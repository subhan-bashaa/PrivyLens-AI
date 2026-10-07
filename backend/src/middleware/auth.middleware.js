import { verifyToken } from '../utils/jwt.js';
import userModel from '../models/user.model.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token missing or invalid format. Please provide Authorization: Bearer <token>',
        error: 'UNAUTHORIZED',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: 'Session expired or token is invalid. Please log in again.',
        error: 'INVALID_TOKEN',
      });
    }

    const user = await userModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User associated with this token no longer exists.',
        error: 'USER_NOT_FOUND',
      });
    }

    // Attach user to request object (without password hash)
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

// Optional auth for endpoints that can work anonymously or authenticated
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      if (decoded && decoded.userId) {
        const user = await userModel.findById(decoded.userId);
        if (user) {
          req.user = user;
        }
      }
    }
    next();
  } catch (error) {
    // Silently continue for optional auth
    next();
  }
}
