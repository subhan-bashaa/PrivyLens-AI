import rateLimit from 'express-rate-limit';

// Standard API rate limiter: 1000 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address, please try again after 15 minutes.',
    error: 'RATE_LIMIT_EXCEEDED',
  },
});

// Stricter limiter for authentication endpoints: 50 requests per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    error: 'AUTH_RATE_LIMIT_EXCEEDED',
  },
});

// AI analysis limiter to protect LLM quota: 100 analyses per hour
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Hourly AI analysis quota reached for this IP. Please wait before analyzing more policies.',
    error: 'AI_RATE_LIMIT_EXCEEDED',
  },
});
