import policyService from '../services/policy.service.js';

// Helper to guarantee rich structured summary and normalized domains
function formatPolicyForResponse(policy) {
  if (!policy) return null;

  const pe = policy.persona_explanations || {};
  const structuredSummary = pe.structured_summary || {
    data_collected: Array.isArray(policy.data_collection) ? policy.data_collection.join(', ') : policy.data_collection?.summary || 'Personal identifiers and usage telemetry.',
    purpose_of_data_use: pe.student?.personaQuestions?.whyDoesItCollect || pe.general?.personaQuestions?.whyDoesItCollect || 'To provide, maintain, and secure online platform services.',
    data_sharing: Array.isArray(policy.data_sharing) ? policy.data_sharing.join(', ') : policy.data_sharing?.summary || pe.student?.personaQuestions?.whoReceivesIt || 'Authorized service providers and regulatory compliance.',
    data_retention: policy.retention?.duration_statement || policy.retention?.summary || pe.student?.personaQuestions?.howLongKept || 'Retained as needed for core service delivery.',
    user_rights: Array.isArray(policy.user_rights) ? policy.user_rights.join(', ') : policy.user_rights?.summary || pe.student?.personaQuestions?.whatRightsDoIHave || 'Access, correction, and consent withdrawal rights.',
    security: Array.isArray(policy.security) ? policy.security.join(', ') : policy.security?.summary || 'Standard data encryption and storage safeguards.',
    other_important_points: pe.other_important_points?.summary || 'Minimum age criteria, dispute processes, and policy update notifications.',
  };

  const executiveSynthesis = pe.executive_synthesis || {
    verdict: policy.risk_level === 'Low' ? 'Safe to Use' : policy.risk_level === 'High' ? 'High Risk Profile' : 'Proceed with Caution',
    verdict_summary: policy.summary?.split('\n')?.[0] || 'Evaluate personal data collection and third-party data broker sharing before agreeing.',
    data_processing_purpose: structuredSummary.purpose_of_data_use,
    third_party_scope: structuredSummary.data_sharing,
  };

  const normDataCollection = Array.isArray(policy.data_collection)
    ? { summary: structuredSummary.data_collected, collected_items: policy.data_collection }
    : (policy.data_collection && typeof policy.data_collection === 'object' && policy.data_collection.collected_items)
    ? policy.data_collection
    : { summary: structuredSummary.data_collected, collected_items: [] };

  const normDataSharing = Array.isArray(policy.data_sharing)
    ? { summary: structuredSummary.data_sharing, sharing_recipients: policy.data_sharing }
    : (policy.data_sharing && typeof policy.data_sharing === 'object' && policy.data_sharing.sharing_recipients)
    ? policy.data_sharing
    : { summary: structuredSummary.data_sharing, sharing_recipients: [] };

  const normTracking = Array.isArray(policy.tracking)
    ? { summary: (policy.tracking || []).join(', ') || 'Session cookies and analytics beacons.', methods: policy.tracking }
    : (policy.tracking && typeof policy.tracking === 'object' && policy.tracking.methods)
    ? policy.tracking
    : { summary: 'Cookies and telemetry tracking active.', methods: [] };

  const normRetention = (policy.retention && policy.retention.policies)
    ? policy.retention
    : {
        summary: structuredSummary.data_retention,
        policies: [policy.retention?.duration_statement || 'Active account lifecycle'],
      };

  const normUserRights = Array.isArray(policy.user_rights)
    ? { summary: structuredSummary.user_rights, rights_list: policy.user_rights }
    : (policy.user_rights && typeof policy.user_rights === 'object' && policy.user_rights.rights_list)
    ? policy.user_rights
    : { summary: structuredSummary.user_rights, rights_list: [] };

  const normSecurity = Array.isArray(policy.security)
    ? { summary: structuredSummary.security, measures: policy.security }
    : (policy.security && typeof policy.security === 'object' && policy.security.measures)
    ? policy.security
    : { summary: structuredSummary.security, measures: [] };

  const normOther = pe.other_important_points || {
    summary: structuredSummary.other_important_points,
    points: ['Age limit compliance (13+)', 'Policy update notifications'],
  };

  return {
    ...policy,
    structured_summary: structuredSummary,
    executive_synthesis: executiveSynthesis,
    data_collection: normDataCollection,
    data_sharing: normDataSharing,
    tracking: normTracking,
    retention: normRetention,
    user_rights: normUserRights,
    security: normSecurity,
    other_important_points: normOther,
  };
}

