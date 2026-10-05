import { sendSuccess } from '../../utils/apiResponse.js';
import { createWarehouse, deactivateWarehouse, getWarehouse, listWarehouses, updateWarehouse } from './warehouse.service.js';

export async function getWarehouses(request, response) { return sendSuccess(response, await listWarehouses(request.validated.query), 'Almacenes obtenidos correctamente'); }
export async function getWarehouseById(request, response) { return sendSuccess(response, await getWarehouse(request.params.id, request.validated.query.companyId), 'Almacen obtenido correctamente'); }
export async function postWarehouse(request, response) { return sendSuccess(response, await createWarehouse(request.body, request.auth.userId), 'Almacen creado correctamente', 201); }
export async function putWarehouse(request, response) { return sendSuccess(response, await updateWarehouse(request.params.id, request.validated.query.companyId, request.body), 'Almacen actualizado correctamente'); }
export async function deleteWarehouse(request, response) { return sendSuccess(response, await deactivateWarehouse(request.params.id, request.validated.query.companyId), 'Almacen desactivado correctamente'); }
