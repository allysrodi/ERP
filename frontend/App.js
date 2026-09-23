import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { api, clearAuthToken, setAuthToken } from './src/services/api';
import { moduleCatalog } from './src/navigation/moduleCatalog';

const companyId = process.env.EXPO_PUBLIC_COMPANY_ID;

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true); setError('');
    try { const result = await api.login({ email, password }); setAuthToken(result.data.token); onLogin(result.data.user); }
    catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  }

  return <SafeAreaView style={styles.safeArea}><View style={styles.authShell}>
    <Text style={styles.eyebrow}>ERP MODULAR</Text><Text style={styles.title}>Tu operacion, en orden.</Text>
    <Text style={styles.subtitle}>Accede al espacio de trabajo de tu empresa.</Text>
    <TextInput autoCapitalize="none" keyboardType="email-address" placeholder="Correo" placeholderTextColor="#82918f" style={styles.input} value={email} onChangeText={setEmail} />
    <TextInput placeholder="Contrasena" placeholderTextColor="#82918f" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
    {error ? <Text style={styles.error}>{error}</Text> : null}
    <Pressable onPress={submit} style={styles.primaryButton}><Text style={styles.primaryButtonText}>{loading ? 'Accediendo...' : 'Iniciar sesion'}</Text></Pressable>
  </View></SafeAreaView>;
}

