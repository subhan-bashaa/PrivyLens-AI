import pool from '../config/db.js';

export const analysisModel = {
  async create({
    policyVersionId,
    overallScore,
    riskLevel,
    summary,
    dataCollection,
    dataSharing,
    tracking,
    retention,
    userRights,
    security,
    redFlags,
    positiveFindings,
    recommendations,
  }) {
    const query = `
      INSERT INTO policy_analysis (
        policy_version_id, overall_score, risk_level, summary,
        data_collection, data_sharing, tracking, retention,
        user_rights, security, red_flags, positive_findings, recommendations
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [
      policyVersionId,
      overallScore,
      riskLevel,
      summary,
      JSON.stringify(dataCollection || {}),
      JSON.stringify(dataSharing || {}),
      JSON.stringify(tracking || {}),
      JSON.stringify(retention || {}),
      JSON.stringify(userRights || []),
      JSON.stringify(security || []),
      JSON.stringify(redFlags || []),
      JSON.stringify(positiveFindings || []),
      JSON.stringify(recommendations || []),
    ]);
    return rows[0];
  },

  async findByVersionId(versionId) {
    const query = `
      SELECT * FROM policy_analysis
      WHERE policy_version_id = $1;
    `;
    const { rows } = await pool.query(query, [versionId]);
    return rows[0] || null;
  },
};

export default analysisModel;
