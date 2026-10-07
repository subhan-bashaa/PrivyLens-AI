import reportService from '../services/report.service.js';

export const reportController = {
  // POST /api/reports/:policyId
  async generate(req, res, next) {
    try {
      const report = await reportService.generateReport(req.params.policyId, req.user.id);
      return res.status(201).json({
        success: true,
        message: 'Compliance audit report generated successfully.',
        data: { report },
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/reports
  async list(req, res, next) {
    try {
      if (!req.user?.id) {
        return res.status(200).json({
          success: true,
          data: {
            reports: [],
            count: 0,
          },
        });
      }
      const reports = await reportService.listUserReports(req.user.id);
      return res.status(200).json({
        success: true,
        data: {
          reports,
          count: reports.length,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/reports/:id
  async getById(req, res, next) {
    try {
      const report = await reportService.getReportById(req.params.id, req.user.id);
      return res.status(200).json({
        success: true,
        data: { report },
      });
    } catch (error) {
      next(error);
    }
  },
};

export default reportController;
