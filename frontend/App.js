import { useEffect, useState } from 'react';

import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Platform,
  TextInput,
  View
} from 'react-native';

import {
  api,
  clearAuthToken,
  setAuthToken
} from './src/services/api';

import { moduleCatalog } from './src/navigation/moduleCatalog';
//import { jsPDF } from 'jspdf';
//import * as XLSX from 'xlsx';


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
  <SafeAreaView
  style={[
    styles.loginPage,
    Platform.OS !== 'web' && styles.loginPageMobile
  ]}
>
    <View
  style={[
    styles.loginContainer,
    Platform.OS !== 'web' && styles.loginContainerMobile
  ]}
>

     <View
  style={[
    styles.loginBrandPanel,
    Platform.OS !== 'web' && styles.loginBrandPanelMobile
  ]}
>
        <Image
          source={require('./assets/images/kitli-logo.png')}
          style={styles.brandLogo}
          resizeMode="contain"
        />

        <Text style={styles.brandTag}>KIT-LI ERP</Text>

        <Text
  style={[
    styles.brandTitle,
    Platform.OS !== 'web' && {
      fontSize: 26,
      lineHeight: 32,
      textAlign: 'center'
    }
  ]}
>
          Tu empresa, bajo control.
        </Text>

        <Text
  style={[
    styles.brandDescription,
    Platform.OS !== 'web' && { display: 'none' }
  ]}
>
          Administra ventas, inventario, clientes y operaciones
          desde un solo lugar.
        </Text>

        <View
  style={[
    styles.brandFeatures,
    Platform.OS !== 'web' && { display: 'none' }
  ]}
>
          <Text style={styles.brandFeature}>✓ Inventario organizado</Text>
          <Text style={styles.brandFeature}>✓ Control de ventas</Text>
          <Text style={styles.brandFeature}>✓ Información centralizada</Text>
        </View>
      </View>

        <View
  style={[
    styles.loginFormPanel,
    Platform.OS !== 'web' && styles.loginFormPanelMobile
  ]}
>
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