function RecordsScreen({ moduleKey }) {
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState('Configura EXPO_PUBLIC_COMPANY_ID para consultar datos.');
  const [form, setForm] = useState({ name: '', email: '', phone: '', sku: '', description: '', unit: 'pieza', purchasePrice: '0', salePrice: '0', categoryId: '' });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const endpoint = moduleKey === 'customers' ? api.customers : moduleKey === 'suppliers' ? api.suppliers : api.products;

  useEffect(() => {
    if (!companyId) return;
    endpoint({ companyId, page: '1', limit: '20' }).then((result) => { setRecords(result.data.items ?? []); setMessage(''); }).catch((error) => setMessage(error.message));
  }, [endpoint]);

  function updateField(field, value) { setForm((current) => ({ ...current, [field]: value })); }
  async function createRecord() {
    if (!companyId) return setMessage('Configura EXPO_PUBLIC_COMPANY_ID antes de crear registros.');
    setSaving(true); setMessage('');
    try {
      const payload = moduleKey === 'products'
        ? { sku: form.sku, name: form.name, description: form.description, companyId, categoryId: form.categoryId, purchasePrice: Number(form.purchasePrice), salePrice: Number(form.salePrice), unit: form.unit }
        : { name: form.name, email: form.email, phone: form.phone, companyId };
      const create = moduleKey === 'customers' ? api.createCustomer : moduleKey === 'suppliers' ? api.createSupplier : api.createProduct;
      const update = moduleKey === 'customers' ? api.updateCustomer : moduleKey === 'suppliers' ? api.updateSupplier : api.updateProduct;
      const result = editingId ? await update(editingId, companyId, payload) : await create(payload);
      setRecords((current) => editingId ? current.map((record) => record._id === editingId ? result.data : record) : [result.data, ...current]); setEditingId(null); setForm({ name: '', email: '', phone: '', sku: '', description: '', unit: 'pieza', purchasePrice: '0', salePrice: '0', categoryId: '' }); setMessage(editingId ? 'Registro actualizado correctamente.' : 'Registro creado correctamente.');
    } catch (error) { setMessage(error.message); }
    finally { setSaving(false); }
  }

  function editRecord(record) {
    setEditingId(record._id); setForm({ name: record.name ?? '', email: record.email ?? '', phone: record.phone ?? '', sku: record.sku ?? '', description: record.description ?? '', unit: record.unit ?? 'pieza', purchasePrice: String(record.purchasePrice ?? 0), salePrice: String(record.salePrice ?? 0), categoryId: record.categoryId?._id ?? record.categoryId ?? '' });
  }

  async function deactivateRecord(record) {
    if (!companyId) return setMessage('Configura EXPO_PUBLIC_COMPANY_ID antes de desactivar registros.');
    try { const deactivate = moduleKey === 'customers' ? api.deactivateCustomer : moduleKey === 'suppliers' ? api.deactivateSupplier : api.deactivateProduct; const result = await deactivate(record._id, companyId); setRecords((current) => current.map((item) => item._id === record._id ? result.data : item)); setMessage('Registro desactivado correctamente.'); } catch (error) { setMessage(error.message); }
  }

  return <View><Text style={styles.sectionTitle}>{moduleCatalog.find((item) => item.key === moduleKey)?.label}</Text><Text style={styles.sectionHint}>{message}</Text>
    <View style={styles.formCard}><Text style={styles.formTitle}>{editingId ? 'Editar registro' : 'Nuevo registro'}</Text><TextInput placeholder="Nombre" placeholderTextColor="#82918f" style={styles.input} value={form.name} onChangeText={(value) => updateField('name', value)} />
      {moduleKey === 'products' ? <><TextInput placeholder="SKU" placeholderTextColor="#82918f" style={styles.input} value={form.sku} onChangeText={(value) => updateField('sku', value)} /><TextInput placeholder="ID de categoria" placeholderTextColor="#82918f" style={styles.input} value={form.categoryId} onChangeText={(value) => updateField('categoryId', value)} /><TextInput placeholder="Precio de compra" keyboardType="decimal-pad" placeholderTextColor="#82918f" style={styles.input} value={form.purchasePrice} onChangeText={(value) => updateField('purchasePrice', value)} /><TextInput placeholder="Precio de venta" keyboardType="decimal-pad" placeholderTextColor="#82918f" style={styles.input} value={form.salePrice} onChangeText={(value) => updateField('salePrice', value)} /></> : <><TextInput placeholder="Correo" placeholderTextColor="#82918f" style={styles.input} value={form.email} onChangeText={(value) => updateField('email', value)} /><TextInput placeholder="Telefono" placeholderTextColor="#82918f" style={styles.input} value={form.phone} onChangeText={(value) => updateField('phone', value)} /></>}
      <View style={styles.formActions}><Pressable onPress={createRecord} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>{saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear registro'}</Text></Pressable>{editingId ? <Pressable onPress={() => { setEditingId(null); setForm({ name: '', email: '', phone: '', sku: '', description: '', unit: 'pieza', purchasePrice: '0', salePrice: '0', categoryId: '' }); }} style={styles.cancelButton}><Text style={styles.cancelButtonText}>Cancelar</Text></Pressable> : null}</View>
    </View>
    {records.map((record) => <View key={record._id} style={styles.record}><View style={styles.recordCopy}><Text style={styles.recordTitle}>{record.name ?? record.sku}</Text><Text style={styles.recordMeta}>{record.email ?? record.description ?? record.unit ?? 'Registro activo'}</Text></View><View style={styles.recordActions}><Pressable onPress={() => editRecord(record)}><Text style={styles.actionText}>Editar</Text></Pressable><Pressable onPress={() => deactivateRecord(record)}><Text style={styles.dangerText}>Desactivar</Text></Pressable></View></View>)}
  </View>;
}

function Workspace({ user, onLogout }) {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [health, setHealth] = useState('Comprobando API...');
  useEffect(() => { api.health().then((result) => setHealth(result.data.database.connected ? 'API y MongoDB conectadas' : 'API conectada; MongoDB pendiente')).catch(() => setHealth('API no disponible')); }, []);
  const isRecords = ['customers', 'suppliers', 'products'].includes(activeModule);
  return <SafeAreaView style={styles.safeArea}><View style={styles.workspace}>
    <View style={styles.sidebar}><Text style={styles.brand}>ERP</Text>{moduleCatalog.map((item) => <Pressable key={item.key} onPress={() => setActiveModule(item.key)} style={[styles.navItem, activeModule === item.key && styles.navActive]}><Text style={styles.navText}>{item.label}</Text></Pressable>)}<Pressable onPress={onLogout} style={styles.logout}><Text style={styles.logoutText}>Cerrar sesion</Text></Pressable></View>
    <ScrollView contentContainerStyle={styles.content}><Text style={styles.welcome}>Hola, {user?.name ?? 'usuario'}</Text><Text style={styles.connection}>{health}</Text>{isRecords ? <RecordsScreen moduleKey={activeModule} /> : <><Text style={styles.sectionTitle}>{moduleCatalog.find((item) => item.key === activeModule)?.label ?? 'Dashboard'}</Text><Text style={styles.subtitle}>Selecciona un modulo para consultar la operacion sin perder el contexto.</Text><View style={styles.metricRow}><View style={styles.metric}><Text style={styles.metricNumber}>{moduleCatalog.length}</Text><Text style={styles.metricLabel}>Modulos preparados</Text></View><View style={styles.metric}><Text style={styles.metricNumber}>REST</Text><Text style={styles.metricLabel}>Conexion por API</Text></View></View></>}</ScrollView>
  </View></SafeAreaView>;
}

export default function App() {
  const [user, setUser] = useState(null);
  function logout() { clearAuthToken(); setUser(null); }
  return user ? <Workspace user={user} onLogout={logout} /> : <LoginScreen onLogin={setUser} />;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f7f5' },
  authShell: { alignSelf: 'center', justifyContent: 'center', maxWidth: 560, padding: 32, width: '100%' },
  workspace: { flex: 1, flexDirection: 'row' },
  sidebar: { backgroundColor: '#102a2a', padding: 18, width: 220 },
  brand: { color: '#a7e3d0', fontSize: 28, fontWeight: '800', marginBottom: 24 },
  navItem: { borderRadius: 8, marginBottom: 5, padding: 11 },
  navActive: { backgroundColor: '#24534d' },
  navText: { color: '#d8e7e2', fontSize: 14 },
  logout: { borderTopColor: '#35605a', borderTopWidth: 1, marginTop: 'auto', paddingTop: 18 },
  logoutText: { color: '#a7e3d0', fontSize: 14 },
  content: { maxWidth: 900, padding: 34, width: '100%' },
  eyebrow: { color: '#0f766e', fontSize: 13, fontWeight: '700', letterSpacing: 2 },
  title: { color: '#102a2a', fontSize: 42, fontWeight: '800', marginTop: 14 },
  subtitle: { color: '#526565', fontSize: 17, lineHeight: 26, marginTop: 10 },
  welcome: { color: '#102a2a', fontSize: 30, fontWeight: '800' },
  connection: { color: '#0f766e', fontSize: 13, marginTop: 8 },
  sectionTitle: { color: '#102a2a', fontSize: 24, fontWeight: '800', marginTop: 34 },
  sectionHint: { color: '#687a76', marginTop: 8 },
  input: { backgroundColor: '#ffffff', borderColor: '#dce7e3', borderRadius: 8, borderWidth: 1, color: '#102a2a', marginTop: 14, padding: 14 },
  primaryButton: { alignItems: 'center', backgroundColor: '#0f766e', borderRadius: 8, marginTop: 18, padding: 15 },
  primaryButtonText: { color: '#ffffff', fontWeight: '700' },
  error: { color: '#b42318', marginTop: 12 },
  record: { backgroundColor: '#ffffff', borderColor: '#dce7e3', borderRadius: 8, borderWidth: 1, marginTop: 10, padding: 15 },
  recordTitle: { color: '#102a2a', fontSize: 16, fontWeight: '700' },
  recordMeta: { color: '#687a76', marginTop: 4 },
  metricRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  metric: { backgroundColor: '#e7f0ed', borderRadius: 10, padding: 18, width: 190 },
  metricNumber: { color: '#0f766e', fontSize: 24, fontWeight: '800' },
  metricLabel: { color: '#526565', fontSize: 13, marginTop: 6 }
  ,formCard: { backgroundColor: '#ffffff', borderColor: '#dce7e3', borderRadius: 10, borderWidth: 1, marginTop: 18, padding: 18 },
  formTitle: { color: '#102a2a', fontSize: 16, fontWeight: '700' },
  secondaryButton: { alignItems: 'center', backgroundColor: '#24534d', borderRadius: 8, marginTop: 14, padding: 13 },
  secondaryButtonText: { color: '#ffffff', fontWeight: '700' }
  ,formActions: { flexDirection: 'row', gap: 10 },
  cancelButton: { alignItems: 'center', borderColor: '#b7c8c3', borderRadius: 8, borderWidth: 1, marginTop: 14, padding: 13 },
  cancelButtonText: { color: '#526565', fontWeight: '700' },
  recordCopy: { flex: 1 },
  recordActions: { flexDirection: 'row', gap: 16, marginTop: 12 },
  actionText: { color: '#0f766e', fontWeight: '700' },
  dangerText: { color: '#b42318', fontWeight: '700' }
});
