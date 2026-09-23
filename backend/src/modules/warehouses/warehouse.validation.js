import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Identificador invalido');

export const warehouseSchema = z.object({
  name: z.string().trim().min(1).max(160),
  companyId: objectId,
  branchId: objectId,
  address: z.string().trim().max(300).optional(),
  manager: z.string().trim().max(160).optional()
});
export const warehouseUpdateSchema = warehouseSchema.omit({ companyId: true, branchId: true }).partial();
export const warehouseQuerySchema = z.object({
  companyId: objectId,
  branchId: objectId.optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20)
});
export const idParamSchema = z.object({ id: objectId });
