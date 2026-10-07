import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import axios from 'axios';
import env from '../config/env.js';
import logger from '../utils/logger.js';

export const embeddingService = {
  // 1. Text Chunking via LangChain
  async chunkText(text, metadata = {}) {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 150,
      separators: ['\n\n', '\n', '. ', ' '],
    });

    const docs = await splitter.createDocuments([text], [metadata]);
    return docs.map((doc, idx) => ({
      pageContent: doc.pageContent.trim(),
      metadata: {
        ...doc.metadata,
        chunkIndex: idx,
      },
    }));
  },

  // 2. Generate Vector Embeddings (Gemini text-embedding-004)
  async getEmbedding(text) {
    if (!env.geminiApiKey) {
      return this.getLocalFallbackEmbedding(text);
    }

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${env.geminiApiKey}`;
      const payload = {
        model: 'models/text-embedding-004',
        content: {
          parts: [{ text: text.substring(0, 2048) }],
        },
      };

      const res = await axios.post(endpoint, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      });

      const values = res.data?.embedding?.values;
      if (Array.isArray(values) && values.length > 0) {
        return values;
      }
      return this.getLocalFallbackEmbedding(text);
    } catch (err) {
      logger.warn(`Gemini embedding failed (${err.message}). Using normalized fallback vector.`);
      return this.getLocalFallbackEmbedding(text);
    }
  },

  // Batch Embedding Generation
  async getBatchEmbeddings(texts) {
    const embeddings = [];
    for (const text of texts) {
      const emb = await this.getEmbedding(text);
      embeddings.push(emb);
    }
    return embeddings;
  },

  // High-performance deterministic fallback vector (768 dimensions)
  getLocalFallbackEmbedding(text) {
    const dimensions = 768;
    const vector = new Array(dimensions).fill(0);
    const clean = text.toLowerCase();

    for (let i = 0; i < clean.length; i++) {
      const charCode = clean.charCodeAt(i);
      const targetIdx = (charCode * 31 + i * 17) % dimensions;
      vector[targetIdx] += 1 / (1 + (i % 10));
    }

    // Normalize vector to unit length
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0)) || 1;
    return vector.map((v) => Math.round((v / magnitude) * 100000) / 100000);
  },
};

export default embeddingService;
