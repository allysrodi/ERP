import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Identificador invalido');
const optionalText = (max) => z.string().trim().max(max).optional();

export const companySchema = z.object({
  name: z.string().trim().min(1).max(160),
  legalName: z.string().trim().min(1).max(200),
  rfc: z.string().trim().min(12).max(13).transform((value) => value.toUpperCase()),
  address: optionalText(300),
  phone: optionalText(30),
  email: z.string().trim().email().max(160).optional()
});

export const companyUpdateSchema = companySchema.partial();

export const branchSchema = z.object({
  name: z.string().trim().min(1).max(160),
  companyId: objectId,
  address: optionalText(300),
  phone: optionalText(30),
  manager: optionalText(160)
});

export const branchCreateSchema = branchSchema.omit({ companyId: true });

export const branchUpdateSchema = branchSchema.omit({ companyId: true }).partial();
