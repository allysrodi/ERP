import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Identificador invalido');
const optionalText = (max) => z.string().trim().max(max).optional();
const nonNegative = z.coerce.number().finite().min(0);

const productFields = z.object({
  sku: z.string().trim().min(1).max(60).transform((value) => value.toUpperCase()),
  name: z.string().trim().min(1).max(160),
  description: optionalText(500),
  companyId: objectId,
  categoryId: objectId,
  supplierId: objectId.optional(),
  purchasePrice: nonNegative,
  salePrice: nonNegative,
  stock: nonNegative.default(0),
  minStock: nonNegative.default(0),
  maxStock: nonNegative.default(0),
  unit: z.string().trim().min(1).max(30)
});

const stockRange = (schema) => schema.refine((data) => data.maxStock === undefined || data.minStock === undefined || data.maxStock === 0 || data.maxStock >= data.minStock, {
  message: 'El stock maximo debe ser mayor o igual al minimo',
  path: ['maxStock']
});

export const productSchema = stockRange(productFields);
export const productUpdateSchema = stockRange(productFields.omit({ companyId: true }).partial());
export const productQuerySchema = z.object({
  companyId: objectId,
  categoryId: objectId.optional(),
  search: z.string().trim().max(100).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  lowStock: z.enum(['true', 'false']).transform((value) => value === 'true').optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20)
});
export const idParamSchema = z.object({ id: objectId });
