/**
 * Server Entry Point
 * Starts the HTTP server after confirming database connectivity.
 */

require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/database');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Test DB before accepting traffic
  await testConnection();

  app.listen(PORT, () => {
    logger.info(`🚀 ESS Promotion API running on port ${PORT}`);
    logger.info(`   Environment : ${process.env.NODE_ENV || 'development'}`);
    logger.info(`   Health check: http://localhost:${PORT}/health`);
    logger.info(`   API base    : http://localhost:${PORT}/api`);
  });
};

startServer().catch((error) => {
  logger.error(`Failed to start server: ${error.message}`);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});
