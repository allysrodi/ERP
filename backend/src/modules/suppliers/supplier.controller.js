import { sendSuccess } from '../../utils/apiResponse.js';
import { createSupplier, deactivateSupplier, getSupplier, listSuppliers, updateSupplier } from './supplier.service.js';

export async function getSuppliers(request, response) {
  return sendSuccess(response, await listSuppliers(request.validated.query), 'Proveedores obtenidos correctamente');
}

export async function getSupplierById(request, response) {
  return sendSuccess(response, await getSupplier(request.params.id, request.validated.query.companyId), 'Proveedor obtenido correctamente');
}

export async function postSupplier(request, response) {
  return sendSuccess(response, await createSupplier(request.body, request.auth.userId), 'Proveedor creado correctamente', 201);
}

export async function putSupplier(request, response) {
  return sendSuccess(response, await updateSupplier(request.params.id, request.validated.query.companyId, request.body), 'Proveedor actualizado correctamente');
}

export async function deleteSupplier(request, response) {
  return sendSuccess(response, await deactivateSupplier(request.params.id, request.validated.query.companyId), 'Proveedor desactivado correctamente');
}
