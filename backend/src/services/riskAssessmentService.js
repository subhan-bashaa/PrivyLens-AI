import logger from '../utils/logger.js';

/**
 * PrivyLens Configurable Privacy Risk Weight Matrix
 * Note: These weights represent the documented PrivyLens risk methodology
 * based on NIST Privacy Framework (ID.RA-P4) and are not statutory legal mandates.
 */
export const DEFAULT_WEIGHT_MATRIX = {
  dataCollection: 0.15,
  dataSharing: 0.20,
  tracking: 0.15,
  userRights: 0.15,
  retention: 0.10,
  consentTransparency: 0.10,
  security: 0.10,
  childrenPrivacy: 0.05,
};

export const riskAssessmentService = {
  calculateRisk(extractedData, customWeights = {}) {
    const weights = { ...DEFAULT_WEIGHT_MATRIX, ...customWeights };

    const facts = extractedData.facts || [];
    const redFlags = extractedData.red_flags || [];
    const positiveFindings = extractedData.positive_findings || [];
    const collectedTypes = extractedData.collected_data_types || [];
    const sharingRecipients = extractedData.sharing_recipients || [];
    const trackingMethods = extractedData.tracking_methods || [];
    const retentionInfo = extractedData.retention_policy || {};
    const rightsProvided = extractedData.user_rights_provided || [];
    const securityMeasures = extractedData.security_measures || [];
    const childSafeguards = extractedData.child_safeguards || {};

    // Helper: find fact by factor name
    const getFact = (factorName) => facts.find((f) => f.factor === factorName);

    // 1. Data Collection Risk (0–100)
    let collectionRisk = 25; // baseline collection
    if (collectedTypes.length > 5) collectionRisk += 25;
    if (collectedTypes.some((t) => /location|gps|ip address|telemetry/i.test(t))) collectionRisk += 25;
    if (collectedTypes.some((t) => /contact|contacts|phonebook/i.test(t))) collectionRisk += 20;
    collectionRisk = Math.min(100, Math.max(10, collectionRisk));

    // 2. Sensitive Data Risk (0–100)
    let sensitiveRisk = 15;
    const hasBiometric = facts.some((f) => /biometric/i.test(f.factor) && f.value === true);
    const hasHealth = facts.some((f) => /health|medical/i.test(f.factor) && f.value === true);
    const hasFinancial = facts.some((f) => /financial|payment|card/i.test(f.factor) && f.value === true);
    if (hasBiometric) sensitiveRisk += 45;
    if (hasHealth) sensitiveRisk += 30;
    if (hasFinancial) sensitiveRisk += 20;
    sensitiveRisk = Math.min(100, sensitiveRisk);

    // 3. Data Sharing Risk (0–100)
    let sharingRisk = 20;
    const hasAdBrokers = sharingRecipients.some((r) => /advertis|broker|ad network|marketing/i.test(r));
    const hasThirdParties = sharingRecipients.some((r) => /third party|partners|affiliates/i.test(r));
    if (hasAdBrokers) sharingRisk += 45;
    if (hasThirdParties) sharingRisk += 25;
    if (sharingRecipients.length > 3) sharingRisk += 15;
    sharingRisk = Math.min(100, sharingRisk);

    // 4. Tracking & Advertising Risk (0–100)
    let trackingRisk = 20;
    if (trackingMethods.some((m) => /pixel|fingerprint|beacon|cross-site/i.test(m))) trackingRisk += 40;
    if (trackingMethods.some((m) => /cookie|analytics/i.test(m))) trackingRisk += 25;
    if (facts.some((f) => /advertising_tracking/i.test(f.factor) && f.value === true)) trackingRisk += 25;
    trackingRisk = Math.min(100, trackingRisk);

    // 5. Retention Risk (0–100)
    let retentionRisk = 30;
    const duration = (retentionInfo.duration_statement || '').toLowerCase();
    if (duration.includes('indefinite') || duration.includes('unspecified') || duration.includes('forever')) {
      retentionRisk += 45;
    } else if (duration.includes('year') || duration.includes('month')) {
      retentionRisk -= 10;
    }
    if (retentionInfo.erasure_upon_request === false) retentionRisk += 30;
    retentionRisk = Math.min(100, Math.max(10, retentionRisk));

    // 6. User Control & Rights Risk (0–100) (Inverted: fewer rights = higher risk)
    let rightsRisk = 80;
    if (rightsProvided.includes('erasure') || rightsProvided.includes('deletion')) rightsRisk -= 25;
    if (rightsProvided.includes('access')) rightsRisk -= 20;
    if (rightsProvided.includes('correction')) rightsRisk -= 15;
    if (rightsProvided.includes('consent_withdrawal')) rightsRisk -= 15;
    rightsRisk = Math.min(100, Math.max(10, rightsRisk));

    // 7. Security Risk (0–100) (Inverted: stronger security = lower risk)
    let securityRisk = 75;
    if (securityMeasures.some((s) => /encryption/i.test(s))) securityRisk -= 30;
    if (securityMeasures.some((s) => /access_control|logging/i.test(s))) securityRisk -= 20;
    if (securityMeasures.some((s) => /backup/i.test(s))) securityRisk -= 10;
    securityRisk = Math.min(100, Math.max(10, securityRisk));

    // 8. Consent & Transparency Risk (0–100)
    let consentRisk = 40;
    const noticeFact = getFact('notice_transparency');
    if (noticeFact && noticeFact.value === true) consentRisk -= 20;
    if (facts.some((f) => /unconditional_consent/i.test(f.factor) && f.value === true)) consentRisk += 30;
    consentRisk = Math.min(100, Math.max(15, consentRisk));

    // 9. Children's Privacy Risk (0–100)
    let childRisk = 15;
    if (childSafeguards.collects_child_data === true) childRisk += 50;
    if (childSafeguards.parental_consent_required === false) childRisk += 30;
    if (childSafeguards.child_tracking_prohibited === false) childRisk += 25;
    childRisk = Math.min(100, childRisk);

    // 10. Profiling / Automated Decision Risk (0–100)
    let profilingRisk = 20;
    if (facts.some((f) => /automated_profiling|ai_decisions/i.test(f.factor) && f.value === true)) {
      profilingRisk += 50;
    }
    profilingRisk = Math.min(100, profilingRisk);

    // 11. International Transfer Risk (0–100)
    let transferRisk = 20;
    if (facts.some((f) => /cross_border_transfer/i.test(f.factor) && f.value === true)) {
      transferRisk += 35;
    }
    transferRisk = Math.min(100, transferRisk);

    // Compute Overall Weighted Score (0–100)
    const overallScore = Math.round(
      collectionRisk * weights.dataCollection +
      sharingRisk * weights.dataSharing +
      trackingRisk * weights.tracking +
      rightsRisk * weights.userRights +
      retentionRisk * weights.retention +
      consentRisk * weights.consentTransparency +
      securityRisk * weights.security +
      childRisk * weights.childrenPrivacy
    );

    const clampedOverall = Math.max(5, Math.min(98, overallScore));
    const displayScore = (clampedOverall / 10).toFixed(1) + '/10';

    let riskLevel = 'MODERATE';
    if (clampedOverall <= 30) riskLevel = 'LOW';
    else if (clampedOverall <= 60) riskLevel = 'MODERATE';
    else if (clampedOverall <= 80) riskLevel = 'HIGH';
    else riskLevel = 'VERY HIGH';

    // Main Contributors
    const contributors = [];
    if (sharingRisk >= 60) contributors.push({ factor: 'Third-Party Sharing', impact: 'High sharing with external ad networks or service partners' });
    if (trackingRisk >= 60) contributors.push({ factor: 'Behavioral & Telemetry Tracking', impact: 'Persistent identifiers and advertising pixels' });
    if (collectionRisk >= 60) contributors.push({ factor: 'Extensive Data Ingestion', impact: 'Broad personal and device data collection' });
    if (retentionRisk >= 60) contributors.push({ factor: 'Unclear Retention Timeline', impact: 'Indefinite storage without concrete erasure schedule' });
    if (sensitiveRisk >= 50) contributors.push({ factor: 'Sensitive Data Processing', impact: 'Biometric, health, or financial telemetry detected' });
    if (childRisk >= 50) contributors.push({ factor: "Children's Data Processing", impact: 'Potential processing of minor data without parental controls' });

    // Positive Mitigating Factors
    const mitigations = [];
    if (rightsRisk <= 40) mitigations.push({ factor: 'User Control Supported', benefit: 'Clear deletion, access, and correction mechanisms available' });
    if (securityRisk <= 40) mitigations.push({ factor: 'Strong Technical Safeguards', benefit: 'Industry-standard encryption and access logging deployed' });
    if (retentionInfo.erasure_upon_request === true) mitigations.push({ factor: 'Erasure on Request', benefit: 'Explicit right to be forgotten acknowledged' });

    logger.info(`Calculated Risk Score: ${clampedOverall}/100 (${riskLevel})`);

    return {
      score: {
        value: clampedOverall,
        outOf: 100,
        display: displayScore,
        riskLevel,
      },
      categoryScores: {
        dataCollection: collectionRisk,
        sensitiveData: sensitiveRisk,
        dataSharing: sharingRisk,
        tracking: trackingRisk,
        retention: retentionRisk,
        userRights: rightsRisk,
        security: securityRisk,
        consentTransparency: consentRisk,
        childrenPrivacy: childRisk,
        profiling: profilingRisk,
        internationalTransfer: transferRisk,
      },
      contributors: contributors.slice(0, 4),
      mitigations: mitigations.slice(0, 3),
      methodology: {
        engine: 'PrivyLens Weighted Privacy Risk Model',
        framework_alignment: 'NIST Privacy Framework Version 1.0 (ID.RA-P4)',
        note: 'Weights are derived from documented privacy engineering principles and are not legally prescribed values.',
      },
    };
  },
};

export default riskAssessmentService;
