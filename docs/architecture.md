# Arquitectura inicial

## Flujo

`React Native / Web -> REST/JSON -> Express -> servicios y modelos -> MongoDB Atlas`

El frontend no conoce credenciales ni accede directamente a MongoDB. La configuración de producción debe usar HTTPS y secretos gestionados por el entorno de despliegue.

## Backend

La carpeta `backend/src` está organizada en configuración, middleware y rutas. Cada módulo de negocio futuro tendrá sus propios `model`, `validation`, `service`, `controller` y `routes`.

## Frontend

La carpeta `frontend` usa Expo como runtime común para Android y Web. Las pantallas futuras se separarán por módulos y consumirán servicios HTTP compartidos.

## Decisiones de Fase 1

- JavaScript ESM para mantener el arranque pequeño y legible.
- `zod` valida variables de entorno antes de iniciar.
- `helmet`, CORS explícito, límite de payload y rate limiting forman la protección HTTP inicial.
- La conexión a MongoDB falla de forma visible si se configura una URI inválida; si no existe URI, el modo local permite validar el contrato HTTP sin persistencia.
