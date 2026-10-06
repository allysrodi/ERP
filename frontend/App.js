import { useEffect, useState } from 'react';

import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import {
  api,
  clearAuthToken,
  setAuthToken
} from './src/services/api';

import { moduleCatalog } from './src/navigation/moduleCatalog';



function LoginScreen({ onLogin, onForgotPassword }) {
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

  return (
  <SafeAreaView style={styles.loginPage}>
    <View style={styles.loginContainer}>

      <View style={styles.loginBrandPanel}>
        <Image
          source={require('./assets/images/kitli-logo.png')}
          style={styles.brandLogo}
          resizeMode="contain"
        />

        <Text style={styles.brandTag}>KIT-LI ERP</Text>

        <Text style={styles.brandTitle}>
          Tu empresa, bajo control.
        </Text>

        <Text style={styles.brandDescription}>
          Administra ventas, inventario, clientes y operaciones
          desde un solo lugar.
        </Text>

        <View style={styles.brandFeatures}>
          <Text style={styles.brandFeature}>✓ Inventario organizado</Text>
          <Text style={styles.brandFeature}>✓ Control de ventas</Text>
          <Text style={styles.brandFeature}>✓ Información centralizada</Text>
        </View>
      </View>

      <View style={styles.loginFormPanel}>
        <View style={styles.loginForm}>
          <Text style={styles.loginEyebrow}>KIT-LI ERP</Text>

          <Text style={styles.loginTitle}>
            Bienvenido de nuevo
          </Text>

          <Text style={styles.loginSubtitle}>
            Ingresa tus datos para acceder a tu espacio de trabajo.
          </Text>

          <Text style={styles.fieldLabel}>Correo electrónico</Text>

          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="correo@empresa.com"
            placeholderTextColor="#9A9A96"
            style={styles.loginInput}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.fieldLabel}>Contraseña</Text>

          <TextInput
            placeholder="Ingresa tu contraseña"
            placeholderTextColor="#9A9A96"
            secureTextEntry
            style={styles.loginInput}
            value={password}
            onChangeText={setPassword}
          />

          {error ? (
            <Text style={styles.loginError}>{error}</Text>
          ) : null}

          <Pressable
            onPress={submit}
            disabled={loading}
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.loginButtonPressed,
              loading && styles.loginButtonDisabled
            ]}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Accediendo...' : 'Iniciar sesión'}
            </Text>
          </Pressable>

          <Pressable
            onPress={onForgotPassword}
            style={styles.forgotButton}
          >
            <Text style={styles.forgotButtonText}>
              ¿Olvidaste tu contraseña?
            </Text>
          </Pressable>

          <Text style={styles.loginFooter}>
            KIT-LI ERP • Gestión empresarial
          </Text>
        </View>
      </View>

    </View>
  </SafeAreaView>
);
}

