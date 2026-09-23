export function notFoundHandler(request, response) {
  response.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
}

export function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    return next(error);
  }

  const isMalformedJson = error instanceof SyntaxError && error.status === 400 && error.type === 'entity.parse.failed';
  const statusCode = isMalformedJson ? 400 : (error.statusCode ?? 500);
  if (isMalformedJson) {
    error.message = 'JSON invalido';
    error.isOperational = true;
  }
  const message = error.isOperational ? error.message : 'Error interno del servidor';

  if (statusCode >= 500 && !error.isOperational) {
    console.error(error);
  }

  response.status(statusCode).json({
    success: false,
    message,
    ...(error.details ? { details: error.details } : {}),
    ...(envIsDevelopment() && statusCode >= 500 && !error.isOperational ? { error: error.message } : {})
  });
}

function envIsDevelopment() {
  return process.env.NODE_ENV !== 'production';
}
