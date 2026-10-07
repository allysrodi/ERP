import { sendSuccess } from '../../utils/apiResponse.js';
import {
  listInventory,
  listMovements,
  registerMovement
} from './inventory.service.js';

export async function getInventory(request, response) {
  const query = request.validated?.query ?? request.query;

  return sendSuccess(
    response,
    await listInventory(query),
    'Inventario obtenido correctamente'
  );
}

export async function postMovement(request, response) {
  return sendSuccess(
    response,
    await registerMovement(
      request.body,
      request.auth.userId
    ),
    'Movimiento registrado correctamente',
    201
  );
}

export async function getMovements(request, response) {
  const query = request.validated?.query ?? request.query;

  return sendSuccess(
    response,
    await listMovements(query),
    'Movimientos obtenidos correctamente'
  );
}