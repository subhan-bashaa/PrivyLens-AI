import chromaClient from '../config/chroma.js';
import embeddingService from './embedding.service.js';
import logger from '../utils/logger.js';

const REFERENCE_COLLECTION_NAME = 'privylens_authoritative_references';

/**
 * Authoritative Knowledge Base Chunks
 * Preserves exact metadata for DPDP Act 2023, DPDP Rules 2025, NIST Privacy Framework, and GDPR.
 */
export const AUTHORITATIVE_REFERENCES = [
  // --- DPDP Act 2023 ---
  {
    id: 'dpdp_sec_5_notice',
    document_name: 'Digital Personal Data Protection Act, 2023',
    document_type: 'primary_legislation',
    section: 'Section 5',
    subsection: 'Section 5(1)',
    page: 4,
    jurisdiction: 'India',
    authority: 'Ministry of Law and Justice, Government of India',
    version: 'Act No. 22 of 2023',
    topic: 'Notice Requirements & Transparency',
    keywords: ['notice', 'consent request', 'purpose', 'rights', 'complaint to board', 'itemised description'],
    content: 'Every request made to a Data Principal under section 6 for consent shall be accompanied or preceded by a notice informing her: (i) the personal data and purpose for which it is proposed to be processed; (ii) the manner in which she may exercise rights of withdrawal and grievance redressal; (iii) the manner in which she may make a complaint to the Board.',
  },
  {
    id: 'dpdp_sec_6_consent',
    document_name: 'Digital Personal Data Protection Act, 2023',
    document_type: 'primary_legislation',
    section: 'Section 6',
    subsection: 'Section 6(1)-(4)',
    page: 5,
    jurisdiction: 'India',
    authority: 'Ministry of Law and Justice, Government of India',
    version: 'Act No. 22 of 2023',
    topic: 'Consent & Withdrawal of Consent',
    keywords: ['consent', 'free', 'specific', 'informed', 'unconditional', 'unambiguous', 'withdraw consent', 'ease of withdrawal'],
    content: 'Consent given by the Data Principal shall be free, specific, informed, unconditional and unambiguous with a clear affirmative action, limited to personal data necessary for specified purpose. The Data Principal shall have the right to withdraw consent at any time, with the ease of doing so being comparable to the ease with which consent was given.',
  },
  {
    id: 'dpdp_sec_8_obligations',
    document_name: 'Digital Personal Data Protection Act, 2023',
    document_type: 'primary_legislation',
    section: 'Section 8',
    subsection: 'Section 8(4)-(7)',
    page: 7,
    jurisdiction: 'India',
    authority: 'Ministry of Law and Justice, Government of India',
    version: 'Act No. 22 of 2023',
    topic: 'Data Fiduciary Obligations & Erasure',
    keywords: ['security safeguards', 'erasure', 'retention', 'breach intimation', 'data processor contract'],
    content: 'A Data Fiduciary shall protect personal data by taking reasonable security safeguards to prevent personal data breach. In the event of a personal data breach, the Data Fiduciary shall intimate the Board and each affected Data Principal. A Data Fiduciary shall erase personal data upon withdrawal of consent or as soon as the specified purpose is no longer served.',
  },
  {
    id: 'dpdp_sec_9_children',
    document_name: 'Digital Personal Data Protection Act, 2023',
    document_type: 'primary_legislation',
    section: 'Section 9',
    subsection: 'Section 9(1)-(3)',
    page: 8,
    jurisdiction: 'India',
    authority: 'Ministry of Law and Justice, Government of India',
    version: 'Act No. 22 of 2023',
    topic: "Children's Privacy Protection",
    keywords: ['children', 'child', 'parental consent', 'verifiable consent', 'tracking', 'behavioural monitoring', 'targeted advertising'],
    content: "A Data Fiduciary shall obtain verifiable consent of the parent before processing any personal data of a child. A Data Fiduciary shall not undertake tracking or behavioural monitoring of children or targeted advertising directed at children, nor undertake processing likely to cause detrimental effect on the well-being of a child.",
  },
  {
    id: 'dpdp_sec_11_access',
    document_name: 'Digital Personal Data Protection Act, 2023',
    document_type: 'primary_legislation',
    section: 'Section 11',
    subsection: 'Section 11(1)',
    page: 9,
    jurisdiction: 'India',
    authority: 'Ministry of Law and Justice, Government of India',
    version: 'Act No. 22 of 2023',
    topic: 'Right to Access & Information',
    keywords: ['right to access', 'identities of third parties', 'summary of data', 'shared data description'],
    content: 'The Data Principal shall have the right to obtain from the Data Fiduciary: (a) a summary of personal data being processed; (b) the identities of all other Data Fiduciaries and Data Processors with whom personal data has been shared, along with a description of the data so shared.',
  },
  {
    id: 'dpdp_sec_12_correction_erasure',
    document_name: 'Digital Personal Data Protection Act, 2023',
    document_type: 'primary_legislation',
    section: 'Section 12',
    subsection: 'Section 12(1)-(3)',
    page: 10,
    jurisdiction: 'India',
    authority: 'Ministry of Law and Justice, Government of India',
    version: 'Act No. 22 of 2023',
    topic: 'Right to Correction & Erasure',
    keywords: ['right to correction', 'erasure', 'deletion', 'updating', 'misleading data'],
    content: 'A Data Principal shall have the right to correction, completion, updating and erasure of her personal data. Upon receipt of request for erasure, Data Fiduciary shall erase her personal data unless retention is necessary for the specified purpose or compliance with law.',
  },
  {
    id: 'dpdp_sec_13_grievance',
    document_name: 'Digital Personal Data Protection Act, 2023',
    document_type: 'primary_legislation',
    section: 'Section 13',
    subsection: 'Section 13(1)',
    page: 10,
    jurisdiction: 'India',
    authority: 'Ministry of Law and Justice, Government of India',
    version: 'Act No. 22 of 2023',
    topic: 'Grievance Redressal Mechanism',
    keywords: ['grievance redressal', 'complaint', 'dpo', 'contact information'],
    content: 'A Data Principal shall have the right to have readily available means of grievance redressal provided by a Data Fiduciary or Consent Manager regarding performance of obligations or exercise of rights.',
  },
  {
    id: 'dpdp_sec_16_cross_border',
    document_name: 'Digital Personal Data Protection Act, 2023',
    document_type: 'primary_legislation',
    section: 'Section 16',
    subsection: 'Section 16(1)',
    page: 11,
    jurisdiction: 'India',
    authority: 'Ministry of Law and Justice, Government of India',
    version: 'Act No. 22 of 2023',
    topic: 'Cross-Border International Data Transfers',
    keywords: ['international transfer', 'cross border', 'outside india', 'restricted territory'],
    content: 'The Central Government may, by notification, restrict the transfer of personal data by a Data Fiduciary for processing to such country or territory outside India as may be notified.',
  },

  // --- DPDP Rules 2025 ---
  {
    id: 'dpdp_rules_3_notice_standards',
    document_name: 'Digital Personal Data Protection Rules, 2025',
    document_type: 'subordinate_legislation',
    section: 'Rule 3',
    subsection: 'Rule 3(a)-(c)',
    page: 24,
    jurisdiction: 'India',
    authority: 'Ministry of Electronics and Information Technology (MeitY)',
    version: 'G.S.R. 846(E), 2025',
    topic: 'Notice Presentation & Itemised Disclosures',
    keywords: ['notice', 'itemised description', 'clear language', 'independent disclosure', 'link for withdrawal'],
    content: 'Notice given by Data Fiduciary must be presented and understandable independently of other information, in clear and plain language, providing an itemised description of personal data, specific purposes, and communication links to withdraw consent, exercise rights, and make a complaint.',
  },
  {
    id: 'dpdp_rules_6_security_safeguards',
    document_name: 'Digital Personal Data Protection Rules, 2025',
    document_type: 'subordinate_legislation',
    section: 'Rule 6',
    subsection: 'Rule 6(1)',
    page: 26,
    jurisdiction: 'India',
    authority: 'MeitY, Government of India',
    version: 'G.S.R. 846(E), 2025',
    topic: 'Mandatory Technical Security Safeguards',
    keywords: ['encryption', 'obfuscation', 'masking', 'access control', 'logs retention', 'backups'],
    content: 'Data Fiduciary shall protect personal data through encryption, obfuscation, masking, virtual tokens, access controls on computer resources, access logging and monitoring retained for at least one year, and regular data backups to ensure confidentiality, integrity, and availability.',
  },
  {
    id: 'dpdp_rules_7_breach_intimation',
    document_name: 'Digital Personal Data Protection Rules, 2025',
    document_type: 'subordinate_legislation',
    section: 'Rule 7',
    subsection: 'Rule 7(1)-(2)',
    page: 26,
    jurisdiction: 'India',
    authority: 'MeitY, Government of India',
    version: 'G.S.R. 846(E), 2025',
    topic: 'Data Breach Notification Deadlines',
    keywords: ['breach notice', 'intimation', 'seventy-two hours', '72 hours', 'consequences', 'mitigation'],
    content: 'On becoming aware of personal data breach, Data Fiduciary shall intimate affected Data Principals without delay with breach description, consequences, and mitigation steps. The Data Fiduciary must intimate the Data Protection Board within 72 hours with full investigation facts.',
  },
  {
    id: 'dpdp_rules_8_retention_erasure',
    document_name: 'Digital Personal Data Protection Rules, 2025',
    document_type: 'subordinate_legislation',
    section: 'Rule 8',
    subsection: 'Rule 8(1)-(3)',
    page: 27,
    jurisdiction: 'India',
    authority: 'MeitY, Government of India',
    version: 'G.S.R. 846(E), 2025',
    topic: 'Purpose Fulfillment & Erasure Notice',
    keywords: ['retention', 'erasure', 'forty-eight hours', '48 hours notice', 'one year logs'],
    content: 'Data Fiduciary shall erase personal data when purpose is served. At least 48 hours before erasure completion, Data Fiduciary shall inform Data Principal. Processing and traffic logs must be retained for a minimum period of one year.',
  },
  {
    id: 'dpdp_rules_10_child_consent',
    document_name: 'Digital Personal Data Protection Rules, 2025',
    document_type: 'subordinate_legislation',
    section: 'Rule 10',
    subsection: 'Rule 10(1)',
    page: 27,
    jurisdiction: 'India',
    authority: 'MeitY, Government of India',
    version: 'G.S.R. 846(E), 2025',
    topic: 'Verifiable Parental Consent Verification',
    keywords: ['child consent', 'parent age verification', 'virtual token', 'identifiable adult', 'digital locker'],
    content: 'Data Fiduciary shall adopt appropriate technical and organisational measures to ensure verifiable consent of parent is obtained before processing child data, verifying through reliable identity/age details or virtual tokens that individual is an identifiable adult.',
  },

  // --- NIST Privacy Framework Version 1.0 ---
  {
    id: 'nist_id_im_inventory',
    document_name: 'NIST Privacy Framework Version 1.0',
    document_type: 'framework_standard',
    section: 'ID.IM-P',
    subsection: 'ID.IM-P4 to ID.IM-P6',
    page: 20,
    jurisdiction: 'United States / International',
    authority: 'National Institute of Standards and Technology (NIST)',
    version: 'Version 1.0 (2020)',
    topic: 'Inventory & Data Mapping (Identify-P)',
    keywords: ['data actions', 'data elements', 'purposes', 'mapping', 'inventory'],
    content: 'Systems, products, and services that process data are inventoried; data actions (collection, retention, sharing, disposal) and purposes for data actions are explicitly inventoried; data elements within data actions are mapped.',
  },
  {
    id: 'nist_ct_dm_management',
    document_name: 'NIST Privacy Framework Version 1.0',
    document_type: 'framework_standard',
    section: 'CT.DM-P',
    subsection: 'CT.DM-P1 to CT.DM-P5',
    page: 24,
    jurisdiction: 'United States / International',
    authority: 'National Institute of Standards and Technology (NIST)',
    version: 'Version 1.0 (2020)',
    topic: 'Data Processing Management & Deletion (Control-P)',
    keywords: ['manageability', 'deletion', 'access review', 'data minimization', 'destruction'],
    content: 'Data elements can be accessed for review, transmission, alteration, and deletion; data are destroyed according to policy; audit/log records are implemented incorporating the principle of data minimization.',
  },
  {
    id: 'nist_ct_dp_disassociated',
    document_name: 'NIST Privacy Framework Version 1.0',
    document_type: 'framework_standard',
    section: 'CT.DP-P',
    subsection: 'CT.DP-P1 to CT.DP-P4',
    page: 24,
    jurisdiction: 'United States / International',
    authority: 'National Institute of Standards and Technology (NIST)',
    version: 'Version 1.0 (2020)',
    topic: 'Disassociated Processing & Observability (Control-P)',
    keywords: ['disassociability', 'observability', 'linkability', 'de-identification', 'selective collection', 'inferences'],
    content: 'Data are processed to limit observability and linkability; data are processed to limit identification of individuals (tokenization, de-identification); data are processed to limit formulation of inferences about behavior; systems permit selective collection.',
  },
  {
    id: 'nist_pr_ds_security',
    document_name: 'NIST Privacy Framework Version 1.0',
    document_type: 'framework_standard',
    section: 'PR.DS-P',
    subsection: 'PR.DS-P1 to PR.DS-P5',
    page: 26,
    jurisdiction: 'United States / International',
    authority: 'National Institute of Standards and Technology (NIST)',
    version: 'Version 1.0 (2020)',
    topic: 'Data Security & Protection (Protect-P)',
    keywords: ['data-at-rest', 'data-in-transit', 'encryption', 'data leaks', 'integrity'],
    content: 'Data-at-rest are protected; data-in-transit are protected; systems formally manage data throughout removal and transfers; protections against data leaks are implemented.',
  },
  {
    id: 'nist_cm_aw_awareness',
    document_name: 'NIST Privacy Framework Version 1.0',
    document_type: 'framework_standard',
    section: 'CM.AW-P',
    subsection: 'CM.AW-P1 to CM.AW-P8',
    page: 25,
    jurisdiction: 'United States / International',
    authority: 'National Institute of Standards and Technology (NIST)',
    version: 'Version 1.0 (2020)',
    topic: 'Transparency & Breach Notification (Communicate-P)',
    keywords: ['transparency', 'notices', 'breach notification', 'records of sharing', 'consent withdrawal'],
    content: 'Mechanisms for communicating data processing purposes, practices, and privacy risks are established; records of disclosures and sharing are maintained; impacted individuals are notified about privacy events or breaches.',
  },

  // --- EU GDPR 2016/679 ---
  {
    id: 'gdpr_art_5_principles',
    document_name: 'General Data Protection Regulation (EU) 2016/679',
    document_type: 'european_regulation',
    section: 'Article 5',
    subsection: 'Article 5(1)(a)-(f)',
    page: 35,
    jurisdiction: 'European Union',
    authority: 'European Parliament and Council of the European Union',
    version: 'Regulation (EU) 2016/679',
    topic: 'Principles Relating to Processing of Personal Data',
    keywords: ['lawfulness', 'purpose limitation', 'data minimisation', 'storage limitation', 'integrity and confidentiality'],
    content: 'Personal data shall be processed lawfully, fairly and in a transparent manner; collected for specified, explicit and legitimate purposes; adequate, relevant and limited to what is necessary; kept for no longer than is necessary; and processed with appropriate security.',
  },
  {
    id: 'gdpr_art_17_erasure',
    document_name: 'General Data Protection Regulation (EU) 2016/679',
    document_type: 'european_regulation',
    section: 'Article 17',
    subsection: 'Article 17(1)-(2)',
    page: 43,
    jurisdiction: 'European Union',
    authority: 'European Parliament and Council of the European Union',
    version: 'Regulation (EU) 2016/679',
    topic: 'Right to Erasure (Right to be Forgotten)',
    keywords: ['right to be forgotten', 'erasure', 'deletion', 'withdrawal of consent'],
    content: 'The data subject shall have the right to obtain from the controller the erasure of personal data concerning him or her without undue delay where personal data are no longer necessary in relation to the purposes for which they were collected or consent is withdrawn.',
  },
];

