import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

// Workspace-specific values override the root fallback; process.env wins.
dotenv.config({ path: [
  fileURLToPath(new URL('../../.env', import.meta.url)),
  fileURLToPath(new URL('../../../.env', import.meta.url))
] });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CLIENT_ORIGIN: z.string().default('http://localhost:8081'),
  MONGODB_URI: z.string().min(1).optional(),
  AUTH_JWT_SECRET: z.string().min(32).optional(),
  AUTH_JWT_EXPIRES_IN: z.string().default('1h')
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Configuracion de entorno invalida:', parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsedEnv.data;
