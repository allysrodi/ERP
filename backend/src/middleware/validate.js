import { AppError } from '../utils/appError.js';

export function validate(schema, source = 'body') {
  return (request, response, next) => {
    const result = schema.safeParse(request[source]);

    if (!result.success) {
      return next(new AppError('Datos de entrada invalidos', 400, result.error.flatten()));
    }

    request.validated ??= {};
    request.validated[source] = result.data;
    if (source !== 'query') request[source] = result.data;
    return next();
  };
}
