import referenceRetrievalService from './referenceRetrievalService.js';

export const privacyMappingService = {
  // Map extracted policy facts to DPDP Act, DPDP Rules, and NIST Framework
  mapFactsToReferences(extractedFacts = []) {
    const mappings = [];

    extractedFacts.forEach((fact) => {
      const { factor, value, evidence, section } = fact;

      // Skip facts with no finding or where value is not_found unless significant
      if (!evidence && value === 'not_found') return;

      const matchedRefs = referenceRetrievalService.retrieveReferencesForFactor(factor);

      if (matchedRefs.length > 0) {
        mappings.push({
          factor,
          policy_finding: value,
          policy_evidence: evidence,
          policy_section: section || 'Operative Terms',
          references: matchedRefs.map((ref) => ({
            document: ref.document,
            document_type: ref.document_type,
            section: ref.section,
            subsection: ref.subsection,
            page: ref.page,
            jurisdiction: ref.jurisdiction,
            topic: ref.topic,
            statutory_requirement: ref.statutory_requirement,
            note: 'Referenced for legal/framework baseline compliance evaluation. Numerical risk weight is derived from PrivyLens methodology.',
          })),
        });
      }
    });

    return mappings;
  },
};

export default privacyMappingService;
