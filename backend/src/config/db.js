import pg from 'pg';
import env from './env.js';
import logger from '../utils/logger.js';

const { Pool } = pg;

// Neon PostgreSQL requires SSL connections in production / cloud
const isSslRequired = env.databaseUrl.includes('neon.tech') || env.nodeEnv === 'production';

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: isSslRequired ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
});

pool.on('connect', () => {
  logger.info('Connected to PostgreSQL (Neon) Database');
});

pool.on('error', (err) => {
  logger.error(`Unexpected PostgreSQL client error: ${err.message}`);
});

export async function testDbConnection() {
  try {
    const res = await pool.query('SELECT NOW() as current_time');
    logger.info(`PostgreSQL health check OK. Server time: ${res.rows[0].current_time}`);
    return true;
  } catch (err) {
    logger.error(`PostgreSQL connection failed: ${err.message}`);
    return false;
  }
}

export default pool;
