import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Identificador invalido');

export const movementQuerySchema = z.object({
  companyId: objectId,
  productId: objectId.optional(),
  warehouseId: objectId.optional(),
  type: z.enum(['PURCHASE', 'SALE', 'ADJUSTMENT', 'TRANSFER', 'RETURN']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20)
});
