import { Customer } from './customer.model.js';
import { Company } from '../companies/company.model.js';
import { AppError } from '../../utils/appError.js';
import { ensureDatabaseConnection } from '../../utils/databaseGuard.js';

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function ensureCompany(companyId) {
  const company = await Company.exists({ _id: companyId, status: 'ACTIVE' });
  if (!company) throw new AppError('Empresa no encontrada o inactiva', 404);
}

function handleDuplicate(error) {
  if (error?.code === 11000) throw new AppError('Ya existe un cliente con esos datos', 409);
  throw error;
}

export async function listCustomers({ companyId, search, status, page, limit }) {
  ensureDatabaseConnection();
  const filter = { companyId, ...(status ? { status } : {}) };
  if (search) filter.$or = [{ name: new RegExp(escapeRegex(search), 'i') }, { rfc: new RegExp(escapeRegex(search), 'i') }, { email: new RegExp(escapeRegex(search), 'i') }];
  const [items, total] = await Promise.all([
    Customer.find(filter).sort({ name: 1 }).skip((page - 1) * limit).limit(limit).lean(),
    Customer.countDocuments(filter)
  ]);
  return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function getCustomer(id, companyId) {
  ensureDatabaseConnection();
  const customer = await Customer.findOne({ _id: id, companyId }).lean();
  if (!customer) throw new AppError('Cliente no encontrado', 404);
  return customer;
}

export async function createCustomer(data, userId) {
  ensureDatabaseConnection();
  await ensureCompany(data.companyId);
  try { return await Customer.create({ ...data, createdBy: userId }); } catch (error) { handleDuplicate(error); }
}

export async function updateCustomer(id, companyId, data) {
  ensureDatabaseConnection();
  const customer = await Customer.findOneAndUpdate({ _id: id, companyId }, data, { new: true, runValidators: true }).lean();
  if (!customer) throw new AppError('Cliente no encontrado', 404);
  return customer;
}

export async function deactivateCustomer(id, companyId) {
  return updateCustomer(id, companyId, { status: 'INACTIVE' });
}
