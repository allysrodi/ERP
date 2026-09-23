import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../');
dotenv.config({ path: resolve(projectRoot, '.env') });

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
export const clientOrigins = env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);
