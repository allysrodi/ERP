import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { requireAuth, requirePermission } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { ACTIONS } from '../auth/permissions.js';
import { idParamSchema, productQuerySchema, productSchema, productUpdateSchema } from './product.validation.js';
import { deleteProduct, getProductById, getProducts, postProduct, putProduct } from './product.controller.js';

const productRouter = Router();
productRouter.use(requireAuth);
productRouter.get('/', requirePermission(ACTIONS.VIEW), validate(productQuerySchema, 'query'), asyncHandler(getProducts));
productRouter.get('/:id', requirePermission(ACTIONS.VIEW), validate(idParamSchema, 'params'), validate(productQuerySchema, 'query'), asyncHandler(getProductById));
productRouter.post('/', requirePermission(ACTIONS.CREATE), validate(productSchema), asyncHandler(postProduct));
productRouter.put('/:id', requirePermission(ACTIONS.UPDATE), validate(idParamSchema, 'params'), validate(productQuerySchema.pick({ companyId: true }), 'query'), validate(productUpdateSchema), asyncHandler(putProduct));
productRouter.delete('/:id', requirePermission(ACTIONS.DELETE), validate(idParamSchema, 'params'), validate(productQuerySchema.pick({ companyId: true }), 'query'), validate(productUpdateSchema), asyncHandler(deleteProduct));

export default productRouter;
