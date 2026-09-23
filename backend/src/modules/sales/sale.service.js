import { Sale } from './sale.model.js';
import { Customer } from '../customers/customer.model.js';
import { Product } from '../products/product.model.js';
import { Income } from '../finance/income.model.js';
import { AuditLog } from '../audit/audit.model.js';
import { registerMovement } from '../inventory/inventory.service.js';
import { AppError } from '../../utils/appError.js';
import { ensureDatabaseConnection } from '../../utils/databaseGuard.js';

async function calculateItems(items, companyId) {
  const productIds = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds }, companyId, status: 'ACTIVE' }).lean();
  const productsById = new Map(products.map((product) => [product._id.toString(), product]));
  return items.map((item) => {
    const product = productsById.get(item.productId);
    if (!product) throw new AppError('Producto no encontrado o inactivo', 404);
    return { ...item, unitPrice: item.unitPrice ?? product.salePrice, subtotal: Number((item.quantity * item.unitPrice).toFixed(2)) };
  });
}

export async function createSale(data, userId) {
  ensureDatabaseConnection();
  const customer = await Customer.exists({ _id: data.customerId, companyId: data.companyId, status: 'ACTIVE' });
  if (!customer) throw new AppError('Cliente no encontrado o inactivo', 404);
  const items = await calculateItems(data.items, data.companyId);
  const subtotal = Number(items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));
  const total = Number((subtotal + data.taxes - data.discount).toFixed(2));
  if (total < 0) throw new AppError('El total no puede ser negativo', 400);
  return Sale.create({ ...data, items, subtotal, total, userId });
}

export async function listSales({ companyId, status, page, limit }) {
  ensureDatabaseConnection();
  const filter = { companyId, ...(status ? { status } : {}) };
  const [items, total] = await Promise.all([
    Sale.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate('customerId', 'name email').lean(),
    Sale.countDocuments(filter)
  ]);
  return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function getSale(id, companyId) {
  ensureDatabaseConnection();
  const sale = await Sale.findOne({ _id: id, companyId }).populate('customerId', 'name email').populate('items.productId', 'sku name').lean();
  if (!sale) throw new AppError('Venta no encontrada', 404);
  return sale;
}

export async function updateSaleStatus(id, companyId, status, userId) {
  ensureDatabaseConnection();
  const sale = await Sale.findOne({ _id: id, companyId });
  if (!sale) throw new AppError('Venta no encontrada', 404);
  if (sale.status === 'CANCELLED' || sale.status === 'PAID') throw new AppError('La venta no puede modificarse en su estado actual', 409);
  if (status === 'CONFIRMED' && sale.status !== 'CONFIRMED') {
    for (const item of sale.items) {
      await registerMovement({ companyId, productId: item.productId, warehouseId: item.warehouseId, type: 'SALE', direction: 'OUT', quantity: item.quantity, referenceId: sale._id, reason: 'Venta confirmada' }, userId);
    }
    sale.confirmedAt = new Date();
    await Income.create({ companyId, saleId: sale._id, concept: `Venta ${sale._id}`, amount: sale.total, paymentMethod: sale.paymentMethod, userId });
    await AuditLog.create({ companyId, userId, action: 'CONFIRM', module: 'SALES', recordId: sale._id, changes: { status: 'CONFIRMED' } });
  }
  sale.status = status;
  await sale.save();
  return sale.toObject();
}
