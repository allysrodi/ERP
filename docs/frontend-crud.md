# Frontend CRUD

## Implementado

- Login JWT en React Native/Web.
- Navegación inicial por módulos.
- Listados de clientes, proveedores y productos.
- Alta desde formularios reutilizables.
- Edición desde cada registro.
- Desactivación lógica desde cada registro.
- Mensajes de carga, error y resultado.
- API URL y `companyId` configurables por entorno.

## Variables

```env
EXPO_PUBLIC_API_URL=http://localhost:4000/api
EXPO_PUBLIC_COMPANY_ID=<empresa-demo>
```

## Validación

La exportación web de Expo completa correctamente. Las operaciones de datos requieren JWT y una API conectada a MongoDB Atlas.