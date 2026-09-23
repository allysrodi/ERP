import mongoose from 'mongoose';
const departmentSchema = new mongoose.Schema({ companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true }, name: { type: String, required: true, trim: true }, description: String, manager: String, status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' }, createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } }, { timestamps: true });
export const Department = mongoose.models.Department ?? mongoose.model('Department', departmentSchema, 'departments');
