# Auditoría QA — fase-19-nucleo

Base revisada: 82f6b50. Rama principal de trabajo indicada por la propietaria:
`fase-19-nucleo`. La rama `main` contiene una versión anterior. Este cambio conserva
recuperación de contraseña, configuración de despliegue y transacciones existentes.

## Hallazgos corregidos

| Área | Fallo | Cambio |
|---|---|---|
| Consultas | Express 5 rechaza sobrescribir req.query | Datos validados separados y todos los consumidores actualizados |
| Empresa | Mutar el getter query no garantizaba aplicar el alcance | Empresa del token aplicada a validación; petición de otra empresa rechazada |
| Empresas/sucursales | Gerente podía consultar IDs de otras empresas | Alcance en parámetros y listado; alta de empresas reservada al administrador global |
| Registro público | Podía reclamar pertenencia a cualquier empresa | Empresa/sucursal no aceptadas en registro público; asignación administrativa necesaria |
| Roles | CREATE general habilitaba módulos ajenos | Escrituras por módulo y rol; botones de catálogos coherentes |
| Guardar/login/reset | Repetición por doble clic | Bloqueo de evento y botones durante solicitudes |
| Navegación | Conservaba edición del módulo anterior | Pantallas con identidad por módulo/empresa |
| Consultas tardías | Resultado anterior podía sustituir el módulo actual | Cancelación y descarte de respuestas después de navegar |
| Desactivar | Operación inmediata y estado inactivo poco visible | Confirmación inline, estado visible y acciones inactivas bloqueadas |
| Catálogos | Solo 20 registros y categoría escrita como ObjectId | Paginación, selector y creación de categorías desde Productos |
| Formularios | Email opcional vacío era inválido; precios aceptaban valores incorrectos | Omitir email en alta, null para borrarlo al editar; números finitos/no negativos |
| Menú | Seis secciones solo mostraban tarjetas genéricas | Consultas reales, dashboard, reportes de compras/ventas y estados vacío/error/reintento |
| Red | Sin timeout y errores no JSON incomprensibles | Tiempo límite, cancelación, error legible, status/details preservados |
| Recuperación | Enlace y remitente fijados en código; falta de proveedor simulaba éxito | PASSWORD_RESET_URL y EMAIL_FROM configurables; 503 si correo no configurado |
| Ventas | DRAFT→PAID y CONFIRMED→PENDING permitidos | Transiciones validadas; repetición del mismo estado sin efectos; cancelar confirmada bloqueado hasta disponer de reversión |
| Móvil | Sidebar fija consumía el ancho | Navegación adaptable a pantallas pequeñas |

## Validación

Pruebas backend: salud, validación, consultas autenticadas, alcance de empresa,
roles y transiciones. Pruebas frontend: token, errores, formularios y eventos de
componentes con API y controles nativos simulados. Se ejercitan doble guardar,
confirmación de desactivación, cambio de módulo, respuesta tardía y recuperación.
Exportación Expo Web verificada. CI repite las pruebas y exportación.

Estas pruebas no prueban persistencia MongoDB, entrega de correo ni ejecución
Android real. El navegador local de QA no pudo instalarse por fallo de descarga;
no se afirma inspección visual ni prueba integral por clic en navegador.

## Pendientes para una entrega completa

- Validación integral con MongoDB replica set y datos exclusivos de pruebas.
- Concurrencia e idempotencia persistente en confirmación/recepción y pagos.
- Reconciliación stock agregado/almacenes y filtro lowStock antes de paginar.
- Revocación de JWT ante cambio de contraseña, rol o estado del usuario.
- Confirmar/cancelar ventas con reversión, recibir compras y movimientos desde UI.
  Los módulos nuevos de negocio son de consulta y lo indican explícitamente.
- Aplicación de pagos a saldos y política de crédito, sobrepagos y reembolsos.
- Filtros/exportación paginada de reportes y edición de proyectos/tareas.
- Selector de categorías pagina hasta 100 categorías activas; ampliar para catálogos mayores.
- Deep links nativos para recuperación; actualmente el enlace abre la aplicación web.
- Prueba real de SMTP/proveedor y dominio del remitente, HTTPS y CORS de despliegue.

## Configuración

Backend carga `backend/.env` y después `.env` raíz; variables de proceso tienen
prioridad. Configure PASSWORD_RESET_URL con la URL real de la web que termina en
/reset-password; EMAIL_FROM debe ser un remitente autorizado por el proveedor.
No incluir credenciales en variables EXPO_PUBLIC_*.

Conclusión: los eventos de catálogos y autenticación tienen defensas y pruebas,
y el menú consulta datos reales. El sistema mejora su base operativa, pero no
se considera un ERP completo ni validado para producción hasta cerrar los
pendientes de integridad y las pruebas reales web/Android.
