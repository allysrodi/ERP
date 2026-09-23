import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { requireAuth, requirePermission } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { ACTIONS } from '../auth/permissions.js';
import { customerQuerySchema, customerSchema, customerUpdateSchema, idParamSchema } from './customer.validation.js';
import { deleteCustomer, getCustomerById, getCustomers, postCustomer, putCustomer } from './customer.controller.js';

const customerRouter = Router();

customerRouter.use(requireAuth);
customerRouter.get('/', requirePermission(ACTIONS.VIEW), validate(customerQuerySchema, 'query'), asyncHandler(getCustomers));
customerRouter.get('/:id', requirePermission(ACTIONS.VIEW), validate(idParamSchema, 'params'), validate(customerQuerySchema, 'query'), asyncHandler(getCustomerById));
customerRouter.post('/', requirePermission(ACTIONS.CREATE), validate(customerSchema), asyncHandler(postCustomer));
customerRouter.put('/:id', requirePermission(ACTIONS.UPDATE), validate(idParamSchema, 'params'), validate(customerQuerySchema.pick({ companyId: true }), 'query'), validate(customerUpdateSchema), asyncHandler(putCustomer));
customerRouter.delete('/:id', requirePermission(ACTIONS.DELETE), validate(idParamSchema, 'params'), validate(customerQuerySchema.pick({ companyId: true }), 'query'), asyncHandler(deleteCustomer));

export default customerRouter;
