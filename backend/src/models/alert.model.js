import pool from '../config/db.js';

export const alertModel = {
  async create({ userId, policyId, type, title, message }) {
    const query = `
      INSERT INTO alerts (user_id, policy_id, type, title, message, is_read)
      VALUES ($1, $2, $3, $4, $5, false)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [userId, policyId, type, title, message]);
    return rows[0];
  },

  async findByUserId(userId, limit = 50, offset = 0) {
    const query = `
      SELECT a.*, p.title as policy_title, p.policy_url
      FROM alerts a
      LEFT JOIN policies p ON a.policy_id = p.id
      WHERE a.user_id = $1
      ORDER BY a.created_at DESC
      LIMIT $2 OFFSET $3;
    `;
    const { rows } = await pool.query(query, [userId, limit, offset]);
    return rows;
  },

  async markAsRead(alertId, userId) {
    const query = `
      UPDATE alerts
      SET is_read = true
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [alertId, userId]);
    return rows[0] || null;
  },

  async markAllAsRead(userId) {
    const query = `
      UPDATE alerts
      SET is_read = true
      WHERE user_id = $1
      RETURNING id;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows.length;
  },

  async delete(alertId, userId) {
    const query = `
      DELETE FROM alerts
      WHERE id = $1 AND user_id = $2
      RETURNING id;
    `;
    const { rows } = await pool.query(query, [alertId, userId]);
    return rows[0] || null;
  },
};

export default alertModel;
