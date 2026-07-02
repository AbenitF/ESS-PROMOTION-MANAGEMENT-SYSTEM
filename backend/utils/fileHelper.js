/**
 * File Helper Utility
 * Handles file deletion and path resolution for uploads.
 */

const fs = require('fs');
const path = require('path');
const logger = require('./logger');

/**
 * Delete a file from the filesystem safely.
 * @param {string} filePath - Relative path stored in DB (e.g. "uploads/promotions/file.pdf")
 */
const deleteFile = (filePath) => {
  if (!filePath) return;

  const absolutePath = path.join(__dirname, '..', filePath);

  fs.unlink(absolutePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      logger.warn(`Failed to delete file: ${absolutePath} - ${err.message}`);
    } else if (!err) {
      logger.info(`Deleted file: ${absolutePath}`);
    }
  });
};

/**
 * Build a public URL for a stored file.
 * @param {object} req - Express request object
 * @param {string} filePath - Relative path stored in DB
 */
const buildFileUrl = (req, filePath) => {
  if (!filePath) return null;
  const normalized = filePath.replace(/\\/g, '/');
  return `${req.protocol}://${req.get('host')}/${normalized}`;
};

/**
 * Ensure an upload directory exists.
 * @param {string} dirPath - Absolute path
 */
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

module.exports = { deleteFile, buildFileUrl, ensureDir };
