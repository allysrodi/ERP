import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { requireAuth, requirePermission } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { ACTIONS } from '../auth/permissions.js';
import { expenseSchema, financeQuerySchema, paymentSchema } from './finance.validation.js';
import { getExpenses, getPayments, postExpense, postPayment } from './finance.controller.js';

const financeRouter = Router();
financeRouter.use(requireAuth);
financeRouter.get('/expenses', requirePermission(ACTIONS.VIEW), validate(financeQuerySchema, 'query'), asyncHandler(getExpenses));
financeRouter.post('/expenses', requirePermission(ACTIONS.CREATE), validate(expenseSchema), asyncHandler(postExpense));
financeRouter.get('/payments', requirePermission(ACTIONS.VIEW), validate(financeQuerySchema, 'query'), asyncHandler(getPayments));
financeRouter.post('/payments', requirePermission(ACTIONS.CREATE), validate(paymentSchema), asyncHandler(postPayment));

export default financeRouter;
