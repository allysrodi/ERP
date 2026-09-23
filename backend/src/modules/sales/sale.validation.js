import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Identificador invalido');
const item = z.object({
  productId: objectId,
  warehouseId: objectId,
  quantity: z.coerce.number().positive(),
  unitPrice: z.coerce.number().nonnegative()
});

export const saleSchema = z.object({
  companyId: objectId,
  customerId: objectId,
  items: z.array(item).min(1),
  taxes: z.coerce.number().nonnegative().default(0),
  discount: z.coerce.number().nonnegative().default(0),
  paymentMethod: z.enum(['CASH', 'CARD', 'TRANSFER', 'CREDIT'])
});

export const saleUpdateSchema = z.object({ status: z.enum(['PENDING', 'CONFIRMED', 'PAID', 'CANCELLED']) });
export const saleQuerySchema = z.object({
  companyId: objectId,
  status: z.enum(['DRAFT', 'PENDING', 'CONFIRMED', 'PAID', 'CANCELLED']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20)
});
export const idParamSchema = z.object({ id: objectId });
