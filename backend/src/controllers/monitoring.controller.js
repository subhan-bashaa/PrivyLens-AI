import monitoringService from '../services/monitoring.service.js';

export const monitoringController = {
  // POST /api/monitoring/enable
  async enable(req, res, next) {
    try {
      const { policyId, frequency } = req.body;
      if (!policyId) {
        return res.status(400).json({
          success: false,
          message: 'policyId is required to enable monitoring.',
          error: 'VALIDATION_ERROR',
        });
      }

      const record = await monitoringService.enable({
        policyId,
        userId: req.user.id,
        frequency: frequency || 'weekly',
      });

      return res.status(200).json({
        success: true,
        message: 'Policy monitoring enabled successfully.',
        data: { monitoring: record },
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/monitoring/disable
  async disable(req, res, next) {
    try {
      const { policyId } = req.body;
      if (!policyId) {
        return res.status(400).json({
          success: false,
          message: 'policyId is required.',
          error: 'VALIDATION_ERROR',
        });
      }

      await monitoringService.disable({ policyId, userId: req.user.id });

      return res.status(200).json({
        success: true,
        message: 'Policy monitoring disabled successfully.',
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/monitoring
  async list(req, res, next) {
    try {
      const list = await monitoringService.listUserMonitored(req.user.id);
      return res.status(200).json({
        success: true,
        data: {
          monitoredPolicies: list,
          count: list.length,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/monitoring/:id/check
  async checkNow(req, res, next) {
    try {
      const result = await monitoringService.checkPolicyForDrift(req.params.id);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default monitoringController;
