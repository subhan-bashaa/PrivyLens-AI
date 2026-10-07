const formatLog = (level, message) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
};

export const logger = {
  info: (msg) => console.log(`\x1b[32m${formatLog('info', msg)}\x1b[0m`),
  warn: (msg) => console.warn(`\x1b[33m${formatLog('warn', msg)}\x1b[0m`),
  error: (msg) => console.error(`\x1b[31m${formatLog('error', msg)}\x1b[0m`),
  debug: (msg) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`\x1b[36m${formatLog('debug', msg)}\x1b[0m`);
    }
  },
};

export default logger;
