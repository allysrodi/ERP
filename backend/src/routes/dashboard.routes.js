import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { ACTIONS } from '../modules/auth/permissions.js';
import { Sale } from '../modules/sales/sale.model.js';
import { Purchase } from '../modules/purchases/purchase.model.js';
import { Expense } from '../modules/finance/expense.model.js';
import { Product } from '../modules/products/product.model.js';
import { Customer } from '../modules/customers/customer.model.js';
import { Project } from '../modules/projects/project.model.js';
import { ensureDatabaseConnection } from '../utils/databaseGuard.js';
const query = z.object({ companyId: z.string().regex(/^[a-f\d]{24}$/i) });
const router = Router(); router.use(requireAuth, requirePermission(ACTIONS.VIEW));
router.get('/', validate(query, 'query'), asyncHandler(async (req, res) => { ensureDatabaseConnection(); const queryData = req.validated?.query ?? req.query;
const { companyId } = queryData; const [
  sales,
  purchases,
  expenses,
  lowStock,
  activeProjects,
  products,
  customers
] = await Promise.all([Sale.countDocuments({ companyId, status: { $in: ['CONFIRMED', 'PAID'] } }), Purchase.countDocuments({ companyId, status: 'RECEIVED' }), Expense.countDocuments({ companyId, status: { $ne: 'CANCELLED' } }), Product.countDocuments({ companyId, status: 'ACTIVE', $expr: { $lte: ['$stock', '$minStock'] } }), Project.countDocuments({ companyId, status: 'IN_PROGRESS' }),Product.countDocuments({ companyId, status: 'ACTIVE' }),
Customer.countDocuments({ companyId, status: 'ACTIVE' }) ]); res.json({
  success: true,
  data: {
    sales,
    purchases,
    expenses,
    lowStock,
    activeProjects,
    products,
    customers
  },
  message: 'Dashboard obtenido correctamente'
});
}));
export default router;
