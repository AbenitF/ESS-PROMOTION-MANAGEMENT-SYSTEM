/**

 * Promotion Routes

 * Public:  GET /api/promotions, /api/promotions/latest, /api/promotions/departments, /api/promotions/:id

 * Admin:   POST, PUT, DELETE, /admin/stats (protected)

 *

 * IMPORTANT: authenticate MUST come before uploadPromotion middleware.

 */



const express = require('express');

const { body } = require('express-validator');

const router = express.Router();



const promotionController = require('../controllers/promotion.controller');

const { authenticate } = require('../middleware/auth.middleware');

const { validate } = require('../middleware/validate.middleware');

const { uploadPromotion } = require('../config/multer');



// Validation rules

const promotionValidation = [

  body('title')

    .trim()

    .notEmpty().withMessage('Title is required.')

    .isLength({ max: 255 }).withMessage('Title must not exceed 255 characters.'),

  body('department')

    .trim()

    .notEmpty().withMessage('Department is required.')

    .isLength({ max: 100 }).withMessage('Department name too long.'),

  body('description')

    .trim()

    .notEmpty().withMessage('Description is required.'),

  body('publish_date')

    .notEmpty().withMessage('Publish date is required.')

    .isDate().withMessage('Publish date must be a valid date.'),

  body('deadline')

    .optional({ nullable: true, checkFalsy: true })

    .isDate().withMessage('Deadline must be a valid date.'),

  body('status')

    .optional()

    .isIn(['active', 'expired', 'draft']).withMessage('Status must be active, expired, or draft.'),

];



// ─── Public Routes ────────────────────────────────────────────────────────────

// Static paths must come BEFORE /:id to avoid being matched as param

router.get('/latest',      promotionController.getLatest);

router.get('/departments', promotionController.getDepartments);

router.get('/',            promotionController.getAll);

router.get('/:id/download', promotionController.downloadAttachment);

router.get('/:id',         promotionController.getById);



// ─── Admin Protected Routes ───────────────────────────────────────────────────

router.get('/admin/stats', authenticate, promotionController.getStats);



router.post(

  '/',

  authenticate,

  (req, res, next) => {

    uploadPromotion.single('attachment')(req, res, (err) => {

      if (err) return next(err);

      next();

    });

  },

  promotionValidation,

  validate,

  promotionController.create

);



router.put(

  '/:id',

  authenticate,

  (req, res, next) => {

    uploadPromotion.single('attachment')(req, res, (err) => {

      if (err) return next(err);

      next();

    });

  },

  promotionValidation,

  validate,

  promotionController.update

);



router.delete('/:id', authenticate, promotionController.delete);



module.exports = router;


