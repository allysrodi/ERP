import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/appError.js';
import { ensureDatabaseConnection } from '../../utils/databaseGuard.js';
import { User } from './user.model.js';
import { getPermissionsForRole, ROLES } from './permissions.js';

function ensureAuthConfiguration() {
  if (!env.AUTH_JWT_SECRET) {
    throw new AppError('Autenticacion no configurada', 503);
  }
}

function createToken(user) {
  ensureAuthConfiguration();
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.AUTH_JWT_SECRET, { expiresIn: env.AUTH_JWT_EXPIRES_IN });
}

function buildAuthResponse(user) {
  return {
    token: createToken(user),
    user: user.toSafeObject(),
    permissions: getPermissionsForRole(user.role)
  };
}

export async function registerUser(data) {
  ensureAuthConfiguration();
  ensureDatabaseConnection();
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) throw new AppError('El correo ya esta registrado', 409);

  const user = await User.create({ ...data, role: ROLES.EMPLEADO });
  return buildAuthResponse(user);
}

export async function loginUser({ email, password }) {
  ensureAuthConfiguration();
  ensureDatabaseConnection();
  const user = await User.findOne({ email }).select('+password');

  if (!user || user.status !== 'ACTIVE' || !(await user.comparePassword(password))) {
    throw new AppError('Credenciales invalidas', 401);
  }

  user.lastLoginAt = new Date();
  await user.save();
  return buildAuthResponse(user);
}

export async function getUserById(userId) {
  const user = await User.findById(userId);
  if (!user || user.status !== 'ACTIVE') throw new AppError('Usuario no disponible', 401);
  return user;
}
