import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { changeUserPassword, forgotPassword, login, profile, register, resetUserPassword } from './auth.controller.js';
import { changePasswordSchema, forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from './auth.validation.js';

const authRouter = Router();
const authRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, message: { success: false, message: 'Demasiados intentos de autenticacion' } });

authRouter.post('/register', validate(registerSchema), asyncHandler(register));
authRouter.post('/login', authRateLimit, validate(loginSchema), asyncHandler(login));
authRouter.get('/me', requireAuth, asyncHandler(profile));
authRouter.post('/change-password', requireAuth, validate(changePasswordSchema), asyncHandler(changeUserPassword));
authRouter.post('/forgot-password', authRateLimit, validate(forgotPasswordSchema), asyncHandler(forgotPassword));
authRouter.post('/reset-password', validate(resetPasswordSchema), asyncHandler(resetUserPassword));

export default authRouter;
