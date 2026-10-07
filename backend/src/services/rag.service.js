import chromaClient from '../config/chroma.js';
import embeddingService from './embedding.service.js';
import aiService from './ai.service.js';
import policyVersionModel from '../models/policyVersion.model.js';
import logger from '../utils/logger.js';

const COLLECTION_NAME = 'privylens_policy_chunks';

// In-Memory Vector Cache for fallback if ChromaDB server is offline
const inMemoryVectorStore = new Map();

// Helper: Cosine similarity between two vectors
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export const ragService = {
  // 1. Index Policy Chunks into ChromaDB & In-Memory Store
  async indexPolicy(policyId, versionId, fullText, sections = []) {
    logger.info(`Starting RAG vector indexing for policy: ${policyId} (v:${versionId})...`);

    // Chunk text using LangChain
    const chunks = await embeddingService.chunkText(fullText, {
      policyId,
      versionId,
      source: 'policy_document',
    });

    if (chunks.length === 0) return;

    // Attach section metadata if found
    chunks.forEach((chunk) => {
      const matchedSection = sections.find((sec) =>
        sec.content.includes(chunk.pageContent.substring(0, 50))
      );
      chunk.metadata.section = matchedSection ? matchedSection.title : 'Operative Terms';
    });

    const texts = chunks.map((c) => c.pageContent);
    const metadatas = chunks.map((c) => c.metadata);
    const ids = chunks.map((_, i) => `${policyId}_${versionId}_${i}`);

    // Generate Embeddings
    const embeddings = await embeddingService.getBatchEmbeddings(texts);

    // Save into in-memory store for instantaneous local search
    const policyChunks = texts.map((text, i) => ({
      id: ids[i],
      text,
      metadata: metadatas[i],
      embedding: embeddings[i],
    }));
    inMemoryVectorStore.set(policyId, policyChunks);

    // Persist into ChromaDB if available
    try {
      if (chromaClient) {
        const collection = await chromaClient.getOrCreateCollection({
          name: COLLECTION_NAME,
        });

        await collection.upsert({
          ids,
          embeddings,
          metadatas,
          documents: texts,
        });
        logger.info(`Successfully stored ${chunks.length} chunks in ChromaDB collection.`);
      }
    } catch (chromaError) {
      logger.warn(`ChromaDB indexing warning: ${chromaError.message}. Retaining in-memory vector cache.`);
    }
  },

  // 2. Similarity Search across Policy Chunks
  async searchRelevantChunks(policyId, query, topK = 4) {
    const queryEmbedding = await embeddingService.getEmbedding(query);

    // Try ChromaDB first
    try {
      if (chromaClient) {
        const collection = await chromaClient.getCollection({ name: COLLECTION_NAME });
        const results = await collection.query({
          queryEmbeddings: [queryEmbedding],
          nResults: topK,
          where: { policyId: { $eq: policyId } },
        });

        if (results && results.documents?.[0]?.length > 0) {
          return results.documents[0].map((doc, idx) => ({
            content: doc,
            section: results.metadatas[0][idx]?.section || 'General Terms',
            distance: results.distances?.[0]?.[idx] || 0.1,
            relevance: Math.round((1 - (results.distances?.[0]?.[idx] || 0.1)) * 100) / 100,
          }));
        }
      }
    } catch (err) {
      logger.debug(`ChromaDB query fallback: ${err.message}`);
    }

    // In-Memory Cosine Similarity Fallback
    const stored = inMemoryVectorStore.get(policyId);
    if (!stored || stored.length === 0) {
      // Re-hydrate from DB text if needed
      const version = await policyVersionModel.getLatestVersion(policyId);
      if (version && version.extracted_text) {
        await this.indexPolicy(policyId, version.id, version.extracted_text);
        return this.searchRelevantChunks(policyId, query, topK);
      }
      return [];
    }

    const scored = stored.map((item) => {
      const sim = cosineSimilarity(queryEmbedding, item.embedding);
      return {
        content: item.text,
        section: item.metadata.section || 'General Terms',
        relevance: Math.max(0, Math.min(0.99, Math.round(sim * 100) / 100)),
      };
    });

    scored.sort((a, b) => b.relevance - a.relevance);
    return scored.slice(0, topK);
  },

  // 3. Grounded Context-Based Q&A Generation
  async askPolicyQuestion(policyId, question, userRole = 'general') {
    logger.info(`Processing RAG question for policy ${policyId}: "${question}"`);

    // 1. Retrieve top matching chunks
    const relevantChunks = await this.searchRelevantChunks(policyId, question, 4);

    if (!relevantChunks || relevantChunks.length === 0) {
      return {
        answer: "I couldn't find sufficient evidence in this privacy policy to answer that confidently.",
        evidence: [],
      };
    }

    // Assemble context snippets
    const contextSnippets = relevantChunks
      .map((c, i) => `[Clause Citation #${i + 1} - Section: ${c.section}]\n${c.content}`)
      .join('\n\n---\n\n');

    const systemPrompt = `You are PrivyLens AI, an objective, evidence-grounded privacy intelligence assistant.
Your answers MUST be strictly derived ONLY from the provided policy clauses below.
Do NOT extrapolate, fabricate, or assume any information that is not explicitly stated in the context.
If the retrieved clauses do not contain the answer, reply ONLY with:
"I couldn't find sufficient evidence in this privacy policy to answer that confidently."
Adopt an objective tone tailored to the persona: "${userRole}".
Return a JSON object strictly matching this schema:
{
  "answer": "Clear, direct answer explaining the factual terms found in the policy.",
  "evidence": [
    {
      "section": "Name of section from citation",
      "quote": "Verbatim quote from the clause proving the answer",
      "relevance": 0.95
    }
  ]
}`;

    const userPrompt = `Retrieved Policy Clauses:\n${contextSnippets}\n\nUser Question: "${question}"`;

    try {
      const response = await aiService.executeWithFallback(systemPrompt, userPrompt);
      return {
        answer: response.answer || "I couldn't find sufficient evidence in this privacy policy to answer that confidently.",
        evidence: (response.evidence || []).map((e, idx) => ({
          section: e.section || relevantChunks[idx]?.section || 'Policy Terms',
          content: e.quote || relevantChunks[idx]?.content || '',
          relevance: e.relevance || relevantChunks[idx]?.relevance || 0.9,
        })),
      };
    } catch (err) {
      logger.error(`RAG inference failed: ${err.message}`);
      return {
        answer: "An error occurred while analyzing the policy clauses. Please try asking again.",
        evidence: [],
      };
    }
  },
};

export default ragService;
