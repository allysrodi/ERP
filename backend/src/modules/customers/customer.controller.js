import { sendSuccess } from '../../utils/apiResponse.js';
import { createCustomer, deactivateCustomer, getCustomer, listCustomers, updateCustomer } from './customer.service.js';

export async function getCustomers(request, response) {
  return sendSuccess(response, await listCustomers(request.query), 'Clientes obtenidos correctamente');
}

export async function getCustomerById(request, response) {
  return sendSuccess(response, await getCustomer(request.params.id, request.query.companyId), 'Cliente obtenido correctamente');
}

export async function postCustomer(request, response) {
  return sendSuccess(response, await createCustomer(request.body, request.auth.userId), 'Cliente creado correctamente', 201);
}

export async function putCustomer(request, response) {
  return sendSuccess(response, await updateCustomer(request.params.id, request.query.companyId, request.body), 'Cliente actualizado correctamente');
}

export async function deleteCustomer(request, response) {
  return sendSuccess(response, await deactivateCustomer(request.params.id, request.query.companyId), 'Cliente desactivado correctamente');
}
