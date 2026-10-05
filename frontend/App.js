import { useEffect, useRef, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { api, clearAuthToken, setAuthToken, setAuthExpiredHandler } from './src/services/api';
import { moduleCatalog } from './src/navigation/moduleCatalog';

import RecordsScreen from './src/screens/RecordsScreen';
import ModuleScreen from './src/screens/ModuleScreen';

const configuredCompanyId = process.env.EXPO_PUBLIC_COMPANY_ID;

function LoginScreen({ onLogin, onForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submitting = useRef(false);
  async function submit() {
    if (submitting.current) return;
    submitting.current = true;
    setLoading(true); setError('');
    try { const result = await api.login({ email: email.trim().toLowerCase(), password }); setAuthToken(result.data.token); onLogin(result.data.user); }
    catch (requestError) { setError(requestError.message); }
    finally { submitting.current = false; setLoading(false); }
  }

  return <SafeAreaView style={styles.safeArea}><View style={styles.authShell}>
    <Text style={styles.eyebrow}>ERP MODULAR</Text><Text style={styles.title}>Tu operacion, en orden.</Text>
    <Text style={styles.subtitle}>Accede al espacio de trabajo de tu empresa.</Text>
    <TextInput autoCapitalize="none" keyboardType="email-address" placeholder="Correo" placeholderTextColor="#82918f" style={styles.input} value={email} onChangeText={setEmail} />
    <TextInput placeholder="Contrasena" placeholderTextColor="#82918f" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
    {error ? <Text style={styles.error}>{error}</Text> : null}
    <Pressable onPress={submit} disabled={loading} accessibilityRole="button" style={styles.primaryButton}><Text style={styles.primaryButtonText}>{loading ? 'Accediendo...' : 'Iniciar sesion'}</Text></Pressable>
    <Pressable
  disabled={loading} onPress={onForgotPassword}
  style={styles.backButton}
>
  <Text style={styles.backButtonText}>
    ¿Olvidaste tu contraseña?
  </Text>
</Pressable>
  </View></SafeAreaView>;
}

function ForgotPasswordScreen({ onBack }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submitting = useRef(false);
  async function submit() {
    if (submitting.current) return;
    if (!email.trim()) {
      setError('Ingresa tu correo electrónico.');
      return;
    }

    submitting.current = true;
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
      submitting.current = false; setLoading(false);
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

        <Pressable disabled={loading} onPress={onBack} style={styles.backButton}>
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

  const submitting = useRef(false);
  async function submit() {
    if (submitting.current) return;
    setError('');
    setMessage('');

    if (newPassword.length < 8 || newPassword.length > 128) {
      setError('La contraseña debe tener entre 8 y 128 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    submitting.current = true;
    setLoading(true);

    try {
      await api.resetPassword(token, newPassword);
      setMessage('Contraseña actualizada correctamente.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      submitting.current = false; setLoading(false);
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
        {!message ? <Pressable disabled={loading} onPress={onDone} style={styles.backButton}><Text style={styles.backButtonText}>Volver a iniciar sesión</Text></Pressable> : null}
      </View>
    </SafeAreaView>
  );
}

function Workspace({ user, onLogout }) {
  const companyId = user?.companyId?._id ?? user?.companyId ?? configuredCompanyId;
  const { width } = useWindowDimensions();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [health, setHealth] = useState('Comprobando API...');
  useEffect(() => { api.health().then((result) => setHealth(result.data.database.connected ? 'API y MongoDB conectadas' : 'API conectada; MongoDB pendiente')).catch(() => setHealth('API no disponible')); }, []);
  const isRecords = ['customers', 'suppliers', 'products'].includes(activeModule);
  return <SafeAreaView style={styles.safeArea}><View style={[styles.workspace, width < 700 && { flexDirection: 'column' }]} >
    <View style={[styles.sidebar, width < 700 && { width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: 8 }]} ><Text style={styles.brand}>ERP</Text>{moduleCatalog.map((item) => <Pressable key={item.key} onPress={() => setActiveModule(item.key)} style={[styles.navItem, activeModule === item.key && styles.navActive]}><Text style={styles.navText}>{item.label}</Text></Pressable>)}<Pressable onPress={onLogout} style={[styles.logout, width < 700 && { marginTop: 0 }]}><Text style={styles.logoutText}>Cerrar sesion</Text></Pressable></View>
    <ScrollView contentContainerStyle={styles.content}><Text style={styles.welcome}>Hola, {user?.name ?? 'usuario'}</Text><Text style={styles.connection}>{health}</Text>{isRecords ? <RecordsScreen key={`${activeModule}:${companyId}`} moduleKey={activeModule} companyId={companyId} role={user?.role} styles={styles} /> : <ModuleScreen key={`${activeModule}:${companyId}`} moduleKey={activeModule} companyId={companyId} styles={styles} />}</ScrollView>
  </View></SafeAreaView>;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [resetToken, setResetToken] = useState(null);
  const [forgotPassword, setForgotPassword] = useState(false);
  useEffect(() => {
    setAuthExpiredHandler(() => setUser(null));
    return () => setAuthExpiredHandler(null);
  }, []);

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
    setForgotPassword(false);
    clearAuthToken();
    setUser(null);

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
  metricRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 24 },
  metric: { backgroundColor: '#e7f0ed', borderRadius: 10, padding: 18, minWidth: 150, flexGrow: 1 },
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
