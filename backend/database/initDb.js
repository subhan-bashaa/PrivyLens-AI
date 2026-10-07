import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../src/config/db.js';
import logger from '../src/utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  logger.info(`Reading schema from: ${schemaPath}`);

  try {
    const sql = fs.readFileSync(schemaPath, 'utf8');
    logger.info('Executing database schema initialization against PostgreSQL...');
    await pool.query(sql);
    logger.info('Database schema initialized successfully!');
    process.exit(0);
  } catch (error) {
    logger.error(`Database initialization failed: ${error.message}`);
    process.exit(1);
  }
}

initDatabase();
