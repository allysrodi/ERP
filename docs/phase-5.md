# Fase 5: Clientes y proveedores

## Implementado

- Modelos Mongoose de clientes y proveedores.
- Relación obligatoria con empresa mediante `companyId`.
- Datos de contacto, fiscales y estado.
- Creación, consulta, edición y desactivación lógica.
- Búsqueda por nombre, RFC o correo.
- Filtros por estado.
- Paginación limitada a 100 elementos por página.
- Índices por empresa, nombre y RFC.
- Validación de cuerpos, parámetros y consultas con Zod.
- Rechazo de operaciones anónimas con JWT.
- Permisos backend por acción.

## Integración

Los servicios verifican que la empresa exista y esté activa antes de crear registros. Las consultas de lectura, modificación y desactivación filtran por `companyId`, evitando acceder a datos de otra empresa mediante un identificador aislado.

## QA

`npm test --workspace backend`: 9 pruebas exitosas.

Se verificó que clientes y proveedores requieren autenticación y que las fases anteriores mantienen sus contratos.

## Observación

El CRUD completo con datos persistidos requiere configurar MongoDB Atlas y ejecutar las pruebas con un usuario JWT real. No se utilizaron datos personales reales.