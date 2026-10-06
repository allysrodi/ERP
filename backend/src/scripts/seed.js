import crypto from 'node:crypto';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import { env } from '../config/env.js';
import { ROLES } from '../modules/auth/permissions.js';
import { User } from '../modules/auth/user.model.js';
import { Company } from '../modules/companies/company.model.js';
import { Branch } from '../modules/companies/branch.model.js';
import { Customer } from '../modules/customers/customer.model.js';
import { Supplier } from '../modules/suppliers/supplier.model.js';
import { Category } from '../modules/categories/category.model.js';
import { Product } from '../modules/products/product.model.js';
import { Warehouse } from '../modules/warehouses/warehouse.model.js';

const generatedSeedPassword = crypto.randomBytes(24).toString('base64url');
const seedPassword = process.env.SEED_PASSWORD ?? generatedSeedPassword;
const systemId = new mongoose.Types.ObjectId();
const existingUserEmail = process.env.SEED_EXISTING_USER_EMAIL;

async function ensureUser({ email, role, companyId, branchId }) {
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name: role, lastName: 'Demo', email, password: seedPassword, role, companyId, branchId });
  }
  return user;
}

async function seed() {
  const database = await connectDatabase();
  if (!database.connected) throw new Error('MONGODB_URI es necesaria para ejecutar el seed');

  const company = await Company.findOneAndUpdate(
    { rfc: 'DEM010101AAA' },
    { $setOnInsert: { name: 'Empresa Demo', legalName: 'Empresa Demo S.A. de C.V.', rfc: 'DEM010101AAA', address: 'Direccion Demo', phone: '5550000000', email: 'demo@example.com', createdBy: systemId } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  const branch = await Branch.findOneAndUpdate(
    { companyId: company._id, name: 'Sucursal Principal' },
    { $setOnInsert: { address: 'Direccion Principal', phone: '5550000001', manager: 'Gerente Demo', createdBy: systemId } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

if (existingUserEmail) {
  const existingUser = await User.findOne({
    email: existingUserEmail.toLowerCase().trim()
  });

  if (!existingUser) {
    console.log('Usuario existente no encontrado; no se realizó la asociación.');
  } else {
    existingUser.companyId = company._id;
    existingUser.branchId = branch._id;
    await existingUser.save();

    console.log(
      `Usuario existente asociado correctamente a Empresa Demo: ${existingUser.name}`
    );
  }
}


  const users = {};
  for (const role of Object.values(ROLES)) {
    users[role] = await ensureUser({ email: `demo.${role.toLowerCase()}@example.com`, role, companyId: role === ROLES.ADMIN ? undefined : company._id, branchId: role === ROLES.ADMIN ? undefined : branch._id });
  }
  const createdBy = users[ROLES.ADMIN]._id;
  const customer = await Customer.findOneAndUpdate({ companyId: company._id, email: 'cliente.demo@example.com' }, { $setOnInsert: { name: 'Cliente Demo', phone: '5550000010', email: 'cliente.demo@example.com', city: 'Ciudad Demo', status: 'ACTIVE', createdBy } }, { upsert: true, new: true, setDefaultsOnInsert: true });
  const supplier = await Supplier.findOneAndUpdate({ companyId: company._id, email: 'proveedor.demo@example.com' }, { $setOnInsert: { name: 'Proveedor Demo', phone: '5550000020', email: 'proveedor.demo@example.com', contact: 'Contacto Demo', status: 'ACTIVE', createdBy } }, { upsert: true, new: true, setDefaultsOnInsert: true });
  const category = await Category.findOneAndUpdate({ companyId: company._id, name: 'Categoria Demo' }, { $setOnInsert: { description: 'Categoria para datos de prueba', createdBy } }, { upsert: true, new: true, setDefaultsOnInsert: true });
  const product = await Product.findOneAndUpdate({ companyId: company._id, sku: 'DEMO-001' }, { $setOnInsert: { name: 'Producto Demo', description: 'Producto ficticio para pruebas', categoryId: category._id, supplierId: supplier._id, purchasePrice: 50, salePrice: 80, stock: 0, minStock: 5, maxStock: 100, unit: 'pieza', createdBy } }, { upsert: true, new: true, setDefaultsOnInsert: true });
  const warehouse = await Warehouse.findOneAndUpdate({ companyId: company._id, name: 'Almacen Demo' }, { $setOnInsert: { branchId: branch._id, address: 'Direccion del almacen', manager: 'Almacenista Demo', createdBy } }, { upsert: true, new: true, setDefaultsOnInsert: true });

  console.log(`Seed completado: company=${company._id} branch=${branch._id} customer=${customer._id} supplier=${supplier._id} category=${category._id} product=${product._id} warehouse=${warehouse._id}`);
  console.log('Las contrasenas no se imprimen. Usa SEED_PASSWORD para definirlas de forma controlada.');
}

try {
  await seed();
} catch (error) {
  console.error('Seed fallido:', error.message);
  process.exitCode = 1;
} finally {
  if (env.MONGODB_URI) await mongoose.disconnect();
}
