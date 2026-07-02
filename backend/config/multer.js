/**
 * Multer Configuration
 * Separate upload configs for promotion documents and news images.
 * Validates file type and enforces size limits.
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const MAX_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB) || 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

// Ensure upload directories exist
const promotionUploadsDir = path.join(__dirname, '..', 'uploads', 'promotions');
const newsUploadsDir = path.join(__dirname, '..', 'uploads', 'news');

[promotionUploadsDir, newsUploadsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// --- Promotion Documents Storage ---
const promotionStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, promotionUploadsDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `promotion-${uniqueSuffix}${ext}`);
  },
});

const promotionFileFilter = (_req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed for promotion documents.'), false);
  }
};

const uploadPromotion = multer({
  storage: promotionStorage,
  fileFilter: promotionFileFilter,
  limits: { fileSize: MAX_SIZE_BYTES },
});

// --- News Images Storage ---
const newsStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, newsUploadsDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `news-${uniqueSuffix}${ext}`);
  },
});

const newsFileFilter = (_req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed.'), false);
  }
};

const uploadNews = multer({
  storage: newsStorage,
  fileFilter: newsFileFilter,
  limits: { fileSize: MAX_SIZE_BYTES },
});

module.exports = { uploadPromotion, uploadNews };
