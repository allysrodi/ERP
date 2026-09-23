import { Product } from './product.model.js';
import { Category } from '../categories/category.model.js';
import { Company } from '../companies/company.model.js';
import { Supplier } from '../suppliers/supplier.model.js';
import { AppError } from '../../utils/appError.js';
import { ensureDatabaseConnection } from '../../utils/databaseGuard.js';

function escapeRegex(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
async function ensureProductRelations({ companyId, categoryId, supplierId }) {
  const [company, category] = await Promise.all([
    Company.exists({ _id: companyId, status: 'ACTIVE' }),
    Category.exists({ _id: categoryId, companyId, status: 'ACTIVE' })
  ]);
  if (!company) throw new AppError('Empresa no encontrada o inactiva', 404);
  if (!category) throw new AppError('Categoria no encontrada o inactiva', 404);
  if (supplierId && !(await Supplier.exists({ _id: supplierId, companyId, status: 'ACTIVE' }))) {
    throw new AppError('Proveedor no encontrado o inactivo', 404);
  }
}
function handleDuplicate(error) {
  if (error?.code === 11000) throw new AppError('Ya existe un producto con ese SKU', 409);
  throw error;
}

export async function listProducts({ companyId, categoryId, search, status, lowStock, page, limit }) {
  ensureDatabaseConnection();
  const filter = { companyId, ...(categoryId ? { categoryId } : {}), ...(status ? { status } : {}) };
  if (lowStock) filter.$expr = { $lte: ['$stock', '$minStock'] };
  if (search) filter.$or = [{ name: new RegExp(escapeRegex(search), 'i') }, { sku: new RegExp(escapeRegex(search), 'i') }];
  const [items, total] = await Promise.all([
    Product.find(filter).sort({ name: 1 }).skip((page - 1) * limit).limit(limit).populate('categoryId', 'name').lean(),
    Product.countDocuments(filter)
  ]);
  return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function getProduct(id, companyId) {
  ensureDatabaseConnection();
  const product = await Product.findOne({ _id: id, companyId }).populate('categoryId', 'name').lean();
  if (!product) throw new AppError('Producto no encontrado', 404);
  return product;
}

export async function createProduct(data, userId) {
  ensureDatabaseConnection();
  await ensureProductRelations(data);
  try { return await Product.create({ ...data, createdBy: userId }); } catch (error) { handleDuplicate(error); }
}

export async function updateProduct(id, companyId, data) {
  ensureDatabaseConnection();
  const currentProduct = await Product.findOne({ _id: id, companyId }).lean();
  if (!currentProduct) throw new AppError('Producto no encontrado', 404);
  if (data.categoryId || data.supplierId) {
    await ensureProductRelations({
      companyId,
      categoryId: data.categoryId ?? currentProduct.categoryId.toString(),
      supplierId: data.supplierId ?? currentProduct.supplierId?.toString()
    });
  }
  const product = await Product.findOneAndUpdate({ _id: id, companyId }, data, { new: true, runValidators: true }).lean();
  return product;
}

export async function deactivateProduct(id, companyId) { return updateProduct(id, companyId, { status: 'INACTIVE' }); }
