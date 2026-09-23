import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 160 },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  rfc: { type: String, trim: true, uppercase: true, maxlength: 13 },
  phone: { type: String, trim: true, maxlength: 30 },
  email: { type: String, trim: true, lowercase: true, maxlength: 160 },
  address: { type: String, trim: true, maxlength: 300 },
  contact: { type: String, trim: true, maxlength: 160 },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE', index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

supplierSchema.index({ companyId: 1, name: 1 });
supplierSchema.index({ companyId: 1, rfc: 1 });

export const Supplier = mongoose.models.Supplier ?? mongoose.model('Supplier', supplierSchema);
