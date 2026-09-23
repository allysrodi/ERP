import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase() {
  if (!env.MONGODB_URI) {
    console.warn('MONGODB_URI no configurada. El backend inicia sin persistencia.');
    return { connected: false, configured: false };
  }

  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  });

  return { connected: true, configured: true };
}

export function getDatabaseStatus() {
  return {
    configured: Boolean(env.MONGODB_URI),
    connected: mongoose.connection.readyState === 1,
    state: mongoose.connection.readyState
  };
}
