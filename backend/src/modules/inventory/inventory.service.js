import mongoose from 'mongoose';
import { Inventory } from './inventory.model.js';
import { InventoryMovement } from './inventoryMovement.model.js';
import { Product } from '../products/product.model.js';
import { Warehouse } from '../warehouses/warehouse.model.js';
import { AppError } from '../../utils/appError.js';
import { ensureDatabaseConnection } from '../../utils/databaseGuard.js';

async function ensureProductAndWarehouse(data) {
  const [product, warehouse, destination] = await Promise.all([
    Product.findOne({ _id: data.productId, companyId: data.companyId, status: 'ACTIVE' }).lean(),
    Warehouse.findOne({ _id: data.warehouseId, companyId: data.companyId, status: 'ACTIVE' }).lean(),
    data.destinationWarehouseId ? Warehouse.findOne({ _id: data.destinationWarehouseId, companyId: data.companyId, status: 'ACTIVE' }).lean() : null
  ]);
  if (!product) throw new AppError('Producto no encontrado o inactivo', 404);
  if (!warehouse) throw new AppError('Almacen no encontrado o inactivo', 404);
  if (data.type === 'TRANSFER' && !destination) throw new AppError('Almacen destino no encontrado o inactivo', 404);
  return { product, warehouse };
}

async function increaseBalance({ companyId, productId, warehouseId, quantity, userId, session }) {
  return Inventory.findOneAndUpdate(
    { companyId, productId, warehouseId },
    { $inc: { quantity }, $set: { updatedBy: userId } },
    { new: true, upsert: true, setDefaultsOnInsert: true, session }
  );
}

async function decreaseBalance({ companyId, productId, warehouseId, quantity, userId, session }) {
  const balance = await Inventory.findOneAndUpdate(
    { companyId, productId, warehouseId, quantity: { $gte: quantity } },
    { $inc: { quantity: -quantity }, $set: { updatedBy: userId } },
    { new: true, session }
  );
  if (!balance) throw new AppError('Existencia insuficiente en el almacen', 409);
  return balance;
}

function getDelta({ type, direction, quantity }) {
  if (type === 'SALE') return -quantity;
  if (type === 'PURCHASE' || type === 'RETURN') return quantity;
  return direction === 'OUT' ? -quantity : quantity;
}

export async function registerMovement(data, userId, externalSession) {
  ensureDatabaseConnection();
  const { product } = await ensureProductAndWarehouse(data);
  const session = externalSession ?? await mongoose.startSession();
  const applyMovement = async () => {
    let movement;
    if (data.type === 'TRANSFER') {
      await decreaseBalance({ ...data, userId, session });
      await increaseBalance({ ...data, warehouseId: data.destinationWarehouseId, userId, session });
    } else {
      const delta = getDelta(data);
      if (delta < 0) await decreaseBalance({ ...data, quantity: Math.abs(delta), userId, session });
      else await increaseBalance({ ...data, quantity: delta, userId, session });
      await Product.updateOne({ _id: product._id }, { $inc: { stock: delta } }, { session });
    }
    [movement] = await InventoryMovement.create([{ ...data, userId }], { session });
    return movement.toObject();
  };
  try {
    if (externalSession) return await applyMovement();
    let result;
    await session.withTransaction(async () => { result = await applyMovement(); });
    return result;
  } finally {
    if (!externalSession) await session.endSession();
  }
}

export async function listInventory({ companyId, warehouseId, productId, lowStock, page, limit }) {
  ensureDatabaseConnection();
  const filter = { companyId, ...(warehouseId ? { warehouseId } : {}), ...(productId ? { productId } : {}) };
  const [items, total] = await Promise.all([
    Inventory.find(filter).sort({ updatedAt: -1 }).skip((page - 1) * limit).limit(limit).populate('productId', 'sku name minStock unit').populate('warehouseId', 'name').lean(),
    Inventory.countDocuments(filter)
  ]);
  const filteredItems = lowStock ? items.filter((item) => item.quantity <= (item.productId?.minStock ?? 0)) : items;
  return { items: filteredItems, pagination: { page, limit, total: lowStock ? filteredItems.length : total, pages: Math.ceil((lowStock ? filteredItems.length : total) / limit) } };
}

export async function listMovements({ companyId, productId, warehouseId, type, page, limit }) {
  ensureDatabaseConnection();
  const filter = { companyId, ...(productId ? { productId } : {}), ...(warehouseId ? { warehouseId } : {}), ...(type ? { type } : {}) };
  const [items, total] = await Promise.all([
    InventoryMovement.find(filter).sort({ occurredAt: -1 }).skip((page - 1) * limit).limit(limit).populate('productId', 'sku name').populate('warehouseId', 'name').populate('destinationWarehouseId', 'name').lean(),
    InventoryMovement.countDocuments(filter)
  ]);
  return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}
