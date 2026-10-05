import { sendSuccess } from '../../utils/apiResponse.js';
import { createExpense, createPayment, listExpenses, listPayments } from './finance.service.js';

export async function postExpense(request, response) { return sendSuccess(response, await createExpense(request.body, request.auth.userId), 'Gasto creado correctamente', 201); }
export async function getExpenses(request, response) { return sendSuccess(response, await listExpenses(request.validated.query), 'Gastos obtenidos correctamente'); }
export async function postPayment(request, response) { return sendSuccess(response, await createPayment(request.body, request.auth.userId), 'Pago creado correctamente', 201); }
export async function getPayments(request, response) { return sendSuccess(response, await listPayments(request.validated.query), 'Pagos obtenidos correctamente'); }
