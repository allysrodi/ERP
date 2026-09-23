import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  saleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', required: true, unique: true },
  concept: { type: String, required: true, trim: true, maxlength: 200 },
  amount: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const Income = mongoose.models.Income ?? mongoose.model('Income', incomeSchema, 'incomes');
