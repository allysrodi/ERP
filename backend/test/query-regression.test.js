import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
process.env.NODE_ENV = 'test';
process.env.AUTH_JWT_SECRET = 'local-test-secret-012345678901234567890';
delete process.env.MONGODB_URI;
const { app } = await import('../src/app.js');
const { env } = await import('../src/config/env.js');
const { validate } = await import('../src/middleware/validate.js');
const { z } = await import('zod');
const server = app.listen(0);
const token = jwt.sign({ sub: '507f1f77bcf86cd799439011', role: 'ADMIN' }, env.AUTH_JWT_SECRET);
const headers = { Authorization: `Bearer ${token}` };
const companyId = '507f1f77bcf86cd799439012';
test.after(() => server.close());

test('validated query preserves coercion/defaults without writing Express getter', () => {
  const request = Object.create(Object.defineProperty({}, 'query', { get: () => ({ page: '2' }) }));
  let called = false;
  validate(z.object({ page: z.coerce.number(), limit: z.number().default(20) }), 'query')(request, {}, () => { called = true; });
  assert.equal(called, true);
  assert.deepEqual(request.validated.query, { page: 2, limit: 20 });
  assert.deepEqual(request.query, { page: '2' });
});

for (const route of ['customers', 'suppliers', 'products', 'categories', 'warehouses', 'inventory', 'inventory/movements', 'sales', 'purchases', 'finance/expenses', 'finance/payments', 'dashboard', 'reports/sales', 'reports/purchases', 'hr/employees', 'crm/leads', 'projects', 'notifications', 'audit']) {
  test(`authenticated ${route} reaches database guard without query TypeError`, async () => {
    const response = await fetch(`http://localhost:${server.address().port}/api/${route}?companyId=${companyId}`, { headers });
    const body = await response.json();
    assert.equal(response.status, 503);
    assert.equal(body.message, 'Base de datos no disponible');
  });
}

test('authenticated invalid query returns validation error', async () => {
  const response = await fetch(`http://localhost:${server.address().port}/api/products?companyId=invalid`, { headers });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).message, 'Datos de entrada invalidos');
});
