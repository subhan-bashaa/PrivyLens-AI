import pool from '../config/db.js';

export const policyVersionModel = {
  async create({ policyId, versionNumber, contentHash, extractedText }) {
    const query = `
      INSERT INTO policy_versions (policy_id, version_number, content_hash, extracted_text)
      VALUES ($1, $2, $3, $4)
      RETURNING id, policy_id, version_number, content_hash, created_at;
    `;
    const { rows } = await pool.query(query, [policyId, versionNumber, contentHash, extractedText]);
    return rows[0];
  },

  async findByPolicyId(policyId) {
    const query = `
      SELECT pv.id, pv.version_number, pv.content_hash, pv.created_at,
             pa.overall_score, pa.risk_level
      FROM policy_versions pv
      LEFT JOIN policy_analysis pa ON pa.policy_version_id = pv.id
      WHERE pv.policy_id = $1
      ORDER BY pv.version_number DESC;
    `;
    const { rows } = await pool.query(query, [policyId]);
    return rows;
  },

  async findById(versionId) {
    const query = `
      SELECT * FROM policy_versions
      WHERE id = $1;
    `;
    const { rows } = await pool.query(query, [versionId]);
    return rows[0] || null;
  },

  async getLatestVersion(policyId) {
    const query = `
      SELECT * FROM policy_versions
      WHERE policy_id = $1
      ORDER BY version_number DESC
      LIMIT 1;
    `;
    const { rows } = await pool.query(query, [policyId]);
    return rows[0] || null;
  },
};

export default policyVersionModel;