function ForgotPasswordScreen({ onBack }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email.trim()) {
      setError('Ingresa tu correo electrónico.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await api.forgotPassword(email.trim());

      setMessage(
        'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.'
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.authShell}>
        <Text style={styles.eyebrow}>KIT-LI ERP</Text>

        <Text style={styles.title}>
          Recuperar contraseña
        </Text>

        <Text style={styles.subtitle}>
          Ingresa el correo asociado a tu cuenta y te enviaremos un enlace de recuperación.
        </Text>

        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Correo electrónico"
          placeholderTextColor="#82918f"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}

        {message ? (
          <Text style={styles.success}>{message}</Text>
        ) : null}

        {!message ? (
          <Pressable
            onPress={submit}
            disabled={loading}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </Text>
          </Pressable>
        ) : null}

        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>
            Volver a iniciar sesión
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function ResetPasswordScreen({ token, onDone }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError('');
    setMessage('');

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      await api.resetPassword(token, newPassword);
      setMessage('Contraseña actualizada correctamente.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.authShell}>
        <Text style={styles.eyebrow}>KIT-LI ERP</Text>

        <Text style={styles.title}>
          Crear nueva contraseña
        </Text>

        <Text style={styles.subtitle}>
          Ingresa una nueva contraseña para recuperar el acceso a tu cuenta.
        </Text>

        <TextInput
          placeholder="Nueva contraseña"
          placeholderTextColor="#82918f"
          secureTextEntry
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TextInput
          placeholder="Confirmar contraseña"
          placeholderTextColor="#82918f"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}

        {message ? (
          <Text style={styles.success}>{message}</Text>
        ) : null}

        {!message ? (
          <Pressable
            onPress={submit}
            disabled={loading}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Actualizando...' : 'Restablecer contraseña'}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={onDone}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>
              Ir a iniciar sesión
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

function RecordsScreen({ moduleKey, companyId }) {
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState(companyId ? '' : 'Tu usuario no tiene una empresa asignada.');
  const [form, setForm] = useState({ name: '', email: '', phone: '', sku: '', description: '', unit: 'pieza', purchasePrice: '0', salePrice: '0', categoryId: '' });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const endpoint = moduleKey === 'customers' ? api.customers : moduleKey === 'suppliers' ? api.suppliers : api.products;

  useEffect(() => {
    if (!companyId) return;
    endpoint({ companyId, page: '1', limit: '20' }).then((result) => { setRecords(result.data.items ?? []); setMessage(''); }).catch((error) => setMessage(error.message));
  }, [endpoint, companyId]);

  function updateField(field, value) { setForm((current) => ({ ...current, [field]: value })); }
  async function createRecord() {
    if (!companyId) {
  return setMessage('Tu usuario no tiene una empresa asignada.');
    }
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
    if (!companyId) {
  return setMessage('Tu usuario no tiene una empresa asignada.');
}
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

  useEffect(() => {
    api.health()
      .then((result) =>
        setHealth(
          result.data.database.connected
            ? 'Sistema conectado'
            : 'Base de datos pendiente'
        )
      )
      .catch(() => setHealth('API no disponible'));
  }, []);

  const isRecords = ['customers', 'suppliers', 'products'].includes(activeModule);

  const currentModule =
    moduleCatalog.find((item) => item.key === activeModule)?.label ?? 'Dashboard';

  return (
    <SafeAreaView style={styles.erpPage}>
      <View style={styles.erpWorkspace}>

        {/* SIDEBAR */}
        <View style={styles.erpSidebar}>

          <View style={styles.sidebarBrand}>
            <Image
              source={require('./assets/images/kitli-logo.png')}
              style={styles.sidebarLogo}
              resizeMode="contain"
            />

            <View>
              <Text style={styles.sidebarBrandName}>KIT-LI</Text>
              <Text style={styles.sidebarBrandSub}>ERP</Text>
            </View>
          </View>

          <Text style={styles.menuLabel}>MENÚ PRINCIPAL</Text>

          <ScrollView
            style={styles.sidebarNavigation}
            showsVerticalScrollIndicator={false}
          >
            {moduleCatalog.map((item) => {
              const selected = activeModule === item.key;

              return (
                <Pressable
                  key={item.key}
                  onPress={() => setActiveModule(item.key)}
                  style={[
                    styles.erpNavItem,
                    selected && styles.erpNavActive
                  ]}
                >
                  <View
                    style={[
                      styles.navIndicator,
                      selected && styles.navIndicatorActive
                    ]}
                  />

                  <Text
                    style={[
                      styles.erpNavText,
                      selected && styles.erpNavTextActive
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.sidebarBottom}>
            <View style={styles.sidebarUser}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>
                  {(user?.name ?? 'U').charAt(0).toUpperCase()}
                </Text>
              </View>

              <View style={styles.sidebarUserInfo}>
                <Text
                  style={styles.sidebarUserName}
                  numberOfLines={1}
                >
                  {user?.name ?? 'Usuario'}
                </Text>

                <Text style={styles.sidebarUserRole}>
                  {user?.role ?? 'Usuario'}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={onLogout}
              style={styles.erpLogout}
            >
              <Text style={styles.erpLogoutText}>
                Cerrar sesión
              </Text>
            </Pressable>
          </View>

        </View>

        {/* CONTENIDO */}
        <View style={styles.erpMain}>

          {/* HEADER */}
          <View style={styles.erpHeader}>
            <View>
              <Text style={styles.headerSection}>
                KIT-LI / {currentModule}
              </Text>

              <Text style={styles.headerTitle}>
                {currentModule}
              </Text>
            </View>

            <View style={styles.headerStatus}>
              <View style={styles.statusDot} />

              <Text style={styles.statusText}>
                {health}
              </Text>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.erpContent}
            showsVerticalScrollIndicator={false}
          >
            {isRecords ? (
              <RecordsScreen
                   moduleKey={activeModule}
                  companyId={user?.companyId}/>
            ) : activeModule === 'dashboard' ? (
              <>
                {/* BIENVENIDA */}
                <View style={styles.dashboardWelcome}>
                  <View>
                    <Text style={styles.dashboardGreeting}>
                      Hola, {user?.name ?? 'usuario'} 👋
                    </Text>

                    <Text style={styles.dashboardDescription}>
                      Aquí tienes un resumen general de tu empresa.
                    </Text>
                  </View>

                  <View style={styles.dashboardDateBadge}>
                    <Text style={styles.dashboardDateText}>
                      KIT-LI ERP
                    </Text>
                  </View>
                </View>

                {/* MÉTRICAS */}
                <View style={styles.dashboardMetrics}>

                  <View style={styles.dashboardCard}>
                    <View style={styles.cardIcon}>
                      <Text style={styles.cardIconText}>$</Text>
                    </View>

                    <Text style={styles.dashboardCardLabel}>
                      Ventas
                    </Text>

                    <Text style={styles.dashboardCardValue}>
                      $0.00
                    </Text>

                    <Text style={styles.dashboardCardHint}>
                      Ventas registradas
                    </Text>
                  </View>

                  <View style={styles.dashboardCard}>
                    <View style={styles.cardIcon}>
                      <Text style={styles.cardIconText}>P</Text>
                    </View>

                    <Text style={styles.dashboardCardLabel}>
                      Productos
                    </Text>

                    <Text style={styles.dashboardCardValue}>
                      —
                    </Text>

                    <Text style={styles.dashboardCardHint}>
                      Productos disponibles
                    </Text>
                  </View>

                  <View style={styles.dashboardCard}>
                    <View style={styles.cardIcon}>
                      <Text style={styles.cardIconText}>C</Text>
                    </View>

                    <Text style={styles.dashboardCardLabel}>
                      Clientes
                    </Text>

                    <Text style={styles.dashboardCardValue}>
                      —
                    </Text>

                    <Text style={styles.dashboardCardHint}>
                      Clientes registrados
                    </Text>
                  </View>

                  <View style={styles.dashboardCard}>
                    <View style={styles.cardIcon}>
                      <Text style={styles.cardIconText}>M</Text>
                    </View>

                    <Text style={styles.dashboardCardLabel}>
                      Módulos
                    </Text>

                    <Text style={styles.dashboardCardValue}>
                      {moduleCatalog.length}
                    </Text>

                    <Text style={styles.dashboardCardHint}>
                      Módulos disponibles
                    </Text>
                  </View>

                </View>

                {/* PARTE INFERIOR */}
                <View style={styles.dashboardGrid}>

                  <View style={styles.dashboardPanel}>
                    <View style={styles.panelHeader}>
                      <View>
                        <Text style={styles.panelTitle}>
                          Resumen de operaciones
                        </Text>

                        <Text style={styles.panelSubtitle}>
                          Actividad general del sistema
                        </Text>
                      </View>
                    </View>

                    <View style={styles.emptyChart}>
                      <Text style={styles.emptyChartIcon}>▥</Text>

                      <Text style={styles.emptyChartTitle}>
                        Tu operación en un solo lugar
                      </Text>

                      <Text style={styles.emptyChartText}>
                        Conforme registres ventas y movimientos,
                        aquí podrás consultar el comportamiento de tu empresa.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.dashboardSidePanel}>
                    <Text style={styles.panelTitle}>
                      Estado del sistema
                    </Text>

                    <View style={styles.systemItem}>
                      <View style={styles.systemIcon}>
                        <Text>✓</Text>
                      </View>

                      <View>
                        <Text style={styles.systemItemTitle}>
                          API REST
                        </Text>
                        <Text style={styles.systemItemText}>
                          Servicio disponible
                        </Text>
                      </View>
                    </View>

                    <View style={styles.systemItem}>
                      <View style={styles.systemIcon}>
                        <Text>✓</Text>
                      </View>

                      <View>
                        <Text style={styles.systemItemTitle}>
                          Base de datos
                        </Text>
                        <Text style={styles.systemItemText}>
                          {health}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.systemItem}>
                      <View style={styles.systemIcon}>
                        <Text>✓</Text>
                      </View>

                      <View>
                        <Text style={styles.systemItemTitle}>
                          Sesión
                        </Text>
                        <Text style={styles.systemItemText}>
                          Autenticación activa
                        </Text>
                      </View>
                    </View>
                  </View>

                </View>
              </>
            ) : (
              <>
                <Text style={styles.modulePageTitle}>
                  {currentModule}
                </Text>

                <Text style={styles.modulePageSubtitle}>
                  Consulta y administra la operación de este módulo.
                </Text>

                <View style={styles.modulePlaceholder}>
                  <Text style={styles.modulePlaceholderTitle}>
                    {currentModule}
                  </Text>

                  <Text style={styles.modulePlaceholderText}>
                    Este módulo está preparado para integrarse con
                    las funciones correspondientes del ERP.
                  </Text>
                </View>
              </>
            )}
          </ScrollView>

        </View>

      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [resetToken, setResetToken] = useState(null);
  const [forgotPassword, setForgotPassword] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (
      window.location.pathname === '/reset-password' &&
      token
    ) {
      setResetToken(token);
    }
  
  }, []);

  function logout() {
    clearAuthToken();
    setUser(null);
  }

  function finishPasswordReset() {
    setResetToken(null);

    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/');
    }
  }

  if (resetToken) {
    return (
      <ResetPasswordScreen
        token={resetToken}
        onDone={finishPasswordReset}
      />
    );
  }

  if (forgotPassword) {
    return (
      <ForgotPasswordScreen
        onBack={() => setForgotPassword(false)}
      />
    );
  }

  return user
    ? <Workspace user={user} onLogout={logout} />
    : (
        <LoginScreen
          onLogin={setUser}
          onForgotPassword={() => setForgotPassword(true)}
        />
      );
}

const styles = StyleSheet.create({

  loginPage: {
  flex: 1,
  minHeight: '100vh',
  backgroundColor: '#F7F5F1',
  justifyContent: 'center',
  padding: 24
},

loginContainer: {
  width: '100%',
  maxWidth: 1100,
  minHeight: 650,
  alignSelf: 'center',
  flexDirection: 'row',
  backgroundColor: '#FFFFFF',
  borderRadius: 28,
  overflow: 'hidden',
  borderWidth: 1,
  borderColor: '#E8E4DE',
  shadowColor: '#000000',
  shadowOffset: {
    width: 0,
    height: 12
  },
  shadowOpacity: 0.08,
  shadowRadius: 30,
  elevation: 5
},

loginBrandPanel: {
  flex: 1,
  backgroundColor: '#FCE9E4',
  padding: 54,
  justifyContent: 'center'
},

brandLogo: {
  width: 180,
  height: 180,
  marginBottom: 24
},

brandTag: {
  color: '#E64B32',
  fontSize: 14,
  fontWeight: '800',
  letterSpacing: 3,
  marginBottom: 14
},

brandTitle: {
  color: '#151515',
  fontSize: 40,
  lineHeight: 46,
  fontWeight: '800',
  maxWidth: 390
},

brandDescription: {
  color: '#6F7774',
  fontSize: 17,
  lineHeight: 27,
  marginTop: 18,
  maxWidth: 410
},

brandFeatures: {
  marginTop: 32,
  gap: 12
},

brandFeature: {
  color: '#333330',
  fontSize: 15,
  fontWeight: '600'
},

loginFormPanel: {
  flex: 1,
  padding: 54,
  justifyContent: 'center',
  backgroundColor: '#FFFFFF'
},

loginForm: {
  width: '100%',
  maxWidth: 420,
  alignSelf: 'center'
},

loginEyebrow: {
  color: '#E64B32',
  fontSize: 13,
  fontWeight: '800',
  letterSpacing: 2.5,
  marginBottom: 12
},

loginTitle: {
  color: '#151515',
  fontSize: 38,
  lineHeight: 44,
  fontWeight: '800'
},

loginSubtitle: {
  color: '#6F7774',
  fontSize: 16,
  lineHeight: 24,
  marginTop: 12,
  marginBottom: 30
},

fieldLabel: {
  color: '#202321',
  fontSize: 14,
  fontWeight: '700',
  marginBottom: 8
},

loginInput: {
  width: '100%',
  minHeight: 54,
  backgroundColor: '#FAF9F7',
  borderWidth: 1,
  borderColor: '#E8E4DE',
  borderRadius: 12,
  paddingHorizontal: 16,
  fontSize: 16,
  color: '#202321',
  marginBottom: 20,
  outlineStyle: 'none'
},

loginError: {
  color: '#C9362B',
  fontWeight: '600',
  marginBottom: 16
},

loginButton: {
  width: '100%',
  minHeight: 56,
  backgroundColor: '#E64B32',
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 6
},

loginButtonPressed: {
  opacity: 0.88
},

loginButtonDisabled: {
  opacity: 0.6
},

loginButtonText: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: '800'
},

forgotButton: {
  alignItems: 'center',
  paddingVertical: 16
},

forgotButtonText: {
  color: '#E64B32',
  fontSize: 14,
  fontWeight: '700'
},

loginFooter: {
  color: '#9A9A96',
  fontSize: 12,
  textAlign: 'center',
  marginTop: 26
},
  loginLogo: {
  width: 170,
  height: 170,
  alignSelf: 'center',
  marginBottom: 12
},

  loginLogo: {
  width: 150,
  height: 150,
  alignSelf: 'center',
  marginBottom: 20
},

  backButton: {
  alignItems: 'center',
  marginTop: 18,
  padding: 10
},

backButtonText: {
  color: '#0f766e',
  fontWeight: '700'
},
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
  success: {
  color: '#0f766e',
  fontWeight: '700',
  marginTop: 12
},
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
  dangerText: { color: '#b42318', fontWeight: '700' },
  
erpPage: {
  flex: 1,
  backgroundColor: '#F7F5F1'
},

erpWorkspace: {
  flex: 1,
  flexDirection: 'row',
  minHeight: '100vh'
},

erpSidebar: {
  width: 250,
  backgroundColor: '#FFFFFF',
  borderRightWidth: 1,
  borderRightColor: '#E8E4DE',
  paddingTop: 24,
  paddingHorizontal: 16
},

sidebarBrand: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 8,
  marginBottom: 32
},

sidebarLogo: {
  width: 52,
  height: 52,
  marginRight: 10
},

sidebarBrandName: {
  color: '#151515',
  fontSize: 21,
  fontWeight: '900',
  letterSpacing: 1
},

sidebarBrandSub: {
  color: '#E64B32',
  fontSize: 11,
  fontWeight: '800',
  letterSpacing: 3
},

menuLabel: {
  color: '#AAA7A1',
  fontSize: 10,
  fontWeight: '800',
  letterSpacing: 1.5,
  paddingHorizontal: 12,
  marginBottom: 10
},

sidebarNavigation: {
  flex: 1
},

erpNavItem: {
  minHeight: 46,
  borderRadius: 10,
  paddingHorizontal: 12,
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 4
},

erpNavActive: {
  backgroundColor: '#FCE9E4'
},

navIndicator: {
  width: 4,
  height: 20,
  borderRadius: 4,
  marginRight: 11,
  backgroundColor: 'transparent'
},

navIndicatorActive: {
  backgroundColor: '#E64B32'
},

erpNavText: {
  color: '#686B68',
  fontSize: 14,
  fontWeight: '600'
},

erpNavTextActive: {
  color: '#E64B32',
  fontWeight: '800'
},

sidebarBottom: {
  borderTopWidth: 1,
  borderTopColor: '#EEEAE5',
  paddingVertical: 18
},

sidebarUser: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 14
},

userAvatar: {
  width: 38,
  height: 38,
  borderRadius: 19,
  backgroundColor: '#FCE9E4',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 10
},

userAvatarText: {
  color: '#E64B32',
  fontWeight: '900'
},

sidebarUserInfo: {
  flex: 1
},

sidebarUserName: {
  color: '#202321',
  fontSize: 13,
  fontWeight: '800'
},

sidebarUserRole: {
  color: '#8D918D',
  fontSize: 11,
  marginTop: 2
},

erpLogout: {
  minHeight: 40,
  borderRadius: 9,
  backgroundColor: '#F7F5F1',
  alignItems: 'center',
  justifyContent: 'center'
},

erpLogoutText: {
  color: '#6F7774',
  fontSize: 13,
  fontWeight: '700'
},

erpMain: {
  flex: 1,
  backgroundColor: '#F7F5F1'
},

erpHeader: {
  minHeight: 82,
  backgroundColor: '#FFFFFF',
  borderBottomWidth: 1,
  borderBottomColor: '#E8E4DE',
  paddingHorizontal: 32,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between'
},

headerSection: {
  color: '#9A9A96',
  fontSize: 11,
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: 1
},

headerTitle: {
  color: '#202321',
  fontSize: 21,
  fontWeight: '800',
  marginTop: 3
},

headerStatus: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F3F8F6',
  borderRadius: 20,
  paddingHorizontal: 13,
  paddingVertical: 8
},

statusDot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: '#168477',
  marginRight: 7
},

statusText: {
  color: '#53706A',
  fontSize: 12,
  fontWeight: '700'
},

erpContent: {
  padding: 32
},

dashboardWelcome: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 28
},

dashboardGreeting: {
  color: '#202321',
  fontSize: 28,
  fontWeight: '900'
},

dashboardDescription: {
  color: '#777B77',
  fontSize: 14,
  marginTop: 6
},

dashboardDateBadge: {
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#E8E4DE',
  borderRadius: 10,
  paddingHorizontal: 16,
  paddingVertical: 10
},

dashboardDateText: {
  color: '#E64B32',
  fontSize: 12,
  fontWeight: '800'
},

dashboardMetrics: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 16,
  marginBottom: 22
},

