import { Category } from './category.model.js';
import { Company } from '../companies/company.model.js';
import { AppError } from '../../utils/appError.js';
import { ensureDatabaseConnection } from '../../utils/databaseGuard.js';

function escapeRegex(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
async function ensureCompany(companyId) {
  const company = await Company.exists({ _id: companyId, status: 'ACTIVE' });
  if (!company) throw new AppError('Empresa no encontrada o inactiva', 404);
}
function handleDuplicate(error) {
  if (error?.code === 11000) throw new AppError('Ya existe una categoria con ese nombre', 409);
  throw error;
}

export async function listCategories({ companyId, search, status, page, limit }) {
  ensureDatabaseConnection();
  const filter = { companyId, ...(status ? { status } : {}) };
  if (search) filter.name = new RegExp(escapeRegex(search), 'i');
  const [items, total] = await Promise.all([
    Category.find(filter).sort({ name: 1 }).skip((page - 1) * limit).limit(limit).lean(),
    Category.countDocuments(filter)
  ]);
  return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function getCategory(id, companyId) {
  ensureDatabaseConnection();
  const category = await Category.findOne({ _id: id, companyId }).lean();
  if (!category) throw new AppError('Categoria no encontrada', 404);
  return category;
}

export async function createCategory(data, userId) {
  ensureDatabaseConnection();
  await ensureCompany(data.companyId);
  try { return await Category.create({ ...data, createdBy: userId }); } catch (error) { handleDuplicate(error); }
}

export async function updateCategory(id, companyId, data) {
  ensureDatabaseConnection();
  const category = await Category.findOneAndUpdate({ _id: id, companyId }, data, { new: true, runValidators: true }).lean();
  if (!category) throw new AppError('Categoria no encontrada', 404);
  return category;
}

export async function deactivateCategory(id, companyId) { return updateCategory(id, companyId, { status: 'INACTIVE' }); }
