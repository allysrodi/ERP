# Fase 6: Productos y categorías

## Implementado

- Modelo de categorías con relación a empresa.
- Modelo de productos con SKU único por empresa.
- Nombre, descripción, categoría, proveedor, precios, existencia, mínimos, máximos y unidad.
- CRUD y desactivación lógica.
- Búsqueda por SKU y nombre.
- Filtro por categoría, estado y productos con stock bajo.
- Paginación limitada a 100 elementos.
- Índices por empresa, SKU, nombre y categoría.
- Validación de precios y existencias no negativas.
- Regla de stock máximo mayor o igual al mínimo.
- Verificación de empresa, categoría y proveedor activos.

## Integración

Los productos referencian categorías y proveedores mediante identificadores; no duplican sus datos. La existencia se mantiene como dato inicial del producto y quedará bajo control de inventario en la siguiente fase correspondiente.

## QA

`npm test --workspace backend`: 10 pruebas exitosas.

Se verificó que las rutas de productos y categorías exigen autenticación y que las fases anteriores continúan funcionando.

## Observación

La prueba CRUD con persistencia real requiere `MONGODB_URI` y un token JWT válido. No se alteró la configuración actual del usuario en `backend/package.json`.