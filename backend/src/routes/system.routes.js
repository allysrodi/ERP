import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { echoSchema } from '../validation/system.schemas.js';
import { sendSuccess } from '../utils/apiResponse.js';

const systemRouter = Router();

systemRouter.post('/echo', validate(echoSchema), (request, response) => {
  return sendSuccess(response, { message: request.body.message }, 'Datos validados correctamente');
});

export default systemRouter;
