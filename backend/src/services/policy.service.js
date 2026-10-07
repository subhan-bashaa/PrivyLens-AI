import policyExtractionService from './policyExtractionService.js';
import privacyFactExtractionService from './privacyFactExtractionService.js';
import privacyMappingService from './privacyMappingService.js';
import riskAssessmentService from './riskAssessmentService.js';
import personaExplanationService from './personaExplanationService.js';
import evidenceService from './evidenceService.js';
import ragService from './rag.service.js';
import policyModel from '../models/policy.model.js';
import policyVersionModel from '../models/policyVersion.model.js';
import analysisModel from '../models/analysis.model.js';
import pool from '../config/db.js';
import logger from '../utils/logger.js';

export const policyService = {
  // Analyze a Policy from URL, Text, or PDF
  async analyzePolicy({ userId, url, text, pdfBuffer, filename, userRole = 'general' }) {
    const activePersona = (userRole || 'general').toLowerCase();

    // 1. Extraction Phase (with Browser Internal Page & Cookie Banner detection)
    let extracted;
    if (url) {
      extracted = await policyExtractionService.extractFromUrl(url);
    } else if (pdfBuffer) {
      extracted = await policyExtractionService.extractFromPdf(pdfBuffer, filename);
    } else if (text) {
      extracted = policyExtractionService.extractFromText(text);
    } else {
      throw new Error('No policy content provided.');
    }

    // Handle Browser Internal / System Utility Pages (chrome://, extension://, about:)
    if (extracted.isInternalPage) {
      logger.info('Detected browser internal utility page. Returning safe system state without AI analysis.');
      return {
        isInternalPage: true,
        policy: {
          title: extracted.title,
          url: url || 'chrome://internal',
          lastUpdated: new Date().toISOString(),
        },
        persona: activePersona,
        score: extracted.score,
        summary: {
          whatItMeansForYou: extracted.message,
          recommendation: 'Safe system utility page',
        },
        categoryScores: {},
        redFlags: [],
        positiveFindings: [
          {
            title: 'System Utility Page',
            description: 'No external tracking or personal data collection takes place on internal browser pages.',
          },
        ],
        recommendations: ['No action required'],
        evidence: [],
        references: [],
      };
    }

    const { title, websiteUrl, policyUrl, extractedText, contentHash, sourceType, hasCookieBanner, cookieBannerSignal } = extracted;

    // 2. Policy Record Retrieval / Creation
    let policy = await policyModel.findByUrl(userId, policyUrl);
    if (!policy) {
      policy = await policyModel.create({
        userId,
        title,
        websiteUrl,
        policyUrl,
        sourceType,
        monitoringEnabled: false,
      });
    }

    // 3. Version Check (Detect if already analyzed with identical content)
    let latestVersion = await policyVersionModel.getLatestVersion(policy.id);
    if (latestVersion && latestVersion.content_hash === contentHash) {
      logger.info(`Policy content unchanged for ${title}. Returning existing analysis.`);
      const existingAnalysis = await analysisModel.findByVersionId(latestVersion.id);
      if (existingAnalysis) {
        const storedScores = existingAnalysis.category_scores || {};
        const storedRefs = existingAnalysis.reference_mappings || [];
        const storedPersona = existingAnalysis.persona_explanations?.[activePersona] || null;
        const storedEvidence = existingAnalysis.evidence_records || [];

        return {
          policy: {
            id: policy.id,
            versionId: latestVersion.id,
            versionNumber: latestVersion.version_number,
            title: policy.title,
            url: policy.policy_url,
            lastUpdated: policy.updated_at,
          },
          persona: activePersona,
          score: {
            value: Math.round(parseFloat(existingAnalysis.overall_score) * 10),
            outOf: 100,
            display: (parseFloat(existingAnalysis.overall_score) || 0).toFixed(1) + '/10',
            riskLevel: existingAnalysis.risk_level,
          },
          summary: {
            whatItMeansForYou: storedPersona?.whatItMeansForYou || existingAnalysis.summary,
            recommendation: storedPersona?.recommendationStatus || 'Proceed with caution',
            personaQuestions: storedPersona?.personaQuestions || {},
          },
          categoryScores: storedScores,
          redFlags: existingAnalysis.red_flags || [],
          positiveFindings: existingAnalysis.positive_findings || [],
          recommendations: existingAnalysis.recommendations || [],
          evidence: storedEvidence,
          references: storedRefs,
          cookieBannerSignal,
          isCached: true,
        };
      }
    }

    const nextVersionNumber = latestVersion ? latestVersion.version_number + 1 : 1;

    // 4. Create New Policy Version
    const newVersion = await policyVersionModel.create({
      policyId: policy.id,
      versionNumber: nextVersionNumber,
      contentHash,
      extractedText,
    });

    await policyModel.updateCurrentVersion(policy.id, newVersion.id);

    // 5. Fact Extraction across 10 Dimensions
    logger.info(`Extracting structured privacy facts for: ${title}...`);
    const extractedFactsData = await privacyFactExtractionService.extractFacts(extractedText, activePersona);

    // 6. Map to Authoritative Baselines (DPDP Act, DPDP Rules, NIST Framework)
    const referenceMappings = privacyMappingService.mapFactsToReferences(extractedFactsData.facts);

    // 7. Calculate Deterministic Risk Scores (11 Categories & Explainability)
    const riskAssessment = riskAssessmentService.calculateRisk(extractedFactsData);

    // 8. Generate Persona-Specific Explanation & Relatable Questions
    const personaExplanation = await personaExplanationService.generateExplanation({
      facts: extractedFactsData.facts,
      collectedTypes: extractedFactsData.collected_data_types || [],
      sharingRecipients: extractedFactsData.sharing_recipients || [],
      trackingMethods: extractedFactsData.tracking_methods || [],
      retention: extractedFactsData.retention_policy || {},
      rights: extractedFactsData.user_rights_provided || [],
      security: extractedFactsData.security_measures || [],
      score: riskAssessment.score,
      persona: activePersona,
    });

    // 9. Compile Verifiable Evidence Records
    const compiledEvidence = evidenceService.compileEvidence(
      extractedFactsData.facts,
      extractedFactsData.red_flags,
      extractedFactsData.positive_findings
    );

    // Build Structured Privacy Summary and Executive Synthesis
    const structuredSummary = extractedFactsData.structured_summary || {
      data_collected: (extractedFactsData.collected_data_types || []).join(', ') || 'Standard personal and telemetry data.',
      purpose_of_data_use: (extractedFactsData.purposes || []).join(', ') || 'Account management and service provision.',
      data_sharing: (extractedFactsData.sharing_recipients || []).join(', ') || 'Authorized service providers.',
      data_retention: extractedFactsData.retention_policy?.duration_statement || 'Retained during active usage.',
      user_rights: (extractedFactsData.user_rights_provided || []).join(', ') || 'Access and correction rights.',
      security: (extractedFactsData.security_measures || []).join(', ') || 'Standard transport security.',
      other_important_points: 'Service terms and statutory privacy benchmarks apply.',
    };

    const executiveSynthesis = extractedFactsData.executive_synthesis || {
      verdict: personaExplanation.recommendationStatus || (riskAssessment.score.riskLevel === 'Low' ? 'Safe to Use' : riskAssessment.score.riskLevel === 'High' ? 'High Risk Profile' : 'Proceed with Caution'),
      verdict_summary: personaExplanation.whatItMeansForYou?.split('\n')[0] || 'Evaluate personal data collection and third-party data broker sharing before agreeing.',
      data_processing_purpose: structuredSummary.purpose_of_data_use || 'Service processes personal identifiers for core delivery and authentication.',
      third_party_scope: structuredSummary.data_sharing || 'Telemetry and usage metrics are shared across authorized service partners.',
    };

    const domainCollection = {
      summary: extractedFactsData.data_collection?.summary || structuredSummary.data_collected,
      collected_items: extractedFactsData.data_collection?.collected_items || extractedFactsData.collected_data_types || [],
    };

    const domainSharing = {
      summary: extractedFactsData.data_sharing?.summary || structuredSummary.data_sharing,
      sharing_recipients: extractedFactsData.data_sharing?.sharing_recipients || extractedFactsData.sharing_recipients || [],
    };

    const domainTracking = {
      summary: extractedFactsData.tracking?.summary || (extractedFactsData.tracking_methods || []).join(', ') || 'Server session and analytics telemetry.',
      methods: extractedFactsData.tracking?.methods || extractedFactsData.tracking_methods || [],
    };

    const domainRetention = {
      summary: extractedFactsData.retention?.summary || structuredSummary.data_retention,
      policies: extractedFactsData.retention?.policies || [extractedFactsData.retention_policy?.duration_statement || 'Active account lifecycle'],
    };

    const domainRights = {
      summary: extractedFactsData.user_rights?.summary || structuredSummary.user_rights,
      rights_list: extractedFactsData.user_rights?.rights_list || extractedFactsData.user_rights_provided || [],
    };

    const domainSecurity = {
      summary: extractedFactsData.security?.summary || structuredSummary.security,
      measures: extractedFactsData.security?.measures || extractedFactsData.security_measures || [],
    };

    const domainOther = {
      summary: extractedFactsData.other_important_points?.summary || structuredSummary.other_important_points,
      points: extractedFactsData.other_important_points?.points || ['Age eligibility requirements', 'Periodic policy notifications'],
    };

    // 10. Persist Full Intelligence Analysis into PostgreSQL
    await pool.query(
      `INSERT INTO policy_analysis (
        policy_version_id, overall_score, risk_level, summary,
        data_collection, data_sharing, tracking, retention,
        user_rights, security, red_flags, positive_findings, recommendations,
        category_scores, reference_mappings, persona_explanations, evidence_records
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      ON CONFLICT (policy_version_id) DO UPDATE
      SET overall_score = EXCLUDED.overall_score,
          risk_level = EXCLUDED.risk_level,
          summary = EXCLUDED.summary,
          data_collection = EXCLUDED.data_collection,
          data_sharing = EXCLUDED.data_sharing,
          tracking = EXCLUDED.tracking,
          retention = EXCLUDED.retention,
          user_rights = EXCLUDED.user_rights,
          security = EXCLUDED.security,
          red_flags = EXCLUDED.red_flags,
          positive_findings = EXCLUDED.positive_findings,
          recommendations = EXCLUDED.recommendations,
          category_scores = EXCLUDED.category_scores,
          reference_mappings = EXCLUDED.reference_mappings,
          persona_explanations = EXCLUDED.persona_explanations,
          evidence_records = EXCLUDED.evidence_records;`,
      [
        newVersion.id,
        parseFloat((riskAssessment.score.value / 10).toFixed(1)),
        riskAssessment.score.riskLevel,
        extractedFactsData.summary || personaExplanation.whatItMeansForYou,
        JSON.stringify(domainCollection),
        JSON.stringify(domainSharing),
        JSON.stringify(domainTracking),
        JSON.stringify(domainRetention),
        JSON.stringify(domainRights),
        JSON.stringify(domainSecurity),
        JSON.stringify(extractedFactsData.red_flags || []),
        JSON.stringify(extractedFactsData.positive_findings || []),
        JSON.stringify(personaExplanation.personaQuestions?.whatShouldIDo || []),
        JSON.stringify(riskAssessment.categoryScores || {}),
        JSON.stringify(referenceMappings || []),
        JSON.stringify({
          [activePersona]: personaExplanation,
          structured_summary: structuredSummary,
          executive_synthesis: executiveSynthesis,
          other_important_points: domainOther,
        }),
        JSON.stringify(compiledEvidence || []),
      ]
    );

    // 11. Background Asynchronous RAG Chunk Indexing
    ragService.indexPolicy(policy.id, newVersion.id, extractedText, extracted.sections).catch((err) => {
      logger.warn(`Background RAG indexing warning for ${policy.id}: ${err.message}`);
    });

    // 12. Return Authoritative Response Formatted for Extension & Dashboard
    return {
      policy: {
        id: policy.id,
        versionId: newVersion.id,
        versionNumber: nextVersionNumber,
        title: policy.title,
        url: policy.policy_url,
        lastUpdated: new Date().toISOString(),
      },
      persona: activePersona,
      score: riskAssessment.score,
      summary: {
        whatItMeansForYou: personaExplanation.whatItMeansForYou,
        recommendation: personaExplanation.recommendationStatus || 'Proceed with caution',
        personaQuestions: personaExplanation.personaQuestions || {},
        overallSummary: extractedFactsData.summary || personaExplanation.whatItMeansForYou,
      },
      structured_summary: structuredSummary,
      executive_synthesis: executiveSynthesis,
      data_collection: domainCollection,
      data_sharing: domainSharing,
      tracking: domainTracking,
      retention: domainRetention,
      user_rights: domainRights,
      security: domainSecurity,
      other_important_points: domainOther,
      categoryScores: riskAssessment.categoryScores,
      redFlags: extractedFactsData.red_flags || [],
      positiveFindings: extractedFactsData.positive_findings || [],
      recommendations: personaExplanation.personaQuestions?.whatShouldIDo || [],
      evidence: compiledEvidence,
      references: referenceMappings,
      cookieBannerSignal,
      methodology: riskAssessment.methodology,
      isCached: false,
    };
  },

  // Get Policy by ID
  async getPolicyById(policyId, userId) {
    const policy = await policyModel.findById(policyId);
    if (!policy) {
      const error = new Error('Policy not found.');
      error.statusCode = 404;
      throw error;
    }
    if (userId && policy.user_id && policy.user_id !== userId) {
      const error = new Error('Policy not found or unauthorized.');
      error.statusCode = 404;
      throw error;
    }
    return policy;
  },

  // List all User Policies
  async getUserPolicies(userId, limit = 50, offset = 0) {
    return await policyModel.findByUserId(userId, limit, offset);
  },

  // Get Public/Global Policies with audited scores
  async getPublicPolicies(limit = 50, offset = 0) {
    return await policyModel.findPublic(limit, offset);
  },

  // Lookup Policy by URL or Domain for Extension & Quick Inspector
  async lookupPolicy(url, domain) {
    return await policyModel.findByDomainOrUrl(domain, url);
  },

  // Delete Policy
  async deletePolicy(policyId, userId) {
    const deleted = await policyModel.delete(policyId, userId);
    if (!deleted) {
      const error = new Error('Policy not found or unauthorized.');
      error.statusCode = 404;
      throw error;
    }
    return true;
  },

  // Get Versions for a Policy
  async getPolicyVersions(policyId, userId) {
    await this.getPolicyById(policyId, userId);
    return await policyVersionModel.findByPolicyId(policyId);
  },

  // Compare Two Policy Versions (Phase 15 Version Comparison)
  async compareVersions(policyId, userId, fromVer, toVer) {
    await this.getPolicyById(policyId, userId);
    const versions = await policyVersionModel.findByPolicyId(policyId);

    if (versions.length < 2 && (!fromVer || !toVer)) {
      const error = new Error('Policy does not have multiple versions to compare yet.');
      error.statusCode = 400;
      throw error;
    }

    let v1 = fromVer ? versions.find((v) => v.version_number === parseInt(fromVer, 10)) : versions[1];
    let v2 = toVer ? versions.find((v) => v.version_number === parseInt(toVer, 10)) : versions[0];

    if (!v1 || !v2) {
      const error = new Error('Specified version numbers were not found for this policy.');
      error.statusCode = 404;
      throw error;
    }

    const [v1Full, v2Full, a1, a2] = await Promise.all([
      policyVersionModel.findById(v1.id),
      policyVersionModel.findById(v2.id),
      analysisModel.findByVersionId(v1.id),
      analysisModel.findByVersionId(v2.id),
    ]);

    const s1 = parseFloat(a1?.overall_score) || 0.0;
    const s2 = parseFloat(a2?.overall_score) || 0.0;
    const scoreDelta = Math.round((s2 - s1) * 10) / 10;

    const paras1 = new Set((v1Full.extracted_text || '').split(/\n\n+/).map((p) => p.trim()).filter(Boolean));
    const paras2 = new Set((v2Full.extracted_text || '').split(/\n\n+/).map((p) => p.trim()).filter(Boolean));

    const addedClauses = [];
    const removedClauses = [];

    paras2.forEach((p) => {
      if (!paras1.has(p) && p.length > 30) addedClauses.push(p);
    });

    paras1.forEach((p) => {
      if (!paras2.has(p) && p.length > 30) removedClauses.push(p);
    });

    return {
      policyId,
      fromVersion: v1.version_number,
      toVersion: v2.version_number,
      fromScore: s1,
      toScore: s2,
      scoreDelta,
      riskTrend: scoreDelta > 0 ? 'Risk Increased' : scoreDelta < 0 ? 'Risk Decreased' : 'Risk Unchanged',
      clausesAddedCount: addedClauses.length,
      clausesRemovedCount: removedClauses.length,
      addedClauses: addedClauses.slice(0, 10),
      removedClauses: removedClauses.slice(0, 10),
    };
  },
};

export default policyService;