dashboardCard: {
  flex: 1,
  minWidth: 190,
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '#E8E4DE',
  padding: 20
},

cardIcon: {
  width: 38,
  height: 38,
  borderRadius: 10,
  backgroundColor: '#FCE9E4',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 17
},

cardIconText: {
  color: '#E64B32',
  fontSize: 15,
  fontWeight: '900'
},

dashboardCardLabel: {
  color: '#777B77',
  fontSize: 12,
  fontWeight: '700'
},

dashboardCardValue: {
  color: '#202321',
  fontSize: 26,
  fontWeight: '900',
  marginTop: 5
},

dashboardCardHint: {
  color: '#A1A49F',
  fontSize: 11,
  marginTop: 5
},

dashboardGrid: {
  flexDirection: 'row',
  gap: 20
},

dashboardPanel: {
  flex: 2,
  minHeight: 300,
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '#E8E4DE',
  padding: 22
},

dashboardSidePanel: {
  flex: 1,
  minWidth: 250,
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '#E8E4DE',
  padding: 22
},

panelHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between'
},

panelTitle: {
  color: '#202321',
  fontSize: 16,
  fontWeight: '800'
},

panelSubtitle: {
  color: '#999D98',
  fontSize: 12,
  marginTop: 4
},

emptyChart: {
  flex: 1,
  minHeight: 220,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 30
},

