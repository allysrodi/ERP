import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  saleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale' },
  purchaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' },
  expenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense' },
  amount: { type: Number, required: true, min: 0 },
  method: { type: String, enum: ['CASH', 'CARD', 'TRANSFER', 'CREDIT'], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paidAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Payment = mongoose.models.Payment ?? mongoose.model('Payment', paymentSchema, 'payments');
