/**
 * Authentication Middleware
 * Verifies JWT tokens on protected routes.
 * Attaches decoded admin data to req.admin.
 */

const jwt = require('jsonwebtoken');
const { sendUnauthorized } = require('../utils/apiResponse');
const logger = require('../utils/logger');
require('dotenv').config();

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendUnauthorized(res, 'No token provided. Please log in.');
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    logger.warn(`Auth middleware error: ${error.message}`);

    if (error.name === 'TokenExpiredError') {
      return sendUnauthorized(res, 'Session expired. Please log in again.');
    }
    if (error.name === 'JsonWebTokenError') {
      return sendUnauthorized(res, 'Invalid token. Please log in again.');
    }
    return sendUnauthorized(res, 'Authentication failed.');
  }
};

/**
 * Role-based authorization middleware factory.
 * Usage: authorize('ADMIN', 'SUPER_ADMIN')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return sendUnauthorized(res, 'Not authenticated.');
    }

    if (!allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions.',
      });
    }

    next();
  };
};

module.exports = { authenticate, authorize };
