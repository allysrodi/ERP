import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const source = await readFile(new URL('../src/services/recordForm.js', import.meta.url), 'utf8');
const { buildRecordPayload } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
test('blank optional email is omitted, not sent as invalid empty email', () => {
  assert.deepEqual(buildRecordPayload('customers', { name: ' Ana ', email: '', phone: '' }, 'company'), { name: 'Ana', companyId: 'company', phone: '' });
});
test('product prices reject invalid values and accept decimal comma', () => {
  const form = { name: 'A', sku: 'B', categoryId: '507f1f77bcf86cd799439011', unit: 'pieza', purchasePrice: '2,50', salePrice: '3', description: '' };
  assert.equal(buildRecordPayload('products', form, 'company').purchasePrice, 2.5);
  for (const price of ['', '-1', 'abc', 'Infinity']) assert.throws(() => buildRecordPayload('products', { ...form, salePrice: price }, 'company'));
});
test('editing can explicitly clear optional email', () => {
  assert.equal(buildRecordPayload('customers', {name:'Ana',email:'',phone:''},'company',true).email,null);
});
