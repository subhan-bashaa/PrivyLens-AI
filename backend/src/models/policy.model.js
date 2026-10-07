import pool from '../config/db.js';

export const policyModel = {
  async create({ userId, title, websiteUrl, policyUrl, sourceType = 'url', monitoringEnabled = false }) {
    const query = `
      INSERT INTO policies (user_id, title, website_url, policy_url, source_type, monitoring_enabled)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, user_id, title, website_url, policy_url, source_type, current_version_id, monitoring_enabled, created_at, updated_at;
    `;
    const { rows } = await pool.query(query, [userId, title, websiteUrl, policyUrl, sourceType, monitoringEnabled]);
    return rows[0];
  },

  async updateCurrentVersion(policyId, versionId) {
    const query = `
      UPDATE policies
      SET current_version_id = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [versionId, policyId]);
    return rows[0];
  },

  async findById(policyId) {
    const query = `
      SELECT p.*, pv.version_number, pv.content_hash,
             pa.overall_score, pa.risk_level, pa.summary, pa.data_collection,
             pa.data_sharing, pa.tracking, pa.retention, pa.user_rights,
             pa.security, pa.red_flags, pa.positive_findings, pa.recommendations,
             pa.category_scores, pa.reference_mappings, pa.persona_explanations, pa.evidence_records
      FROM policies p
      LEFT JOIN policy_versions pv ON p.current_version_id = pv.id
      LEFT JOIN policy_analysis pa ON pa.policy_version_id = pv.id
      WHERE p.id = $1;
    `;
    const { rows } = await pool.query(query, [policyId]);
    return rows[0] || null;
  },

  async findByUserId(userId, limit = 50, offset = 0) {
    const query = `
      SELECT p.id, p.title, p.website_url, p.policy_url, p.source_type,
             p.monitoring_enabled, p.created_at, p.updated_at,
             pv.version_number, pa.overall_score, pa.risk_level, pa.summary
      FROM policies p
      LEFT JOIN policy_versions pv ON p.current_version_id = pv.id
      LEFT JOIN policy_analysis pa ON pa.policy_version_id = pv.id
      WHERE p.user_id = $1
      ORDER BY p.updated_at DESC
      LIMIT $2 OFFSET $3;
    `;
    const { rows } = await pool.query(query, [userId, limit, offset]);
    return rows;
  },

  async findPublic(limit = 50, offset = 0) {
    const query = `
      SELECT p.id, p.title, p.website_url, p.policy_url, p.source_type,
             p.monitoring_enabled, p.created_at, p.updated_at,
             pv.version_number, pa.overall_score, pa.risk_level, pa.summary
      FROM policies p
      LEFT JOIN policy_versions pv ON p.current_version_id = pv.id
      LEFT JOIN policy_analysis pa ON pa.policy_version_id = pv.id
      WHERE pa.overall_score IS NOT NULL
      ORDER BY p.updated_at DESC
      LIMIT $1 OFFSET $2;
    `;
    const { rows } = await pool.query(query, [limit, offset]);
    return rows;
  },

  async findByUrl(userId, policyUrl) {
    let query;
    let params;
    if (userId) {
      query = `SELECT * FROM policies WHERE user_id = $1 AND policy_url = $2;`;
      params = [userId, policyUrl];
    } else {
      query = `SELECT * FROM policies WHERE policy_url = $1 ORDER BY updated_at DESC LIMIT 1;`;
      params = [policyUrl];
    }
    const { rows } = await pool.query(query, params);
    return rows[0] || null;
  },

  async findByDomainOrUrl(domain, url) {
    const query = `
      SELECT p.*, pv.version_number, pa.overall_score, pa.risk_level, pa.summary
      FROM policies p
      LEFT JOIN policy_versions pv ON p.current_version_id = pv.id
      LEFT JOIN policy_analysis pa ON pa.policy_version_id = pv.id
      WHERE pa.overall_score IS NOT NULL
        AND (
          p.policy_url = $1
          OR p.website_url ILIKE $2
          OR p.title ILIKE $3
          OR p.policy_url ILIKE $2
        )
      ORDER BY p.updated_at DESC
      LIMIT 1;
    `;
    const domainKeyword = `%${domain}%`;
    const { rows } = await pool.query(query, [url || '', domainKeyword, domainKeyword]);
    return rows[0] || null;
  },

  async delete(policyId, userId) {
    let query;
    let params;
    if (userId) {
      query = `
        DELETE FROM policies
        WHERE id = $1 AND (user_id = $2 OR user_id IS NULL)
        RETURNING id;
      `;
      params = [policyId, userId];
    } else {
      query = `
        DELETE FROM policies
        WHERE id = $1
        RETURNING id;
      `;
      params = [policyId];
    }
    const { rows } = await pool.query(query, params);
    return rows[0] || null;
  },
};

export default policyModel;
