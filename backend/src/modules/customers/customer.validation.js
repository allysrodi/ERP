import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Identificador invalido');
const optionalText = (max) => z.string().trim().max(max).optional();

export const customerSchema = z.object({
  name: z.string().trim().min(1).max(160),
  companyId: objectId,
  rfc: optionalText(13).transform((value) => value?.toUpperCase()),
  phone: optionalText(30),
  email: z.string().trim().email().max(160).nullable().optional(),
  address: optionalText(300),
  city: optionalText(100),
  state: optionalText(100),
  postalCode: optionalText(10)
});

export const customerUpdateSchema = customerSchema.omit({ companyId: true }).partial();
export const customerQuerySchema = z.object({
  companyId: objectId,
  search: z.string().trim().max(100).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20)
});
export const idParamSchema = z.object({ id: objectId });
