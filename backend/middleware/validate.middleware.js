/**
 * Validation Middleware
 * Runs express-validator result check and returns errors in standard format.
 */

const { validationResult } = require('express-validator');
const { sendValidationError } = require('../utils/apiResponse');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return sendValidationError(res, formattedErrors);
  }
  next();
};

module.exports = { validate };
