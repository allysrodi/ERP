import mongoose from 'mongoose';
import { Branch } from './branch.model.js';
import { AppError } from '../../utils/appError.js';
import { ensureDatabaseConnection } from '../../utils/databaseGuard.js';
import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { ROLES } from '../auth/permissions.js';
import { branchCreateSchema, branchUpdateSchema, companySchema, companyUpdateSchema } from './company.validation.js';
import { deleteBranch, deleteCompany, getCompanyBranches, getCompanyById, getCompanies, postBranch, postCompany, putBranch, putCompany } from './company.controller.js';

const companyRouter = Router();
const managers = [ROLES.ADMIN, ROLES.GERENTE];

companyRouter.use(requireAuth, requireRole(...managers));
companyRouter.param('companyId', (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) return next(new AppError('Identificador invalido', 400));
  if (!req.auth.isGlobalAdmin && id !== req.auth.companyId) return next(new AppError('Empresa no autorizada', 403));
  return next();
});
companyRouter.param('id', (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) return next(new AppError('Identificador invalido', 400));
  if (req.auth.isGlobalAdmin) return next();
  if (!req.path.startsWith('/branches/')) {
    return id === req.auth.companyId ? next() : next(new AppError('Empresa no autorizada', 403));
  }
  Promise.resolve().then(async () => {
    ensureDatabaseConnection();
    if (!await Branch.exists({ _id: id, companyId: req.auth.companyId })) throw new AppError('Sucursal no encontrada', 404);
    next();
  }).catch(next);
});

companyRouter.get('/', asyncHandler(getCompanies));
companyRouter.get('/:id', asyncHandler(getCompanyById));
companyRouter.post('/', (req, res, next) => req.auth.isGlobalAdmin ? next() : next(new AppError('Solo un administrador global puede crear empresas', 403)), validate(companySchema), asyncHandler(postCompany));
companyRouter.put('/:id', validate(companyUpdateSchema), asyncHandler(putCompany));
companyRouter.delete('/:id', asyncHandler(deleteCompany));
companyRouter.get('/:companyId/branches', asyncHandler(getCompanyBranches));
companyRouter.post('/:companyId/branches', validate(branchCreateSchema), asyncHandler(postBranch));
companyRouter.put('/branches/:id', validate(branchUpdateSchema), asyncHandler(putBranch));
companyRouter.delete('/branches/:id', asyncHandler(deleteBranch));

export default companyRouter;
