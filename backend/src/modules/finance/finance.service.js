import { Expense } from './expense.model.js';
import { Payment } from './payment.model.js';
import { ensureDatabaseConnection } from '../../utils/databaseGuard.js';

export async function createExpense(data, userId) { ensureDatabaseConnection(); return Expense.create({ ...data, responsibleId: userId }); }
export async function listExpenses({ companyId, page, limit }) { ensureDatabaseConnection(); const filter = { companyId }; const [items, total] = await Promise.all([Expense.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(), Expense.countDocuments(filter)]); return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }; }
export async function createPayment(data, userId) { ensureDatabaseConnection(); return Payment.create({ ...data, userId }); }
export async function listPayments({ companyId, page, limit }) { ensureDatabaseConnection(); const filter = { companyId }; const [items, total] = await Promise.all([Payment.find(filter).sort({ paidAt: -1 }).skip((page - 1) * limit).limit(limit).lean(), Payment.countDocuments(filter)]); return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }; }
