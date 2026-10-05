import { sendSuccess } from '../../utils/apiResponse.js';
import { listInventory, listMovements, registerMovement } from './inventory.service.js';

export async function getInventory(request, response) { return sendSuccess(response, await listInventory(request.validated.query), 'Inventario obtenido correctamente'); }
export async function postMovement(request, response) { return sendSuccess(response, await registerMovement(request.body, request.auth.userId), 'Movimiento registrado correctamente', 201); }
export async function getMovements(request, response) { return sendSuccess(response, await listMovements(request.validated.query), 'Movimientos obtenidos correctamente'); }
