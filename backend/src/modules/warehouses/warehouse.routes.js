import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { requireAuth, requirePermission } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { ACTIONS } from '../auth/permissions.js';
import { idParamSchema, warehouseQuerySchema, warehouseSchema, warehouseUpdateSchema } from './warehouse.validation.js';
import { deleteWarehouse, getWarehouseById, getWarehouses, postWarehouse, putWarehouse } from './warehouse.controller.js';

const warehouseRouter = Router();
warehouseRouter.use(requireAuth);
warehouseRouter.get('/', requirePermission(ACTIONS.VIEW), validate(warehouseQuerySchema, 'query'), asyncHandler(getWarehouses));
warehouseRouter.get('/:id', requirePermission(ACTIONS.VIEW), validate(idParamSchema, 'params'), validate(warehouseQuerySchema, 'query'), asyncHandler(getWarehouseById));
warehouseRouter.post('/', requirePermission(ACTIONS.CREATE), validate(warehouseSchema), asyncHandler(postWarehouse));
warehouseRouter.put('/:id', requirePermission(ACTIONS.UPDATE), validate(idParamSchema, 'params'), validate(warehouseQuerySchema.pick({ companyId: true }), 'query'), validate(warehouseUpdateSchema), asyncHandler(putWarehouse));
warehouseRouter.delete('/:id', requirePermission(ACTIONS.DELETE), validate(idParamSchema, 'params'), validate(warehouseQuerySchema.pick({ companyId: true }), 'query'), asyncHandler(deleteWarehouse));

export default warehouseRouter;
