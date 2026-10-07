import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import env from './config/env.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';

// Route Imports
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import policyRoutes from './routes/policy.routes.js';
import aiRoutes from './routes/ai.routes.js';
import monitoringRoutes from './routes/monitoring.routes.js';
import alertRoutes from './routes/alert.routes.js';
import reportRoutes from './routes/report.routes.js';

const app = express();

// 1. Security Headers via Helmet
app.use(helmet());

// 2. CORS configuration (Supporting Frontend & Chromium Extensions)
const allowedOrigins = [
  env.clientUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, extension service workers)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.startsWith('chrome-extension://')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev for extension companions
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// 3. Request Logging via Morgan
if (env.nodeEnv !== 'test') {
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
}

// 4. Request Body Parsers (10MB limit for policy documents)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Global API Rate Limiter
app.use('/api', apiLimiter);

// 6. Root Health & Status Endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PrivyLens AI Intelligence API is running.',
    version: '1.0.0',
    environment: env.nodeEnv,
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 7. Route Registrations
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);

// 8. 404 & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
