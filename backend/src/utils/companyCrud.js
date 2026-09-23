import { AppError } from './appError.js';
import { ensureDatabaseConnection } from './databaseGuard.js';

export function createCompanyCrud(Model, label) {
  return {
    list: async ({ companyId }) => { ensureDatabaseConnection(); return Model.find({ companyId }).sort({ createdAt: -1 }).limit(100).lean(); },
    create: async (data, userId) => { ensureDatabaseConnection(); return Model.create({ ...data, createdBy: userId, ownerId: data.ownerId ?? userId, responsibleId: data.responsibleId ?? userId }); },
    get: async (id, companyId) => { ensureDatabaseConnection(); const item = await Model.findOne({ _id: id, companyId }).lean(); if (!item) throw new AppError(`${label} no encontrado`, 404); return item; }
  };
}
