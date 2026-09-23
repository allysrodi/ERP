import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Identificador invalido');
export const expenseSchema = z.object({ companyId: objectId, concept: z.string().trim().min(1).max(200), category: z.string().trim().min(1).max(100), amount: z.coerce.number().nonnegative() });
export const paymentSchema = z.object({ companyId: objectId, saleId: objectId.optional(), purchaseId: objectId.optional(), expenseId: objectId.optional(), amount: z.coerce.number().positive(), method: z.enum(['CASH', 'CARD', 'TRANSFER', 'CREDIT']) }).refine((data) => [data.saleId, data.purchaseId, data.expenseId].filter(Boolean).length === 1, { message: 'El pago debe relacionarse con una venta, compra o gasto' });
export const financeQuerySchema = z.object({ companyId: objectId, page: z.coerce.number().int().positive().default(1), limit: z.coerce.number().int().positive().max(100).default(20) });
