import alertModel from '../models/alert.model.js';

export const alertController = {
  // GET /api/alerts
  async list(req, res, next) {
    try {
      const limit = parseInt(req.query.limit, 10) || 50;
      const offset = parseInt(req.query.offset, 10) || 0;
      const alerts = await alertModel.findByUserId(req.user.id, limit, offset);

      return res.status(200).json({
        success: true,
        data: {
          alerts,
          count: alerts.length,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // PATCH /api/alerts/:id/read
  async markRead(req, res, next) {
    try {
      const alert = await alertModel.markAsRead(req.params.id, req.user.id);
      if (!alert) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found.',
          error: 'ALERT_NOT_FOUND',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Alert marked as read.',
        data: { alert },
      });
    } catch (error) {
      next(error);
    }
  },

  // PATCH /api/alerts/read-all
  async markAllRead(req, res, next) {
    try {
      const count = await alertModel.markAllAsRead(req.user.id);
      return res.status(200).json({
        success: true,
        message: 'All alerts marked as read.',
        data: { markedCount: count },
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/alerts/:id
  async delete(req, res, next) {
    try {
      const deleted = await alertModel.delete(req.params.id, req.user.id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found.',
          error: 'ALERT_NOT_FOUND',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Alert dismissed successfully.',
      });
    } catch (error) {
      next(error);
    }
  },
};

export default alertController;
