import userModel from '../models/user.model.js';
import profileModel from '../models/profile.model.js';
import { hashPassword, comparePassword } from '../utils/hashing.js';
import { signToken } from '../utils/jwt.js';
import pool from '../config/db.js';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import logger from '../utils/logger.js';
import notificationService from './notification.service.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const authService = {
  async register({ name, email, password, role = 'general', deviceType = 'personal' }) {
    // 1. Check if user already exists
    const existing = await userModel.findByEmail(email);
    if (existing) {
      const error = new Error('An account with this email address already exists.');
      error.statusCode = 409;
      error.code = 'EMAIL_ALREADY_EXISTS';
      throw error;
    }

    // 2. Hash password securely
    const passwordHash = await hashPassword(password);

    // 3. Insert user record
    const user = await userModel.create({
      name,
      email,
      passwordHash,
    });

    // 4. Create default profile
    await profileModel.upsert(user.id, {
      role,
      deviceType,
      privacyPreference: {
        alertOnTracking: true,
        alertOnSharing: true,
        highSensitivityOnly: false,
      },
    });

    // 5. Create default settings
    await pool.query(
      `INSERT INTO user_settings (user_id, email_notifications, monitoring_notifications, theme)
       VALUES ($1, true, true, 'dark')
       ON CONFLICT (user_id) DO NOTHING;`,
      [user.id]
    );

    // 6. Generate JWT payload: { userId, email }
    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
        deviceType,
      },
      token,
    };
  },

  async login({ email, password }) {
    // 1. Find user by email
    const user = await userModel.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    // 2. Verify password hash
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    // 3. Fetch profile
    const profile = await profileModel.findByUserId(user.id);

    // 4. Generate JWT payload
    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: profile?.role || 'general',
        deviceType: profile?.device_type || 'personal',
      },
      token,
    };
  },

  async changePassword(userId, currentPassword, newPassword) {
    const user = await userModel.findById(userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    // Fetch password hash directly
    const { rows } = await pool.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    const currentHash = rows[0]?.password_hash;

    const isMatch = await comparePassword(currentPassword, currentHash);
    if (!isMatch) {
      const error = new Error('Current password does not match.');
      error.statusCode = 400;
      error.code = 'INCORRECT_PASSWORD';
      throw error;
    }

    const newHash = await hashPassword(newPassword);
    await userModel.updatePassword(userId, newHash);

    return { message: 'Password changed successfully.' };
  },

  async googleAuth({ credential, accessToken, role = 'general', deviceType = 'personal' }) {
    if (!credential && !accessToken) {
      const error = new Error('Google credential or access token is required.');
      error.statusCode = 400;
      throw error;
    }

    let payload = null;

    if (accessToken) {
      try {
        const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        payload = response.data;
      } catch (err) {
        logger.error(`Google userinfo fetch failed: ${err.message}`);
        const error = new Error('Invalid or expired Google access token.');
        error.statusCode = 401;
        error.code = 'INVALID_GOOGLE_TOKEN';
        throw error;
      }
    } else {
      const clientId = process.env.GOOGLE_CLIENT_ID;

      // 1. Verify token with Google
      try {
        if (clientId && !clientId.includes('your_google_client_id')) {
          const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: clientId,
          });
          payload = ticket.getPayload();
        } else {
          const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
          payload = response.data;
        }
      } catch (err) {
        logger.warn(`Google verifyIdToken check: ${err.message}. Trying tokeninfo fallback...`);
        try {
          const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
          payload = response.data;
        } catch (fallbackErr) {
          const error = new Error('Invalid or expired Google authentication credential.');
          error.statusCode = 401;
          error.code = 'INVALID_GOOGLE_TOKEN';
          throw error;
        }
      }
    }

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name || email?.split('@')[0] || 'Google User';
    const avatarUrl = payload.picture || null;

    if (!email) {
      const error = new Error('Google account must have an associated email address.');
      error.statusCode = 400;
      throw error;
    }

    // 2. Check if user exists by googleId or email
    let user = await userModel.findByGoogleId(googleId);
    let isNewUser = false;

    if (!user) {
      const existingByEmail = await userModel.findByEmail(email);
      if (existingByEmail) {
        // Link Google ID and avatar to existing account
        await userModel.linkGoogleAccount(existingByEmail.id, { googleId, avatarUrl });
        user = await userModel.findById(existingByEmail.id);
      } else {
        // Create new OAuth user
        isNewUser = true;
        user = await userModel.createOAuthUser({
          name,
          email,
          googleId,
          avatarUrl,
          authProvider: 'google',
        });

        // Create default profile
        await profileModel.upsert(user.id, {
          role,
          deviceType,
          privacyPreference: {
            alertOnTracking: true,
            alertOnSharing: true,
            highSensitivityOnly: false,
          },
        });

        // Create default settings
        await pool.query(
          `INSERT INTO user_settings (user_id, email_notifications, monitoring_notifications, theme)
           VALUES ($1, true, true, 'dark')
           ON CONFLICT (user_id) DO NOTHING;`,
          [user.id]
        );
      }
    }

    // Fetch full profile info
    const profile = await profileModel.findByUserId(user.id);

    // 3. Generate PrivyLens JWT
    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatar_url || avatarUrl,
        authProvider: user.auth_provider || 'google',
        role: profile?.role || 'general',
        deviceType: profile?.device_type || 'personal',
      },
      token,
      isNewUser,
    };
  },

  async getCurrentUser(userId) {
    const user = await userModel.findById(userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatar_url || null,
      authProvider: user.auth_provider || 'local',
      role: user.role || 'general',
      deviceType: user.device_type || 'personal',
      privacyPreference: user.privacy_preference || {},
      createdAt: user.created_at,
    };
  },

  async requestPasswordResetOtp(email) {
    if (!email) {
      const error = new Error('Email address is required.');
      error.statusCode = 400;
      throw error;
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await userModel.findByEmail(cleanEmail);

    if (!user) {
      const error = new Error('No registered account found with this email address.');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    // Invalidate prior active OTPs for this email
    await pool.query(
      `UPDATE password_reset_otps SET consumed = true WHERE email = $1 AND consumed = false`,
      [cleanEmail]
    );

    // Generate 4-digit numeric code (1000 - 9999)
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Store in PostgreSQL with 10-minute expiry
    await pool.query(
      `INSERT INTO password_reset_otps (email, otp, expires_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '10 minutes')`,
      [cleanEmail, otp]
    );

    // Dispatch email
    const emailSent = await notificationService.sendPasswordResetOtpEmail(cleanEmail, otp);

    const isDev = process.env.NODE_ENV !== 'production';

    return {
      message: emailSent
        ? `A 4-digit verification code has been dispatched to ${cleanEmail}.`
        : `A 4-digit verification code was generated for ${cleanEmail}.`,
      emailSent,
      // Provide devOtp only when real email was not sent
      ...(isDev && !emailSent ? { devOtp: otp } : {}),
    };
  },

  async verifyPasswordResetOtp(email, otp) {
    if (!email || !otp) {
      const error = new Error('Email and 4-digit OTP code are required.');
      error.statusCode = 400;
      throw error;
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    const { rows } = await pool.query(
      `SELECT * FROM password_reset_otps
       WHERE email = $1 AND otp = $2 AND consumed = false AND expires_at > CURRENT_TIMESTAMP
       ORDER BY created_at DESC LIMIT 1`,
      [cleanEmail, cleanOtp]
    );

    if (rows.length === 0) {
      const error = new Error('Invalid or expired 4-digit code. Please request a new code.');
      error.statusCode = 400;
      error.code = 'INVALID_OTP';
      throw error;
    }

    return { valid: true, message: 'Code verified successfully.' };
  },

  async resetPasswordWithOtp(email, otp, newPassword) {
    if (!email || !otp || !newPassword) {
      const error = new Error('Email, 4-digit OTP code, and new password are required.');
      error.statusCode = 400;
      throw error;
    }

    if (newPassword.length < 6) {
      const error = new Error('New password must be at least 6 characters long.');
      error.statusCode = 400;
      throw error;
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    // 1. Validate OTP
    const { rows } = await pool.query(
      `SELECT * FROM password_reset_otps
       WHERE email = $1 AND otp = $2 AND consumed = false AND expires_at > CURRENT_TIMESTAMP
       ORDER BY created_at DESC LIMIT 1`,
      [cleanEmail, cleanOtp]
    );

    if (rows.length === 0) {
      const error = new Error('Invalid or expired 4-digit code. Please request a new code.');
      error.statusCode = 400;
      error.code = 'INVALID_OTP';
      throw error;
    }

    const otpRecord = rows[0];

    // 2. Mark OTP consumed
    await pool.query(`UPDATE password_reset_otps SET consumed = true WHERE id = $1`, [otpRecord.id]);

    // 3. Hash new password
    const passwordHash = await hashPassword(newPassword);

    // 4. Update user password
    const user = await userModel.findByEmail(cleanEmail);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    await userModel.updatePassword(user.id, passwordHash);

    return {
      message: 'Your password has been reset successfully. You may now sign in with your new password.',
    };
  },
};

export default authService;
