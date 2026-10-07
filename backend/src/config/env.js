import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/privylens',
  jwtSecret: process.env.JWT_SECRET || 'privylens_default_jwt_secret_dev_only',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  groqApiKey: process.env.GROQ_API_KEY || '',
  groqModel: process.env.GROQ_MODEL || 'qwen/qwen3.8-27b',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
  chromaUrl: process.env.CHROMA_URL || 'http://localhost:8000',
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 465,
    user: (process.env.SMTP_USER || '').trim(),
    password: (process.env.SMTP_PASSWORD || '').trim(),
    from: process.env.EMAIL_FROM || '"PrivyLens AI Intelligence" <alerts@privylens.ai>',
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
};

export default env;
