import mongoose from 'mongoose';

const purchaseItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  quantity: { type: Number, required: true, min: 0.000001 },
  unitPrice: { type: Number, required: true, min: 0 },
  subtotal: { type: Number, required: true, min: 0 }
}, { _id: false });

const purchaseSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [purchaseItemSchema], required: true, validate: (items) => items.length > 0 },
  subtotal: { type: Number, required: true, min: 0 },
  taxes: { type: Number, required: true, min: 0, default: 0 },
  total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['DRAFT', 'PENDING', 'RECEIVED', 'CANCELLED'], default: 'DRAFT', index: true },
  receivedAt: Date
}, { timestamps: true });

purchaseSchema.index({ companyId: 1, createdAt: -1 });
export const Purchase = mongoose.models.Purchase ?? mongoose.model('Purchase', purchaseSchema, 'purchases');
