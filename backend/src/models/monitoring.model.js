import pool from '../config/db.js';

export const monitoringModel = {
  async upsert({ policyId, frequency = 'weekly', enabled = true }) {
    const query = `
      INSERT INTO monitoring (policy_id, frequency, enabled, last_checked)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (policy_id) DO UPDATE
      SET frequency = EXCLUDED.frequency,
          enabled = EXCLUDED.enabled,
          last_checked = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [policyId, frequency, enabled]);
    return rows[0];
  },

  async disable(policyId) {
    const query = `
      UPDATE monitoring
      SET enabled = false
      WHERE policy_id = $1
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [policyId]);
    return rows[0] || null;
  },

  async findByPolicyId(policyId) {
    const query = `
      SELECT m.*, p.title as policy_title, p.policy_url, p.user_id
      FROM monitoring m
      JOIN policies p ON m.policy_id = p.id
      WHERE m.policy_id = $1;
    `;
    const { rows } = await pool.query(query, [policyId]);
    return rows[0] || null;
  },

  async getActiveMonitoringList() {
    const query = `
      SELECT m.*, p.title as policy_title, p.policy_url, p.user_id,
             u.email as user_email, u.name as user_name,
             pv.content_hash, pv.version_number
      FROM monitoring m
      JOIN policies p ON m.policy_id = p.id
      JOIN users u ON p.user_id = u.id
      LEFT JOIN policy_versions pv ON p.current_version_id = pv.id
      WHERE m.enabled = true;
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  async updateLastChecked(policyId, hasChanged = false) {
    const query = `
      UPDATE monitoring
      SET last_checked = CURRENT_TIMESTAMP,
          last_changed = CASE WHEN $2 THEN CURRENT_TIMESTAMP ELSE last_changed END
      WHERE policy_id = $1
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [policyId, hasChanged]);
    return rows[0];
  },

  async findByUserId(userId) {
    const query = `
      SELECT m.*, p.title as policy_title, p.website_url, p.policy_url,
             pa.overall_score, pa.risk_level
      FROM monitoring m
      JOIN policies p ON m.policy_id = p.id
      LEFT JOIN policy_versions pv ON p.current_version_id = pv.id
      LEFT JOIN policy_analysis pa ON pa.policy_version_id = pv.id
      WHERE p.user_id = $1
      ORDER BY m.created_at DESC;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  },
};

export default monitoringModel;
