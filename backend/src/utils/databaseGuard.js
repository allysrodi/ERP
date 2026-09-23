import { getDatabaseStatus } from '../config/database.js';
import { AppError } from './appError.js';

export function ensureDatabaseConnection() {
  const database = getDatabaseStatus();
  if (!database.configured || !database.connected) {
    throw new AppError('Base de datos no disponible', 503);
  }
}
