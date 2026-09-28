import { AuditLog } from '../modules/audit/audit.model.js';
import { getDatabaseStatus } from '../config/database.js';

function moduleFromPath(path) {
  const segment = path.split('/').filter(Boolean)[1] ?? 'SYSTEM';
  return segment.toUpperCase();
}

export function auditWrites(request, response, next) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) return next();

  const originalJson = response.json.bind(response);
  response.json = (body) => {
    const result = originalJson(body);
    const database = getDatabaseStatus();
    const shouldAudit = request.user && !request.auditManaged && response.statusCode < 400 && database.connected;
    if (shouldAudit) {
      const recordId = body?.data?._id ?? body?.data?.id;
      void AuditLog.create({
        companyId: request.user.companyId,
        userId: request.user.userId,
        action: request.method,
        module: moduleFromPath(request.originalUrl),
        recordId,
        changes: { body: request.body }
      }).catch((error) => console.error('No se pudo registrar auditoria:', error.message));
    }
    return result;
  };
  return next();
}
