/**
 * News Routes
 * Public:  GET /api/news, GET /api/news/latest, GET /api/news/:id
 * Admin:   POST, PUT, DELETE (protected)
 *
 * IMPORTANT: authenticate MUST come before uploadNews so auth failures
 * are caught before Multer processes any file upload.
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const newsController = require('../controllers/news.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { uploadNews } = require('../config/multer');

// Validation rules
const newsValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required.')
    .isLength({ max: 255 }).withMessage('Title must not exceed 255 characters.'),
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required.'),
];

// ─── Public Routes ────────────────────────────────────────────────────────────
// NOTE: /latest and /count must be defined BEFORE /:id to avoid being caught as params
router.get('/latest', newsController.getLatest);
router.get('/', newsController.getAll);
router.get('/:id', newsController.getById);

// ─── Admin Protected Routes ───────────────────────────────────────────────────
// authenticate FIRST, then uploadNews — this ensures auth errors surface properly
router.post(
  '/',
  authenticate,
  (req, res, next) => {
    uploadNews.single('image')(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  },
  newsValidation,
  validate,
  newsController.create
);

router.put(
  '/:id',
  authenticate,
  (req, res, next) => {
    uploadNews.single('image')(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  },
  newsValidation,
  validate,
  newsController.update
);

router.delete('/:id', authenticate, newsController.delete);

module.exports = router;
