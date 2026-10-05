# ERP Modular

Base de la Fase 1 para un ERP multiempresa y multisucursal.

## Arquitectura

- `frontend/`: Expo + React Native + React Native Web.
- `backend/`: Node.js + Express + API REST.
- MongoDB Atlas se consume exclusivamente desde el backend mediante Mongoose.
- La comunicación frontend-backend usa JSON y una URL configurable por entorno.

## Requisitos

- Node.js 24+
- npm 11+
- Una URI de MongoDB Atlas para habilitar persistencia

## Instalación

```bash
npm install
copy .env.example .env
```

En macOS/Linux, usa `cp .env.example .env`. Edita `.env` y reemplaza `MONGODB_URI` con una credencial de Atlas. No guardes ese archivo en Git.

## Ejecución

Terminal 1:

```bash
npm run dev:backend
```

Terminal 2:

```bash
npm run web
```

- API: `http://localhost:4000`
- Salud de API: `http://localhost:4000/api/health`
- Frontend web: URL mostrada por Expo, normalmente `http://localhost:8081`

Si `MONGODB_URI` no está configurada, el backend puede arrancar para validar la API, pero el estado de base de datos aparecerá como pendiente de configuración.

## Pruebas

```bash
npm test --workspace backend
```

## Fases 9 a 17

También se prepararon compras, finanzas, RRHH, CRM, proyectos, notificaciones, auditoría, dashboard y reportes iniciales. Estas capas usan los modelos existentes y mantienen autenticación, validación y aislamiento por empresa.

Rutas agregadas:

- `/api/purchases`
- `/api/finance`
- `/api/hr`
- `/api/crm`
- `/api/projects`
- `/api/notifications`
- `/api/audit`
- `/api/dashboard`
- `/api/reports`

La Fase 18 agrega rate limiting específico al login y manejo seguro de cuerpos JSON inválidos. El cliente frontend incluye login, navegación, cierre de sesión y consultas iniciales de clientes, proveedores y productos.

Las pantallas de clientes, proveedores y productos incluyen formularios de alta reutilizables, estados de guardado, errores y actualización del listado después de crear un registro.

También incluyen edición y desactivación lógica desde cada registro, con confirmación visual del resultado y envío del `companyId` requerido por la API.

## Estado de la Fase 8

Se implementó el flujo inicial de ventas: cliente, productos, cálculo de subtotal/impuestos/descuento/total, estados, confirmación, salida de inventario, ingreso financiero y auditoría.

Endpoints:

- `GET/POST /api/sales`
- `GET /api/sales/:id?companyId=<id>`
- `PUT /api/sales/:id/status?companyId=<id>`

La confirmación usa el servicio de inventario y crea un ingreso y una auditoría relacionados.

## Estado de la Fase 7

Se implementaron almacenes e inventario. El inventario se separa por producto y almacén; cada cambio registra un documento en `inventory_movements`. Entradas y salidas actualizan el stock agregado del producto, mientras las transferencias mueven existencias entre almacenes sin alterar el total global.

Endpoints:

- `GET/POST /api/warehouses`
- `GET/PUT/DELETE /api/warehouses/:id?companyId=<id>`
- `GET /api/inventory`
- `GET /api/inventory/movements`
- `POST /api/inventory/movement`

Tipos soportados: `PURCHASE`, `SALE`, `ADJUSTMENT`, `TRANSFER`, `RETURN`.

## Estado de la Fase 6

Se implementaron productos y categorías. Los productos son la fuente única de SKU, precios, unidad y existencia inicial; las categorías se relacionan mediante `categoryId`. Ambos módulos usan `companyId`, validan referencias activas y soportan búsqueda, filtros y paginación.

Endpoints:

- `GET/POST /api/categories`
- `GET/PUT/DELETE /api/categories/:id?companyId=<id>`
- `GET/POST /api/products`
- `GET/PUT/DELETE /api/products/:id?companyId=<id>`

Los productos permiten filtrar por categoría, estado, texto y `lowStock=true`.

## Estado de la Fase 5

Se implementaron los módulos de clientes y proveedores. Ambos usan `companyId`, filtros por texto/estado, paginación, desactivación lógica y permisos backend. Clientes usa las acciones generales de ventas y proveedores las de compras.

