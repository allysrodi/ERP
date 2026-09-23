import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { requireAuth, requirePermission } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { ACTIONS } from '../auth/permissions.js';
import { idParamSchema, saleQuerySchema, saleSchema, saleUpdateSchema } from './sale.validation.js';
import { getSaleById, getSales, postSale, putSaleStatus } from './sale.controller.js';

const saleRouter = Router();
saleRouter.use(requireAuth);
saleRouter.get('/', requirePermission(ACTIONS.VIEW), validate(saleQuerySchema, 'query'), asyncHandler(getSales));
saleRouter.get('/:id', requirePermission(ACTIONS.VIEW), validate(idParamSchema, 'params'), validate(saleQuerySchema, 'query'), asyncHandler(getSaleById));
saleRouter.post('/', requirePermission(ACTIONS.CREATE), validate(saleSchema), asyncHandler(postSale));
saleRouter.put('/:id/status', requirePermission(ACTIONS.UPDATE), validate(idParamSchema, 'params'), validate(saleQuerySchema.pick({ companyId: true }), 'query'), validate(saleUpdateSchema), asyncHandler(putSaleStatus));

export default saleRouter;
