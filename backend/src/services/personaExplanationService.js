import aiService from './ai.service.js';
import logger from '../utils/logger.js';

export const personaExplanationService = {
  // Generate persona-specific explanations without mutating factual evidence or score
  async generateExplanation({ facts, collectedTypes, sharingRecipients, trackingMethods, retention, rights, security, score, persona = 'general' }) {
    const normPersona = (persona || 'general').toLowerCase();
    logger.info(`Synthesizing persona-oriented privacy explanation for: ${normPersona.toUpperCase()}`);

    // Context guidelines per persona
    const personaGuidelines = {
      student: `Focus on: campus/home location tracking, device telemetry, social media/search history, advertising profiling, educational app permissions, and third-party data sharing.
Example emphasis: "This app may collect your location. If you use it regularly around college, home, or other places, this information could reveal patterns about where you spend your time."`,
      parent: `Focus strongly on: children's data collection, verifiable parental consent under DPDP Act Sec 9, child tracking/profiling, targeted advertising to minors, photos/videos, and family data.
Example emphasis: "Because this policy allows tracking or profiling, parents should check whether children's accounts or devices are affected."`,
      employee: `Focus on: work email, employer visibility, workplace monitoring, device telemetry on corporate/BYOD hardware, activity logs, third-party processors, and post-employment retention.
Example emphasis: "This service may collect device and activity information. If used for work, check whether your employer or third-party providers can access or retain this information."`,
      business: `Focus on: enterprise liability, customer data handling, vendor risk, compliance with DPDP Act and NIST Framework, encryption standards, breach notification timelines, and data retention.
Example emphasis: "This policy allows third-party processing of customer information. A business should verify what vendors receive the data, how long they retain it, and what security safeguards are described."`,
      general: `Focus on: simple, clear, non-technical explanations. Summarize what is collected, who gets it, tracking mechanisms, key red flags, and plain advice in everyday terms.`,
    };

    const targetGuideline = personaGuidelines[normPersona] || personaGuidelines.general;

    const systemPrompt = `You are PrivyLens AI, an objective privacy advocate.
You are explaining an analyzed privacy policy to a user whose persona is: "${normPersona.toUpperCase()}".

CRITICAL RULES:
1. The persona MUST NOT change the extracted facts.
2. The persona MUST NOT change the legal references.
3. The persona MUST NOT invent risks not present in the facts.
4. The persona ONLY changes the framing, emphasis, relatable examples, and tailored recommendations.
5. Answer the 10 core questions directly for this user.

Persona Guidance:
${targetGuideline}

Output a single valid JSON object strictly matching this schema:
{
  "whatItMeansForYou": "2-3 paragraphs explaining the real-world impact for this specific persona",
  "recommendationStatus": "Proceed with caution | Avoid | Safe to use | High Risk Action Required",
  "personaQuestions": {
    "whatDoesItCollect": "Summary of collected data elements in plain terms",
    "whyDoesItCollect": "Specified processing purposes",
    "whoReceivesIt": "Categories of external recipients or brokers",
    "howLongKept": "Retention period and erasure conditions",
    "doesItTrackMe": "Explanation of cookies, pixels, or location tracking",
    "whatRightsDoIHave": "Available rights like deletion, access, and consent withdrawal",
    "biggestConcerns": ["Top 2-3 concerns relevant to this persona"],
    "positivePractices": ["1-2 positive privacy practices"],
    "personaImpact": "Direct advice for this user persona",
    "whatShouldIDo": ["3 concrete, actionable steps the user should take right now"]
  }
}`;

    const userPrompt = `Analyzed Policy Facts:
- Risk Score: ${score.display} (${score.riskLevel})
- Collected Data: ${collectedTypes.join(', ')}
- Sharing Recipients: ${sharingRecipients.join(', ')}
- Tracking Methods: ${trackingMethods.join(', ')}
- Retention: ${retention.duration_statement || 'Unspecified'} (Erasure on request: ${retention.erasure_upon_request})
- Rights: ${rights.join(', ')}
- Security: ${security.join(', ')}`;

    try {
      const result = await aiService.executeWithFallback(systemPrompt, userPrompt);
      return result;
    } catch (e) {
      logger.warn(`Persona synthesis fallback: ${e.message}`);
      return {
        whatItMeansForYou: `This service has an overall risk rating of ${score.display} (${score.riskLevel}). Based on your persona (${normPersona}), review third-party sharing and device telemetry permissions.`,
        recommendationStatus: score.value > 60 ? 'Proceed with caution' : 'Safe to use',
        personaQuestions: {
          whatDoesItCollect: collectedTypes.join(', '),
          whyDoesItCollect: 'Service delivery and analytics',
          whoReceivesIt: sharingRecipients.join(', '),
          howLongKept: retention.duration_statement || 'Unspecified',
          doesItTrackMe: trackingMethods.join(', '),
          whatRightsDoIHave: rights.join(', '),
          biggestConcerns: ['Third-party sharing', 'Persistent tracking'],
          positivePractices: ['Encryption safeguards'],
          personaImpact: `Pay close attention to data collection when using this service as a ${normPersona}.`,
          whatShouldIDo: ['Review in-app privacy toggles', 'Opt-out of behavioral advertising', 'Request data deletion when finished'],
        },
      };
    }
  },
};

export default personaExplanationService;
