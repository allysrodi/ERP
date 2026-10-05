import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { api } from '../services/api';
import { moduleCatalog } from '../navigation/moduleCatalog';
const paths = { dashboard: 'dashboard', sales: 'sales', purchases: 'purchases', inventory: 'inventory', projects: 'projects', reports: 'reports/sales' };
export default function ModuleScreen({ moduleKey, companyId, styles }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const [page, setPage] = useState(1);
  const [report, setReport] = useState('sales');
  useEffect(() => {
    const controller = new AbortController();
    setData(null); setError('');
    if (!companyId) { setError('Tu cuenta necesita una empresa asignada.'); return () => controller.abort(); }
    setLoading(true);
    api.moduleData(moduleKey === 'reports' ? `reports/${report}` : paths[moduleKey], companyId, { signal: controller.signal }, page)
      .then(result => { if (!controller.signal.aborted) setData(result.data); })
      .catch(error => { if (!controller.signal.aborted) setError(error.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [moduleKey, companyId, reload, report, page]);
  const rows = Array.isArray(data) ? data : data?.items ?? [];
  const labels = { sales: 'Ventas confirmadas/pagadas', purchases: 'Compras recibidas', expenses: 'Gastos activos', lowStock: 'Productos con stock bajo', activeProjects: 'Proyectos en curso' };
  return <View>
    <Text style={styles.sectionTitle}>{moduleCatalog.find(item => item.key === moduleKey)?.label}</Text>
    <Pressable accessibilityRole="button" disabled={loading || !companyId} style={styles.secondaryButton} onPress={() => setReload(value => value + 1)}><Text style={styles.secondaryButtonText}>{loading ? 'Cargando...' : 'Actualizar'}</Text></Pressable>
    {moduleKey === 'reports' ? <View style={styles.formActions}>{['sales', 'purchases'].map(value => <Pressable accessibilityRole="button" accessibilityState={{ selected: report === value }} key={value} onPress={() => { setReport(value); setPage(1); }}><Text style={styles.actionText}>{value === 'sales' ? 'Ventas' : 'Compras'}</Text></Pressable>)}</View> : null}
    {error ? <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}
    {moduleKey === 'dashboard' && data ? <View style={styles.metricRow}>{Object.entries(labels).map(([key,label]) => <View key={key} style={styles.metric}><Text style={styles.metricNumber}>{data[key] ?? 0}</Text><Text>{label}</Text></View>)}</View> : null}
    {moduleKey !== 'dashboard' ? <>
      <Text style={styles.sectionHint}>Consulta de registros. Las operaciones de confirmación, recepción y movimientos se completarán en la siguiente fase.</Text>
      {!loading && data && !rows.length ? <Text>No hay registros.</Text> : null}
      {rows.map((row, index) => <View key={row._id ?? index} style={styles.record}><Text style={styles.recordTitle}>{row.name ?? row.productId?.name ?? row.customerId?.name ?? row.supplierId?.name ?? `Registro ${index + 1}`}</Text><Text>{row.status ?? row.warehouseId?.name ?? ''}</Text>{row.total !== undefined ? <Text>Total: {row.total}</Text> : null}{row.quantity !== undefined ? <Text>Existencias: {row.quantity}</Text> : null}</View>)}
      {data?.pagination ? <View><Text>Página {page} de {Math.max(1, data.pagination.pages)}</Text><Pressable accessibilityRole="button" disabled={loading || page <= 1} onPress={() => setPage(value => value - 1)}><Text style={styles.actionText}>Anterior</Text></Pressable><Pressable accessibilityRole="button" disabled={loading || page >= data.pagination.pages} onPress={() => setPage(value => value + 1)}><Text style={styles.actionText}>Siguiente</Text></Pressable></View> : null}
    </> : null}
  </View>;
}
