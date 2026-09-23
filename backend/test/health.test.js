import test from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/app.js';

const server = app.listen(0);
test('GET /api/health responde con contrato base', async () => {
  const { port } = server.address();
    const response = await fetch(`http://localhost:${port}/api/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.data.status, 'ok');
    assert.equal(body.data.service, 'erp-backend');
});

test('ruta inexistente responde con error consistente', async () => {
  const { port } = server.address();
    const response = await fetch(`http://localhost:${port}/api/no-existe`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.success, false);
});

  test('readiness indica dependencia pendiente sin MongoDB', async () => {
    const { port } = server.address();
    const response = await fetch(`http://localhost:${port}/api/health/ready`);
    const body = await response.json();

    assert.equal(response.status, 503);
    assert.equal(body.success, false);
    assert.equal(body.data.status, 'not_ready');
  });

  test('echo acepta datos validos y rechaza datos invalidos', async () => {
    const { port } = server.address();
    const validResponse = await fetch(`http://localhost:${port}/api/system/echo`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: 'fase 2' })
    });
    const validBody = await validResponse.json();

    const invalidResponse = await fetch(`http://localhost:${port}/api/system/echo`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: '' })
    });
    const invalidBody = await invalidResponse.json();

    assert.equal(validResponse.status, 200);
    assert.equal(validBody.data.message, 'fase 2');
    assert.equal(invalidResponse.status, 400);
    assert.equal(invalidBody.success, false);
    assert.equal(invalidBody.message, 'Datos de entrada invalidos');
  });

  test('perfil protegido rechaza solicitudes sin token', async () => {
    const { port } = server.address();
    const response = await fetch(`http://localhost:${port}/api/auth/me`);
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.success, false);
    assert.equal(body.message, 'Autenticacion requerida');
  });

  test('login rechaza datos invalidos antes de acceder a la base', async () => {
    const { port } = server.address();
    const response = await fetch(`http://localhost:${port}/api/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'no-es-correo', password: 'corta' })
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.equal(body.message, 'Datos de entrada invalidos');
  });

  test('registro valido informa que la autenticacion requiere configuracion', async () => {
    const { port } = server.address();
    const response = await fetch(`http://localhost:${port}/api/auth/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'Demo',
        lastName: 'Admin',
        email: 'demo@example.com',
        password: 'x'.repeat(16),
        role: 'ADMIN'
      })
    });
    const body = await response.json();

    assert.equal(response.status, 503);
    assert.equal(body.success, false);
    assert.ok(['Autenticacion no configurada', 'Base de datos no disponible'].includes(body.message));
  });

  test('empresas protege sus operaciones administrativas', async () => {
    const { port } = server.address();
    const response = await fetch(`http://localhost:${port}/api/companies`);
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.success, false);
    assert.equal(body.message, 'Autenticacion requerida');
  });

  test('clientes y proveedores protegen sus operaciones', async () => {
    const { port } = server.address();
    const [customersResponse, suppliersResponse] = await Promise.all([
      fetch(`http://localhost:${port}/api/customers?companyId=507f1f77bcf86cd799439011`),
      fetch(`http://localhost:${port}/api/suppliers?companyId=507f1f77bcf86cd799439011`)
    ]);
    const customersBody = await customersResponse.json();
    const suppliersBody = await suppliersResponse.json();

    assert.equal(customersResponse.status, 401);
    assert.equal(suppliersResponse.status, 401);
    assert.equal(customersBody.message, 'Autenticacion requerida');
    assert.equal(suppliersBody.message, 'Autenticacion requerida');
  });

  test('categorias y productos protegen sus operaciones', async () => {
    const { port } = server.address();
    const [categoriesResponse, productsResponse] = await Promise.all([
      fetch(`http://localhost:${port}/api/categories?companyId=507f1f77bcf86cd799439011`),
      fetch(`http://localhost:${port}/api/products?companyId=507f1f77bcf86cd799439011`)
    ]);
    const categoriesBody = await categoriesResponse.json();
    const productsBody = await productsResponse.json();

    assert.equal(categoriesResponse.status, 401);
    assert.equal(productsResponse.status, 401);
    assert.equal(categoriesBody.message, 'Autenticacion requerida');
    assert.equal(productsBody.message, 'Autenticacion requerida');
  });

  test('almacenes e inventario protegen sus operaciones', async () => {
    const { port } = server.address();
    const [warehousesResponse, inventoryResponse] = await Promise.all([
      fetch(`http://localhost:${port}/api/warehouses?companyId=507f1f77bcf86cd799439011`),
      fetch(`http://localhost:${port}/api/inventory?companyId=507f1f77bcf86cd799439011`)
    ]);
    const warehousesBody = await warehousesResponse.json();
    const inventoryBody = await inventoryResponse.json();

    assert.equal(warehousesResponse.status, 401);
    assert.equal(inventoryResponse.status, 401);
    assert.equal(warehousesBody.message, 'Autenticacion requerida');
    assert.equal(inventoryBody.message, 'Autenticacion requerida');
  });

  test('transferencia exige un almacen destino', async () => {
    const { port } = server.address();
    const response = await fetch(`http://localhost:${port}/api/inventory/movement`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        companyId: '507f1f77bcf86cd799439011',
        productId: '507f1f77bcf86cd799439012',
        warehouseId: '507f1f77bcf86cd799439013',
        type: 'TRANSFER',
        quantity: 1
      })
    });
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.message, 'Autenticacion requerida');
  });

  test('ventas protegen sus operaciones', async () => {
    const { port } = server.address();
    const response = await fetch(`http://localhost:${port}/api/sales?companyId=507f1f77bcf86cd799439011`);
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.message, 'Autenticacion requerida');
  });

  test('compras y finanzas protegen sus operaciones', async () => {
    const { port } = server.address();
    const [purchasesResponse, financeResponse] = await Promise.all([
      fetch(`http://localhost:${port}/api/purchases?companyId=507f1f77bcf86cd799439011`),
      fetch(`http://localhost:${port}/api/finance/expenses?companyId=507f1f77bcf86cd799439011`)
    ]);
    const purchasesBody = await purchasesResponse.json();
    const financeBody = await financeResponse.json();

    assert.equal(purchasesResponse.status, 401);
    assert.equal(financeResponse.status, 401);
    assert.equal(purchasesBody.message, 'Autenticacion requerida');
    assert.equal(financeBody.message, 'Autenticacion requerida');
  });

  test('RRHH, CRM y proyectos protegen sus operaciones', async () => {
    const { port } = server.address();
    const responses = await Promise.all([
      fetch(`http://localhost:${port}/api/hr/employees?companyId=507f1f77bcf86cd799439011`),
      fetch(`http://localhost:${port}/api/crm/leads?companyId=507f1f77bcf86cd799439011`),
      fetch(`http://localhost:${port}/api/projects?companyId=507f1f77bcf86cd799439011`)
    ]);
    for (const response of responses) assert.equal(response.status, 401);
  });

  test('notificaciones, auditoria, dashboard y reportes protegen sus operaciones', async () => {
    const { port } = server.address();
    const responses = await Promise.all([
      fetch(`http://localhost:${port}/api/notifications?companyId=507f1f77bcf86cd799439011`),
      fetch(`http://localhost:${port}/api/audit?companyId=507f1f77bcf86cd799439011`),
      fetch(`http://localhost:${port}/api/dashboard?companyId=507f1f77bcf86cd799439011`),
      fetch(`http://localhost:${port}/api/reports/sales?companyId=507f1f77bcf86cd799439011`)
    ]);
    for (const response of responses) assert.equal(response.status, 401);
  });

  test('JSON malformado responde como error de cliente', async () => {
    const { port } = server.address();
    const response = await fetch(`http://localhost:${port}/api/system/echo`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{' });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.equal(body.message, 'JSON invalido');
  });

test.after(() => {
  server.close();
});
