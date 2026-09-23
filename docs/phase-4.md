# Fase 4: Empresas y sucursales

## Implementado

- Modelo de empresas con nombre, razón social, RFC, contacto, estado y creador.
- Modelo de sucursales relacionado con una empresa.
- Índices para RFC, estado y relación empresa-sucursal.
- CRUD de empresas con desactivación lógica.
- Listado, alta, edición y desactivación de sucursales.
- Validación de datos e identificadores con Zod.
- Restricción de rutas a `ADMIN` y `GERENTE`.
- Guard de conexión MongoDB reutilizable.
- Relación de sucursal controlada por `:companyId` en la URL.

## Integración

Las rutas usan el JWT de la Fase 3 y no aceptan acceso anónimo. Las operaciones no se ejecutan si MongoDB no está configurada o conectada.

## QA

`npm test --workspace backend`: 8 pruebas exitosas.

Se mantuvieron funcionando los health checks, validaciones, errores y protección de autenticación existentes.

## Observación

El CRUD completo contra MongoDB Atlas queda pendiente de ejecutar porque el entorno todavía no tiene `MONGODB_URI` ni un usuario autenticado real configurado.