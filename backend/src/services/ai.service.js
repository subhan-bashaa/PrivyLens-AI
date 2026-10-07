import Groq from 'groq-sdk';
import axios from 'axios';
import env from '../config/env.js';
import logger from '../utils/logger.js';

// Initialize Primary Groq Client
const groq = new Groq({
  apiKey: env.groqApiKey,
});

// Throttling / Request Queue Helper (Delay between rapid API bursts)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function retryWithBackoff(fn, retries = 2, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    // Check if error is 429 (rate limit) or 5xx
    const status = error.status || error.response?.status;
    if (status === 429 || (status >= 500 && status < 600)) {
      const waitTime = delay + Math.floor(Math.random() * 500); // Exponential backoff with jitter
      logger.warn(`API Rate limit or server error encountered (${status}). Backing off for ${waitTime}ms before retry...`);
      await sleep(waitTime);
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const aiService = {
  // Call Primary Groq (Llama)
  async callGroq(systemPrompt, userPrompt) {
    logger.info(`Sending inference to Primary LLM (Groq: ${env.groqModel})...`);
    const completion = await groq.chat.completions.create({
      model: env.groqModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    return JSON.parse(content);
  },

  // Call Fallback Google Gemini (Highest throughput: gemini-2.0-flash-lite)
  async callGeminiFallback(systemPrompt, userPrompt) {
    logger.warn(`Triggering Fallback LLM (Google Gemini: ${env.geminiModel})...`);
    if (!env.geminiApiKey) {
      throw new Error('Gemini API key is not configured.');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent?key=${env.geminiApiKey}`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${systemPrompt}\n\nIMPORTANT: Respond with pure JSON only matching the schema.\n\n${userPrompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    };

    const res = await axios.post(endpoint, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 25000,
    });

    const rawText = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error('Empty response received from Gemini API.');
    }

    // Clean any markdown formatting if present
    const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    return JSON.parse(cleaned);
  },

  // Resilient High-Load API Execution with Provider Fallback
  async executeWithFallback(systemPrompt, userPrompt) {
    // 1. Try Primary: Groq API with retries
    try {
      return await retryWithBackoff(() => this.callGroq(systemPrompt, userPrompt), 2, 1200);
    } catch (groqError) {
      logger.error(`Primary LLM (Groq) failed or rate-limited: ${groqError.message}`);

      // 2. Fallback to Gemini Flash-Lite
      try {
        return await retryWithBackoff(() => this.callGeminiFallback(systemPrompt, userPrompt), 2, 1000);
      } catch (geminiError) {
        logger.error(`Fallback LLM (Gemini) failed: ${geminiError.message}`);
        throw new Error(`All LLM providers exhausted. Primary error: ${groqError.message}; Fallback error: ${geminiError.message}`);
      }
    }
  },

  // Analyze Privacy Policy Document
  async analyzePolicyText(policyText, userRole = 'general') {
    // Truncate to safe token boundary (~16,000 characters for high speed extraction)
    const truncatedText = policyText.length > 20000 ? policyText.substring(0, 20000) + '\n[...content truncated...]' : policyText;

    const systemPrompt = `You are PrivyLens AI, an enterprise-grade privacy policy analysis engine.
Extract factual information strictly from the provided text.
Do NOT invent or extrapolate facts not present in the text.
Tailor recommendations for the user persona: "${userRole}".
You must output a single valid JSON object strictly matching this schema:
{
  "summary": "Concise 2-3 paragraph overview of privacy practices",
  "data_collection": {
    "personal_data": ["list of collected personal identifiers"],
    "sensitive_data": ["biometrics, health, financial data, or empty if none"],
    "location_data": ["approximate or precise GPS tracking details"],
    "device_data": ["IP, device ID, telemetry details"]
  },
  "data_sharing": {
    "third_parties": ["categories of third parties receiving data"],
    "advertisers": ["targeted advertising networks or ad-brokers"],
    "service_providers": ["cloud hosts, payment processors, analytics"]
  },
  "tracking": {
    "cookies": true,
    "analytics": true,
    "advertising_tracking": true
  },
  "retention": {
    "duration": "Specified retention timeline or 'Indefinite / Unspecified'",
    "deletion_available": true
  },
  "user_rights": ["GDPR rights, CCPA opt-out, access, port, delete"],
  "security": ["Encryption at rest/in transit, SOC2, two-factor"],
  "red_flags": [
    {
      "title": "Short title of concern",
      "severity": "High or Critical or Medium",
      "description": "Explanation",
      "clause_quote": "Verbatim quote from policy"
    }
  ],
  "positive_findings": [
    {
      "title": "Positive privacy practice",
      "description": "Explanation"
    }
  ],
  "recommendations": ["Actionable steps for the user"]
}`;

    const userPrompt = `Here is the privacy policy document to analyze:\n\n${truncatedText}`;

    return await this.executeWithFallback(systemPrompt, userPrompt);
  },
};

export default aiService;
