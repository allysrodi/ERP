import mongoose from 'mongoose';

const saleItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  quantity: { type: Number, required: true, min: 0.000001 },
  unitPrice: { type: Number, required: true, min: 0 },
  subtotal: { type: Number, required: true, min: 0 }
}, { _id: false });

const saleSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [saleItemSchema], required: true, validate: (items) => items.length > 0 },
  subtotal: { type: Number, required: true, min: 0 },
  taxes: { type: Number, required: true, min: 0, default: 0 },
  discount: { type: Number, required: true, min: 0, default: 0 },
  total: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, enum: ['CASH', 'CARD', 'TRANSFER', 'CREDIT'], required: true },
  status: { type: String, enum: ['DRAFT', 'PENDING', 'CONFIRMED', 'PAID', 'CANCELLED'], default: 'DRAFT', index: true },
  confirmedAt: Date
}, { timestamps: true });

saleSchema.index({ companyId: 1, createdAt: -1 });
export const Sale = mongoose.models.Sale ?? mongoose.model('Sale', saleSchema, 'sales');
