export const evidenceService = {
  // Structure and validate evidence records
  compileEvidence(facts = [], redFlags = [], positiveFindings = []) {
    const compiled = [];

    // 1. Process Extracted Privacy Facts
    facts.forEach((fact, idx) => {
      let state = 'Unclear';
      if (fact.value === true) state = 'Yes (Affirmed in Policy)';
      else if (fact.value === false) state = 'No (Explicitly Denied)';
      else if (fact.value === 'not_found' || !fact.evidence) state = 'Not Mentioned';

      compiled.push({
        id: `ev-fact-${idx + 1}`,
        factor: fact.factor,
        dimension: fact.dimension || 'General',
        state,
        confidence: fact.confidence || 0.9,
        evidenceQuote: fact.evidence || null,
        section: fact.section || 'Operative Policy Terms',
        hasDirectEvidence: !!fact.evidence && fact.value !== 'not_found',
      });
    });

    // 2. Process Red Flags with Verbatim Proof
    redFlags.forEach((flag, idx) => {
      compiled.push({
        id: `ev-flag-${idx + 1}`,
        factor: flag.title,
        dimension: 'Red Flag',
        state: `Severity: ${flag.severity || 'High'}`,
        confidence: 0.95,
        evidenceQuote: flag.evidence || flag.clause_quote || null,
        section: 'Identified Concern',
        hasDirectEvidence: !!(flag.evidence || flag.clause_quote),
        description: flag.description,
      });
    });

    // 3. Process Positive Privacy Mitigations
    positiveFindings.forEach((pos, idx) => {
      compiled.push({
        id: `ev-pos-${idx + 1}`,
        factor: pos.title,
        dimension: 'Positive Safeguard',
        state: 'Mitigation Verified',
        confidence: 0.95,
        evidenceQuote: pos.evidence || null,
        section: 'Safeguard Measure',
        hasDirectEvidence: !!pos.evidence,
        description: pos.description,
      });
    });

    return compiled;
  },

  // Filter evidence by dimension (e.g. data_collection, tracking, children)
  filterByDimension(evidenceList, dimension) {
    if (!dimension) return evidenceList;
    return evidenceList.filter((e) => e.dimension.toLowerCase() === dimension.toLowerCase());
  },
};

export default evidenceService;
