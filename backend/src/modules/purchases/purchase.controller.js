import { sendSuccess } from '../../utils/apiResponse.js';
import { createPurchase, listPurchases, receivePurchase } from './purchase.service.js';

export async function postPurchase(request, response) { return sendSuccess(response, await createPurchase(request.body, request.auth.userId), 'Compra creada correctamente', 201); }
export async function getPurchases(request, response) { return sendSuccess(response, await listPurchases(request.query), 'Compras obtenidas correctamente'); }
export async function putPurchaseStatus(request, response) { return sendSuccess(response, await receivePurchase(request.params.id, request.query.companyId, request.auth.userId), 'Compra recibida correctamente'); }
