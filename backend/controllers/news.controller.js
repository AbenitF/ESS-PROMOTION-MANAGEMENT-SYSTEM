/**

 * News Controller

 * Handles all news CRUD operations and image management.

 */



const NewsModel = require('../models/News.model');

const { sendSuccess, sendCreated, sendError, sendNotFound } = require('../utils/apiResponse');

const { deleteFile, buildFileUrl } = require('../utils/fileHelper');

const logger = require('../utils/logger');



const newsController = {

  /**

   * GET /api/news

   * Public: list news with search and pagination.

   */

  getAll: async (req, res) => {

    try {

      const { search = '', page = 1, limit = 10 } = req.query;



      const result = await NewsModel.findAll({

        search: search.trim(),

        page: parseInt(page),

        limit: Math.min(parseInt(limit), 50),

      });



      result.news = result.news.map((n) => ({

        ...n,

        image_url: n.image_path ? buildFileUrl(req, n.image_path) : null,

      }));



      return sendSuccess(res, 'News retrieved successfully.', result);

    } catch (error) {

      logger.error(`Get news error: ${error.message}`);

      return sendError(res, 'Failed to retrieve news.');

    }

  },



  /**

   * GET /api/news/latest

   * Public: latest news for home page.

   */

  getLatest: async (req, res) => {

    try {

      const limit = parseInt(req.query.limit) || 4;

      const news = await NewsModel.getLatest(limit);

      const withUrls = news.map((n) => ({

        ...n,

        image_url: n.image_path ? buildFileUrl(req, n.image_path) : null,

      }));

      return sendSuccess(res, 'Latest news retrieved.', withUrls);

    } catch (error) {

      logger.error(`Get latest news error: ${error.message}`);

      return sendError(res, 'Failed to retrieve latest news.');

    }

  },



  /**

   * GET /api/news/:id

   * Public: single news article.

   */

  getById: async (req, res) => {

    try {

      const news = await NewsModel.findById(req.params.id);

      if (!news) {

        return sendNotFound(res, 'News article not found.');

      }



      news.image_url = news.image_path ? buildFileUrl(req, news.image_path) : null;

      return sendSuccess(res, 'News article retrieved successfully.', news);

    } catch (error) {

      logger.error(`Get news by ID error: ${error.message}`);

      return sendError(res, 'Failed to retrieve news article.');

    }

  },



  /**

   * POST /api/news

   * Admin: create news article.

   */

  create: async (req, res) => {

    try {

      const { title, content } = req.body;

      const image_path = req.file ? `uploads/news/${req.file.filename}` : null;



      const id = await NewsModel.create({ title, content, image_path });

      const news = await NewsModel.findById(id);

      news.image_url = news.image_path ? buildFileUrl(req, news.image_path) : null;



      logger.info(`News created: ID ${id} by admin ${req.admin.username}`);

      return sendCreated(res, 'News article created successfully.', news);

    } catch (error) {

      if (req.file) deleteFile(`uploads/news/${req.file.filename}`);

      logger.error(`Create news error: ${error.message}`);

      return sendError(res, 'Failed to create news article.');

    }

  },



  /**

   * PUT /api/news/:id

   * Admin: update a news article.

   */

  update: async (req, res) => {

    try {

      const news = await NewsModel.findById(req.params.id);

      if (!news) {

        if (req.file) deleteFile(`uploads/news/${req.file.filename}`);

        return sendNotFound(res, 'News article not found.');

      }



      const { title, content } = req.body;



      let image_path = news.image_path;

      if (req.file) {

        if (news.image_path) deleteFile(news.image_path);

        image_path = `uploads/news/${req.file.filename}`;

      }



      if (req.body.remove_image === 'true') {

        if (news.image_path) deleteFile(news.image_path);

        image_path = null;

      }



      await NewsModel.update(req.params.id, { title, content, image_path });

      const updated = await NewsModel.findById(req.params.id);

      updated.image_url = updated.image_path ? buildFileUrl(req, updated.image_path) : null;



      logger.info(`News updated: ID ${req.params.id} by admin ${req.admin.username}`);

      return sendSuccess(res, 'News article updated successfully.', updated);

    } catch (error) {

      if (req.file) deleteFile(`uploads/news/${req.file.filename}`);

      logger.error(`Update news error: ${error.message}`);

      return sendError(res, 'Failed to update news article.');

    }

  },



  /**

   * DELETE /api/news/:id

   * Admin: delete a news article and its image.

   */

  delete: async (req, res) => {

    try {

      const news = await NewsModel.findById(req.params.id);

      if (!news) {

        return sendNotFound(res, 'News article not found.');

      }



      if (news.image_path) deleteFile(news.image_path);

      await NewsModel.delete(req.params.id);



      logger.info(`News deleted: ID ${req.params.id} by admin ${req.admin.username}`);

      return sendSuccess(res, 'News article deleted successfully.');

    } catch (error) {

      logger.error(`Delete news error: ${error.message}`);

      return sendError(res, 'Failed to delete news article.');

    }

  },

};



module.exports = newsController;

