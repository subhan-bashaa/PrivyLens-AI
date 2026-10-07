import aiService from './ai.service.js';
import logger from '../utils/logger.js';

export const privacyFactExtractionService = {
  // Extract Structured Privacy Facts with Verifiable Evidence & Confidence
  async extractFacts(policyText, userRole = 'general') {
    logger.info('Extracting structured privacy facts across 10 statutory dimensions and full policy summary...');

    // Support up to ~45,000 characters for complete policy coverage (e.g. comprehensive legal terms)
    const truncated = policyText.length > 45000 ? policyText.substring(0, 45000) + '\n[...truncated...]' : policyText;

    const systemPrompt = `You are the PrivyLens AI Privacy Intelligence and Summarization Engine.
Your objective is to thoroughly analyze the provided privacy policy, extract verifiable facts, and generate a comprehensive, plain-language summary of the entire policy.

You MUST NOT hallucinate, extrapolate, or invent facts. Base every finding on the actual text.
Tailor recommendations and executive focus for the user persona: "${userRole}".

You must output a single valid JSON object strictly matching this schema:
{
  "summary": "A concise 2-3 paragraph plain-English overview synthesizing the entire privacy policy.",
  "structured_summary": {
    "data_collected": "Comprehensive paragraph summarizing all personal, sensitive, biometric, location, and device data collected from users.",
    "purpose_of_data_use": "Comprehensive paragraph summarizing why and how the service processes user data (e.g., account operation, features, communications, safety, personalized ads).",
    "data_sharing": "Comprehensive paragraph summarizing third-party disclosures (e.g., service providers, ad networks, business partners, legal/law enforcement, affiliates).",
    "data_retention": "Comprehensive paragraph summarizing retention timelines, deletion rules, chat/message lifecycles, and legal archival periods.",
    "user_rights": "Comprehensive paragraph summarizing statutory user rights (access, download, rectification, deletion, consent withdrawal, regional laws like DPDP, GDPR, CCPA).",
    "security": "Comprehensive paragraph summarizing security safeguards (encryption in transit TLS, storage security, access controls, international data transfer safeguards).",
    "other_important_points": "Comprehensive paragraph summarizing minimum age requirements (e.g., 13+), policy change notices, dispute mechanisms, and jurisdictional specifics."
  },
  "executive_synthesis": {
    "verdict": "Proceed with Caution | Safe to Use | High Risk Profile",
    "verdict_summary": "One clear, actionable sentence summarizing the privacy verdict and primary user advice.",
    "data_processing_purpose": "One clear sentence explaining the core purpose for which this service requires personal data.",
    "third_party_scope": "One clear sentence explaining who user data and telemetry are shared with."
  },
  "data_collection": {
    "summary": "Detailed plain-language summary of data collection practices.",
    "collected_items": ["list of specific collected data types, e.g. Name, Phone, Email, IP Address, Device Telemetry, Location"]
  },
  "data_sharing": {
    "summary": "Detailed plain-language summary of third-party sharing practices.",
    "sharing_recipients": ["list of third-party recipient categories, e.g. Payment Processors, Analytics Providers, Ad Networks, Affiliates"]
  },
  "tracking": {
    "summary": "Detailed plain-language summary of cookies, telemetry, and tracking beacons.",
    "methods": ["list of tracking methods, e.g. Essential Session Cookies, Google Analytics, Advertising Pixels, Device Fingerprinting"]
  },
  "retention": {
    "summary": "Detailed plain-language summary of data retention timelines and deletion policies.",
    "policies": ["list of retention guidelines, e.g. Retained for active account duration, Chats deleted after 24 hours, Purged on request"]
  },
  "user_rights": {
    "summary": "Detailed plain-language summary of user statutory rights.",
    "rights_list": ["list of specific user rights, e.g. Right to Access, Right to Erasure, Right to Correction, Grievance Redressal"]
  },
  "security": {
    "summary": "Detailed plain-language summary of security and encryption safeguards.",
    "measures": ["list of security measures, e.g. TLS 1.3 Encryption in Transit, AES-256 Storage Encryption, Access Controls"]
  },
  "other_important_points": {
    "summary": "Detailed plain-language summary of age requirements, updates, and cross-border transfers.",
    "points": ["list of highlights, e.g. 13+ age restriction, In-app policy update notices, Cross-border transfer safeguards"]
  },
  "facts": [
    {
      "factor": "name of factor (e.g., location_collection, third_party_advertising, data_deletion_available, child_data_collection, biometric_data, data_retention_period, encryption_safeguard, cross_border_transfer, automated_profiling, breach_notification)",
      "dimension": "data_collection | purpose | data_sharing | tracking | retention | user_rights | security | children | automated_decision | international_transfers",
      "value": true, 
      "confidence": 0.95,
      "evidence": "Exact verbatim quote from the text, or null if value is not_found",
      "section": "Section name if known"
    }
  ],
  "collected_data_types": ["list of explicit data elements collected"],
  "purposes": ["list of specified processing purposes"],
  "sharing_recipients": ["list of third-party recipient categories"],
  "tracking_methods": ["cookies", "pixels", "device_fingerprinting", etc.],
  "retention_policy": {
    "duration_statement": "exact stated period or 'unspecified'",
    "erasure_upon_request": true
  },
  "user_rights_provided": ["access", "correction", "erasure", "consent_withdrawal", "grievance"],
  "security_measures": ["encryption_in_transit", "encryption_at_rest", "access_controls", "logging"],
  "child_safeguards": {
    "collects_child_data": false,
    "parental_consent_required": true,
    "child_tracking_prohibited": true
  },
  "red_flags": [
    {
      "title": "Concern title",
      "severity": "Critical | High | Medium",
      "description": "Why this creates privacy risk",
      "evidence": "Verbatim quote from policy"
    }
  ],
  "positive_findings": [
    {
      "title": "Positive safeguard",
      "description": "Good privacy practice",
      "evidence": "Verbatim quote from policy"
    }
  ]
}`;

    const userPrompt = `Here is the operative Privacy Policy text to analyze:\n\n${truncated}`;

    const extracted = await aiService.executeWithFallback(systemPrompt, userPrompt);
    return extracted;
  },
};

export default privacyFactExtractionService;
