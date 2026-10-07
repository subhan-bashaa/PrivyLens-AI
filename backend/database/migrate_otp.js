import pool from '../src/config/db.js';
import logger from '../src/utils/logger.js';

async function migrateOtp() {
  try {
    logger.info('Creating password_reset_otps table in PostgreSQL...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_reset_otps (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(10) NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        consumed BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_reset_otps_email ON password_reset_otps(email);
    `);

    logger.info('password_reset_otps table successfully created/verified!');
    process.exit(0);
  } catch (error) {
    logger.error('Failed to create password_reset_otps table:', error);
    process.exit(1);
  }
}

migrateOtp();
