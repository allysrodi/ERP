import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
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
  return jwt.sign({ sub: user._id.toString(), role: user.role, companyId: user.companyId?.toString() }, env.AUTH_JWT_SECRET, { expiresIn: env.AUTH_JWT_EXPIRES_IN });
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

  if (!user || user.status !== 'ACTIVE') throw new AppError('Credenciales invalidas', 401);
  if (user.lockUntil && user.lockUntil > new Date()) throw new AppError('Cuenta bloqueada temporalmente', 423);
  if (!(await user.comparePassword(password))) {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= 5) { user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); user.failedLoginAttempts = 0; }
    await user.save();
    throw new AppError('Credenciales invalidas', 401);
  }

  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  user.lastLoginAt = new Date();
  await user.save();
  return buildAuthResponse(user);
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  ensureDatabaseConnection();
  const user = await User.findById(userId).select('+password');
  if (!user || !(await user.comparePassword(currentPassword))) throw new AppError('Credenciales invalidas', 401);
  user.password = newPassword;
  await user.save();
}

export async function requestPasswordReset(email) {
  ensureDatabaseConnection();
  const user = await User.findOne({ email });
  if (!user) return;
  const token = crypto.randomBytes(32).toString('hex');
  user.passwordResetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
  user.passwordResetExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();
}

export async function resetPassword({ token, newPassword }) {
  ensureDatabaseConnection();
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({ passwordResetTokenHash: tokenHash, passwordResetExpiresAt: { $gt: new Date() } }).select('+password');
  if (!user) throw new AppError('Token de recuperacion invalido o expirado', 400);
  user.password = newPassword;
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpiresAt = undefined;
  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();
}

export async function getUserById(userId) {
  const user = await User.findById(userId);
  if (!user || user.status !== 'ACTIVE') throw new AppError('Usuario no disponible', 401);
  return user;
}
