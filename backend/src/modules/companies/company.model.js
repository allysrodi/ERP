import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 160 },
  legalName: { type: String, required: true, trim: true, maxlength: 200 },
  rfc: { type: String, required: true, uppercase: true, trim: true, unique: true, index: true, maxlength: 13 },
  address: { type: String, trim: true, maxlength: 300 },
  phone: { type: String, trim: true, maxlength: 30 },
  email: { type: String, trim: true, lowercase: true, maxlength: 160 },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE', index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const Company = mongoose.models.Company ?? mongoose.model('Company', companySchema);
