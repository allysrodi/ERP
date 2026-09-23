# ERP Modular

ERP multiempresa y multisucursal con React Native/Web, Node.js, Express, Mongoose y MongoDB Atlas.

## Arquitectura

- `frontend/`: aplicación Expo para React Native y React Native Web.
- `backend/`: API REST Express con módulos, validaciones, permisos y servicios.
- `MongoDB Atlas`: persistencia accesible exclusivamente desde el backend.
- Flujo: `frontend -> REST/JSON -> backend -> Mongoose -> MongoDB`.

## Requisitos

- Node.js 24+
- npm 11+
- MongoDB Atlas o MongoDB compatible con transacciones

## Configuración

El backend carga el archivo `.env` de la raíz del repositorio. Copia `.env.example` a `.env` y configura tus valores locales. Nunca subas `.env` ni credenciales.

```env
NODE_ENV=development
PORT=4000
CLIENT_ORIGIN=http://localhost:8081,http://localhost:8082
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>/<base_de_datos>
AUTH_JWT_SECRET=<secreto_de_al_menos_32_caracteres>
AUTH_JWT_EXPIRES_IN=1h
EXPO_PUBLIC_API_URL=http://localhost:4000/api
EXPO_PUBLIC_COMPANY_ID=<empresa-demo>
```

`CLIENT_ORIGIN` admite varios orígenes separados por comas.

## Instalación y ejecución

```bash
npm install
npm run dev:backend
npm run web
```

- API: `http://localhost:4000`
- Health: `http://localhost:4000/api/health`
- Readiness: `http://localhost:4000/api/health/ready`
- Web: URL mostrada por Expo

## Pruebas

```bash
npm test --workspace backend
npm exec --workspace frontend expo export -- --platform web
```

## Fases

1. Arquitectura y configuración.
2. Backend base y conexión Mongoose.
3. Autenticación, usuarios, roles y permisos.
4. Empresas y sucursales.
5. Clientes y proveedores.
6. Productos y categorías.
7. Almacenes e inventario.
8. Ventas.
9. Compras.
10. Finanzas.
11. Dashboard.
12. Recursos humanos.
13. CRM.
14. Proyectos y tareas.
15. Reportes.
16. Notificaciones.
17. Auditoría.
18. Seguridad avanzada inicial.
19. Consolidación del núcleo.

## Módulos actuales

La API contiene autenticación, empresas, clientes, proveedores, productos, categorías, almacenes, inventario, ventas, compras, finanzas, RRHH, CRM, proyectos, notificaciones, auditoría, dashboard y reportes.

La interfaz web/móvil incluye login, navegación, consultas y operaciones CRUD iniciales para clientes, proveedores y productos.

## Estructura

```text
backend/
  src/
    config/
    middleware/
    modules/
    routes/
    utils/
frontend/
  src/
    components/
    context/
    navigation/
    screens/
    services/
docs/
```

`frontend/App.js` es la entrada de la aplicación. El `App.js` de la raíz es únicamente un shim de compatibilidad para Expo cuando Metro resuelve el workspace desde la raíz.

## Seguridad

- `.env` está excluido por Git.
- Contraseñas con bcrypt.
- Tokens JWT con expiración.
- Validación Zod.
- Helmet, CORS configurable, rate limiting y límites de payload.
- Permisos validados en backend.
- Auditoría y movimientos de inventario.
- No se deben compartir ni reutilizar credenciales expuestas.

## Documentación

La documentación detallada de fases y API está en `docs/`.

La Fase 19 consolida el núcleo sin agregar módulos de negocio nuevos.
