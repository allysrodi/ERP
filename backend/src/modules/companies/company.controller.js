import { sendSuccess } from '../../utils/apiResponse.js';
import { createCompany, createBranch, deactivateBranch, deactivateCompany, getCompany, listBranches, listCompanies, updateBranch, updateCompany } from './company.service.js';

export async function getCompanies(request, response) {
  return sendSuccess(response, await listCompanies(request.auth.isGlobalAdmin ? undefined : request.auth.companyId), 'Empresas obtenidas correctamente');
}

export async function getCompanyById(request, response) {
  return sendSuccess(response, await getCompany(request.params.id), 'Empresa obtenida correctamente');
}

export async function postCompany(request, response) {
  return sendSuccess(response, await createCompany(request.body, request.auth.userId), 'Empresa creada correctamente', 201);
}

export async function putCompany(request, response) {
  return sendSuccess(response, await updateCompany(request.params.id, request.body), 'Empresa actualizada correctamente');
}

export async function deleteCompany(request, response) {
  return sendSuccess(response, await deactivateCompany(request.params.id), 'Empresa desactivada correctamente');
}

export async function getCompanyBranches(request, response) {
  return sendSuccess(response, await listBranches(request.params.companyId), 'Sucursales obtenidas correctamente');
}

export async function postBranch(request, response) {
  return sendSuccess(response, await createBranch({ ...request.body, companyId: request.params.companyId }, request.auth.userId), 'Sucursal creada correctamente', 201);
}

export async function putBranch(request, response) {
  return sendSuccess(response, await updateBranch(request.params.id, request.body), 'Sucursal actualizada correctamente');
}

export async function deleteBranch(request, response) {
  return sendSuccess(response, await deactivateBranch(request.params.id), 'Sucursal desactivada correctamente');
}
