/**
 * Promotion Controller
 * Handles all promotion CRUD operations and file downloads.
 */

const path = require('path');
const PromotionModel = require('../models/Promotion.model');
const { sendSuccess, sendCreated, sendError, sendNotFound } = require('../utils/apiResponse');
const { deleteFile, buildFileUrl } = require('../utils/fileHelper');
const logger = require('../utils/logger');

const promotionController = {
  /**
   * GET /api/promotions
   * Public: list promotions with search, filter, pagination.
   */
  getAll: async (req, res) => {
    try {
      const { search = '', department = '', status = '', page = 1, limit = 10 } = req.query;

      const result = await PromotionModel.findAll({
        search: search.trim(),
        department: department.trim(),
        status: status.trim(),
        page: parseInt(page),
        limit: Math.min(parseInt(limit), 50), // cap at 50
      });

      // Append file URLs
      result.promotions = result.promotions.map((p) => ({
        ...p,
        attachment_url: p.attachment_path ? buildFileUrl(req, p.attachment_path) : null,
      }));

      return sendSuccess(res, 'Promotions retrieved successfully.', result);
    } catch (error) {
      logger.error(`Get promotions error: ${error.message}`);
      return sendError(res, 'Failed to retrieve promotions.');
    }
  },

  /**
   * GET /api/promotions/departments
   * Public: list distinct departments for filter dropdown.
   */
  getDepartments: async (req, res) => {
    try {
      const departments = await PromotionModel.getDepartments();
      return sendSuccess(res, 'Departments retrieved successfully.', departments);
    } catch (error) {
      logger.error(`Get departments error: ${error.message}`);
      return sendError(res, 'Failed to retrieve departments.');
    }
  },

  /**
   * GET /api/promotions/latest
   * Public: latest active promotions for home page.
   */
  getLatest: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 6;
      const promotions = await PromotionModel.getLatest(limit);
      const withUrls = promotions.map((p) => ({
        ...p,
        attachment_url: p.attachment_path ? buildFileUrl(req, p.attachment_path) : null,
      }));
      return sendSuccess(res, 'Latest promotions retrieved.', withUrls);
    } catch (error) {
      logger.error(`Get latest promotions error: ${error.message}`);
      return sendError(res, 'Failed to retrieve latest promotions.');
    }
  },

  /**
   * GET /api/promotions/:id
   * Public: single promotion detail.
   */
  getById: async (req, res) => {
    try {
      const promotion = await PromotionModel.findById(req.params.id);
      if (!promotion) {
        return sendNotFound(res, 'Promotion not found.');
      }

      promotion.attachment_url = promotion.attachment_path
        ? buildFileUrl(req, promotion.attachment_path)
        : null;

      return sendSuccess(res, 'Promotion retrieved successfully.', promotion);
    } catch (error) {
      logger.error(`Get promotion by ID error: ${error.message}`);
      return sendError(res, 'Failed to retrieve promotion.');
    }
  },

  /**
   * POST /api/promotions
   * Admin: create a new promotion.
   */
  create: async (req, res) => {
    try {
      const { title, department, description, requirements, publish_date, deadline, status } = req.body;
      const attachment_path = req.file
        ? `uploads/promotions/${req.file.filename}`
        : null;

      const id = await PromotionModel.create({
        title,
        department,
        description,
        requirements,
        attachment_path,
        publish_date,
        deadline: deadline || null,
        status: status || 'active',
      });

      const promotion = await PromotionModel.findById(id);
      promotion.attachment_url = promotion.attachment_path
        ? buildFileUrl(req, promotion.attachment_path)
        : null;

      logger.info(`Promotion created: ID ${id} by admin ${req.admin.username}`);
      return sendCreated(res, 'Promotion created successfully.', promotion);
    } catch (error) {
      // Clean up uploaded file on error
      if (req.file) deleteFile(`uploads/promotions/${req.file.filename}`);
      logger.error(`Create promotion error: ${error.message}`);
      return sendError(res, 'Failed to create promotion.');
    }
  },

  /**
   * PUT /api/promotions/:id
   * Admin: update a promotion.
   */
  update: async (req, res) => {
    try {
      const promotion = await PromotionModel.findById(req.params.id);
      if (!promotion) {
        if (req.file) deleteFile(`uploads/promotions/${req.file.filename}`);
        return sendNotFound(res, 'Promotion not found.');
      }

      const { title, department, description, requirements, publish_date, deadline, status } = req.body;

      // If new file uploaded, delete old file
      let attachment_path = promotion.attachment_path;
      if (req.file) {
        if (promotion.attachment_path) deleteFile(promotion.attachment_path);
        attachment_path = `uploads/promotions/${req.file.filename}`;
      }

      // Allow removing attachment
      if (req.body.remove_attachment === 'true') {
        if (promotion.attachment_path) deleteFile(promotion.attachment_path);
        attachment_path = null;
      }

      await PromotionModel.update(req.params.id, {
        title,
        department,
        description,
        requirements,
        attachment_path,
        publish_date,
        deadline: deadline || null,
        status,
      });

      const updated = await PromotionModel.findById(req.params.id);
      updated.attachment_url = updated.attachment_path
        ? buildFileUrl(req, updated.attachment_path)
        : null;

      logger.info(`Promotion updated: ID ${req.params.id} by admin ${req.admin.username}`);
      return sendSuccess(res, 'Promotion updated successfully.', updated);
    } catch (error) {
      if (req.file) deleteFile(`uploads/promotions/${req.file.filename}`);
      logger.error(`Update promotion error: ${error.message}`);
      return sendError(res, 'Failed to update promotion.');
    }
  },

  /**
   * DELETE /api/promotions/:id
   * Admin: delete a promotion and its attached file.
   */
  delete: async (req, res) => {
    try {
      const promotion = await PromotionModel.findById(req.params.id);
      if (!promotion) {
        return sendNotFound(res, 'Promotion not found.');
      }

      if (promotion.attachment_path) {
        deleteFile(promotion.attachment_path);
      }

      await PromotionModel.delete(req.params.id);

      logger.info(`Promotion deleted: ID ${req.params.id} by admin ${req.admin.username}`);
      return sendSuccess(res, 'Promotion deleted successfully.');
    } catch (error) {
      logger.error(`Delete promotion error: ${error.message}`);
      return sendError(res, 'Failed to delete promotion.');
    }
  },

  /**
   * GET /api/promotions/stats
   * Admin: dashboard statistics.
   */
  getStats: async (req, res) => {
    try {
      const stats = await PromotionModel.getStats();
      return sendSuccess(res, 'Statistics retrieved successfully.', stats);
    } catch (error) {
      logger.error(`Get stats error: ${error.message}`);
      return sendError(res, 'Failed to retrieve statistics.');
    }
  },

  /**
   * GET /api/promotions/:id/download
   * Public: stream/download promotion attachment.
   */
  downloadAttachment: async (req, res) => {
    try {
      const promotion = await PromotionModel.findById(req.params.id);
      if (!promotion || !promotion.attachment_path) {
        return sendNotFound(res, 'Attachment not found.');
      }

      const filePath = path.join(__dirname, '..', promotion.attachment_path);
      return res.download(filePath, path.basename(promotion.attachment_path), (err) => {
        if (err) {
          logger.error(`Download error: ${err.message}`);
          return sendError(res, 'Failed to download file.');
        }
      });
    } catch (error) {
      logger.error(`Download attachment error: ${error.message}`);
      return sendError(res, 'Failed to download attachment.');
    }
  },
};

module.exports = promotionController;
