import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSaleTransition } from '../src/modules/sales/sale.transitions.js';
test('sale cannot bypass inventory confirmation or repeat it through a backward transition', () => {
  for (const [from, to] of [['DRAFT','PAID'], ['PENDING','PAID'], ['CONFIRMED','PENDING'], ['CONFIRMED','CANCELLED'], ['PAID','CONFIRMED']]) {
    assert.throws(() => validateSaleTransition(from, to), error => error.statusCode === 409);
  }
  for (const [from, to] of [['DRAFT','CONFIRMED'], ['PENDING','CANCELLED'], ['CONFIRMED','PAID'], ['CONFIRMED','CONFIRMED']]) validateSaleTransition(from,to);
});
