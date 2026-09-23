import { registerUser, loginUser, getUserById } from './auth.service.js';
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
