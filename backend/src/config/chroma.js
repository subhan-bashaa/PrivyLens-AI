import { ChromaClient } from 'chromadb';
import env from './env.js';
import logger from '../utils/logger.js';

let chromaClient = null;

try {
  chromaClient = new ChromaClient({
    path: env.chromaUrl,
  });
  logger.info(`ChromaDB client configured at ${env.chromaUrl}`);
} catch (error) {
  logger.warn(`ChromaDB client initialization warning: ${error.message}`);
}

export async function testChromaConnection() {
  try {
    if (!chromaClient) return false;
    const version = await chromaClient.version();
    logger.info(`ChromaDB connected successfully. Version: ${version}`);
    return true;
  } catch (error) {
    logger.warn(`ChromaDB not reachable at ${env.chromaUrl} (${error.message}). Vector search will degrade gracefully.`);
    return false;
  }
}

export default chromaClient;