function SalesScreen({ companyId }) {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);

  const [customerId, setCustomerId] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [productId, setProductId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');

  const [quantity, setQuantity] = useState('0');
  const [unitPrice, setUnitPrice] = useState('0');
  const [taxes, setTaxes] = useState('0');
  const [discount, setDiscount] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadSalesData() {
    if (!companyId) {
      setMessage('Tu usuario no tiene una empresa asignada.');
      setLoading(false);
      return;
    }

    try {
      const [
        customersResult,
        productsResult,
        warehousesResult,
        salesResult
      ] = await Promise.all([
        api.customers({ companyId, page: '1', limit: '100' }),
        api.products({ companyId, page: '1', limit: '100' }),
        api.warehouses({ companyId, page: '1', limit: '100' }),
        api.sales({ companyId, page: '1', limit: '100' })
      ]);

      const loadedCustomers = customersResult.data.items ?? [];
      const loadedProducts = productsResult.data.items ?? [];
      const loadedWarehouses = warehousesResult.data.items ?? [];
      const loadedSales = salesResult.data.items ?? [];

      setCustomers(loadedCustomers);
      setProducts(loadedProducts);
      setWarehouses(loadedWarehouses);
      setSales(loadedSales);



      if (!warehouseId && loadedWarehouses.length) {
        setWarehouseId(loadedWarehouses[0]._id);
      }

      if (!productId && loadedProducts.length) {
        setProductId(loadedProducts[0]._id);
        setUnitPrice(
          String(loadedProducts[0].salePrice ?? 0)
        );
      }

      setMessage('');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSalesData();
  }, [companyId]);

  function selectProduct(product) {
    setProductId(product._id);
    setUnitPrice(String(product.salePrice ?? 0));
  }

  async function handleCreateSale() {
    if (!customerId || !productId || !warehouseId) {
      setMessage(
        'Selecciona un cliente, producto y almacén.'
      );
      return;
    }

    if (Number(quantity) <= 0) {
      setMessage('La cantidad debe ser mayor a 0.');
      return;
    }

    try {
      setSaving(true);
      setMessage('');

      await api.createSale({
        companyId,
        customerId,
        items: [
          {
            productId,
            warehouseId,
            quantity: Number(quantity),
            unitPrice: Number(unitPrice)
          }
        ],
        taxes: Number(taxes),
        discount: Number(discount),
        paymentMethod
      });

      setMessage('Venta registrada correctamente.');
      setQuantity('1');
      setTaxes('0');
      setDiscount('0');

      await loadSalesData();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  const selectedCustomer = customers.find(
  (customer) => customer._id === customerId
);

const filteredCustomers = customers
  .filter((customer) => {
    const term = customerSearch.trim().toLowerCase();

    if (!term) return false;

    return [
      customer.name,
      customer.email,
      customer.phone
    ].some((value) =>
      String(value ?? '').toLowerCase().includes(term)
    );
  })
  .slice(0, 8);



  return (
    <View>
      <Text style={styles.sectionTitle}>Ventas</Text>

      <Text style={styles.sectionHint}>
        {loading
          ? 'Cargando información comercial...'
          : `${customers.length} clientes · ${products.length} productos · ${warehouses.length} almacenes · ${sales.length} ventas`}
      </Text>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Nueva venta</Text>

        <Text style={styles.fieldLabel}>Cliente</Text>

        <TextInput
  placeholder="Buscar cliente por nombre, correo o teléfono..."
  placeholderTextColor="#9A9A96"
  style={styles.input}
  value={customerSearch}
  onChangeText={setCustomerSearch}
/>
    {customerSearch.trim() ? (
  <View>
    {filteredCustomers.length ? (
      filteredCustomers.map((customer) => (
        <Pressable
          key={customer._id}
          onPress={() => {
            setCustomerId(customer._id);
            setCustomerSearch('');
          }}
          style={styles.optionButton}
        >
          <Text style={styles.optionButtonText}>
            {customer.name}
          </Text>

          <Text style={styles.sectionHint}>
            {customer.email ?? 'Sin correo'}
            {customer.phone ? ` · ${customer.phone}` : ''}
          </Text>
        </Pressable>
      ))
    ) : (
      <Text style={styles.sectionHint}>
        No encontramos clientes con esa búsqueda.
      </Text>
    )}
  </View>
) : null}
          


 
        <Text style={styles.fieldLabel}>Producto</Text>

<View style={styles.optionRow}>
  {products.map((product) => (
    <Pressable
      key={product._id}
      onPress={() => selectProduct(product)}
      style={[
        styles.optionButton,
        productId === product._id &&
          styles.optionButtonActive
      ]}
    >
      <Text
        style={[
          styles.optionButtonText,
          productId === product._id &&
            styles.optionButtonTextActive
        ]}
      >
        {product.name}
      </Text>
    </Pressable>
  ))}
</View>

<Text style={styles.fieldLabel}>Almacén</Text>

<View style={styles.optionRow}>
  {warehouses.map((warehouse) => (
    <Pressable
      key={warehouse._id}
      onPress={() => setWarehouseId(warehouse._id)}
      style={[
        styles.optionButton,
        warehouseId === warehouse._id &&
          styles.optionButtonActive
      ]}
    >
      <Text
        style={[
          styles.optionButtonText,
          warehouseId === warehouse._id &&
            styles.optionButtonTextActive
        ]}
      >
        {warehouse.name}
      </Text>
    </Pressable>
  ))}
</View>
        <Text style={styles.fieldLabel}>Cantidad</Text>
        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          placeholder="1"
        />

        <Text style={styles.fieldLabel}>Precio unitario</Text>
        <TextInput
          style={styles.input}
          value={unitPrice}
          onChangeText={setUnitPrice}
          keyboardType="numeric"
          placeholder="0"
        />

        <Text style={styles.fieldLabel}>Impuestos</Text>
        <TextInput
          style={styles.input}
          value={taxes}
          onChangeText={setTaxes}
          keyboardType="numeric"
          placeholder="0"
        />

        <Text style={styles.fieldLabel}>Descuento</Text>
        <TextInput
          style={styles.input}
          value={discount}
          onChangeText={setDiscount}
          keyboardType="numeric"
          placeholder="0"
        />

        <Text style={styles.fieldLabel}>Método de pago</Text>

        <View style={styles.optionRow}>
          {[
            ['CASH', 'Efectivo'],
            ['CARD', 'Tarjeta'],
            ['TRANSFER', 'Transferencia'],
            ['CREDIT', 'Crédito']
          ].map(([value, label]) => (
            <Pressable
              key={value}
              onPress={() => setPaymentMethod(value)}
              style={[
                styles.optionButton,
                paymentMethod === value &&
                  styles.optionButtonActive
              ]}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  paymentMethod === value &&
                    styles.optionButtonTextActive
                ]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={handleCreateSale}
          disabled={saving}
        >
          <Text style={styles.primaryButtonText}>
            {saving ? 'Registrando...' : 'Registrar venta'}
          </Text>
        </Pressable>

        {!!message && (
          <Text style={styles.sectionHint}>
            {message}
          </Text>
        )}
      </View>
        <View style={styles.formCard}>
  <Text style={styles.formTitle}>Historial de ventas</Text>

  {sales.length === 0 ? (
    <Text style={styles.sectionHint}>
      Todavía no hay ventas registradas.
    </Text>
  ) : (
    sales.map((sale) => {
      const customer = customers.find(
        (item) => item._id === sale.customerId?._id ||
                  item._id === sale.customerId
      );

      const total =
        sale.total ??
        sale.items?.reduce(
          (sum, item) =>
            sum + Number(item.quantity) * Number(item.unitPrice),
          0
        ) +
          Number(sale.taxes ?? 0) -
          Number(sale.discount ?? 0);

      const paymentLabels = {
        CASH: 'Efectivo',
        CARD: 'Tarjeta',
        TRANSFER: 'Transferencia',
        CREDIT: 'Crédito'
      };

      const statusLabels = {
        DRAFT: 'Borrador',
        PENDING: 'Pendiente',
        CONFIRMED: 'Confirmada',
        PAID: 'Pagada',
        CANCELLED: 'Cancelada'
      };

return (
    <Pressable
    key={sale._id}
    style={styles.saleCard}
    onPress={() => setSelectedSale(sale)}
>
    <View style={styles.saleCardHeader}>
      <View>
        <Text style={styles.saleCustomer}>
          {sale.customerId?.name ??
            customer?.name ??
            'Cliente'}
        </Text>

        <Text style={styles.sectionHint}>
          {sale.items?.length ?? 0} producto(s) ·{' '}
          {paymentLabels[sale.paymentMethod] ??
            sale.paymentMethod}
        </Text>
      </View>

      <Text style={styles.saleTotal}>
        ${Number(total ?? 0).toFixed(2)}
      </Text>
    </View>

    <View style={styles.saleStatusRow}>
      <Text style={styles.saleStatus}>
        {statusLabels[sale.status] ?? sale.status}
      </Text>

<Text style={styles.saleDetailHint}>
  Ver reporte →
</Text>
    </View>


  </Pressable>
);
    })


  )}
</View>
{/* MODAL DETALLE DE VENTA */}
{selectedSale && (() => {
  const selectedCustomer = customers.find(
    (item) =>
      item._id === selectedSale.customerId?._id ||
      item._id === selectedSale.customerId
  );

  const paymentLabels = {
    CASH: 'Efectivo',
    CARD: 'Tarjeta',
    TRANSFER: 'Transferencia',
    CREDIT: 'Crédito'
  };

  const statusLabels = {
    DRAFT: 'Borrador',
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmada',
    PAID: 'Pagada',
    CANCELLED: 'Cancelada'
  };

  return (
    <Modal
    visible={true}
    transparent={true}
    animationType="fade"
    onRequestClose={() => setSelectedSale(null)}
  >
    <View style={styles.saleModalOverlay}>



      {/* Fondo oscuro: también cierra el modal */}
      <Pressable
        style={styles.saleModalBackdrop}
        onPress={() => setSelectedSale(null)}
      />

      {/* Ventana */}
      <View style={styles.saleModal}>

        <View style={styles.saleModalHeader}>
          <View>
            <Text style={styles.saleReportTitle}>
              Detalle de venta
            </Text>

            <Text style={styles.saleReportFolio}>
              Folio: VTA-
              {selectedSale._id?.slice(-6).toUpperCase()}
            </Text>
          </View>

          <Pressable
            style={styles.saleModalClose}
            onPress={() => setSelectedSale(null)}
          >
            <Text style={styles.saleModalCloseText}>
              ×
            </Text>
          </Pressable>
        </View>

        {/* CLIENTE */}
        <Text style={styles.saleModalCustomer}>
          {selectedSale.customerId?.name ??
            selectedCustomer?.name ??
            'Cliente'}
        </Text>

        <View style={styles.saleReportInfo}>
          <Text style={styles.saleReportText}>
            Fecha:{' '}
            <Text style={styles.saleReportStrong}>
              {selectedSale.createdAt
                ? new Date(
                    selectedSale.createdAt
                  ).toLocaleDateString('es-MX')
                : 'Sin fecha'}
            </Text>
          </Text>

          <Text style={styles.saleReportText}>
            Método de pago:{' '}
            <Text style={styles.saleReportStrong}>
              {paymentLabels[selectedSale.paymentMethod] ??
                selectedSale.paymentMethod}
            </Text>
          </Text>

          <Text style={styles.saleReportText}>
            Estado:{' '}
            <Text style={styles.saleReportStrong}>
              {statusLabels[selectedSale.status] ??
                selectedSale.status}
            </Text>
          </Text>
        </View>

        <View style={styles.saleModalDivider} />

        {/* PRODUCTOS */}
        <Text style={styles.saleProductsTitle}>
          Productos de la venta
        </Text>

        {(selectedSale.items ?? []).map(
          (saleItem, index) => {
            const itemProduct = products.find(
              (item) =>
                item._id === saleItem.productId?._id ||
                item._id === saleItem.productId
            );

            const productName =
              saleItem.productId?.name ??
              itemProduct?.name ??
              `Producto ${index + 1}`;

            const itemSubtotal =
              saleItem.subtotal ??
              Number(saleItem.quantity) *
                Number(saleItem.unitPrice);

            return (
              <View
                key={`${selectedSale._id}-${index}`}
                style={styles.saleProductRow}
              >
                <View style={styles.saleProductInfo}>
                  <Text style={styles.saleProductName}>
                    {productName}
                  </Text>

                  <Text style={styles.saleProductMeta}>
                    {saleItem.quantity} × $
                    {Number(
                      saleItem.unitPrice ?? 0
                    ).toFixed(2)}
                  </Text>
                </View>

                <Text style={styles.saleProductSubtotal}>
                  ${Number(itemSubtotal).toFixed(2)}
                </Text>
              </View>
            );
          }
        )}

        {/* TOTALES */}
        <View style={styles.saleTotals}>

          <View style={styles.saleTotalLine}>
            <Text style={styles.saleReportText}>
              Subtotal
            </Text>

            <Text style={styles.saleReportStrong}>
              ${Number(
                selectedSale.subtotal ?? 0
              ).toFixed(2)}
            </Text>
          </View>

          <View style={styles.saleTotalLine}>
            <Text style={styles.saleReportText}>
              Impuestos
            </Text>

            <Text style={styles.saleReportStrong}>
              ${Number(
                selectedSale.taxes ?? 0
              ).toFixed(2)}
            </Text>
          </View>

          <View style={styles.saleTotalLine}>
            <Text style={styles.saleReportText}>
              Descuento
            </Text>

            <Text style={styles.saleReportStrong}>
              -${Number(
                selectedSale.discount ?? 0
              ).toFixed(2)}
            </Text>
          </View>

          <View style={styles.saleGrandTotal}>
            <Text style={styles.saleGrandTotalLabel}>
              TOTAL
            </Text>

            <Text style={styles.saleGrandTotalAmount}>
              ${Number(
                selectedSale.total ?? 0
              ).toFixed(2)}
            </Text>
          </View>

        </View>
      </View>
    </View>
  </Modal>
);
})()}

    </View>
  );

}

    function ProjectsScreen({ companyId }) {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function loadProjects() {
    if (!companyId) return;

    try {
      setLoading(true);
      setMessage('');

      const [projectsResult, tasksResult] = await Promise.all([
        api.projects({ companyId }),
        api.projectTasks({ companyId })
      ]);

      setProjects(
        Array.isArray(projectsResult.data)
          ? projectsResult.data
          : []
      );

      setTasks(
        Array.isArray(tasksResult.data)
          ? tasksResult.data
          : []
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, [companyId]);

  async function handleCreateProject() {
    if (!name.trim()) {
      setMessage('Escribe el nombre del proyecto.');
      return;
    }

    try {
      setSaving(true);
      setMessage('');

      await api.createProject({
        companyId,
        name: name.trim(),
        description: description.trim(),
        priority
      });

      setName('');
      setDescription('');
      setPriority('MEDIUM');

      await loadProjects();

      setMessage('Proyecto creado correctamente.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.moduleContent}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionEyebrow}>
            ORGANIZACIÓN
          </Text>

          <Text style={styles.sectionTitle}>
            Proyectos
          </Text>

          <Text style={styles.sectionHint}>
            Organiza proyectos y actividades del equipo.
          </Text>
        </View>
      </View>

      <View style={styles.dashboardGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>
            Proyectos
          </Text>
          <Text style={styles.statValue}>
            {projects.length}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>
            Tareas
          </Text>
          <Text style={styles.statValue}>
            {tasks.length}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>
            Prioridad alta
          </Text>
          <Text style={styles.statValue}>
            {
              projects.filter(
                (project) => project.priority === 'HIGH'
              ).length
            }
          </Text>
        </View>
      </View>

      {message ? (
        <Text style={styles.messageText}>
          {message}
        </Text>
      ) : null}

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>
          Nuevo proyecto
        </Text>

        <Text style={styles.fieldLabel}>
          Nombre
        </Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ej. Implementación ERP"
          placeholderTextColor="#9A9A96"
        />

        <Text style={styles.fieldLabel}>
          Descripción
        </Text>

        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Descripción del proyecto"
          placeholderTextColor="#9A9A96"
        />

        <Text style={styles.fieldLabel}>
          Prioridad
        </Text>

        <View style={styles.optionRow}>
          {[
            ['LOW', 'Baja'],
            ['MEDIUM', 'Media'],
            ['HIGH', 'Alta']
          ].map(([value, label]) => (
            <Pressable
              key={value}
              onPress={() => setPriority(value)}
              style={[
                styles.optionButton,
                priority === value &&
                  styles.optionButtonActive
              ]}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  priority === value &&
                    styles.optionButtonTextActive
                ]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={handleCreateProject}
          disabled={saving}
        >
          <Text style={styles.primaryButtonText}>
            {saving
              ? 'Creando...'
              : 'Crear proyecto'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>
          Proyectos registrados
        </Text>

        {loading ? (
          <Text style={styles.sectionHint}>
            Cargando proyectos...
          </Text>
        ) : projects.length === 0 ? (
          <Text style={styles.sectionHint}>
            No hay proyectos registrados todavía.
          </Text>
        ) : (
          projects.map((project) => (
            <View
              key={project._id}
              style={styles.recordCard}
            >
              <Text style={styles.recordTitle}>
                {project.name}
              </Text>

              <Text style={styles.recordMeta}>
                Prioridad: {project.priority}
              </Text>

              {project.description ? (
                <Text style={styles.recordMeta}>
                  {project.description}
                </Text>
              ) : null}
            </View>
          ))
        )}
      </View>
    </View>
  );
}






  function PurchasesScreen({ companyId }) {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [productId, setProductId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');

  const [quantity, setQuantity] = useState('1');
  const [unitPrice, setUnitPrice] = useState('0');
  const [taxes, setTaxes] = useState('0');

  const [saving, setSaving] = useState(false);

  async function loadPurchases() {
    if (!companyId) return;

    try {
      setLoading(true);
      setMessage('');

      const [
        purchasesResult,
        suppliersResult,
        productsResult,
        warehousesResult
      ] = await Promise.all([
        api.purchases({
          companyId,
          page: '1',
          limit: '100'
        }),
        api.suppliers({
          companyId,
          page: '1',
          limit: '100'
        }),
        api.products({
          companyId,
          page: '1',
          limit: '100'
        }),
        api.warehouses({
          companyId,
          page: '1',
          limit: '100'
        })
      ]);

      setPurchases(purchasesResult.data.items ?? []);
      setSuppliers(suppliersResult.data.items ?? []);
      setProducts(productsResult.data.items ?? []);
      setWarehouses(warehousesResult.data.items ?? []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPurchases();
  }, [companyId]);

   async function handleCreatePurchase() {

  if (!supplierId || !productId || !warehouseId) {
    setMessage('Selecciona proveedor, producto y almacén.');
    return;
  }

  if (Number(quantity) <= 0) {
    setMessage('La cantidad debe ser mayor a 0.');
    return;
  }

  if (Number(unitPrice) < 0 || Number(taxes) < 0) {
    setMessage('Los importes no pueden ser negativos.');
    return;
  }

  try {
    setSaving(true);
    setMessage('');

    await api.createPurchase({
      companyId,
      supplierId,
      items: [
        {
          productId,
          warehouseId,
          quantity: Number(quantity),
          unitPrice: Number(unitPrice)
        }
      ],
      taxes: Number(taxes)
    });

    setMessage('Compra registrada correctamente.');
    setQuantity('1');
    setUnitPrice('0');
    setTaxes('0');

    await loadPurchases();
  } catch (error) {
    setMessage(error.message);
  } finally {
    setSaving(false);
  }
}

async function handleReceivePurchase(purchaseId) {
  try {
    setSaving(true);
    setMessage('');

    await api.receivePurchase(
      purchaseId,
      companyId
    );

    setMessage(
      'Compra recibida. El inventario fue actualizado correctamente.'
    );

    await loadPurchases();
  } catch (error) {
    setMessage(error.message);
  } finally {
    setSaving(false);
  }
}
    




  const totalPurchases = purchases.reduce(
    (sum, purchase) => sum + Number(purchase.total ?? 0),
    0
  );

  const receivedPurchases = purchases.filter(
    (purchase) => purchase.status === 'RECEIVED'
  ).length;

  return (
    <View style={styles.moduleContent}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionEyebrow}>OPERACIONES</Text>
          <Text style={styles.sectionTitle}>Compras</Text>
          <Text style={styles.sectionHint}>
            Gestiona las compras a proveedores y la recepción de mercancía.
          </Text>
        </View>
      </View>

      <View style={styles.dashboardGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Compras registradas</Text>
          <Text style={styles.statValue}>{purchases.length}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Compras recibidas</Text>
          <Text style={styles.statValue}>{receivedPurchases}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Valor registrado</Text>
          <Text style={styles.statValue}>
            ${totalPurchases.toFixed(2)}
          </Text>
        </View>
      </View>

      {message ? (
        <Text style={styles.messageText}>{message}</Text>
      ) : null}

      
      <View style={styles.formCard}>
  <Text style={styles.formTitle}>Registrar nueva compra</Text>

  <Text style={styles.sectionHint}>
    Selecciona el proveedor, producto y almacén de recepción.
  </Text>

  <Text style={styles.fieldLabel}>Proveedor</Text>

  <View style={styles.optionRow}>
    {suppliers.map((supplier) => (
      <Pressable
        key={supplier._id}
        onPress={() => setSupplierId(supplier._id)}
        style={[
          styles.optionButton,
          supplierId === supplier._id &&
            styles.optionButtonActive
        ]}
      >
        <Text
          style={[
            styles.optionButtonText,
            supplierId === supplier._id &&
              styles.optionButtonTextActive
          ]}
        >
          {supplier.name}
        </Text>
      </Pressable>
    ))}
  </View>

  <Text style={styles.fieldLabel}>Producto</Text>

  <View style={styles.optionRow}>
    {products.map((product) => (
      <Pressable
        key={product._id}
        onPress={() => setProductId(product._id)}
        style={[
          styles.optionButton,
          productId === product._id &&
            styles.optionButtonActive
        ]}
      >
        <Text
          style={[
            styles.optionButtonText,
            productId === product._id &&
              styles.optionButtonTextActive
          ]}
        >
          {product.name}
        </Text>
      </Pressable>
    ))}
  </View>

  <Text style={styles.fieldLabel}>Almacén</Text>

  <View style={styles.optionRow}>
    {warehouses.map((warehouse) => (
      <Pressable
        key={warehouse._id}
        onPress={() => setWarehouseId(warehouse._id)}
        style={[
          styles.optionButton,
          warehouseId === warehouse._id &&
            styles.optionButtonActive
        ]}
      >
        <Text
          style={[
            styles.optionButtonText,
            warehouseId === warehouse._id &&
              styles.optionButtonTextActive
          ]}
        >
          {warehouse.name}
        </Text>
      </Pressable>
    ))}
  </View>

  <Text style={styles.fieldLabel}>Cantidad</Text>
  <TextInput
    style={styles.input}
    value={quantity}
    onChangeText={setQuantity}
    keyboardType="numeric"
    placeholder="Ej. 10"
  />

  <Text style={styles.fieldLabel}>Costo unitario</Text>
  <TextInput
    style={styles.input}
    value={unitPrice}
    onChangeText={setUnitPrice}
    keyboardType="numeric"
    placeholder="Ej. 1500"
  />

  <Text style={styles.fieldLabel}>Impuestos</Text>
  <TextInput
    style={styles.input}
    value={taxes}
    onChangeText={setTaxes}
    keyboardType="numeric"
    placeholder="Ej. 240"
  />

  <Pressable
    style={styles.primaryButton}
    onPress={handleCreatePurchase}
    disabled={saving}
  >
    <Text style={styles.primaryButtonText}>
      {saving ? 'Registrando...' : 'Registrar compra'}
    </Text>
  </Pressable>
</View>



      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Historial de compras</Text>

        {loading ? (
          <Text style={styles.sectionHint}>
            Cargando compras...
          </Text>
        ) : purchases.length === 0 ? (
          <Text style={styles.sectionHint}>
            No hay compras registradas todavía.
          </Text>
        ) : (
          purchases.map((purchase) => (
            <View
              key={purchase._id}
              style={styles.recordCard
                
              }
            >
              <Text style={styles.recordTitle}>
                {purchase.supplierId?.name ?? 'Proveedor'}
              </Text>

              <Text style={styles.recordMeta}>
                Estado: {purchase.status}
              </Text>

              <Text style={styles.recordMeta}>
                Productos: {purchase.items?.length ?? 0}
              </Text>

              <Text style={styles.recordMeta}>
                Total: ${Number(purchase.total ?? 0).toFixed(2)}
              </Text>

              {purchase.status !== 'RECEIVED' &&
 purchase.status !== 'CANCELLED' ? (
  <Pressable
    style={styles.primaryButton}
    onPress={() => handleReceivePurchase(purchase._id)}
    disabled={saving}
  >
    <Text style={styles.primaryButtonText}>
      {saving ? 'Procesando...' : 'Recibir mercancía'}
    </Text>
  </Pressable>
) : (
  <Text style={styles.sectionHint}>
    {purchase.status === 'RECEIVED'
      ? '✓ Mercancía recibida'
      : 'Compra cancelada'}
  </Text>
)}




            </View>
          ))
        )}
      </View>
    </View>
  );
}






function InventoryScreen({ companyId }) {
  const [inventory, setInventory] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState([]);
const [warehouses, setWarehouses] = useState([]);

const [productId, setProductId] = useState('');
const [warehouseId, setWarehouseId] = useState('');
const [quantity, setQuantity] = useState('1');
const [reason, setReason] = useState('');
const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!companyId) {
      setMessage('Tu usuario no tiene una empresa asignada.');
      setLoading(false);
      return;
    }

    async function loadInventory() {
      try {
        setLoading(true);
        setMessage('');

        const [
  inventoryResult,
  movementsResult,
  productsResult,
  warehousesResult
] = await Promise.all([
  api.inventory({
    companyId,
    page: '1',
    limit: '100'
  }),
  api.inventoryMovements({
    companyId,
    page: '1',
    limit: '100'
  }),
  api.products({
    companyId,
    page: '1',
    limit: '100'
  }),
  api.warehouses({
    companyId,
    page: '1',
    limit: '100'
  })
]);

        setInventory(inventoryResult.data.items ?? []);
        setMovements(movementsResult.data.items ?? []);
        setProducts(productsResult.data.items ?? []);
        setWarehouses(warehousesResult.data.items ?? []);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadInventory();
  }, [companyId]);

    async function handleInventoryEntry() {
  if (!productId || !warehouseId) {
    setMessage('Selecciona un producto y un almacén.');
    return;
  }

  if (Number(quantity) <= 0) {
    setMessage('La cantidad debe ser mayor a 0.');
    return;
  }

  try {
    setSaving(true);
    setMessage('');

    await api.createInventoryMovement({
      companyId,
      productId,
      warehouseId,
      type: 'ADJUSTMENT',
      direction: 'IN',
      quantity: Number(quantity),
      reason: reason.trim() || 'Entrada manual de inventario'
    });

    setMessage('Entrada de inventario registrada correctamente.');
    setQuantity('1');
    setReason('');

    const [inventoryResult, movementsResult] =
      await Promise.all([
        api.inventory({
          companyId,
          page: '1',
          limit: '100'
        }),
        api.inventoryMovements({
          companyId,
          page: '1',
          limit: '100'
        })
      ]);

    setInventory(inventoryResult.data.items ?? []);
    setMovements(movementsResult.data.items ?? []);
  } catch (error) {
    setMessage(error.message);
  } finally {
    setSaving(false);
  }
}


  const totalUnits = inventory.reduce(
    (sum, item) => sum + Number(item.quantity ?? 0),
    0
  );

  const lowStockItems = inventory.filter(
    (item) =>
      Number(item.quantity ?? 0) <=
      Number(item.productId?.minStock ?? 0)
  );

  const movementLabels = {
    SALE: 'Venta',
    PURCHASE: 'Compra',
    RETURN: 'Devolución',
    TRANSFER: 'Transferencia',
    ADJUSTMENT: 'Ajuste'
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Inventario</Text>

      <Text style={styles.sectionHint}>
        Consulta existencias y movimientos de almacén.
      </Text>

      {/* RESUMEN */}
      <View style={styles.dashboardMetrics}>
        <View style={styles.dashboardCard}>
          <Text style={styles.dashboardCardLabel}>
            Productos en inventario
          </Text>

          <Text style={styles.dashboardCardValue}>
            {inventory.length}
          </Text>

          <Text style={styles.dashboardCardHint}>
            Registros de existencias
          </Text>
        </View>

        <View style={styles.dashboardCard}>
          <Text style={styles.dashboardCardLabel}>
            Unidades disponibles
          </Text>

          <Text style={styles.dashboardCardValue}>
            {totalUnits}
          </Text>

          <Text style={styles.dashboardCardHint}>
            Existencia total
          </Text>
        </View>

        <View style={styles.dashboardCard}>
          <Text style={styles.dashboardCardLabel}>
            Stock bajo
          </Text>

          <Text style={styles.dashboardCardValue}>
            {lowStockItems.length}
          </Text>

          <Text style={styles.dashboardCardHint}>
            Requieren atención
          </Text>
        </View>
      </View>

      {!!message && (
        <Text style={styles.sectionHint}>
          {message}
        </Text>
      )}


      {/* REGISTRAR ENTRADA */}
<View style={styles.formCard}>
  <Text style={styles.formTitle}>
    Registrar entrada de inventario
  </Text>

  <Text style={styles.sectionHint}>
    Agrega existencias de un producto al almacén.
  </Text>

  <Text style={styles.fieldLabel}>Producto</Text>

  <View style={styles.optionRow}>
    {products.map((product) => (
      <Pressable
        key={product._id}
        onPress={() => setProductId(product._id)}
        style={[
          styles.optionButton,
          productId === product._id &&
            styles.optionButtonActive
        ]}
      >
        <Text
          style={[
            styles.optionButtonText,
            productId === product._id &&
              styles.optionButtonTextActive
          ]}
        >
          {product.name}
        </Text>
      </Pressable>
    ))}
  </View>

  <Text style={styles.fieldLabel}>Almacén</Text>

  <View style={styles.optionRow}>
    {warehouses.map((warehouse) => (
      <Pressable
        key={warehouse._id}
        onPress={() => setWarehouseId(warehouse._id)}
        style={[
          styles.optionButton,
          warehouseId === warehouse._id &&
            styles.optionButtonActive
        ]}
      >
        <Text
          style={[
            styles.optionButtonText,
            warehouseId === warehouse._id &&
              styles.optionButtonTextActive
          ]}
        >
          {warehouse.name}
        </Text>
      </Pressable>
    ))}
  </View>

  <Text style={styles.fieldLabel}>Cantidad</Text>

  <TextInput
    style={styles.input}
    value={quantity}
    onChangeText={setQuantity}
    keyboardType="numeric"
    placeholder="Ej. 25"
  />

  <Text style={styles.fieldLabel}>
    Motivo
  </Text>

  <TextInput
    style={styles.input}
    value={reason}
    onChangeText={setReason}
    placeholder="Ej. Inventario inicial"
    placeholderTextColor="#9A9A96"
  />

  <Pressable
    style={styles.primaryButton}
    onPress={handleInventoryEntry}
    disabled={saving}
  >
    <Text style={styles.primaryButtonText}>
      {saving ? 'Registrando...' : 'Registrar entrada'}
    </Text>
  </Pressable>
</View>





      {/* EXISTENCIAS */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>
          Existencias por almacén
        </Text>

        {loading ? (
          <Text style={styles.sectionHint}>
            Cargando inventario...
          </Text>
        ) : inventory.length === 0 ? (
          <Text style={styles.sectionHint}>
            No hay existencias registradas todavía.
          </Text>
        ) : (
          inventory.map((item) => (
            <View key={item._id} style={styles.record}>
              <View style={styles.recordCopy}>
                <Text style={styles.recordTitle}>
                  {item.productId?.name ?? 'Producto'}
                </Text>

                <Text style={styles.recordMeta}>
                  SKU: {item.productId?.sku ?? 'Sin SKU'}
                </Text>

                <Text style={styles.recordMeta}>
                  Almacén: {item.warehouseId?.name ?? 'Sin almacén'}
                </Text>
              </View>

              <View>
                <Text style={styles.dashboardCardValue}>
                  {item.quantity ?? 0}
                </Text>

                <Text style={styles.recordMeta}>
                  {item.productId?.unit ?? 'unidad(es)'}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* MOVIMIENTOS */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>
          Historial de movimientos
        </Text>

        {movements.length === 0 ? (
          <Text style={styles.sectionHint}>
            No hay movimientos registrados.
          </Text>
        ) : (
          movements.map((movement) => (
            <View key={movement._id} style={styles.record}>
              <View style={styles.recordCopy}>
                <Text style={styles.recordTitle}>
                  {movement.productId?.name ?? 'Producto'}
                </Text>

                <Text style={styles.recordMeta}>
                  {movementLabels[movement.type] ??
                    movement.type}
                  {' · '}
                  {movement.warehouseId?.name ??
                    'Sin almacén'}
                </Text>
              </View>

              <Text style={styles.recordTitle}>
                {movement.quantity ?? 0}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}





function ReportsScreen({ companyId }) {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!companyId) {
      setMessage('Tu usuario no tiene una empresa asignada.');
      setLoading(false);
      return;
    }

    async function loadReports() {
      try {
        setLoading(true);
        setMessage('');

        const [salesResult, customersResult] = await Promise.all([
          api.sales({
            companyId,
            page: '1',
            limit: '100'
          }),
          api.customers({
            companyId,
            page: '1',
            limit: '100'
          })
        ]);

        setSales(salesResult.data.items ?? []);
        setCustomers(customersResult.data.items ?? []);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, [companyId]);

  async function exportSalesPDF() {
  if (!sales.length) {
    setMessage('No hay ventas disponibles para exportar.');
    return;
  }

    if (Platform.OS !== 'web') {
  setMessage('La exportación PDF está disponible desde la versión web.');
  return;
}

const { jsPDF } = await import('jspdf');


  const doc = new jsPDF();

  const paymentLabels = {
    CASH: 'Efectivo',
    CARD: 'Tarjeta',
    TRANSFER: 'Transferencia',
    CREDIT: 'Crédito'
  };

  const statusLabels = {
    DRAFT: 'Borrador',
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmada',
    PAID: 'Pagada',
    CANCELLED: 'Cancelada'
  };

  const reportTotal = sales.reduce(
    (sum, sale) => sum + Number(sale.total ?? 0),
    0
  );

  // ENCABEZADO
  doc.setFontSize(20);
  doc.text('KIT-LI ERP', 14, 18);

  doc.setFontSize(14);
  doc.text('Reporte de Ventas', 14, 28);

  doc.setFontSize(9);
  doc.text(
    `Generado: ${new Date().toLocaleDateString('es-MX')}`,
    14,
    35
  );

  doc.text(
    `Ventas incluidas: ${sales.length}`,
    14,
    41
  );

  doc.text(
    `Total registrado: $${reportTotal.toFixed(2)}`,
    14,
    47
  );

  doc.line(14, 52, 196, 52);

  let y = 60;

  sales.forEach((sale, index) => {
    const customer = customers.find(
      (item) =>
        item._id === sale.customerId?._id ||
        item._id === sale.customerId
    );

    const customerName =
      sale.customerId?.name ??
      customer?.name ??
      'Cliente';

    const folio =
      `VTA-${sale._id?.slice(-6).toUpperCase()}`;

    const date = sale.createdAt
      ? new Date(sale.createdAt).toLocaleDateString('es-MX')
      : 'Sin fecha';

    const payment =
      paymentLabels[sale.paymentMethod] ??
      sale.paymentMethod;

    const status =
      statusLabels[sale.status] ??
      sale.status;

    // NUEVA PÁGINA
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');

    doc.text(
      `${index + 1}. ${folio} - ${customerName}`,
      14,
      y
    );

    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);

    doc.text(
      `Fecha: ${date} | Pago: ${payment} | Estado: ${status}`,
      14,
      y + 6
    );

    doc.text(
      `Productos: ${sale.items?.length ?? 0} | Total: $${Number(
        sale.total ?? 0
      ).toFixed(2)}`,
      14,
      y + 12
    );

    doc.line(14, y + 16, 196, y + 16);

    y += 23;
  });

  doc.save(
    `KIT-LI_Reporte_Ventas_${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`
  );

  setMessage('Reporte PDF generado correctamente.');
}





  async function exportSalesExcel() {
    if (Platform.OS !== 'web') {
  setMessage('La exportación Excel está disponible desde la versión web.');
  return;
}

const XLSX = await import('xlsx');
  if (!sales.length) {
    setMessage('No hay ventas disponibles para exportar.');
    return;
  }

  const paymentLabels = {
    CASH: 'Efectivo',
    CARD: 'Tarjeta',
    TRANSFER: 'Transferencia',
    CREDIT: 'Crédito'
  };

  const statusLabels = {
    DRAFT: 'Borrador',
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmada',
    PAID: 'Pagada',
    CANCELLED: 'Cancelada'
  };

  const reportData = sales.map((sale) => {
    const customer = customers.find(
      (item) =>
        item._id === sale.customerId?._id ||
        item._id === sale.customerId
    );

    return {
      Folio: `VTA-${sale._id?.slice(-6).toUpperCase()}`,
      Fecha: sale.createdAt
        ? new Date(sale.createdAt).toLocaleDateString('es-MX')
        : 'Sin fecha',
      Cliente:
        sale.customerId?.name ??
        customer?.name ??
        'Cliente',
      Productos: sale.items?.length ?? 0,
      'Método de pago':
        paymentLabels[sale.paymentMethod] ??
        sale.paymentMethod,
      Estado:
        statusLabels[sale.status] ??
        sale.status,
      Subtotal: Number(sale.subtotal ?? 0),
      Impuestos: Number(sale.taxes ?? 0),
      Descuento: Number(sale.discount ?? 0),
      Total: Number(sale.total ?? 0)
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(reportData);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Ventas'
  );

  XLSX.writeFile(
    workbook,
    `KIT-LI_Reporte_Ventas_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`
  );

  setMessage('Reporte de Excel generado correctamente.');
}


  const totalSales = sales.reduce(
    (sum, sale) => sum + Number(sale.total ?? 0),
    0
  );

  return (
    <View>
      <Text style={styles.sectionTitle}>Reportes</Text>

      <Text style={styles.sectionHint}>
        Consulta y exporta la información comercial de KIT-LI ERP.
      </Text>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Reporte de ventas</Text>

        <Text style={styles.sectionHint}>
          {loading
            ? 'Preparando información...'
            : `${sales.length} ventas disponibles para exportar`}
        </Text>

        <Text style={styles.fieldLabel}>
          Total registrado
        </Text>

        <Text style={styles.dashboardCardValue}>
          ${totalSales.toFixed(2)}
        </Text>

        {!!message && (
          <Text style={styles.sectionHint}>
            {message}
          </Text>
        )}

        <View style={styles.formActions}>
          <Pressable style={styles.secondaryButton}onPress={exportSalesPDF}
>
            <Text style={styles.secondaryButtonText}>
              Exportar PDF
            </Text>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={exportSalesExcel}>
            <Text style={styles.secondaryButtonText}>
              Exportar Excel
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}



function RecordsScreen({ moduleKey, companyId }) {
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState(companyId ? '' : 'Tu usuario no tiene una empresa asignada.');
  const [form, setForm] = useState({ name: '', email: '', phone: '', sku: '', description: '', unit: 'pieza', purchasePrice: '0', salePrice: '0', categoryId: '' });
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const endpoint = moduleKey === 'customers' ? api.customers : moduleKey === 'suppliers' ? api.suppliers : api.products;

  useEffect(() => {
    if (!companyId) return;
    endpoint({ companyId, page: '1', limit: '100' }).then((result) => { setRecords(result.data.items ?? []); setMessage(''); }).catch((error) => setMessage(error.message));
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

  const filteredRecords = records.filter((record) => {
  const term = search.trim().toLowerCase();

  if (!term) return true;

  return [
    record.name,
    record.email,
    record.phone,
    record.sku
  ].some((value) =>
    String(value ?? '').toLowerCase().includes(term)
  );
});



return (
  <View>
    <Text style={styles.sectionTitle}>
      {moduleCatalog.find((item) => item.key === moduleKey)?.label}
    </Text>

    {!!message && (
      <Text style={styles.sectionHint}>{message}</Text>
    )}

    <View style={styles.formCard}>
      <Text style={styles.formTitle}>
        {editingId
          ? moduleKey === 'customers'
            ? 'Editar cliente'
            : 'Editar registro'
          : moduleKey === 'customers'
            ? 'Nuevo cliente'
            : 'Nuevo registro'}
      </Text>

      <Text style={styles.sectionHint}>
        {moduleKey === 'customers'
          ? 'Ingresa los datos del cliente.'
          : moduleKey === 'products'
            ? 'Ingresa los datos del producto.'
            : 'Ingresa los datos del registro.'}
      </Text>

      <Text style={styles.fieldLabel}>
        {moduleKey === 'customers' ? 'Nombre completo' : 'Nombre'}
      </Text>

      <TextInput
        placeholder={
          moduleKey === 'customers'
            ? 'Ej. Mariana Hernández López'
            : 'Nombre'
        }
        placeholderTextColor="#9A9A96"
        style={styles.input}
        value={form.name}
        onChangeText={(value) => updateField('name', value)}
      />

      {moduleKey === 'products' ? (
        <>
          <Text style={styles.fieldLabel}>SKU</Text>
          <TextInput
            placeholder="Ej. KIT-051"
            placeholderTextColor="#9A9A96"
            style={styles.input}
            value={form.sku}
            onChangeText={(value) => updateField('sku', value)}
          />

          <Text style={styles.fieldLabel}>ID de categoría</Text>
          <TextInput
            placeholder="ID de categoría"
            placeholderTextColor="#9A9A96"
            style={styles.input}
            value={form.categoryId}
            onChangeText={(value) => updateField('categoryId', value)}
          />

          <Text style={styles.fieldLabel}>Precio de compra</Text>
          <TextInput
            placeholder="0.00"
            keyboardType="decimal-pad"
            placeholderTextColor="#9A9A96"
            style={styles.input}
            value={form.purchasePrice}
            onChangeText={(value) =>
              updateField('purchasePrice', value)
            }
          />

          <Text style={styles.fieldLabel}>Precio de venta</Text>
          <TextInput
            placeholder="0.00"
            keyboardType="decimal-pad"
            placeholderTextColor="#9A9A96"
            style={styles.input}
            value={form.salePrice}
            onChangeText={(value) =>
              updateField('salePrice', value)
            }
          />
        </>
      ) : (
        <>
          <Text style={styles.fieldLabel}>
            Correo electrónico
          </Text>

          <TextInput
            placeholder="cliente@correo.com"
            placeholderTextColor="#9A9A96"
            style={styles.input}
            value={form.email}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(value) =>
              updateField('email', value)
            }
          />

          <Text style={styles.fieldLabel}>Teléfono</Text>

          <TextInput
            placeholder="Ej. 2461234567"
            placeholderTextColor="#9A9A96"
            style={styles.input}
            value={form.phone}
            keyboardType="phone-pad"
            onChangeText={(value) =>
              updateField('phone', value)
            }
          />
        </>
      )}

      <View style={styles.formActions}>
        <Pressable
          onPress={createRecord}
          disabled={saving}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>
            {saving
              ? 'Guardando...'
              : editingId
                ? 'Guardar cambios'
                : moduleKey === 'customers'
                  ? 'Registrar cliente'
                  : moduleKey === 'products'
                    ? 'Registrar producto'
                    : 'Crear registro'}
          </Text>
        </Pressable>

        {editingId ? (
          <Pressable
            onPress={() => {
              setEditingId(null);
              setForm({
                name: '',
                email: '',
                phone: '',
                sku: '',
                description: '',
                unit: 'pieza',
                purchasePrice: '0',
                salePrice: '0',
                categoryId: ''
              });
            }}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>
              Cancelar
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>

    <Text style={styles.formTitle}>
      {moduleKey === 'customers'
        ? 'Clientes registrados'
        : moduleKey === 'products'
          ? 'Productos registrados'
          : 'Registros'}
    </Text>

    <TextInput
  placeholder={
    moduleKey === 'customers'
      ? '🔎 Buscar por nombre, correo o teléfono...'
      : '🔎 Buscar registro...'
  }
  placeholderTextColor="#9A9A96"
  style={styles.input}
  value={search}
  onChangeText={setSearch}
/>

<Text style={styles.sectionHint}>
  {filteredRecords.length} resultado(s)
</Text>




    {filteredRecords.map((record) => (
      <View key={record._id} style={styles.record}>
        <View style={styles.recordCopy}>
          <Text style={styles.recordTitle}>
            {record.name ?? record.sku}
          </Text>

          <Text style={styles.recordMeta}>
            {record.email ??
              record.description ??
              record.unit ??
              'Registro activo'}
          </Text>

          {moduleKey === 'customers' && record.phone ? (
            <Text style={styles.recordMeta}>
              Tel. {record.phone}
            </Text>
          ) : null}
        </View>

        <View style={styles.recordActions}>
          <Pressable onPress={() => editRecord(record)}>
            <Text style={styles.actionText}>Editar</Text>
          </Pressable>

          <Pressable
            onPress={() => deactivateRecord(record)}
          >
            <Text style={styles.dangerText}>
              Desactivar
            </Text>
          </Pressable>
        </View>
      </View>
    ))}
  </View>
);
}

function Workspace({ user, onLogout }) {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  useEffect(() => {
  if (!user?.companyId || activeModule !== 'dashboard') {
    return;
  }

  async function loadDashboard() {
    try {
      const response = await api.dashboard(user.companyId);
      console.log('DASHBOARD ACTUAL:', response.data);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    }
  }

  loadDashboard();
}, [user?.companyId, activeModule]);
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
      <View
  style={[
    styles.erpWorkspace,
    Platform.OS !== 'web' && styles.erpWorkspaceMobile
  ]}
>

        {/* SIDEBAR */}
        <View
  style={[
    styles.erpSidebar,
    Platform.OS !== 'web' && styles.erpSidebarMobile
  ]}
>

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

          <Text
  style={[
    styles.menuLabel,
    Platform.OS !== 'web' && { display: 'none' }
  ]}
>
  MENÚ PRINCIPAL
</Text>

           <ScrollView
  style={[
    styles.sidebarNavigation,
    Platform.OS !== 'web' && styles.sidebarNavigationMobile
  ]}
  horizontal={Platform.OS !== 'web'}
  showsVerticalScrollIndicator={false}
  showsHorizontalScrollIndicator={false}
>




            {moduleCatalog.map((item) => {
              const selected = activeModule === item.key;

              return (
                <Pressable
                  key={item.key}
                  onPress={() => setActiveModule(item.key)}
                  style={[
  styles.erpNavItem,
  Platform.OS !== 'web' && styles.erpNavItemMobile,
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

          <View
  style={[
    styles.sidebarBottom,
    Platform.OS !== 'web' && { display: 'none' }
  ]}
>
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
            <View
  style={[
    styles.erpMain,
    Platform.OS !== 'web' && styles.erpMainMobile
  ]}
>

          {/* HEADER */}
          <View
  style={[
    styles.erpHeader,
    Platform.OS !== 'web' && styles.erpHeaderMobile
  ]}
>
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
             style={[
  styles.erpContent,
  Platform.OS !== 'web' && styles.erpContentMobile
]}
            showsVerticalScrollIndicator={false}
          >
           {isRecords ? (
               <RecordsScreen
          moduleKey={activeModule}
          companyId={user?.companyId}
      />
        ) : activeModule === 'sales' ? (
      <SalesScreen
        companyId={user?.companyId}
      />


     ) : activeModule === 'projects' ? (
     <ProjectsScreen
     companyId={user?.companyId}
     />
        
      

          ) : activeModule === 'inventory' ? (
  <InventoryScreen
    companyId={user?.companyId}
  />


      ) : activeModule === 'reports' ? (
  <ReportsScreen
    companyId={user?.companyId}
  />

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
                      {dashboardData?.sales ?? 0}
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
                        {dashboardData?.products ?? 0}
                    </Text>

                    <Text style={styles.dashboardCardHint}>
                      Productos activos
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
                       {dashboardData?.customers ?? 0}
                    </Text>

                    <Text style={styles.dashboardCardHint}>
                      Clientes registrados
                    </Text>
                  </View>

                  <View style={styles.dashboardCard}>
                    <View style={styles.cardIcon}>
                      <Text style={styles.cardIconText}>!</Text>
                    </View>

                    <Text style={styles.dashboardCardLabel}>
                      Productos por reabastecer
                    </Text>

                    <Text style={styles.dashboardCardValue}>
                      {dashboardData?.lowStock ?? 0}
                    </Text>

                    <Text style={styles.dashboardCardHint}>
                      Stock bajo
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

    const params =
  Platform.OS === 'web'
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams('');
    const token = params.get('token');

    if (
      Platform.OS === 'web' &&
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

  saleCard: {
  marginTop: 12,
  padding: 16,
  borderWidth: 1,
  borderColor: '#E8E4DE',
  borderRadius: 12,
  backgroundColor: '#FFFFFF',
},

saleCardHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
},

saleCustomer: {
  fontSize: 15,
  fontWeight: '700',
  color: '#202321',
},

saleTotal: {
  fontSize: 18,
  fontWeight: '800',
  color: '#E64B32',
},

saleStatusRow: {
  flexDirection: 'row',
  marginTop: 12,
},

saleStatus: {
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 8,
  backgroundColor: '#FCE9E4',
  color: '#E64B32',
  fontSize: 12,
  fontWeight: '700',
},

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

loginPageMobile: {
  padding: 16,
  minHeight: undefined,
  justifyContent: 'center',
},

loginContainerMobile: {
  flexDirection: 'column',
  minHeight: undefined,
  maxWidth: 480,
  borderRadius: 22,
},

loginBrandPanelMobile: {
  flex: 0,
  padding: 24,
  alignItems: 'center',
},

loginFormPanelMobile: {
  flex: 0,
  padding: 24,
  width: '100%',
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

erpNavItemMobile: {
  minHeight: 42,
  marginRight: 8,
  marginBottom: 8,
  paddingHorizontal: 14,
},


sidebarNavigationMobile: {
  flexGrow: 0,
  flexDirection: 'row',
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

erpWorkspaceMobile: {
  flexDirection: 'column',
  minHeight: undefined,
},

erpSidebarMobile: {
  width: '100%',
  maxHeight: 210,
  borderRightWidth: 0,
  borderBottomWidth: 1,
  borderBottomColor: '#E8E4DE',
  paddingTop: 10,
  paddingHorizontal: 12,
},

erpMainMobile: {
  width: '100%',
  flex: 1,
},

erpHeaderMobile: {
  minHeight: 64,
  paddingHorizontal: 16,
},

erpContentMobile: {
  padding: 16,
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

fieldLabel: {
  fontSize: 13,
  fontWeight: '700',
  color: '#202321',
  marginTop: 16,
  marginBottom: 8,
},

optionRow: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
  marginBottom: 4,
},

optionButton: {
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#E8E4DE',
  backgroundColor: '#FFFFFF',
},

optionButtonActive: {
  backgroundColor: '#FCE9E4',
  borderColor: '#E64B32',
},

optionButtonText: {
  fontSize: 14,
  fontWeight: '600',
  color: '#6F7774',
},

optionButtonTextActive: {
  color: '#E64B32',
  fontWeight: '700',
},

saleDetailHint: {
  fontSize: 13,
  fontWeight: '700',
  color: '#E64B32'
},

saleReport: {
  marginTop: 18,
  paddingTop: 18,
  borderTopWidth: 1,
  borderTopColor: '#E8E4DE'
},

saleReportHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: 18
},

saleReportTitle: {
  fontSize: 19,
  fontWeight: '800',
  color: '#151515'
},

saleReportFolio: {
  marginTop: 4,
  fontSize: 12,
  color: '#6F7774'
},

saleReportDate: {
  fontSize: 13,
  color: '#6F7774'
},

saleReportInfo: {
  backgroundColor: '#F7F5F1',
  borderRadius: 12,
  padding: 14,
  marginBottom: 18,
  gap: 6
},

saleReportText: {
  fontSize: 14,
  color: '#6F7774'
},

saleReportStrong: {
  fontWeight: '700',
  color: '#202321'
},

saleProductsTitle: {
  fontSize: 15,
  fontWeight: '800',
  color: '#202321',
  marginBottom: 10
},

saleProductRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#E8E4DE'
},

saleProductInfo: {
  flex: 1
},

saleProductName: {
  fontSize: 14,
  fontWeight: '700',
  color: '#202321'
},

saleProductMeta: {
  marginTop: 3,
  fontSize: 12,
  color: '#6F7774'
},

saleProductSubtotal: {
  fontSize: 14,
  fontWeight: '700',
  color: '#202321'
},

saleTotals: {
  marginTop: 16
},

saleTotalLine: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingVertical: 4
},

saleGrandTotal: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 10,
  paddingTop: 12,
  borderTopWidth: 2,
  borderTopColor: '#151515'
},

saleGrandTotalLabel: {
  fontSize: 17,
  fontWeight: '800',
  color: '#151515'
},

saleGrandTotalAmount: {
  fontSize: 22,
  fontWeight: '900',
  color: '#E64B32'
},

saleModalOverlay: {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999
},

saleModalBackdrop: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(21, 21, 21, 0.55)'
},

saleModal: {
  width: '90%',
  maxWidth: 650,
  maxHeight: '85%',
  backgroundColor: '#FFFFFF',
  borderRadius: 20,
  padding: 28,
  zIndex: 10000,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 8
  },
  shadowOpacity: 0.18,
  shadowRadius: 24,
  elevation: 12
},

saleModalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: 22
},

saleModalClose: {
  width: 38,
  height: 38,
  borderRadius: 19,
  backgroundColor: '#F7F5F1',
  alignItems: 'center',
  justifyContent: 'center'
},

saleModalCloseText: {
  fontSize: 25,
  lineHeight: 27,
  fontWeight: '600',
  color: '#202321'
},

saleModalCustomer: {
  fontSize: 21,
  fontWeight: '800',
  color: '#202321',
  marginBottom: 14
},

saleModalDivider: {
  height: 1,
  backgroundColor: '#E8E4DE',
  marginVertical: 20
},




});
