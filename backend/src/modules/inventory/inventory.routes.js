import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { requireAuth, requirePermission } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { ACTIONS } from '../auth/permissions.js';
import { inventoryQuerySchema, movementSchema } from './inventory.validation.js';
import { movementQuerySchema } from './movementQuery.validation.js';
import { getInventory, getMovements, postMovement } from './inventory.controller.js';

const inventoryRouter = Router();
inventoryRouter.use(requireAuth);
inventoryRouter.get('/', requirePermission(ACTIONS.VIEW), validate(inventoryQuerySchema, 'query'), asyncHandler(getInventory));
inventoryRouter.get('/movements', requirePermission(ACTIONS.VIEW), validate(movementQuerySchema, 'query'), asyncHandler(getMovements));
inventoryRouter.post('/movement', requirePermission(ACTIONS.CREATE), validate(movementSchema), asyncHandler(postMovement));

export default inventoryRouter;
