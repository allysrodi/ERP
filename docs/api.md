# API inicial

## `GET /`

Devuelve la identidad y versión de la API.

## `GET /api/health`

Comprueba que el servicio está disponible y devuelve el estado de configuración/conexión de MongoDB.

Respuesta base:

```json
{
  "success": true,
  "data": {
    "service": "erp-backend",
    "status": "ok",
    "database": {
      "configured": false,
      "connected": false,
      "state": 0
    }
  },
  "message": "API disponible"
}
```

## `GET /api/health/ready`

Comprueba si el servicio y sus dependencias estan listos. Devuelve `200` cuando MongoDB esta conectada y `503` cuando no esta configurada o disponible.

## `POST /api/system/echo`

Endpoint tecnico de Fase 2 para verificar validacion de entradas.

```json
{ "message": "prueba" }
```

Los datos invalidos responden con `400`, `success: false` y detalles de validacion sin exponer secretos.

## Autenticacion

### `POST /api/auth/register`

Registra un usuario con nombre, apellidos, correo y contrasena. El rol publico es siempre `EMPLEADO`.

### `POST /api/auth/login`

Valida correo y contrasena y devuelve un token JWT junto con el usuario seguro y sus permisos.

### `GET /api/auth/me`

Requiere el encabezado `Authorization: Bearer <token>` y devuelve el perfil activo.

Roles iniciales: `ADMIN`, `GERENTE`, `VENTAS`, `COMPRAS`, `ALMACEN`, `FINANZAS`, `RRHH`, `EMPLEADO`.

Acciones disponibles: `VIEW`, `CREATE`, `UPDATE`, `DELETE`, `EXPORT`, `APPROVE`.

## Empresas y sucursales

Las operaciones administrativas requieren un token de `ADMIN` o `GERENTE`.

- `GET /api/companies`
- `POST /api/companies`
- `GET /api/companies/:id`
- `PUT /api/companies/:id`
- `DELETE /api/companies/:id`
- `GET /api/companies/:companyId/branches`
- `POST /api/companies/:companyId/branches`
- `PUT /api/companies/branches/:id`
- `DELETE /api/companies/branches/:id`

Las eliminaciones son desactivaciones lógicas mediante `status: INACTIVE`. El `companyId` de una nueva sucursal se toma de la URL.

## Clientes y proveedores

Ambos módulos requieren autenticación. Las consultas siempre incluyen `companyId` para mantener el aislamiento entre empresas.

Clientes:

- `GET /api/customers?companyId=<id>&search=<texto>&status=ACTIVE&page=1&limit=20`
- `POST /api/customers`
- `GET /api/customers/:id?companyId=<id>`
- `PUT /api/customers/:id?companyId=<id>`
- `DELETE /api/customers/:id?companyId=<id>`

Proveedores:

- `GET /api/suppliers?companyId=<id>&search=<texto>&status=ACTIVE&page=1&limit=20`
- `POST /api/suppliers`
- `GET /api/suppliers/:id?companyId=<id>`
- `PUT /api/suppliers/:id?companyId=<id>`
- `DELETE /api/suppliers/:id?companyId=<id>`

Las respuestas de listado contienen `items` y `pagination`. Las eliminaciones son desactivaciones lógicas.

## Productos y categorías

Categorías:

- `GET /api/categories?companyId=<id>&search=<texto>&status=ACTIVE&page=1&limit=20`
- `POST /api/categories`
- `GET /api/categories/:id?companyId=<id>`
- `PUT /api/categories/:id?companyId=<id>`
- `DELETE /api/categories/:id?companyId=<id>`

Productos:

- `GET /api/products?companyId=<id>&categoryId=<id>&search=<texto>&lowStock=true`
- `POST /api/products`
- `GET /api/products/:id?companyId=<id>`
- `PUT /api/products/:id?companyId=<id>`
- `DELETE /api/products/:id?companyId=<id>`

Los productos requieren una empresa y categoría activas. El proveedor, si se especifica, también debe pertenecer a la misma empresa.

## Almacenes e inventario

Almacenes:

- `GET /api/warehouses?companyId=<id>&branchId=<id>&status=ACTIVE`
- `POST /api/warehouses`
- `GET /api/warehouses/:id?companyId=<id>`
- `PUT /api/warehouses/:id?companyId=<id>`
- `DELETE /api/warehouses/:id?companyId=<id>`

Inventario:

- `GET /api/inventory?companyId=<id>&warehouseId=<id>&productId=<id>&lowStock=true`
- `GET /api/inventory/movements?companyId=<id>&productId=<id>&warehouseId=<id>&type=SALE`
- `POST /api/inventory/movement`

El cuerpo de un movimiento incluye `companyId`, `productId`, `warehouseId`, `type`, `direction` y `quantity`. Las transferencias requieren `destinationWarehouseId`. Los movimientos registran usuario, motivo, referencia y fecha.

## Ventas

- `GET /api/sales?companyId=<id>&status=CONFIRMED`
- `POST /api/sales`
- `GET /api/sales/:id?companyId=<id>`
- `PUT /api/sales/:id/status?companyId=<id>`

Al confirmar una venta se registra una salida `SALE`, un ingreso financiero y una auditoría. La salida puede fallar por existencia insuficiente.

## Error 404

Todas las rutas desconocidas responden con `{ "success": false, "message": "Ruta no encontrada" }`.
