import { sendSuccess } from '../../utils/apiResponse.js';
import {
  createSale,
  getSale,
  listSales,
  updateSaleStatus
} from './sale.service.js';

export async function postSale(request, response) {
  return sendSuccess(
    response,
    await createSale(request.body, request.auth.userId),
    'Venta creada correctamente',
    201
  );
}

export async function getSales(request, response) {
  const query = request.validated?.query ?? request.query;

  return sendSuccess(
    response,
    await listSales(query),
    'Ventas obtenidas correctamente'
  );
}

export async function getSaleById(request, response) {
  const query = request.validated?.query ?? request.query;

  return sendSuccess(
    response,
    await getSale(request.params.id, query.companyId),
    'Venta obtenida correctamente'
  );
}

export async function putSaleStatus(request, response) {
  const query = request.validated?.query ?? request.query;

  request.auditManaged = true;

  return sendSuccess(
    response,
    await updateSaleStatus(
      request.params.id,
      query.companyId,
      request.body.status,
      request.auth.userId
    ),
    'Estado de venta actualizado correctamente'
  );
}