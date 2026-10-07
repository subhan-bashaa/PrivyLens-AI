export const riskService = {
  /**
   * Deterministic Rule-Based Privacy Risk Scoring Engine
   * Scale: 0.0 - 10.0
   * 0 - 3   = Low Risk
   * 3.1 - 6 = Moderate Risk
   * 6.1 - 8 = High Risk
   * 8.1 - 10= Very High Risk
   */
  calculateRiskScore(extractedAiData) {
    let riskScore = 2.0; // Baseline baseline risk for any online service collecting basic data

    const {
      data_collection = {},
      data_sharing = {},
      tracking = {},
      retention = {},
      user_rights = [],
      security = [],
      red_flags = [],
      positive_findings = [],
    } = extractedAiData;

    // 1. Data Collection Penalties
    if (data_collection.sensitive_data && data_collection.sensitive_data.length > 0) {
      riskScore += 1.8; // Biometric, financial, or medical data
    }
    if (data_collection.location_data && data_collection.location_data.length > 0) {
      riskScore += 0.9; // Physical GPS location tracing
    }
    if (data_collection.device_data && data_collection.device_data.length > 3) {
      riskScore += 0.6; // Deep telemetry & hardware fingerprinting
    }

    // 2. Data Sharing Penalties
    if (data_sharing.advertisers && data_sharing.advertisers.length > 0) {
      riskScore += 1.5; // Commercial ad brokers
    }
    if (data_sharing.third_parties && data_sharing.third_parties.length > 0) {
      riskScore += 1.0; // External partner sharing
    }

    // 3. Tracking Penalties
    if (tracking.advertising_tracking) {
      riskScore += 1.2;
    }
    if (tracking.analytics) {
      riskScore += 0.4;
    }

    // 4. Retention & Deletion Penalties
    if (retention.deletion_available === false) {
      riskScore += 1.5; // Inability to delete user data
    }
    const duration = (retention.duration || '').toLowerCase();
    if (duration.includes('indefinite') || duration.includes('forever') || duration.includes('unspecified')) {
      riskScore += 0.8;
    }

    // 5. Red Flags Cumulative Penalty
    if (Array.isArray(red_flags)) {
      red_flags.forEach((flag) => {
        const severity = (flag.severity || '').toLowerCase();
        if (severity === 'critical') riskScore += 1.5;
        else if (severity === 'high') riskScore += 1.0;
        else if (severity === 'medium') riskScore += 0.5;
      });
    }

    // 6. Positive Privacy Mitigations (Score Reductions)
    if (retention.deletion_available === true) {
      riskScore -= 0.8;
    }
    if (user_rights && user_rights.length >= 3) {
      riskScore -= 0.8; // GDPR/CCPA explicit rights
    }
    if (security && security.length > 0) {
      riskScore -= 0.6; // In-transit/at-rest encryption
    }
    if (Array.isArray(positive_findings)) {
      riskScore -= Math.min(1.2, positive_findings.length * 0.3);
    }

    // Clamp score within 0.5 - 9.8 range
    riskScore = Math.max(0.5, Math.min(9.8, riskScore));
    const roundedScore = Math.round(riskScore * 10) / 10;

    let riskLevel = 'Moderate';
    if (roundedScore <= 3.0) {
      riskLevel = 'Low';
    } else if (roundedScore <= 6.0) {
      riskLevel = 'Moderate';
    } else if (roundedScore <= 8.0) {
      riskLevel = 'High';
    } else {
      riskLevel = 'Very High';
    }

    return {
      score: roundedScore,
      riskLevel,
    };
  },
};

export default riskService;
