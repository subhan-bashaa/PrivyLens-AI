import nodemailer from 'nodemailer';
import env from '../config/env.js';
import logger from '../utils/logger.js';

let transporter = null;

if (env.smtp.user && env.smtp.password && !env.smtp.password.includes('your_email_app_password')) {
  try {
    const isGmail = env.smtp.host?.includes('gmail') || env.smtp.user?.includes('@gmail.com');
    const cleanPassword = env.smtp.password.replace(/\s+/g, '').trim();

    const transportConfig = isGmail
      ? {
          service: 'gmail',
          auth: {
            user: env.smtp.user.trim(),
            pass: cleanPassword,
          },
        }
      : {
          host: env.smtp.host,
          port: env.smtp.port,
          secure: env.smtp.port === 465,
          auth: {
            user: env.smtp.user.trim(),
            pass: cleanPassword,
          },
        };

    transporter = nodemailer.createTransport(transportConfig);
    logger.info(`SMTP notification transport configured for ${isGmail ? 'Gmail' : env.smtp.host} (${env.smtp.user})`);
  } catch (err) {
    logger.warn(`SMTP initialization error: ${err.message}`);
  }
}

export const notificationService = {
  async sendPolicyDriftEmail(toEmail, { policyName, changeSummary, oldScore, newScore, policyUrl }) {
    if (!transporter) {
      logger.info(`[MOCK EMAIL DISPATCH] To: ${toEmail} | Subject: Policy Drift Alert: ${policyName}`);
      logger.info(`Details: Score changed from ${oldScore} to ${newScore}. Changes: ${changeSummary}`);
      return false;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; border-radius: 12px;">
        <h2 style="color: #10b981;">🛡️ PrivyLens AI — Policy Drift Alert</h2>
        <p>A monitored privacy policy has been updated: <strong>${policyName}</strong></p>
        <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Previous Risk Score:</strong> ${oldScore} / 10</p>
          <p><strong>New Risk Score:</strong> ${newScore} / 10</p>
          <p><strong>Summary of Modifications:</strong></p>
          <p>${changeSummary}</p>
        </div>
        <a href="${env.clientUrl}/policies" style="background: #10b981; color: #0f172a; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
          View Full Audit Diff in Dashboard
        </a>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: env.smtp.from,
        to: toEmail,
        subject: `⚠️ Privacy Policy Changed: ${policyName}`,
        html: htmlContent,
      });
      logger.info(`Policy drift email notification successfully sent to ${toEmail}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send email notification to ${toEmail}: ${error.message}`);
      return false;
    }
  },

  async sendPasswordResetOtpEmail(toEmail, otp) {
    if (!transporter) {
      logger.info(`=======================================================`);
      logger.info(`🔑 [EMAIL OTP DISPATCH] Recipient: ${toEmail}`);
      logger.info(`🔑 [4-DIGIT OTP CODE]: >>> ${otp} <<< (Valid for 10 min)`);
      logger.info(`=======================================================`);
      return false;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1320; color: #f8fafc; margin: 0; padding: 24px; }
          .card { background: #111c2e; border: 1px solid #10b981; border-radius: 16px; padding: 32px; max-width: 480px; margin: 0 auto; text-align: center; }
          .brand { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 20px; }
          .brand h1 { font-size: 22px; font-weight: 800; color: #ffffff; margin: 0; }
          .brand span { color: #10b981; }
          .otp-box { background: #070d16; border: 2px dashed #10b981; border-radius: 12px; padding: 18px 24px; margin: 24px 0; display: inline-block; }
          .otp-code { font-size: 38px; font-weight: 800; letter-spacing: 12px; color: #10b981; font-family: monospace; }
          .note { font-size: 13px; color: #94a3b8; line-height: 1.6; }
          .warning { font-size: 11px; color: #64748b; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="brand">
            <h1>🛡️ PrivyLens <span>AI</span></h1>
          </div>
          <h2 style="font-size: 18px; margin-top: 0; color: #ffffff;">Password Reset Verification</h2>
          <p class="note">
            We received a request to reset your password. Use the 4-digit verification code below to authorize the change:
          </p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>
          <p class="note">
            ⏱️ This code will expire in <strong>10 minutes</strong>.
          </p>
          <div class="warning">
            If you did not request a password reset, please disregard this email or check your account security.
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await transporter.sendMail({
        from: env.smtp.from,
        to: toEmail,
        subject: `🔑 ${otp} is your PrivyLens AI Password Reset Code`,
        html: htmlContent,
      });
      logger.info(`Password reset OTP email dispatched successfully to ${toEmail}`);
      return true;
    } catch (error) {
      logger.warn(`Failed to dispatch SMTP email to ${toEmail}: ${error.message}. Falling back to logger.`);
      logger.info(`🔑 [FALLBACK DEV OTP]: >>> ${otp} <<< for ${toEmail}`);
      return false;
    }
  },
};

export default notificationService;
