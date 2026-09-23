import { z } from 'zod';

export const echoSchema = z.object({
  message: z.string().trim().min(1).max(200)
});
