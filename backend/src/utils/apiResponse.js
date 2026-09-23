export function sendSuccess(response, data, message = 'Operacion realizada correctamente', statusCode = 200) {
  return response.status(statusCode).json({
    success: true,
    data,
    message
  });
}

export function sendError(response, message, statusCode = 400, error) {
  return response.status(statusCode).json({
    success: false,
    message,
    ...(error ? { error } : {})
  });
}
