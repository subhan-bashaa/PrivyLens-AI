import { isValidEmail, isValidPassword, isValidUrl } from '../utils/validators.js';

export function validateRegister(req, res, next) {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Full name is required.',
      error: 'VALIDATION_ERROR',
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'A valid email address is required.',
      error: 'VALIDATION_ERROR',
    });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long.',
      error: 'VALIDATION_ERROR',
    });
  }

  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.',
      error: 'VALIDATION_ERROR',
    });
  }

  next();
}

export function validatePolicyAnalyze(req, res, next) {
  const { url, text } = req.body;

  if (!url && !text) {
    return res.status(400).json({
      success: false,
      message: 'Either a policy webpage URL or raw text content must be provided.',
      error: 'VALIDATION_ERROR',
    });
  }

  if (url && !isValidUrl(url)) {
    return res.status(400).json({
      success: false,
      message: 'The provided URL is not a valid HTTP or HTTPS address.',
      error: 'INVALID_URL',
    });
  }

  next();
}
