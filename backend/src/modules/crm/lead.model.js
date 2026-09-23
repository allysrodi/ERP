import mongoose from 'mongoose';
const leadSchema = new mongoose.Schema({ companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true }, name: { type: String, required: true, trim: true }, email: String, phone: String, source: String, status: { type: String, enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'], default: 'NEW', index: true }, notes: String, ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } }, { timestamps: true });
export const Lead = mongoose.models.Lead ?? mongoose.model('Lead', leadSchema, 'leads');
