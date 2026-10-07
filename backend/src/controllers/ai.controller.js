import ragChatService from '../services/ragChatService.js';
import policyModel from '../models/policy.model.js';
import pool from '../config/db.js';

export const aiController = {
  // POST /api/ai/chat
  async chat(req, res, next) {
    try {
      const { policyId, question, role, persona } = req.body;
      const userId = req.user?.id || null;
      const activePersona = persona || role || req.user?.role || 'general';

      if (!question || typeof question !== 'string' || question.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Question is required.',
          error: 'VALIDATION_ERROR',
        });
      }

      // If policyId is 'global' or not provided, answer general privacy/statutory question
      if (!policyId || policyId === 'global') {
        const result = await ragChatService.askGlobalQuestion({
          question: question.trim(),
          persona: activePersona,
        });

        if (userId) {
          try {
            await pool.query(
              `INSERT INTO chat_sessions (user_id, policy_id) VALUES ($1, $2);`,
              [userId, null]
            );
          } catch (dbErr) {
            // Silently continue
          }
        }

        return res.status(200).json({
          success: true,
          data: {
            policyId: 'global',
            persona: activePersona,
            question: question.trim(),
            answer: result.answer,
            evidence: result.evidence || [],
            references: result.references || [],
          },
        });
      }

      // Check if policy exists in database
      let policy = null;
      try {
        policy = await policyModel.findById(policyId);
      } catch (err) {
        policy = null;
      }

      let result;
      if (policy) {
        // Generate Grounded, Persona-Aware Answer via RAG Pipeline
        result = await ragChatService.askQuestion({
          policyId,
          question: question.trim(),
          persona: activePersona,
        });

        if (userId) {
          try {
            await pool.query(
              `INSERT INTO chat_sessions (user_id, policy_id) VALUES ($1, $2);`,
              [userId, policy.id]
            );
          } catch (dbErr) {
            // Silently continue
          }
        }
      } else {
        // Service-aware or fallback grounded answering
        const serviceName = String(policyId).charAt(0).toUpperCase() + String(policyId).slice(1);
        result = await ragChatService.askGlobalQuestion({
          question: `Regarding ${serviceName}'s privacy practices and statutory compliance: ${question.trim()}`,
          persona: activePersona,
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          policyId,
          persona: activePersona,
          question: question.trim(),
          answer: result.answer,
          evidence: result.evidence || [],
          references: result.references || [],
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

export default aiController;
