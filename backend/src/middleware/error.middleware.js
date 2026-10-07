import logger from '../utils/logger.js';
import env from '../config/env.js';

// Catch-all for undefined routes
export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Resource not found at ${req.method} ${req.originalUrl}`,
    error: 'NOT_FOUND',
  });
}

// Global centralized error handler
export function errorHandler(err, req, res, next) {
  logger.error(`Unhandled API Error: ${err.message}\nStack: ${err.stack}`);

  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: err.code || err.name || 'INTERNAL_ERROR',
    ...(env.nodeEnv !== 'production' && { stack: err.stack }),
  });
}