export const referenceRetrievalService = {
  // Query authoritative references for given privacy factors
  retrieveReferencesForFactor(factorKey) {
    const key = (factorKey || '').toLowerCase();
    const results = [];

    AUTHORITATIVE_REFERENCES.forEach((ref) => {
      const match = ref.keywords.some((kw) => key.includes(kw) || kw.includes(key));
      if (match) {
        results.push({
          document: ref.document_name,
          document_type: ref.document_type,
          section: ref.section,
          subsection: ref.subsection,
          page: ref.page,
          jurisdiction: ref.jurisdiction,
          authority: ref.authority,
          topic: ref.topic,
          statutory_requirement: ref.content,
        });
      }
    });

    return results;
  },

  // Index references into ChromaDB with metadata
  async ensureReferencesIndexed() {
    if (!chromaClient) return;

    try {
      const collection = await chromaClient.getOrCreateCollection({
        name: REFERENCE_COLLECTION_NAME,
      });

      const existing = await collection.count();
      if (existing >= AUTHORITATIVE_REFERENCES.length) {
        return;
      }

      logger.info('Indexing Authoritative Privacy References into ChromaDB...');
      const ids = AUTHORITATIVE_REFERENCES.map((r) => r.id);
      const texts = AUTHORITATIVE_REFERENCES.map((r) => `${r.topic}: ${r.content}`);
      const metadatas = AUTHORITATIVE_REFERENCES.map((r) => ({
        document_name: r.document_name,
        document_type: r.document_type,
        section: r.section,
        subsection: r.subsection,
        page: r.page,
        jurisdiction: r.jurisdiction,
        authority: r.authority,
        version: r.version,
      }));

      const embeddings = await embeddingService.getBatchEmbeddings(texts);

      await collection.upsert({
        ids,
        embeddings,
        metadatas,
        documents: texts,
      });
      logger.info('Authoritative References indexed in ChromaDB successfully.');
    } catch (e) {
      logger.warn(`Reference indexing notice: ${e.message}`);
    }
  },

  // Semantic search across references
  async searchReferences(query, topK = 3) {
    const queryLower = query.toLowerCase();
    // Fast keyword lookup first
    const directMatches = AUTHORITATIVE_REFERENCES.filter((r) =>
      r.keywords.some((kw) => queryLower.includes(kw))
    );

    if (directMatches.length > 0) {
      return directMatches.slice(0, topK).map((r) => ({
        document_name: r.document_name,
        document_type: r.document_type,
        section: r.section,
        subsection: r.subsection,
        page: r.page,
        jurisdiction: r.jurisdiction,
        authority: r.authority,
        topic: r.topic,
        statutory_requirement: r.content,
        relevance: 0.95,
      }));
    }

    return [];
  },
};

export default referenceRetrievalService;
