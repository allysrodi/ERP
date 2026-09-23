# Fases 9 a 17: módulos integrados

## Compras y finanzas

Compras permite crear órdenes y recibir productos. La recepción usa movimientos `PURCHASE`, crea un gasto y registra auditoría. Finanzas incluye gastos, pagos e ingresos de ventas.

## RRHH

Se añadieron empleados y departamentos con datos básicos, empresa, estado y creador. Asistencia, vacaciones y nómina quedan preparados para fases futuras.

## CRM

Se añadieron leads y oportunidades, incluyendo propietario, etapa, importe y fecha estimada. El flujo puede evolucionar hacia contacto, seguimiento y conversión a cliente.

## Proyectos

Se añadieron proyectos y tareas con responsables, fechas, estado, prioridad y porcentaje de avance en proyectos.

## Notificaciones

Se añadió la colección `notifications` y endpoints para consultar notificaciones por usuario y marcarlas como leídas. El envío por correo o push queda desacoplado para una integración posterior.

## Auditoría

Se añadió la colección `audit_logs` y consulta protegida por empresa y módulo. Ventas y compras ya generan registros al confirmar o recibir.

## Dashboard y reportes

El dashboard devuelve indicadores resumidos de ventas, compras, gastos, stock bajo y proyectos activos. Hay reportes iniciales de ventas y compras con filtros de fecha.

## Frontend

Se añadió un cliente REST compartido en `frontend/src/services/api.js`, catálogo inicial de módulos y una pantalla base RN/Web que comprueba la API y muestra los módulos principales.

## QA y limitaciones

La suite backend pasa 16 pruebas y la exportación web de Expo genera el bundle correctamente. Las pruebas CRUD contra datos persistidos, transacciones de inventario y el flujo login real requieren configurar MongoDB Atlas, `AUTH_JWT_SECRET` y datos ficticios de prueba.

Los módulos tienen base backend funcional, pero aún requieren pantallas CRUD completas específicas por módulo, pruebas de integración con Atlas y endurecimiento final antes de considerarse producción.

## Fase 18: seguridad avanzada inicial

- Rate limiting específico para login.
- Rate limiting global de API.
- Helmet, CORS configurable y límites de payload.
- Errores internos sin detalles sensibles en producción.
- JSON malformado tratado como error `400`.
- Autorización backend por token, rol y permiso.

## Frontend actualizado

El frontend incluye autenticación, cierre de sesión, navegación de módulos, consultas, altas, edición y desactivación lógica para clientes, proveedores y productos mediante el cliente REST. Las pantallas de confirmación de ventas/compras y reportes detallados siguen pendientes de una iteración UX posterior.