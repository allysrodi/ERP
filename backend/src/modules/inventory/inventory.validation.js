import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Identificador invalido');
const movementType = z.enum(['PURCHASE', 'SALE', 'ADJUSTMENT', 'TRANSFER', 'RETURN']);

export const movementSchema = z.object({
  companyId: objectId,
  productId: objectId,
  warehouseId: objectId,
  destinationWarehouseId: objectId.optional(),
  type: movementType,
  direction: z.enum(['IN', 'OUT']).default('IN'),
  quantity: z.coerce.number().finite().positive(),
  reason: z.string().trim().max(300).optional(),
  referenceId: objectId.optional()
}).superRefine((data, context) => {
  if (data.type === 'TRANSFER' && !data.destinationWarehouseId) context.addIssue({ code: 'custom', path: ['destinationWarehouseId'], message: 'Destino requerido para transferencias' });
  if (data.type === 'TRANSFER' && data.destinationWarehouseId === data.warehouseId) context.addIssue({ code: 'custom', path: ['destinationWarehouseId'], message: 'El origen y destino deben ser distintos' });
});

export const inventoryQuerySchema = z.object({
  companyId: objectId,
  warehouseId: objectId.optional(),
  productId: objectId.optional(),
  lowStock: z.enum(['true', 'false']).transform((value) => value === 'true').optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20)
});
