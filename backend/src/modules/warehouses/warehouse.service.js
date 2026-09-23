import { Warehouse } from './warehouse.model.js';
import { Company } from '../companies/company.model.js';
import { Branch } from '../companies/branch.model.js';
import { AppError } from '../../utils/appError.js';
import { ensureDatabaseConnection } from '../../utils/databaseGuard.js';

function handleDuplicate(error) {
  if (error?.code === 11000) throw new AppError('Ya existe un almacen con ese nombre', 409);
  throw error;
}

async function ensureRelations({ companyId, branchId }) {
  const [company, branch] = await Promise.all([
    Company.exists({ _id: companyId, status: 'ACTIVE' }),
    Branch.exists({ _id: branchId, companyId, status: 'ACTIVE' })
  ]);
  if (!company) throw new AppError('Empresa no encontrada o inactiva', 404);
  if (!branch) throw new AppError('Sucursal no encontrada o inactiva', 404);
}

export async function listWarehouses({ companyId, branchId, status, page, limit }) {
  ensureDatabaseConnection();
  const filter = { companyId, ...(branchId ? { branchId } : {}), ...(status ? { status } : {}) };
  const [items, total] = await Promise.all([
    Warehouse.find(filter).sort({ name: 1 }).skip((page - 1) * limit).limit(limit).populate('branchId', 'name').lean(),
    Warehouse.countDocuments(filter)
  ]);
  return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function createWarehouse(data, userId) {
  ensureDatabaseConnection();
  await ensureRelations(data);
  try { return await Warehouse.create({ ...data, createdBy: userId }); } catch (error) { handleDuplicate(error); }
}

export async function getWarehouse(id, companyId) {
  ensureDatabaseConnection();
  const warehouse = await Warehouse.findOne({ _id: id, companyId }).populate('branchId', 'name').lean();
  if (!warehouse) throw new AppError('Almacen no encontrado', 404);
  return warehouse;
}

export async function updateWarehouse(id, companyId, data) {
  ensureDatabaseConnection();
  const warehouse = await Warehouse.findOneAndUpdate({ _id: id, companyId }, data, { new: true, runValidators: true }).lean();
  if (!warehouse) throw new AppError('Almacen no encontrado', 404);
  return warehouse;
}

export async function deactivateWarehouse(id, companyId) { return updateWarehouse(id, companyId, { status: 'INACTIVE' }); }
