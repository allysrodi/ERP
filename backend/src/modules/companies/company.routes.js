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
companyRouter.get('/', asyncHandler(getCompanies));
companyRouter.get('/:id', asyncHandler(getCompanyById));
companyRouter.post('/', validate(companySchema), asyncHandler(postCompany));
companyRouter.put('/:id', validate(companyUpdateSchema), asyncHandler(putCompany));
companyRouter.delete('/:id', asyncHandler(deleteCompany));
companyRouter.get('/:companyId/branches', asyncHandler(getCompanyBranches));
companyRouter.post('/:companyId/branches', validate(branchCreateSchema), asyncHandler(postBranch));
companyRouter.put('/branches/:id', validate(branchUpdateSchema), asyncHandler(putBranch));
companyRouter.delete('/branches/:id', asyncHandler(deleteBranch));

export default companyRouter;
