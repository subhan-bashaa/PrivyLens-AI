import pool from '../config/db.js';
import profileModel from '../models/profile.model.js';
import userModel from '../models/user.model.js';

export const userController = {
  // GET /api/users/profile
  async getProfile(req, res, next) {
    try {
      const user = await userModel.findById(req.user.id);
      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role || 'general',
            deviceType: user.device_type || 'personal',
            privacyPreference: user.privacy_preference || {},
            createdAt: user.created_at,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/users/profile
  async updateProfile(req, res, next) {
    try {
      const { name, role, deviceType, privacyPreference } = req.body;
      const userId = req.user.id;

      if (name && typeof name === 'string' && name.trim().length > 0) {
        await userModel.updateName(userId, name.trim());
      }

      const updatedProfile = await profileModel.upsert(userId, {
        role: role || req.user.role || 'general',
        deviceType: deviceType || req.user.device_type || 'personal',
        privacyPreference: privacyPreference || req.user.privacy_preference || {},
      });

      const updatedUser = await userModel.findById(userId);

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        data: {
          user: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedProfile.role,
            deviceType: updatedProfile.device_type,
            privacyPreference: updatedProfile.privacy_preference,
            updatedAt: updatedProfile.updated_at,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/users/settings
  async getSettings(req, res, next) {
    try {
      const { rows } = await pool.query(
        'SELECT email_notifications, monitoring_notifications, theme, updated_at FROM user_settings WHERE user_id = $1;',
        [req.user.id]
      );

      const settings = rows[0] || {
        email_notifications: true,
        monitoring_notifications: true,
        theme: 'dark',
      };

      return res.status(200).json({
        success: true,
        data: { settings },
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/users/settings
  async updateSettings(req, res, next) {
    try {
      const { emailNotifications, monitoringNotifications, theme } = req.body;
      const userId = req.user.id;

      const { rows } = await pool.query(
        `INSERT INTO user_settings (user_id, email_notifications, monitoring_notifications, theme)
         VALUES ($1, COALESCE($2, true), COALESCE($3, true), COALESCE($4, 'dark'))
         ON CONFLICT (user_id) DO UPDATE
         SET email_notifications = COALESCE($2, user_settings.email_notifications),
             monitoring_notifications = COALESCE($3, user_settings.monitoring_notifications),
             theme = COALESCE($4, user_settings.theme),
             updated_at = CURRENT_TIMESTAMP
         RETURNING email_notifications, monitoring_notifications, theme, updated_at;`,
        [userId, emailNotifications, monitoringNotifications, theme]
      );

      return res.status(200).json({
        success: true,
        message: 'Settings updated successfully.',
        data: { settings: rows[0] },
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/users/stats
  async getStats(req, res, next) {
    try {
      const userId = req.user.id;

      const [policiesCount, monitoringCount, alertsCount, avgScoreRes] = await Promise.all([
        pool.query('SELECT COUNT(*) FROM policies WHERE user_id = $1;', [userId]),
        pool.query('SELECT COUNT(*) FROM monitoring m JOIN policies p ON m.policy_id = p.id WHERE p.user_id = $1 AND m.enabled = true;', [userId]),
        pool.query('SELECT COUNT(*) FROM alerts WHERE user_id = $1 AND is_read = false;', [userId]),
        pool.query(
          `SELECT COALESCE(ROUND(AVG(pa.overall_score)::numeric, 1), 0.0) as avg_score
           FROM policies p
           JOIN policy_versions pv ON p.current_version_id = pv.id
           JOIN policy_analysis pa ON pa.policy_version_id = pv.id
           WHERE p.user_id = $1;`,
          [userId]
        ),
      ]);

      return res.status(200).json({
        success: true,
        data: {
          stats: {
            totalPolicies: parseInt(policiesCount.rows[0].count, 10),
            monitoredPolicies: parseInt(monitoringCount.rows[0].count, 10),
            unreadAlerts: parseInt(alertsCount.rows[0].count, 10),
            averageScore: parseFloat(avgScoreRes.rows[0].avg_score) || 0.0,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
