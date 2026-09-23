import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true, index: true },
  quantity: { type: Number, required: true, min: 0, default: 0 },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

inventorySchema.index({ productId: 1, warehouseId: 1 }, { unique: true });

export const Inventory = mongoose.models.Inventory ?? mongoose.model('Inventory', inventorySchema, 'inventory');
