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
import { Sale } from '../modules/sales/sale.model.js';
import { Warehouse } from '../modules/warehouses/warehouse.model.js';

const generatedSeedPassword = crypto.randomBytes(24).toString('base64url');
const seedPassword = process.env.SEED_PASSWORD ?? generatedSeedPassword;
const systemId = new mongoose.Types.ObjectId();
const existingUserEmail = process.env.SEED_EXISTING_USER_EMAIL;
const existingUserRole = process.env.SEED_EXISTING_USER_ROLE;

async function ensureUser({ email, role, companyId, branchId }) {
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name: role,
      lastName: 'Demo',
      email,
      password: seedPassword,
      role,
      companyId,
      branchId
    });
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
  const updateData = {
    companyId: company._id,
    branchId: branch._id
  };

  if (existingUserRole) {
    updateData.role = existingUserRole;
  }

  const updatedUser = await User.findOneAndUpdate(
    { email: existingUserEmail },
    { $set: updateData },
    { new: true }
  );








  
  if (updatedUser) {
    console.log(
      `Usuario existente actualizado: ${updatedUser.email} - Rol: ${updatedUser.role}`
    );
  } else {
    console.log(
      `No se encontro el usuario existente: ${existingUserEmail}`
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
  const product = await Product.findOneAndUpdate({ companyId: company._id, sku: 'DEMO-001' }, { $set: { name: 'Laptop Apple MacBook Air 13"', description: 'Laptop ultraligera para productividad y uso profesional', categoryId: category._id, supplierId: supplier._id, purchasePrice: 50, salePrice: 80, stock: 0, minStock: 5, maxStock: 100, unit: 'pieza', createdBy } }, { upsert: true, new: true, setDefaultsOnInsert: true });
  const warehouse = await Warehouse.findOneAndUpdate({ companyId: company._id, name: 'Almacen Demo' }, { $setOnInsert: { branchId: branch._id, address: 'Direccion del almacen', manager: 'Almacenista Demo', createdBy } }, { upsert: true, new: true, setDefaultsOnInsert: true });
    // =========================================================
  // DATOS MASIVOS DE DEMOSTRACION KIT-LI
  // =========================================================

  console.log('Preparando datos masivos de demostracion...');

  // -------------------- CLIENTES --------------------
const demoCustomers = [];

const firstNames = [
  'Sofía', 'Valeria', 'Mariana', 'Fernanda', 'Camila',
  'Renata', 'Daniela', 'Andrea', 'Natalia', 'Ximena',
  'Alejandro', 'Diego', 'Carlos', 'Fernando', 'Sebastián',
  'Emiliano', 'Santiago', 'Mateo', 'Ricardo', 'Eduardo'
];

const lastNames = [
  'Hernández', 'García', 'Martínez', 'López', 'Ramírez',
  'Torres', 'Flores', 'Sánchez', 'González', 'Vázquez',
  'Morales', 'Castillo', 'Mendoza', 'Reyes', 'Cruz'
];

for (let i = 1; i <= 100; i += 1) {
  const number = String(i).padStart(3, '0');

  const firstName =
    firstNames[(i - 1) % firstNames.length];

  const lastName1 =
    lastNames[(i - 1) % lastNames.length];

  const lastName2 =
    lastNames[(i + 4) % lastNames.length];

  const fullName =
    `${firstName} ${lastName1} ${lastName2}`;

  const demoCustomer = await Customer.findOneAndUpdate(
    {
      companyId: company._id,
      email: `cliente${number}@kitli-demo.com`
    },
    {
      $set: {
        name: fullName,
        phone: `246100${String(i).padStart(4, '0')}`,
        email: `cliente${number}@kitli-demo.com`,
        address: `Calle Demo ${i}`,
        city: i % 3 === 0 ? 'Puebla' : 'Tlaxcala',
        state: i % 3 === 0 ? 'Puebla' : 'Tlaxcala',
        postalCode: '90000',
        status: 'ACTIVE',
        createdBy
      }
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  );

  demoCustomers.push(demoCustomer);
}

const allCustomers = [customer, ...demoCustomers];

  // -------------------- PRODUCTOS --------------------
  const demoProducts = [];
  const technologyProducts = [
  'Mouse inalámbrico Logitech M185',
  'Mouse gamer Logitech G203',
  'Mouse gamer Razer DeathAdder Essential',
  'Mouse inalámbrico HP Z3700',
  'Mouse ergonómico inalámbrico',
  'Teclado mecánico Redragon Kumara',
  'Teclado inalámbrico Logitech K380',
  'Teclado gamer RGB',
  'Teclado y mouse inalámbricos',
  'Teclado numérico USB',
  'Laptop Lenovo IdeaPad 15',
  'Laptop HP Pavilion 14',
  'Laptop ASUS VivoBook 15',
  'Laptop Acer Aspire 5',
  'Laptop Dell Inspiron 15',
  'Monitor Samsung 24" Full HD',
  'Monitor LG UltraGear 27"',
  'Monitor ASUS 24" Full HD',
  'Monitor Acer 23.8" IPS',
  'Monitor portátil USB-C 15.6"',
  'Audífonos HyperX Cloud Stinger',
  'Audífonos Logitech H390',
  'Audífonos gamer RGB 7.1',
  'Audífonos Bluetooth inalámbricos',
  'Bocinas Logitech Z120',
  'Webcam Logitech C920',
  'Webcam Full HD 1080p',
  'Micrófono USB para escritorio',
  'SSD Kingston NV2 1TB',
  'SSD Kingston 500GB',
  'Disco duro externo 2TB',
  'Memoria RAM Kingston Fury 16GB',
  'Memoria RAM DDR4 8GB',
  'Memoria USB 128GB',
  'Memoria USB 64GB',
  'Hub USB-C 6 en 1',
  'Hub USB 3.0 de 4 puertos',
  'Cargador USB-C 65W',
  'Cargador universal para laptop',
  'Power Bank 20000mAh',
  'Cable HDMI 2 metros',
  'Cable USB-C de carga rápida',
  'Adaptador USB-C a HDMI',
  'Adaptador WiFi USB',
  'Adaptador Bluetooth USB',
  'Base enfriadora para laptop',
  'Soporte ajustable para laptop',
  'Mousepad gamer XL',
  'Router WiFi doble banda',
  'Switch Ethernet de 8 puertos'
];

  for (let i = 1; i <= 50; i += 1) {
    const number = String(i).padStart(3, '0');
    const productName = technologyProducts[i - 1];

    const purchasePrice = 25 + (i % 15) * 5;
    const salePrice = purchasePrice + 25 + (i % 10) * 3;

    const demoProduct = await Product.findOneAndUpdate(
      {
        companyId: company._id,
        sku: `KIT-${number}`
      },
      {
        $set: {
          name: productName,
          description: `Producto tecnológico: ${productName}`,
          categoryId: category._id,
          supplierId: supplier._id,
          purchasePrice,
          salePrice,
          stock: 100 + (i % 50),
          minStock: 10,
          maxStock: 500,
          unit: 'pieza',
          status: 'ACTIVE',
          createdBy
        }
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    demoProducts.push(demoProduct);
  }

  const allProducts = [product, ...demoProducts];

  // -------------------- VENTAS --------------------
  // Estas ventas son historicas para demostracion.
  // No ejecutan movimientos de inventario porque estamos
  // poblando el historial comercial del ERP.

  const paymentMethods = [
    'CASH',
    'CARD',
    'TRANSFER',
    'CREDIT'
  ];

  const saleStatuses = [
    'DRAFT',
    'PENDING',
    'CONFIRMED',
    'PAID',
    'PAID',
    'PAID',
    'CANCELLED'
  ];

  const demoSaleUser =
    users[ROLES.VENTAS] ?? users[ROLES.ADMIN];

  // Proteccion contra duplicados masivos:
  // si ya hay cientos de ventas, no vuelve a insertar otras 800.
  const existingSalesCount = await Sale.countDocuments({
    companyId: company._id
  });

  let generatedSales = 0;

  if (existingSalesCount < 100) {
    const demoSales = [];
    const now = Date.now();

    for (let i = 1; i <= 800; i += 1) {
      const selectedCustomer =
        allCustomers[i % allCustomers.length];

      const firstProduct =
        allProducts[i % allProducts.length];

      const secondProduct =
        allProducts[(i * 7) % allProducts.length];

      const quantity1 = (i % 4) + 1;
      const quantity2 = (i % 3) + 1;

      const items = [
        {
          productId: firstProduct._id,
          warehouseId: warehouse._id,
          quantity: quantity1,
          unitPrice: firstProduct.salePrice,
          subtotal: Number(
            (quantity1 * firstProduct.salePrice).toFixed(2)
          )
        }
      ];

      // Aproximadamente una de cada tres ventas tiene dos productos.
      if (
        i % 3 === 0 &&
        secondProduct._id.toString() !==
          firstProduct._id.toString()
      ) {
        items.push({
          productId: secondProduct._id,
          warehouseId: warehouse._id,
          quantity: quantity2,
          unitPrice: secondProduct.salePrice,
          subtotal: Number(
            (quantity2 * secondProduct.salePrice).toFixed(2)
          )
        });
      }

      const subtotal = Number(
        items
          .reduce((sum, item) => sum + item.subtotal, 0)
          .toFixed(2)
      );

      // Algunas operaciones incluyen IVA para dar variedad
      // a los datos del historial.
      const taxes =
        i % 4 === 0
          ? Number((subtotal * 0.16).toFixed(2))
          : 0;

      const discount =
        i % 10 === 0
          ? Number((subtotal * 0.05).toFixed(2))
          : 0;

      const total = Number(
        (subtotal + taxes - discount).toFixed(2)
      );

      const status =
        saleStatuses[i % saleStatuses.length];

      // Reparte las ventas a lo largo de aproximadamente 6 meses.
      const daysAgo = i % 180;
      const hoursAgo = i % 24;

      const createdAt = new Date(
        now -
          daysAgo * 24 * 60 * 60 * 1000 -
          hoursAgo * 60 * 60 * 1000
      );

      demoSales.push({
        companyId: company._id,
        customerId: selectedCustomer._id,
        userId: demoSaleUser._id,
        items,
        subtotal,
        taxes,
        discount,
        total,
        paymentMethod:
          paymentMethods[i % paymentMethods.length],
        status,
        confirmedAt:
          status === 'CONFIRMED' || status === 'PAID'
            ? createdAt
            : undefined,
        createdAt,
        updatedAt: createdAt
      });
    }

    await Sale.insertMany(demoSales);
    generatedSales = demoSales.length;
  } else {
    console.log(
      `Ventas existentes detectadas: ${existingSalesCount}. No se duplicaron las ventas demo.`
    );
  }

  console.log('========================================');
  console.log('DATOS DEMO KIT-LI');
  console.log(`Clientes demo preparados: ${demoCustomers.length}`);
  console.log(`Productos demo preparados: ${demoProducts.length}`);
  console.log(`Ventas nuevas generadas: ${generatedSales}`);
  console.log('========================================');
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
