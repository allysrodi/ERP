# Fase 8: Ventas

## Implementado

- Venta con cliente, usuario, productos, almacén y precios.
- Cálculo backend de subtotal, impuestos, descuento y total.
- Estados `DRAFT`, `PENDING`, `CONFIRMED`, `PAID`, `CANCELLED`.
- Confirmación con salida de inventario.
- Registro de ingreso financiero asociado.
- Registro de auditoría asociado.
- Validación de cliente y productos dentro de la empresa.

## QA

`npm test --workspace backend`: 13 pruebas exitosas.

La persistencia completa requiere MongoDB Atlas y un usuario JWT real. La confirmación delega los movimientos al servicio de inventario para evitar duplicación de reglas.