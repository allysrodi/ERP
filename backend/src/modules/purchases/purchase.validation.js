import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Identificador invalido');
const item = z.object({ productId: objectId, warehouseId: objectId, quantity: z.coerce.number().positive(), unitPrice: z.coerce.number().nonnegative() });
export const purchaseSchema = z.object({ companyId: objectId, supplierId: objectId, items: z.array(item).min(1), taxes: z.coerce.number().nonnegative().default(0) });
export const purchaseUpdateSchema = z.object({ status: z.enum(['PENDING', 'RECEIVED', 'CANCELLED']) });
export const purchaseQuerySchema = z.object({ companyId: objectId, status: z.enum(['DRAFT', 'PENDING', 'RECEIVED', 'CANCELLED']).optional(), page: z.coerce.number().int().positive().default(1), limit: z.coerce.number().int().positive().max(100).default(20) });
export const idParamSchema = z.object({ id: objectId });
