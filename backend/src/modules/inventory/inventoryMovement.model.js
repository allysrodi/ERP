import mongoose from 'mongoose';

const inventoryMovementSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true, index: true },
  destinationWarehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
  type: { type: String, enum: ['PURCHASE', 'SALE', 'ADJUSTMENT', 'TRANSFER', 'RETURN'], required: true, index: true },
  direction: { type: String, enum: ['IN', 'OUT'], default: 'IN' },
  quantity: { type: Number, required: true, min: 0.000001 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, trim: true, maxlength: 300 },
  referenceId: { type: mongoose.Schema.Types.ObjectId },
  occurredAt: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

inventoryMovementSchema.index({ companyId: 1, productId: 1, occurredAt: -1 });

export const InventoryMovement = mongoose.models.InventoryMovement ?? mongoose.model('InventoryMovement', inventoryMovementSchema, 'inventory_movements');
