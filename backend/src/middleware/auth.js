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
    const user = {
      userId: payload.sub,
      role: payload.role,
      companyId: payload.companyId,
      permissions: getPermissionsForRole(payload.role),
      isGlobalAdmin: payload.role === 'ADMIN' && !payload.companyId
    };
    request.user = user;
    request.auth = user;
    scopeCompany(request, user);
    return next();
  } catch {
    return next(new AppError('Token invalido o expirado', 401));
  }
}

function scopeCompany(request, user) {
  const requestedCompanyId = request.body?.companyId ?? request.query?.companyId ?? request.params?.companyId;
  const companyId = user.isGlobalAdmin ? requestedCompanyId : user.companyId;
  if (companyId) {
    if (request.body) request.body.companyId = companyId;
    if (request.query) request.query.companyId = companyId;
    if (request.params?.companyId) request.params.companyId = companyId;
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
