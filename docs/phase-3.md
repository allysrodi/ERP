# Fase 3: Autenticacion, usuarios, roles y permisos

## Implementado

- Modelo `User` con timestamps, estado, empresa y sucursal.
- Hash de contrasenas con `bcryptjs` y factor 12.
- Tokens JWT con expiracion configurable.
- Middleware `requireAuth`, `requireRole` y `requirePermission`.
- Roles iniciales y matriz de permisos en backend.
- Registro, login y perfil autenticado.
- Validacion de payloads con Zod.
- Registro publico limitado al rol `EMPLEADO`.
- Respuestas controladas cuando faltan MongoDB o el secreto JWT.

## Seguridad

Las contrasenas no se seleccionan en consultas normales y se excluyen de la respuesta publica. La interfaz no es la fuente de autorización: las rutas protegidas validan el token y los permisos en el backend.

## QA

`npm test --workspace backend`: 7 pruebas exitosas.

Se verificó que las rutas existentes siguen funcionando, que `/api/auth/me` rechaza solicitudes anónimas y que los payloads inválidos no llegan al servicio de autenticación.

## Pendiente

Para probar registro y login completos se debe configurar `MONGODB_URI` y `AUTH_JWT_SECRET` en `.env`. No se crea una cuenta administrativa automáticamente ni se incluyen credenciales de prueba.