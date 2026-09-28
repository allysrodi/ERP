import { changePassword, registerUser, loginUser, getUserById, requestPasswordReset, resetPassword } from './auth.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export async function register(request, response) {
  const result = await registerUser(request.body);
  return sendSuccess(response, result, 'Usuario registrado correctamente', 201);
}

export async function login(request, response) {
  const result = await loginUser(request.body);
  return sendSuccess(response, result, 'Inicio de sesion correcto');
}

export async function profile(request, response) {
  const user = await getUserById(request.auth.userId);
  return sendSuccess(response, { user: user.toSafeObject() }, 'Perfil obtenido correctamente');
}

export async function changeUserPassword(request, response) { await changePassword(request.user.userId, request.body); return sendSuccess(response, null, 'Contrasena actualizada correctamente'); }
export async function forgotPassword(request, response) { await requestPasswordReset(request.body.email); return sendSuccess(response, null, 'Si el correo existe, recibira instrucciones de recuperacion'); }
export async function resetUserPassword(request, response) { await resetPassword(request.body); return sendSuccess(response, null, 'Contrasena recuperada correctamente'); }
