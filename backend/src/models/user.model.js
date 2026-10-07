import pool from '../config/db.js';

export const userModel = {
  async create({ name, email, passwordHash }) {
    const query = `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at, updated_at;
    `;
    const { rows } = await pool.query(query, [name.trim(), email.toLowerCase().trim(), passwordHash]);
    return rows[0];
  },

  async findByEmail(email) {
    const query = `
      SELECT id, name, email, password_hash, created_at, updated_at
      FROM users
      WHERE email = $1;
    `;
    const { rows } = await pool.query(query, [email.toLowerCase().trim()]);
    return rows[0] || null;
  },

  async findById(id) {
    const query = `
      SELECT u.id, u.name, u.email, u.avatar_url, u.auth_provider, u.google_id, u.created_at, u.updated_at,
             p.role, p.device_type, p.privacy_preference
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE u.id = $1;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  async findByGoogleId(googleId) {
    const query = `
      SELECT u.id, u.name, u.email, u.avatar_url, u.auth_provider, u.google_id, u.created_at, u.updated_at,
             p.role, p.device_type, p.privacy_preference
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE u.google_id = $1;
    `;
    const { rows } = await pool.query(query, [googleId]);
    return rows[0] || null;
  },

  async createOAuthUser({ name, email, googleId, avatarUrl, authProvider = 'google' }) {
    const query = `
      INSERT INTO users (name, email, google_id, avatar_url, auth_provider)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, avatar_url, auth_provider, created_at, updated_at;
    `;
    const { rows } = await pool.query(query, [
      name.trim(),
      email.toLowerCase().trim(),
      googleId,
      avatarUrl || null,
      authProvider,
    ]);
    return rows[0];
  },

  async linkGoogleAccount(id, { googleId, avatarUrl }) {
    const query = `
      UPDATE users
      SET google_id = COALESCE(google_id, $1),
          avatar_url = COALESCE(avatar_url, $2),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, name, email, avatar_url, auth_provider, updated_at;
    `;
    const { rows } = await pool.query(query, [googleId, avatarUrl || null, id]);
    return rows[0] || null;
  },

  async updatePassword(id, passwordHash) {
    const query = `
      UPDATE users
      SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, name, email, updated_at;
    `;
    const { rows } = await pool.query(query, [passwordHash, id]);
    return rows[0] || null;
  },

  async updateName(id, name) {
    const query = `
      UPDATE users
      SET name = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, name, email, updated_at;
    `;
    const { rows } = await pool.query(query, [name.trim(), id]);
    return rows[0] || null;
  },
};

export default userModel;
