import pool from '../config/db.js';

export const reportModel = {
  async create({ userId, policyId, reportUrl }) {
    const query = `
      INSERT INTO reports (user_id, policy_id, report_url)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [userId, policyId, reportUrl]);
    return rows[0];
  },

  async findByUserId(userId) {
    const query = `
      SELECT r.*, p.title as policy_title, p.policy_url, p.website_url,
             pa.overall_score, pa.risk_level
      FROM reports r
      JOIN policies p ON r.policy_id = p.id
      LEFT JOIN policy_versions pv ON p.current_version_id = pv.id
      LEFT JOIN policy_analysis pa ON pa.policy_version_id = pv.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  },

  async findById(reportId, userId) {
    const query = `
      SELECT r.*, p.title as policy_title, p.policy_url, p.website_url,
             pa.overall_score, pa.risk_level, pa.summary, pa.data_collection,
             pa.data_sharing, pa.tracking, pa.retention, pa.user_rights,
             pa.security, pa.red_flags, pa.positive_findings, pa.recommendations
      FROM reports r
      JOIN policies p ON r.policy_id = p.id
      LEFT JOIN policy_versions pv ON p.current_version_id = pv.id
      LEFT JOIN policy_analysis pa ON pa.policy_version_id = pv.id
      WHERE r.id = $1 AND r.user_id = $2;
    `;
    const { rows } = await pool.query(query, [reportId, userId]);
    return rows[0] || null;
  },

  async delete(reportId, userId) {
    const query = `
      DELETE FROM reports
      WHERE id = $1 AND user_id = $2
      RETURNING id;
    `;
    const { rows } = await pool.query(query, [reportId, userId]);
    return rows[0] || null;
  },
};

export default reportModel;
