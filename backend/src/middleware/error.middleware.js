import { sendError } from '../utils/response.js';
import { env } from '../config/env.js';

export const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (statusCode >= 500) {
    console.error('Server Error:', err);
  }

  return sendError(
    res,
    message,
    statusCode,
    env.NODE_ENV === 'development' && statusCode >= 500 ? err.stack : undefined
  );
};

export const notFoundHandler = (req, res) => {
  return sendError(res, `Route ${req.originalUrl} not found`, 404);
};
