import cron from 'node-cron';
import monitoringModel from '../models/monitoring.model.js';
import monitoringService from '../services/monitoring.service.js';
import logger from '../utils/logger.js';

let cronJob = null;

export function initPolicyMonitorJob() {
  // Run sweep every 6 hours: at minute 0 past every 6th hour (0 */6 * * *)
  // In development, also runs an initial check if configured
  const schedule = '0 */6 * * *';

  cronJob = cron.schedule(schedule, async () => {
    logger.info('⏰ Executing scheduled Policy Monitoring background sweep...');
    try {
      const activeList = await monitoringModel.getActiveMonitoringList();
      logger.info(`Found ${activeList.length} active policies to verify.`);

      for (const item of activeList) {
        try {
          await monitoringService.checkPolicyForDrift(item.policy_id);
          // 2 second polite delay between scraping target servers
          await new Promise((r) => setTimeout(r, 2000));
        } catch (itemErr) {
          logger.error(`Error checking monitored policy ${item.policy_id}: ${itemErr.message}`);
        }
      }

      logger.info('Policy Monitoring sweep finished.');
    } catch (err) {
      logger.error(`Failed to execute monitoring cron job: ${err.message}`);
    }
  });

  logger.info(`Policy Monitoring Cron Job initialized (Schedule: ${schedule})`);
}

export default initPolicyMonitorJob;
