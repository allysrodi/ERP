import { sendSuccess } from '../../utils/apiResponse.js';
import {
  createPurchase,
  listPurchases,
  receivePurchase
} from './purchase.service.js';

export async function postPurchase(request, response) {
  return sendSuccess(
    response,
    await createPurchase(
      request.body,
      request.auth.userId
    ),
    'Compra creada correctamente',
    201
  );
}

export async function getPurchases(request, response) {
  const query = request.validated?.query ?? request.query;

  return sendSuccess(
    response,
    await listPurchases(query),
    'Compras obtenidas correctamente'
  );
}

export async function putPurchaseStatus(request, response) {
  const query = request.validated?.query ?? request.query;

  request.auditManaged = true;

  return sendSuccess(
    response,
    await receivePurchase(
      request.params.id,
      query.companyId,
      request.auth.userId
    ),
    'Compra recibida correctamente'
  );
}