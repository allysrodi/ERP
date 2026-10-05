import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { api } from '../services/api';
import { buildRecordPayload } from '../services/recordForm';

const emptyForm = () => ({ name: '', email: '', phone: '', sku: '', description: '', unit: 'pieza', purchasePrice: '0', salePrice: '0', categoryId: '' });
export default function RecordsScreen({ moduleKey, companyId, role, styles }) {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [reload, setReload] = useState(0);
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const lock = useRef(false);
  const mounted = useRef(true);
  const canWrite = ['ADMIN', 'GERENTE'].includes(role) || (role === 'VENTAS' && moduleKey === 'customers') || (role === 'COMPRAS' && moduleKey === 'suppliers') || (role === 'ALMACEN' && moduleKey === 'products');
  const canDelete = ['ADMIN', 'GERENTE'].includes(role);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    const controller = new AbortController();
    setRecords([]); setConfirmId(null);
    if (!companyId) { setMessage('Tu cuenta necesita una empresa asignada.'); return () => controller.abort(); }
    setLoading(true); setMessage('');
    Promise.all([
      api[moduleKey]({ companyId, page, limit: 20 }, { signal: controller.signal }),
      moduleKey === 'products' ? api.categories({ companyId, status: 'ACTIVE', limit: 100 }, { signal: controller.signal }) : Promise.resolve(null)
    ]).then(([result, catalog]) => {
      if (controller.signal.aborted) return;
      setRecords(result.data.items); setPages(Math.max(1, result.data.pagination?.pages ?? 1));
      setCategories(catalog?.data.items ?? []);
    }).catch(error => { if (!controller.signal.aborted) setMessage(error.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [companyId, moduleKey, page, reload]);
  function reset() { setEditingId(null); setForm(emptyForm()); setConfirmId(null); }
  async function save() {
    if (lock.current || !canWrite || !companyId) return;
    let payload;
    try { payload = buildRecordPayload(moduleKey, form, companyId, Boolean(editingId)); } catch(error) { setMessage(error.message); return; }
    lock.current = true; setBusy(true); setMessage('');
    try {
      const suffix = moduleKey === 'customers' ? 'Customer' : moduleKey === 'suppliers' ? 'Supplier' : 'Product';
      if (editingId) await api[`update${suffix}`](editingId, companyId, payload);
      else await api[`create${suffix}`](payload);
      if (!mounted.current) return;
      reset(); setMessage('Registro guardado correctamente.'); setReload(value => value + 1);
    } catch(error) { if (mounted.current) setMessage(error.message); }
    finally { lock.current = false; if (mounted.current) setBusy(false); }
  }
  async function deactivate(record) {
    if (lock.current || !canDelete) return;
    lock.current = true; setBusy(true);
    try {
      const suffix = moduleKey === 'customers' ? 'Customer' : moduleKey === 'suppliers' ? 'Supplier' : 'Product';
      await api[`deactivate${suffix}`](record._id, companyId);
      if (!mounted.current) return;
      if (editingId === record._id) reset();
      setConfirmId(null); setReload(value => value + 1);
    } catch(error) { if (mounted.current) setMessage(error.message); }
    finally { lock.current = false; if (mounted.current) setBusy(false); }
  }
  async function createCategory() {
    if (lock.current || !categoryName.trim()) return;
    lock.current = true; setBusy(true);
    try {
      const result = await api.createCategory({ companyId, name: categoryName.trim() });
      if (!mounted.current) return;
      setCategories(current => [...current, result.data]);
      setForm(current => ({ ...current, categoryId: result.data._id })); setCategoryName('');
    } catch(error) { if (mounted.current) setMessage(error.message); }
    finally { lock.current = false; if (mounted.current) setBusy(false); }
  }
  function field(key, label, numeric = false) {
    return <TextInput accessibilityLabel={label} placeholder={label} value={form[key]} editable={!busy} keyboardType={numeric ? 'decimal-pad' : 'default'} style={styles.input} onChangeText={value => setForm(current => ({ ...current, [key]: value }))} />;
  }
  const button = (label, action, disabled = false) => <Pressable accessibilityRole="button" disabled={disabled} onPress={action} style={[styles.secondaryButton, disabled && { opacity: 0.5 }]}><Text style={styles.secondaryButtonText}>{label}</Text></Pressable>;
  return <View>
    <Text style={styles.sectionTitle}>{moduleKey === 'customers' ? 'Clientes' : moduleKey === 'suppliers' ? 'Proveedores' : 'Productos'}</Text>
    <Text accessibilityLiveRegion="polite" style={styles.sectionHint}>{loading ? 'Cargando...' : message}</Text>
    {button('Actualizar listado', () => setReload(value => value + 1), busy || loading || !companyId)}
    {canWrite && companyId ? <View style={styles.formCard}>
      <Text style={styles.formTitle}>{editingId ? 'Editar registro' : 'Nuevo registro'}</Text>{field('name', 'Nombre')}
      {moduleKey === 'products' ? <>{field('sku', 'SKU')}<Text style={styles.sectionHint}>Categoría</Text>
        {categories.length ? categories.map(category => <Pressable accessibilityRole="radio" accessibilityState={{ checked: form.categoryId === category._id }} disabled={busy} key={category._id} onPress={() => setForm(current => ({ ...current, categoryId: category._id }))}><Text style={styles.actionText}>{form.categoryId === category._id ? '● ' : '○ '}{category.name}</Text></Pressable>) : <Text>Crea una categoría en el catálogo antes de registrar productos.</Text>}
        <TextInput accessibilityLabel="Nueva categoría" placeholder="Nueva categoría" value={categoryName} onChangeText={setCategoryName} editable={!busy} style={styles.input} />{button('Crear categoría', createCategory, busy || !categoryName.trim())}
        {field('purchasePrice', 'Precio de compra', true)}{field('salePrice', 'Precio de venta', true)}{field('unit', 'Unidad')}{field('description', 'Descripción')}
      </> : <>{field('email', 'Correo (opcional)')}{field('phone', 'Teléfono (opcional)')}</>}
      {button(busy ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear registro', save, busy || loading)}
      {editingId ? button('Cancelar edición', reset, busy) : null}
    </View> : null}
    {!loading && !records.length ? <Text style={styles.sectionHint}>No hay registros en esta página.</Text> : null}
    {records.map(record => <View key={record._id} style={styles.record}>
      <Text style={styles.recordTitle}>{record.name}</Text><Text>{record.email || record.sku || record.phone}</Text><Text>{record.status === 'INACTIVE' ? 'Inactivo' : 'Activo'}</Text>
      {canWrite && record.status !== 'INACTIVE' ? button('Editar', () => { setEditingId(record._id); setConfirmId(null); setForm({ ...emptyForm(), ...record, email: record.email ?? '', phone: record.phone ?? '', description: record.description ?? '', categoryId: record.categoryId?._id ?? record.categoryId ?? '', purchasePrice: String(record.purchasePrice ?? 0), salePrice: String(record.salePrice ?? 0) }); }, busy || loading) : null}
      {canDelete && record.status !== 'INACTIVE' ? confirmId === record._id ? <><Text>¿Desactivar {record.name}?</Text>{button('Confirmar desactivación', () => deactivate(record), busy)}{button('Cancelar', () => setConfirmId(null), busy)}</> : button('Desactivar', () => setConfirmId(record._id), busy || loading) : null}
    </View>)}
    <Text style={styles.sectionHint}>Página {page} de {pages}</Text>
    {button('Anterior', () => { reset(); setPage(value => value - 1); }, page <= 1 || busy || loading)}
    {button('Siguiente', () => { reset(); setPage(value => value + 1); }, page >= pages || busy || loading)}
  </View>;
}
