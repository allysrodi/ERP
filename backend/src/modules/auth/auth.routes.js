import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { login, profile, register } from './auth.controller.js';
import { loginSchema, registerSchema } from './auth.validation.js';

const authRouter = Router();
const authRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, message: { success: false, message: 'Demasiados intentos de autenticacion' } });

authRouter.post('/register', validate(registerSchema), asyncHandler(register));
authRouter.post('/login', authRateLimit, validate(loginSchema), asyncHandler(login));
authRouter.get('/me', requireAuth, asyncHandler(profile));

export default authRouter;
