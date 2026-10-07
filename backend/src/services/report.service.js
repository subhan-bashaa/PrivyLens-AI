import reportModel from '../models/report.model.js';
import policyModel from '../models/policy.model.js';
import policyVersionModel from '../models/policyVersion.model.js';
import analysisModel from '../models/analysis.model.js';

export const reportService = {
  async generateReport(policyId, userId) {
    const policy = await policyModel.findById(policyId);
    if (!policy || policy.user_id !== userId) {
      const error = new Error('Policy not found or unauthorized.');
      error.statusCode = 404;
      throw error;
    }

    const version = await policyVersionModel.findById(policy.current_version_id);
    const analysis = await analysisModel.findByVersionId(policy.current_version_id);

    if (!analysis) {
      const error = new Error('Policy has not been analyzed yet.');
      error.statusCode = 400;
      throw error;
    }

    const reportUrl = `/reports/${policyId}/export-${Date.now()}.json`;

    const reportRecord = await reportModel.create({
      userId,
      policyId,
      reportUrl,
    });

    return {
      reportId: reportRecord.id,
      generatedAt: reportRecord.created_at,
      reportUrl,
      policy: {
        id: policy.id,
        title: policy.title,
        websiteUrl: policy.website_url,
        policyUrl: policy.policy_url,
        version: version?.version_number || 1,
      },
      audit: {
        score: parseFloat(analysis.overall_score),
        riskLevel: analysis.risk_level,
        summary: analysis.summary,
        pillars: {
          dataCollection: analysis.data_collection,
          dataSharing: analysis.data_sharing,
          tracking: analysis.tracking,
          retention: analysis.retention,
          userRights: analysis.user_rights,
          security: analysis.security,
        },
        redFlags: analysis.red_flags,
        positiveFindings: analysis.positive_findings,
        recommendations: analysis.recommendations,
      },
    };
  },

  async listUserReports(userId) {
    return await reportModel.findByUserId(userId);
  },

  async getReportById(reportId, userId) {
    const report = await reportModel.findById(reportId, userId);
    if (!report) {
      const error = new Error('Report not found.');
      error.statusCode = 404;
      throw error;
    }
    return report;
  },
};

export default reportService;
