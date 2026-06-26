/**
 * Centralized Error Handling Middleware
 * Catches all unhandled errors and returns consistent JSON responses.
 * Must be registered LAST in Express middleware chain.
 */

const logger = require('../utils/logger');
const { sendError } = require('../utils/apiResponse');

const errorHandler = (err, req, res, _next) => {
  logger.error(`${req.method} ${req.path} - ${err.message}`, { stack: err.stack });

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return sendError(res, `File too large. Maximum size is ${process.env.MAX_FILE_SIZE_MB || 10}MB.`, 400);
  }

  if (err.message && err.message.startsWith('Invalid file type')) {
    return sendError(res, err.message, 400);
  }

  // MySQL duplicate entry
  if (err.code === 'ER_DUP_ENTRY') {
    return sendError(res, 'A record with this value already exists.', 409);
  }

  // JWT errors (fallback)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return sendError(res, 'Authentication error.', 401);
  }

  // Validation errors from express-validator
  if (err.type === 'entity.parse.failed') {
    return sendError(res, 'Invalid JSON in request body.', 400);
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'An internal server error occurred.'
    : err.message || 'An internal server error occurred.';

  return sendError(res, message, statusCode);
};

const notFoundHandler = (req, res) => {
  return sendError(res, `Route ${req.method} ${req.path} not found.`, 404);
};

module.exports = { errorHandler, notFoundHandler };