Endpoints:

- `GET/POST /api/customers`
- `GET/PUT/DELETE /api/customers/:id?companyId=<id>`
- `GET/POST /api/suppliers`
- `GET/PUT/DELETE /api/suppliers/:id?companyId=<id>`

Las consultas requieren `companyId`; aceptan `search`, `status`, `page` y `limit` cuando corresponde.

## Estado de la Fase 4

Se implementaron empresas y sucursales con referencias Mongoose, índices de búsqueda, desactivación lógica y rutas administrativas protegidas para `ADMIN` y `GERENTE`. Las sucursales toman su empresa desde el parámetro de ruta para evitar inconsistencias entre URL y cuerpo.

Endpoints:

- `GET /api/companies`
- `POST /api/companies`
- `GET /api/companies/:id`
- `PUT /api/companies/:id`
- `DELETE /api/companies/:id` (desactivación)
- `GET /api/companies/:companyId/branches`
- `POST /api/companies/:companyId/branches`
- `PUT /api/companies/branches/:id`
- `DELETE /api/companies/branches/:id` (desactivación)

## Estado de la Fase 3

Se implemento autenticacion JWT con usuarios Mongoose, contrasenas protegidas con `bcryptjs`, perfil autenticado y permisos derivados del rol. El registro publico siempre crea usuarios `EMPLEADO`; los roles privilegiados no se aceptan desde ese endpoint.

Endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` con `Authorization: Bearer <token>`

La autenticacion requiere `AUTH_JWT_SECRET` de al menos 32 caracteres y MongoDB conectada. Ningun secreto se incluye en el repositorio.

## Estado de la Fase 2

La Fase 2 agrega la capa base del backend: validacion con Zod, errores tipados, respuestas consistentes, manejadores asincronos y endpoints de liveness/readiness. MongoDB Atlas se conecta mediante Mongoose desde `backend/src/config/database.js`.

Endpoints base:

- `GET /api/health`: servicio activo; no requiere MongoDB.
- `GET /api/health/ready`: servicio listo solo cuando MongoDB esta configurada y conectada.
- `POST /api/system/echo`: endpoint tecnico para comprobar validacion y contrato REST.

## Estado de la Fase 1

Incluye configuración inicial, estructura modular, servidor Express, seguridad HTTP base, limitación de solicitudes, validación de entorno, conexión Mongoose opcional, endpoint de salud, frontend RN Web y prueba de comunicación frontend-backend.

Los módulos de negocio se implementarán únicamente después de revisar y autorizar la siguiente fase.

## Configuración de entornos (web y Android)

Desde la raíz instala con `npm ci`. Copia `backend/.env.example` a
`backend/.env` y `frontend/.env.example` a `frontend/.env`. En Windows usa
`copy`; en Linux/macOS usa `cp`. El backend carga primero su archivo y después
el `.env` raíz como respaldo; las variables del proceso tienen prioridad.
Expo carga las variables públicas desde `frontend/.env`.

Configura MongoDB y un secreto JWT propio de al menos 32 caracteres en el
backend. No uses la URI de ejemplo como conexión real. Usa una base exclusiva
para pruebas y un replica set para transacciones. Nunca pongas secretos en
variables `EXPO_PUBLIC_*`.

- Web local: `EXPO_PUBLIC_API_URL=http://localhost:4000/api`.
- Android físico: usa la IP LAN de la computadora, por ejemplo
  `http://192.168.1.20:4000/api`; ambos equipos deben tener acceso a esa red.
- Emulador Android Studio: normalmente `http://10.0.2.2:4000/api`.
- Despliegue: usa la URL HTTPS real de la API, conservando el sufijo `/api`.

`CLIENT_ORIGIN` debe coincidir con el origen web mostrado por Expo.
`EXPO_PUBLIC_COMPANY_ID` es temporal: usa el ID de una empresa existente.
No garantiza autorización; la pertenencia a empresa se corregirá en M1.
Reinicia Expo al cambiar el entorno (`npm --workspace frontend run start -- --clear`).

Comprueba `/api/health` y `/api/health/ready`: el primero verifica que el
servicio responde; el segundo exige MongoDB disponible. Una conexión saludable
no sustituye las pruebas autenticadas de los módulos.
