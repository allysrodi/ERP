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
    if (!user.isGlobalAdmin && !user.companyId && request.baseUrl !== '/api/auth') {
      throw new AppError('Tu cuenta necesita una empresa asignada', 403);
    }
    request.user = user;
    request.auth = user;
    scopeCompany(request, user);
    return next();
  } catch (error) {
    if (error instanceof AppError) return next(error);
    return next(new AppError('Token invalido o expirado', 401));
  }
}

function scopeCompany(request, user) {
  const requested = [request.body?.companyId, request.query?.companyId, request.params?.companyId].filter(Boolean);
  if (!user.isGlobalAdmin && requested.some((id) => String(id) !== String(user.companyId ?? ''))) {
    throw new AppError('Empresa no autorizada', 403);
  }
  request.companyScope = user.isGlobalAdmin ? undefined : user.companyId;
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
    const allowedModules = { VENTAS: ['customers', 'sales', 'crm'], COMPRAS: ['suppliers', 'purchases'], ALMACEN: ['products', 'categories', 'warehouses', 'inventory'], FINANZAS: ['finance'], RRHH: ['hr'] };
    const module = request.baseUrl?.split('/').filter(Boolean).at(-1);
    const role = request.auth?.role;
    const moduleAllowed = permission === 'VIEW' || ['ADMIN', 'GERENTE'].includes(role) || allowedModules[role]?.includes(module);
    if (!moduleAllowed || !request.auth?.permissions.includes(permission)) {
      return next(new AppError('Permisos insuficientes', 403));
    }
    return next();
  };
}