export const policyController = {
  // POST /api/policies/analyze
  async analyze(req, res, next) {
    try {
      const { url, text, role } = req.body;
      const userId = req.user?.id || null;
      const userRole = role || req.user?.role || 'general';

      const result = await policyService.analyzePolicy({
        userId,
        url,
        text,
        userRole,
      });

      return res.status(200).json({
        success: true,
        message: 'Policy analysis completed successfully.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/policies/upload-pdf
  async uploadPdf(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No PDF file uploaded. Please attach a PDF document with field "file".',
          error: 'FILE_MISSING',
        });
      }

      const { role } = req.body;
      const userId = req.user?.id || null;
      const userRole = role || req.user?.role || 'general';

      const result = await policyService.analyzePolicy({
        userId,
        pdfBuffer: req.file.buffer,
        filename: req.file.originalname,
        userRole,
      });

      return res.status(200).json({
        success: true,
        message: 'PDF policy analyzed and indexed successfully.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/policies
  async list(req, res, next) {
    try {
      const limit = parseInt(req.query.limit, 10) || 50;
      const offset = parseInt(req.query.offset, 10) || 0;
      const policies = req.user?.id
        ? await policyService.getUserPolicies(req.user.id, limit, offset)
        : await policyService.getPublicPolicies(limit, offset);

      const formatted = policies.map((p) => formatPolicyForResponse(p));

      return res.status(200).json({
        success: true,
        data: {
          policies: formatted,
          count: formatted.length,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/policies/lookup
  async lookup(req, res, next) {
    try {
      const { url, domain } = req.query;
      const policy = await policyService.lookupPolicy(url, domain);
      return res.status(200).json({
        success: true,
        data: { policy: formatPolicyForResponse(policy) },
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/policies/:id
  async getById(req, res, next) {
    try {
      const policy = await policyService.getPolicyById(req.params.id, req.user?.id);
      return res.status(200).json({
        success: true,
        data: { policy: formatPolicyForResponse(policy) },
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/policies/:id/summary
  async getSummary(req, res, next) {
    try {
      const policy = await policyService.getPolicyById(req.params.id, req.user?.id);
      const formatted = formatPolicyForResponse(policy);
      return res.status(200).json({
        success: true,
        data: {
          policyId: formatted.id,
          title: formatted.title,
          websiteUrl: formatted.website_url,
          policyUrl: formatted.policy_url,
          score: parseFloat(formatted.overall_score) || 0.0,
          riskLevel: formatted.risk_level || 'Moderate',
          summary: formatted.summary,
          structuredSummary: formatted.structured_summary,
          executiveSynthesis: formatted.executive_synthesis,
          dataCollection: formatted.data_collection,
          dataSharing: formatted.data_sharing,
          tracking: formatted.tracking,
          retention: formatted.retention,
          userRights: formatted.user_rights,
          security: formatted.security,
          otherImportantPoints: formatted.other_important_points,
          categoryScores: formatted.category_scores || {},
          personaExplanations: formatted.persona_explanations || {},
          referenceMappings: formatted.reference_mappings || [],
          redFlags: formatted.red_flags || [],
          positiveFindings: formatted.positive_findings || [],
          recommendations: formatted.recommendations || [],
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/policies/:id/details
  async getDetails(req, res, next) {
    try {
      const policy = await policyService.getPolicyById(req.params.id, req.user?.id);
      const formatted = formatPolicyForResponse(policy);
      return res.status(200).json({
        success: true,
        data: {
          policyId: formatted.id,
          title: formatted.title,
          websiteUrl: formatted.website_url,
          policyUrl: formatted.policy_url,
          score: parseFloat(formatted.overall_score) || 0.0,
          riskLevel: formatted.risk_level || 'Moderate',
          categoryScores: formatted.category_scores || {},
          structuredSummary: formatted.structured_summary,
          executiveSynthesis: formatted.executive_synthesis,
          dataCollection: formatted.data_collection,
          dataSharing: formatted.data_sharing,
          tracking: formatted.tracking,
          retention: formatted.retention,
          userRights: formatted.user_rights,
          security: formatted.security,
          otherImportantPoints: formatted.other_important_points,
          redFlags: formatted.red_flags || [],
          positiveFindings: formatted.positive_findings || [],
          evidenceRecords: formatted.evidence_records || [],
          referenceMappings: formatted.reference_mappings || [],
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/policies/:id/versions
  async getVersions(req, res, next) {
    try {
      const versions = await policyService.getPolicyVersions(req.params.id, req.user?.id);
      return res.status(200).json({
        success: true,
        data: { versions },
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/policies/:id/compare?from=1&to=2
  async compare(req, res, next) {
    try {
      const { from, to } = req.query;
      const comparison = await policyService.compareVersions(req.params.id, req.user?.id, from, to);
      return res.status(200).json({
        success: true,
        data: comparison,
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/policies/:id
  async delete(req, res, next) {
    try {
      await policyService.deletePolicy(req.params.id, req.user?.id);
      return res.status(200).json({
        success: true,
        message: 'Policy deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  },
};

export default policyController;
