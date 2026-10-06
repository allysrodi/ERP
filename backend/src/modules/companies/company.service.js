import { Company } from './company.model.js';
import { Branch } from './branch.model.js';
import { AppError } from '../../utils/appError.js';
import { ensureDatabaseConnection } from '../../utils/databaseGuard.js';

function handleDuplicate(error) {
  if (error?.code === 11000) throw new AppError('Ya existe un registro con esos datos', 409);
  throw error;
}

export async function listCompanies(companyId) {
  ensureDatabaseConnection();
  return Company.find(companyId ? { _id: companyId } : {}).sort({ name: 1 }).lean();
}

export async function getCompany(id) {
  ensureDatabaseConnection();
  const company = await Company.findById(id).lean();
  if (!company) throw new AppError('Empresa no encontrada', 404);
  return company;
}

export async function createCompany(data, userId) {
  ensureDatabaseConnection();
  try {
    return await Company.create({ ...data, createdBy: userId });
  } catch (error) {
    handleDuplicate(error);
  }
}

export async function updateCompany(id, data) {
  ensureDatabaseConnection();
  const company = await Company.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  if (!company) throw new AppError('Empresa no encontrada', 404);
  return company;
}

export async function deactivateCompany(id) {
  return updateCompany(id, { status: 'INACTIVE' });
}

export async function listBranches(companyId) {
  ensureDatabaseConnection();
  return Branch.find({ companyId }).sort({ name: 1 }).lean();
}

export async function createBranch(data, userId) {
  ensureDatabaseConnection();
  const company = await Company.exists({ _id: data.companyId, status: 'ACTIVE' });
  if (!company) throw new AppError('Empresa no encontrada o inactiva', 404);
  try {
    return await Branch.create({ ...data, createdBy: userId });
  } catch (error) {
    handleDuplicate(error);
  }
}

export async function updateBranch(id, data) {
  ensureDatabaseConnection();
  const branch = await Branch.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  if (!branch) throw new AppError('Sucursal no encontrada', 404);
  return branch;
}

export async function deactivateBranch(id) {
  return updateBranch(id, { status: 'INACTIVE' });
}
