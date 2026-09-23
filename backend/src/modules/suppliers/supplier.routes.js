import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { requireAuth, requirePermission } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { ACTIONS } from '../auth/permissions.js';
import { idParamSchema, supplierQuerySchema, supplierSchema, supplierUpdateSchema } from './supplier.validation.js';
import { deleteSupplier, getSupplierById, getSuppliers, postSupplier, putSupplier } from './supplier.controller.js';

const supplierRouter = Router();

supplierRouter.use(requireAuth);
supplierRouter.get('/', requirePermission(ACTIONS.VIEW), validate(supplierQuerySchema, 'query'), asyncHandler(getSuppliers));
supplierRouter.get('/:id', requirePermission(ACTIONS.VIEW), validate(idParamSchema, 'params'), validate(supplierQuerySchema, 'query'), asyncHandler(getSupplierById));
supplierRouter.post('/', requirePermission(ACTIONS.CREATE), validate(supplierSchema), asyncHandler(postSupplier));
supplierRouter.put('/:id', requirePermission(ACTIONS.UPDATE), validate(idParamSchema, 'params'), validate(supplierQuerySchema.pick({ companyId: true }), 'query'), validate(supplierUpdateSchema), asyncHandler(putSupplier));
supplierRouter.delete('/:id', requirePermission(ACTIONS.DELETE), validate(idParamSchema, 'params'), validate(supplierQuerySchema.pick({ companyId: true }), 'query'), asyncHandler(deleteSupplier));

export default supplierRouter;
