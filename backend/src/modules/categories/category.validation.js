import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Identificador invalido');

export const categorySchema = z.object({
  name: z.string().trim().min(1).max(120),
  companyId: objectId,
  description: z.string().trim().max(300).optional()
});

export const categoryUpdateSchema = categorySchema.omit({ companyId: true }).partial();
export const categoryQuerySchema = z.object({
  companyId: objectId,
  search: z.string().trim().max(100).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20)
});
export const idParamSchema = z.object({ id: objectId });
