import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/appError.js';
import { getPermissionsForRole } from '../modules/auth/permissions.js';

export function requireAuth(request, response, next) {
  const authorization = request.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) {
    return next(new AppError('Autenticacion requerida', 401));
  }

  if (!env.AUTH_JWT_SECRET) {
    return next(new AppError('Autenticacion no configurada', 503));
  }

  try {
    const payload = jwt.verify(authorization.slice(7), env.AUTH_JWT_SECRET);
    request.auth = {
      userId: payload.sub,
      role: payload.role,
      permissions: getPermissionsForRole(payload.role)
    };
    return next();
  } catch {
    return next(new AppError('Token invalido o expirado', 401));
  }
}

export function requireRole(...roles) {
  return (request, response, next) => {
    if (!request.auth || !roles.includes(request.auth.role)) {
      return next(new AppError('Permisos insuficientes', 403));
    }
    return next();
  };
}

export function requirePermission(permission) {
  return (request, response, next) => {
    if (!request.auth?.permissions.includes(permission)) {
      return next(new AppError('Permisos insuficientes', 403));
    }
    return next();
  };
}
