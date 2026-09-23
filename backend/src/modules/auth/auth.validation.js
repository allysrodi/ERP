import { z } from 'zod';

const email = z.string().trim().email().transform((value) => value.toLowerCase());
const password = z.string().min(8).max(128);

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(120),
  email,
  phone: z.string().trim().max(30).optional(),
  password,
  companyId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  branchId: z.string().regex(/^[a-f\d]{24}$/i).optional()
});

export const loginSchema = z.object({ email, password });
