import authService from '../services/auth.service.js';

export const authController = {
  async register(req, res, next) {
    try {
      const { name, email, password, role, deviceType } = req.body;
      const result = await authService.register({
        name,
        email,
        password,
        role,
        deviceType,
      });

      return res.status(201).json({
        success: true,
        message: 'User registration successful.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });

      return res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async googleAuth(req, res, next) {
    try {
      const { credential, accessToken, role, deviceType } = req.body;
      if (!credential && !accessToken) {
        return res.status(400).json({
          success: false,
          message: 'Google credential token or access token is required.',
          error: 'MISSING_CREDENTIAL',
        });
      }

      const result = await authService.googleAuth({ credential, accessToken, role, deviceType });

      return res.status(200).json({
        success: true,
        message: result.isNewUser ? 'Google account created and authenticated.' : 'Google login successful.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res) {
    // JWT is stateless; client deletes token.
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  },

  async me(req, res, next) {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      return res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  },

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Both current password and new password are required.',
          error: 'VALIDATION_ERROR',
        });
      }

      await authService.changePassword(req.user.id, currentPassword, newPassword);

      return res.status(200).json({
        success: true,
        message: 'Password has been updated successfully.',
      });
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = await authService.requestPasswordResetOtp(email);
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async verifyOtp(req, res, next) {
    try {
      const { email, otp } = req.body;
      const result = await authService.verifyPasswordResetOtp(email, otp);
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const { email, otp, newPassword } = req.body;
      const result = await authService.resetPasswordWithOtp(email, otp, newPassword);
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default authController;
