# Fase 7: Almacenes e inventario

## Implementado

- Modelo de almacenes asociado a empresa y sucursal.
- Colección `inventory` para existencias por producto y almacén.
- Colección `inventory_movements` para historial inmutable de movimientos.
- Entradas, salidas, ajustes, compras, ventas, devoluciones y transferencias.
- Validación de empresas, productos, almacenes y destinos activos.
- Prevención de existencias negativas.
- Transferencias dentro de transacciones Mongoose.
- Stock agregado del producto actualizado para movimientos que cambian el total.
- Consultas de existencias, historial, filtros y paginación.
- Alertas consultables mediante `lowStock=true`.
- Permisos backend y aislamiento por empresa.

## Integración

El producto sigue siendo la fuente de identidad y stock total. La colección `inventory` mantiene el desglose por almacén y `inventory_movements` conserva trazabilidad. Ventas y compras futuras deben llamar al servicio de movimientos en lugar de modificar existencias directamente.

## QA

`npm test --workspace backend`: 12 pruebas exitosas.

Se verificó que almacenes e inventario requieren autenticación y que una transferencia debe incluir almacén destino.

## Observación

La transacción de inventario requiere un despliegue MongoDB compatible con transacciones, como un replica set o MongoDB Atlas. La prueba CRUD persistida queda pendiente de configurar Atlas y un usuario JWT real.