emptyChartIcon: {
  color: '#E64B32',
  fontSize: 32,
  marginBottom: 12
},

emptyChartTitle: {
  color: '#202321',
  fontSize: 15,
  fontWeight: '800',
  textAlign: 'center'
},

emptyChartText: {
  color: '#8B8F8A',
  fontSize: 12,
  lineHeight: 19,
  textAlign: 'center',
  maxWidth: 400,
  marginTop: 7
},

systemItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 17,
  borderBottomWidth: 1,
  borderBottomColor: '#F0EDE9'
},

systemIcon: {
  width: 34,
  height: 34,
  borderRadius: 17,
  backgroundColor: '#E7F4F0',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 12
},

systemItemTitle: {
  color: '#202321',
  fontSize: 13,
  fontWeight: '800'
},

systemItemText: {
  color: '#969A95',
  fontSize: 11,
  marginTop: 3
},

modulePageTitle: {
  color: '#202321',
  fontSize: 28,
  fontWeight: '900'
},

modulePageSubtitle: {
  color: '#777B77',
  fontSize: 14,
  marginTop: 6,
  marginBottom: 24
},

modulePlaceholder: {
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#E8E4DE',
  borderRadius: 16,
  padding: 28
},

modulePlaceholderTitle: {
  color: '#202321',
  fontSize: 18,
  fontWeight: '800'
},

modulePlaceholderText: {
  color: '#777B77',
  fontSize: 13,
  lineHeight: 21,
  marginTop: 7
},

});
