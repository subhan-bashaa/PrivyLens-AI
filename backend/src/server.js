import app from './app.js';
import env from './config/env.js';
import logger from './utils/logger.js';
import { testDbConnection } from './config/db.js';
import { testChromaConnection } from './config/chroma.js';
import { initPolicyMonitorJob } from './jobs/policyMonitor.job.js';

const PORT = env.port;

async function startServer() {
  logger.info('Starting PrivyLens AI Backend Services...');

  // 1. Verify Database Connection
  const isDbConnected = await testDbConnection();
  if (!isDbConnected) {
    logger.warn('⚠️ PostgreSQL connection failed. Ensure DATABASE_URL is properly configured in .env.');
  }

  // 2. Verify ChromaDB Vector Store
  await testChromaConnection();

  // 3. Initialize Scheduled Policy Monitoring Cron Job
  initPolicyMonitorJob();

  // 4. Start Express HTTP Server
  const server = app.listen(PORT, () => {
    logger.info(`🚀 PrivyLens AI Server listening on http://localhost:${PORT}`);
    logger.info(`🛡️ Environment: ${env.nodeEnv}`);
    logger.info(`📡 Client Origin: ${env.clientUrl}`);
  });

  // Graceful shutdown handling
  const shutdown = () => {
    logger.info('Shutting down PrivyLens AI Server gracefully...');
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer();
