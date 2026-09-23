import { Supplier } from './supplier.model.js';
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
  if (error?.code === 11000) throw new AppError('Ya existe un proveedor con esos datos', 409);
  throw error;
}

export async function listSuppliers({ companyId, search, status, page, limit }) {
  ensureDatabaseConnection();
  const filter = { companyId, ...(status ? { status } : {}) };
  if (search) filter.$or = [{ name: new RegExp(escapeRegex(search), 'i') }, { rfc: new RegExp(escapeRegex(search), 'i') }, { email: new RegExp(escapeRegex(search), 'i') }];
  const [items, total] = await Promise.all([
    Supplier.find(filter).sort({ name: 1 }).skip((page - 1) * limit).limit(limit).lean(),
    Supplier.countDocuments(filter)
  ]);
  return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function getSupplier(id, companyId) {
  ensureDatabaseConnection();
  const supplier = await Supplier.findOne({ _id: id, companyId }).lean();
  if (!supplier) throw new AppError('Proveedor no encontrado', 404);
  return supplier;
}

export async function createSupplier(data, userId) {
  ensureDatabaseConnection();
  await ensureCompany(data.companyId);
  try { return await Supplier.create({ ...data, createdBy: userId }); } catch (error) { handleDuplicate(error); }
}

export async function updateSupplier(id, companyId, data) {
  ensureDatabaseConnection();
  const supplier = await Supplier.findOneAndUpdate({ _id: id, companyId }, data, { new: true, runValidators: true }).lean();
  if (!supplier) throw new AppError('Proveedor no encontrado', 404);
  return supplier;
}

export async function deactivateSupplier(id, companyId) {
  return updateSupplier(id, companyId, { status: 'INACTIVE' });
}
