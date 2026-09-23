# Fase 2: Backend y base de datos

## Implementado

- Contrato comun de respuestas exitosas y errores.
- `AppError` para errores controlados con codigo HTTP y detalles opcionales.
- Middleware de validacion con Zod.
- Adaptador `asyncHandler` para futuras operaciones Mongoose asincronas.
- Endpoint de liveness y endpoint de readiness.
- Conexion Mongoose centralizada con timeout de seleccion de servidor.
- Pruebas automatizadas de contratos HTTP, validacion y readiness.

## Base de datos

No se crean colecciones de negocio en esta fase. La conexion Mongoose queda preparada para que los modelos de autenticacion y negocio se agreguen en fases posteriores sin conectar el frontend directamente a MongoDB.

## QA

`npm test --workspace backend`: 4 pruebas exitosas.

No fue posible validar una conexion real a Atlas porque el entorno no contiene una `MONGODB_URI`. La prueba de readiness confirma de forma segura que el servicio no anuncia disponibilidad cuando esa dependencia falta.