import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { requireAuth, requirePermission } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { ACTIONS } from '../auth/permissions.js';
import { categoryQuerySchema, categorySchema, categoryUpdateSchema, idParamSchema } from './category.validation.js';
import { deleteCategory, getCategories, getCategoryById, postCategory, putCategory } from './category.controller.js';

const categoryRouter = Router();
categoryRouter.use(requireAuth);
categoryRouter.get('/', requirePermission(ACTIONS.VIEW), validate(categoryQuerySchema, 'query'), asyncHandler(getCategories));
categoryRouter.get('/:id', requirePermission(ACTIONS.VIEW), validate(idParamSchema, 'params'), validate(categoryQuerySchema, 'query'), asyncHandler(getCategoryById));
categoryRouter.post('/', requirePermission(ACTIONS.CREATE), validate(categorySchema), asyncHandler(postCategory));
categoryRouter.put('/:id', requirePermission(ACTIONS.UPDATE), validate(idParamSchema, 'params'), validate(categoryQuerySchema.pick({ companyId: true }), 'query'), validate(categoryUpdateSchema), asyncHandler(putCategory));
categoryRouter.delete('/:id', requirePermission(ACTIONS.DELETE), validate(idParamSchema, 'params'), validate(categoryQuerySchema.pick({ companyId: true }), 'query'), asyncHandler(deleteCategory));

export default categoryRouter;
