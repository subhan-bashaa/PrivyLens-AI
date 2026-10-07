import pool from '../config/db.js';

export const profileModel = {
  async upsert(userId, { role = 'general', deviceType = 'personal', privacyPreference = {} }) {
    const query = `
      INSERT INTO user_profiles (user_id, role, device_type, privacy_preference)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id) DO UPDATE
      SET role = EXCLUDED.role,
          device_type = EXCLUDED.device_type,
          privacy_preference = EXCLUDED.privacy_preference,
          updated_at = CURRENT_TIMESTAMP
      RETURNING id, user_id, role, device_type, privacy_preference, updated_at;
    `;
    const { rows } = await pool.query(query, [
      userId,
      role,
      deviceType,
      JSON.stringify(privacyPreference),
    ]);
    return rows[0];
  },

  async findByUserId(userId) {
    const query = `
      SELECT id, user_id, role, device_type, privacy_preference, created_at, updated_at
      FROM user_profiles
      WHERE user_id = $1;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows[0] || null;
  },
};

export default profileModel;
