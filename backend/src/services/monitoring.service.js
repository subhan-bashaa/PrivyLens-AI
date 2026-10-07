import monitoringModel from '../models/monitoring.model.js';
import policyModel from '../models/policy.model.js';
import policyService from './policy.service.js';
import alertModel from '../models/alert.model.js';
import notificationService from './notification.service.js';
import extractionService from './extraction.service.js';
import logger from '../utils/logger.js';

export const monitoringService = {
  // Enable monitoring for a policy
  async enable({ policyId, userId, frequency = 'weekly' }) {
    const policy = await policyModel.findById(policyId);
    if (!policy || policy.user_id !== userId) {
      const error = new Error('Policy not found or unauthorized.');
      error.statusCode = 404;
      throw error;
    }

    if (!policy.policy_url.startsWith('http')) {
      const error = new Error('Monitoring is only supported for live HTTP/HTTPS policy URLs.');
      error.statusCode = 400;
      throw error;
    }

    // Update policies table flag
    await policyModel.create; // verify
    const monRecord = await monitoringModel.upsert({ policyId, frequency, enabled: true });

    return monRecord;
  },

  // Disable monitoring
  async disable({ policyId, userId }) {
    const policy = await policyModel.findById(policyId);
    if (!policy || policy.user_id !== userId) {
      const error = new Error('Policy not found or unauthorized.');
      error.statusCode = 404;
      throw error;
    }

    return await monitoringModel.disable(policyId);
  },

  // List monitored policies for user
  async listUserMonitored(userId) {
    return await monitoringModel.findByUserId(userId);
  },

  // Run Check on Single Policy (invoked by Cron or Manual Trigger)
  async checkPolicyForDrift(policyId) {
    const mon = await monitoringModel.findByPolicyId(policyId);
    if (!mon || !mon.enabled) return null;

    logger.info(`Running drift check for: ${mon.policy_title} (${mon.policy_url})...`);

    try {
      const previousHash = mon.content_hash;
      const scrapeResult = await extractionService.extractFromUrl(mon.policy_url);

      if (previousHash && previousHash === scrapeResult.contentHash) {
        logger.info(`Policy "${mon.policy_title}" is unchanged.`);
        await monitoringModel.updateLastChecked(policyId, false);
        return { changed: false };
      }

      logger.warn(`🚨 Policy Drift Detected for "${mon.policy_title}"! Re-analyzing...`);

      // Re-analyze policy (generates new version & new score)
      const newAnalysis = await policyService.analyzePolicy({
        userId: mon.user_id,
        url: mon.policy_url,
      });

      // Update monitoring timestamp
      await monitoringModel.updateLastChecked(policyId, true);

      // Create Drift Alert in Database
      const alert = await alertModel.create({
        userId: mon.user_id,
        policyId: mon.policy_id,
        type: 'policy_drift',
        title: `Privacy Policy Updated: ${mon.policy_title}`,
        message: `A new revision was detected for ${mon.policy_title}. New Risk Score: ${newAnalysis.score}/10 (${newAnalysis.riskLevel} Risk).`,
      });

      // Dispatch Email Notification
      if (mon.user_email) {
        await notificationService.sendPolicyDriftEmail(mon.user_email, {
          policyName: mon.policy_title,
          changeSummary: newAnalysis.summary,
          oldScore: 'Previous',
          newScore: newAnalysis.score,
          policyUrl: mon.policy_url,
        });
      }

      return {
        changed: true,
        alertId: alert.id,
        newScore: newAnalysis.score,
        newVersion: newAnalysis.versionNumber,
      };
    } catch (err) {
      logger.error(`Error during drift check for ${mon.policy_title}: ${err.message}`);
      return { changed: false, error: err.message };
    }
  },
};

export default monitoringService;
