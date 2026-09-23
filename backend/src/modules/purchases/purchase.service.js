import { Purchase } from './purchase.model.js';
import { Supplier } from '../suppliers/supplier.model.js';
import { Product } from '../products/product.model.js';
import { Expense } from '../finance/expense.model.js';
import { AuditLog } from '../audit/audit.model.js';
import { registerMovement } from '../inventory/inventory.service.js';
import { AppError } from '../../utils/appError.js';
import { ensureDatabaseConnection } from '../../utils/databaseGuard.js';

export async function createPurchase(data, userId) {
  ensureDatabaseConnection();
  if (!await Supplier.exists({ _id: data.supplierId, companyId: data.companyId, status: 'ACTIVE' })) throw new AppError('Proveedor no encontrado o inactivo', 404);
  const products = await Product.find({ _id: { $in: data.items.map((item) => item.productId) }, companyId: data.companyId, status: 'ACTIVE' }).lean();
  const byId = new Map(products.map((product) => [product._id.toString(), product]));
  const items = data.items.map((item) => {
    if (!byId.has(item.productId)) throw new AppError('Producto no encontrado o inactivo', 404);
    return { ...item, subtotal: Number((item.quantity * item.unitPrice).toFixed(2)) };
  });
  const subtotal = Number(items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));
  return Purchase.create({ ...data, items, subtotal, total: Number((subtotal + data.taxes).toFixed(2)), userId });
}

export async function listPurchases({ companyId, status, page, limit }) {
  ensureDatabaseConnection();
  const filter = { companyId, ...(status ? { status } : {}) };
  const [items, total] = await Promise.all([Purchase.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate('supplierId', 'name email').lean(), Purchase.countDocuments(filter)]);
  return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function receivePurchase(id, companyId, userId) {
  ensureDatabaseConnection();
  const purchase = await Purchase.findOne({ _id: id, companyId });
  if (!purchase) throw new AppError('Compra no encontrada', 404);
  if (purchase.status === 'RECEIVED' || purchase.status === 'CANCELLED') throw new AppError('La compra no puede recibirse en su estado actual', 409);
  for (const item of purchase.items) await registerMovement({ companyId, productId: item.productId, warehouseId: item.warehouseId, type: 'PURCHASE', direction: 'IN', quantity: item.quantity, referenceId: purchase._id, reason: 'Compra recibida' }, userId);
  await Expense.create({ companyId, purchaseId: purchase._id, concept: `Compra ${purchase._id}`, category: 'COMPRAS', amount: purchase.total, responsibleId: userId, status: 'PENDING' });
  await AuditLog.create({ companyId, userId, action: 'RECEIVE', module: 'PURCHASES', recordId: purchase._id, changes: { status: 'RECEIVED' } });
  purchase.status = 'RECEIVED'; purchase.receivedAt = new Date(); await purchase.save();
  return purchase.toObject();
}
