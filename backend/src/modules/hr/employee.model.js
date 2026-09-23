import mongoose from 'mongoose';
const employeeSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true }, name: { type: String, required: true, trim: true, maxlength: 80 }, lastName: { type: String, required: true, trim: true, maxlength: 120 }, email: { type: String, trim: true, lowercase: true }, phone: String, position: String, department: String, hireDate: Date, status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' }, createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
export const Employee = mongoose.models.Employee ?? mongoose.model('Employee', employeeSchema, 'employees');
