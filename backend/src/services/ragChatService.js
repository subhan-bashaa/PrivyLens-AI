import ragService from './rag.service.js';
import referenceRetrievalService from './referenceRetrievalService.js';
import aiService from './ai.service.js';
import policyModel from '../models/policy.model.js';
import logger from '../utils/logger.js';

export const ragChatService = {
  // Conversational Grounded RAG with Persona Context and Statutory Baseline
  async askQuestion({ policyId, question, persona = 'general' }) {
    const normPersona = (persona || 'general').toLowerCase();
    logger.info(`Running Grounded RAG Chat on policy: ${policyId} (Persona: ${normPersona}) for question: "${question}"`);

    // 1. Retrieve top matching policy chunks
    const policyChunks = await ragService.searchRelevantChunks(policyId, question, 4);

    // 2. Retrieve relevant authoritative references
    const statutoryRefs = await referenceRetrievalService.searchReferences(question, 2);

    if (!policyChunks || policyChunks.length === 0) {
      return {
        answer: "I couldn't find sufficient evidence in this privacy policy to answer that confidently.",
        evidence: [],
        references: [],
        persona: normPersona,
      };
    }

    // Assemble context
    const policyContext = policyChunks
      .map((c, i) => `[Policy Citation #${i + 1} - Section: ${c.section}]\n${c.content}`)
      .join('\n\n---\n\n');

    const legalContext = statutoryRefs.length > 0
      ? '\n\nAuthoritative Statutory Baselines (DPDP Act / NIST Framework):\n' +
        statutoryRefs.map((r, i) => `[Reference #${i + 1} - ${r.document_name} ${r.section}]: ${r.statutory_requirement}`).join('\n\n')
      : '';

    const systemPrompt = `You are PrivyLens AI, an objective, evidence-grounded privacy intelligence agent.
You are assisting a user who has identified as a: "${normPersona.toUpperCase()}".

STRICT GROUNDING RULES:
1. Your answers MUST be strictly derived ONLY from the provided policy clauses and authoritative legal references below.
2. If the policy does not address the question, reply ONLY with:
   "I couldn't find sufficient evidence in this privacy policy to answer that confidently."
3. Adapt the explanation to the user's persona (${normPersona.toUpperCase()}) without altering factual evidence.
   - Student: Explain real-world impact around college, campus life, mobile apps, social media, location tracing.
   - Parent: Focus on child data protection, parental consent (DPDP Act Sec 9), behavioral monitoring.
   - Employee: Focus on workplace tracking, corporate devices, employer access, retention.
   - Business: Focus on vendor risk, DPO contacts, GDPR/DPDP liability, breach timelines.
   - General: Use simple, everyday non-technical terms.
4. Output a single valid JSON object strictly matching this schema:
{
  "answer": "Direct answer explaining what the policy permits or forbids, contextualized for the persona.",
  "evidence": [
    {
      "section": "Section name from policy citation",
      "quote": "Exact verbatim quote from policy proving this point",
      "relevance": 0.95
    }
  ],
  "applicableReferences": [
    {
      "document": "e.g. DPDP Act 2023 or NIST Privacy Framework",
      "section": "e.g. Section 9 or PR.DS-P",
      "summary": "Short explanation of the legal right or obligation"
    }
  ]
}`;

    const userPrompt = `Retrieved Policy Clauses:\n${policyContext}\n${legalContext}\n\nUser Question: "${question}"`;

    try {
      const response = await aiService.executeWithFallback(systemPrompt, userPrompt);
      return {
        answer: response.answer || "I couldn't find sufficient evidence in this privacy policy to answer that confidently.",
        evidence: (response.evidence || []).map((e, idx) => ({
          section: e.section || policyChunks[idx]?.section || 'Policy Terms',
          content: e.quote || policyChunks[idx]?.content || '',
          relevance: e.relevance || policyChunks[idx]?.relevance || 0.9,
        })),
        references: response.applicableReferences || statutoryRefs.map((r) => ({
          document: r.document_name,
          section: r.section,
          summary: r.topic,
        })),
        persona: normPersona,
      };
    } catch (err) {
      logger.error(`RAG chat inference error: ${err.message}`);
      return {
        answer: "I couldn't find sufficient evidence in this privacy policy to answer that confidently.",
        evidence: [],
        references: [],
        persona: normPersona,
      };
    }
  },

  // General Privacy / Statutory Assistant (when no policy is selected)
  async askGlobalQuestion({ question, persona = 'general' }) {
    const normPersona = (persona || 'general').toLowerCase();
    logger.info(`Running Global Privacy Assistant (Persona: ${normPersona}) for question: "${question}"`);

    const statutoryRefs = await referenceRetrievalService.searchReferences(question, 4);

    const legalContext = statutoryRefs.length > 0
      ? statutoryRefs.map((r, i) => `[Reference #${i + 1} - ${r.document_name} ${r.section} (${r.topic})]: ${r.statutory_requirement}`).join('\n\n')
      : 'Authoritative standards: Digital Personal Data Protection Act 2023 (DPDP Act), DPDP Rules 2025, and NIST Privacy Framework Version 1.0.';

    const systemPrompt = `You are PrivyLens AI, an objective, legally grounded privacy intelligence assistant.
The user persona is: "${normPersona.toUpperCase()}".

AUTHORITATIVE BASELINES:
${legalContext}

RULES:
1. Explain statutory rights, consent requirements, tracking limits, and user protections under DPDP Act 2023, DPDP Rules 2025, and NIST Privacy Framework.
2. Frame explanations according to the user's persona (${normPersona.toUpperCase()}):
   - Student: Mobile privacy, educational tools, campus tracking, app permissions.
   - Parent: DPDP Section 9 child data protection, parental consent, predatory ads.
   - Employee: Workplace monitoring, BYOD surveillance, employee personal data bounds.
   - Business: Compliance obligations, data fiduciaries, consent notices, penalties.
   - General: Plain, clear, jargon-free explanations.
3. Respond in JSON matching:
{
  "answer": "Clear, direct guidance grounded in privacy law and framework standards.",
  "evidence": [],
  "applicableReferences": [
    { "document": "DPDP Act 2023 / NIST Framework", "section": "Section citation", "summary": "Key requirement" }
  ]
}`;

    const userPrompt = `User Question: "${question}"`;

    try {
      const response = await aiService.executeWithFallback(systemPrompt, userPrompt);
      return {
        answer: response.answer || "Based on DPDP Act 2023 and privacy framework standards, you are entitled to notice and consent prior to data processing.",
        evidence: [],
        references: response.applicableReferences || statutoryRefs.map((r) => ({
          document: r.document_name,
          section: r.section,
          summary: r.topic,
        })),
        persona: normPersona,
      };
    } catch (err) {
      logger.error(`Global chat inference error: ${err.message}`);
      return {
        answer: "Under the Digital Personal Data Protection Act 2023, personal data may only be processed for specified lawful purposes with verifiable consent or legitimate uses.",
        evidence: [],
        references: statutoryRefs.map((r) => ({
          document: r.document_name,
          section: r.section,
          summary: r.topic,
        })),
        persona: normPersona,
      };
    }
  },
};

export default ragChatService;
