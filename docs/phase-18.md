# Fase 18: Seguridad avanzada inicial

## Implementado

- Rate limiting global y específico para login.
- Helmet y CORS configurado por entorno.
- Límite de cuerpo JSON de 1 MB.
- Tokens JWT con expiración configurable.
- Validación backend con Zod.
- Errores internos sin detalles técnicos en producción.
- Rechazo de JSON malformado con `400`.
- Permisos backend independientes de la interfaz.

## QA

`npm test --workspace backend`: 17 pruebas exitosas.

`npm audit --workspace backend --audit-level=moderate`: 0 vulnerabilidades.

La auditoría completa de despliegue, secretos, HTTPS, WAF y observabilidad debe ejecutarse al elegir el proveedor de producción.