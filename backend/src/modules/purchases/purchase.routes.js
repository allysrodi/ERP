import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { requireAuth, requirePermission } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { ACTIONS } from '../auth/permissions.js';
import { idParamSchema, purchaseQuerySchema, purchaseSchema, purchaseUpdateSchema } from './purchase.validation.js';
import { getPurchases, postPurchase, putPurchaseStatus } from './purchase.controller.js';

const purchaseRouter = Router();
purchaseRouter.use(requireAuth);
purchaseRouter.get('/', requirePermission(ACTIONS.VIEW), validate(purchaseQuerySchema, 'query'), asyncHandler(getPurchases));
purchaseRouter.post('/', requirePermission(ACTIONS.CREATE), validate(purchaseSchema), asyncHandler(postPurchase));
purchaseRouter.put('/:id/status', requirePermission(ACTIONS.UPDATE), validate(idParamSchema, 'params'), validate(purchaseQuerySchema.pick({ companyId: true }), 'query'), validate(purchaseUpdateSchema), asyncHandler(putPurchaseStatus));

export default purchaseRouter;
