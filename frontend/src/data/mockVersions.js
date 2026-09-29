// Mock Versions and Diff Data for PrivyLens AI Version Comparison Engine

export const POLICY_VERSION_SNAPSHOTS = {
  instagram: {
    serviceName: 'Instagram',
    serviceIcon: '📸',
    category: 'Social Media',
    versions: [
      {
        versionId: 'v2026.1',
        label: 'v2026.1 (Current)',
        releaseDate: '2026-03-09',
        trustScore: 4.8,
        riskLevel: 'High',
        summary: 'Major update introducing mandatory Threads cross-app profile unification and expanded AI training.',
      },
      {
        versionId: 'v2025.2',
        label: 'v2025.2 (Previous)',
        releaseDate: '2025-10-15',
        trustScore: 5.2,
        riskLevel: 'Medium',
        summary: 'Added disclosure regarding Meta AI conversational feature telemetry and regional opt-out clauses.',
      },
      {
        versionId: 'v2025.1',
        label: 'v2025.1 (Legacy)',
        releaseDate: '2025-01-20',
        trustScore: 5.8,
        riskLevel: 'Medium',
        summary: 'Standard annual update with updated GDPR representative contact addresses.',
      },
    ],
    // Diffs comparing v2025.2 (base) -> v2026.1 (target)
    diffs: {
      'v2025.2_v2026.1': {
        scoreShift: {
          previous: 5.2,
          current: 4.8,
          delta: -0.4,
          direction: 'down',
          previousRisk: 'Medium',
          currentRisk: 'High',
        },
        overallSeverity: 'critical',
        stats: {
          added: 2,
          modified: 3,
          removed: 1,
          unchanged: 4,
        },
        executiveSummary:
          'Instagram’s March 2026 update (v2026.1) represents a significant erosion of user privacy controls. Data sharing between Instagram and Threads is now unified by default, facial geometry data is newly processed for generative avatars, and previous standalone opt-out mechanisms for behavioral ad profiling have been deprecated.',
        keyTakeaways: [
          {
            title: 'Automatic Threads Profile Unification',
            risk: 'critical',
            desc: 'Activity, contact lists, and interactions on Instagram now seamlessly cross-pollinate with Threads without explicit separate consent.',
          },
          {
            title: 'Expanded Biometric & Face Data Usage',
            risk: 'high',
            desc: 'Facial landmarks from uploaded videos and reels are now analyzed for real-time generative effects and AI avatar modeling.',
          },
          {
            title: 'AI Content Disclosure Mandate',
            risk: 'medium',
            desc: 'Users must flag any AI-generated or modified media, with automated algorithmic scanning actively enforcing labels.',
          },
          {
            title: 'Dedicated Behavioral Ad Opt-Out Form Removed',
            risk: 'high',
            desc: 'The previous one-click web opt-out portal has been sunsetted in favor of unified Meta Accounts Center settings.',
          },
        ],
        recommendedActions: [
          'Navigate to Meta Accounts Center > Logging & Sharing and disable cross-app profile sync.',
          'Review camera permissions on mobile devices to restrict background facial telemetry collection.',
          'Request an archive of existing biometric training vectors via the privacy rights portal.',
        ],
        clauses: [
          {
            clauseId: 'diff-1',
            section: 'Section 4.1',
            title: 'Meta Companies Sharing & Threads Unification',
            changeType: 'added',
            severity: 'critical',
            aiInterpretation:
              'New clause explicitly granting Meta permission to merge your Instagram social graph, private messaging metadata, and engagement history directly into Threads for algorithmic personalization and targeted advertising.',
            impact: 'Severe loss of compartmentalization across distinct social apps.',
            oldText: null,
            newText:
              'Section 4.1.4 — Threads and Connected Services Integration: When you use Threads or link connected Meta family products, we automatically unify your profile identifiers, contact address book synchronizations, interaction metrics, and content preference vectors between Instagram and Threads. This data interchange is continuous and operates across shared infrastructure to provide unified content feeds and cross-platform advertiser metrics without requiring additional authentication tokens.',
          },
          {
            clauseId: 'diff-2',
            section: 'Section 1.3',
            title: 'Face & Sensor Data Collection (Biometrics)',
            changeType: 'modified',
            severity: 'high',
            aiInterpretation:
              'The clause has been broadened from basic camera filtering to active biometric landmark extraction and persistent storage for AI avatar generation.',
            impact: 'Facial recognition vectors may be retained beyond active session duration.',
            oldText:
              'Section 1.3 — Sensor and Camera Data: We process temporary camera stream metadata when you apply face filters or augmented reality masks. This processing is performed entirely in real-time on your device and landmark coordinates are discarded immediately after rendering each frame.',
            newText:
              'Section 1.3 — Sensor, Camera and Biometric Vector Processing: We process camera imagery, depth sensors, and facial landmark coordinates when you apply filters, create generative avatars, or record video. Extracted facial geometry metrics may be transmitted to Meta cloud servers and cached for up to 90 days to train persona models, enhance 3D avatar fidelity, and optimize computer vision models.',
          },
          {
            clauseId: 'diff-3',
            section: 'Section 2.2',
            title: 'Cross-Device & Telemetry Identifiers',
            changeType: 'modified',
            severity: 'high',
            aiInterpretation:
              'Meta now gathers hardware-level serial numbers, battery health telemetry, and nearby Wi-Fi BSSID signals for precise device fingerprinting.',
            impact: 'Circumvents cookie clearing and traditional browser privacy protections.',
            oldText:
              'Section 2.2 — Device Attributes: We gather device attributes such as operating system version, screen resolution, cellular carrier, and general language preference.',
            newText:
              'Section 2.2 — Device Attributes & Hardware Fingerprints: We collect persistent hardware identifiers, device serial seeds, battery drain telemetry, Bluetooth beacon signals, and nearby Wi-Fi network SSID/BSSID broadcast signatures to link multiple physical devices to your unified user identity graph.',
          },
          {
            clauseId: 'diff-4',
            section: 'Section 5.3',
            title: 'Dedicated Third-Party Ad Opt-Out Form',
            changeType: 'removed',
            severity: 'high',
            aiInterpretation:
              'The legacy direct web-based opt-out form has been removed. Users are now redirected through multi-step Account Center settings which default back to opt-in on major app updates.',
            impact: 'Opting out of third-party ad profiling is significantly more friction-heavy.',
            oldText:
              'Section 5.3 — Web Opt-Out Portal: Users may visit instagram.com/optout at any time to opt out of third-party data broker audience matching with a single unauthenticated submission.',
            newText: null,
          },
          {
            clauseId: 'diff-5',
            section: 'Section 6.1',
            title: 'AI-Generated Content Labeling Mandate',
            changeType: 'added',
            severity: 'medium',
            aiInterpretation:
              'Mandates that users disclose AI tools used in post creation and permits automated algorithmic scanning of all uploaded images and video captions to verify labels.',
            impact: 'Automated content scanning on every upload prior to public feed publishing.',
            oldText: null,
            newText:
              'Section 6.1 — Mandatory AI Content Disclosures: Creators must apply the "AI Info" label to any photorealistic imagery, cloned audio, or synthetic video uploaded to the service. Instagram reserves the right to automatically detect, analyze, and inject persistent watermarks or label flags using server-side forensic inspection models.',
          },
          {
            clauseId: 'diff-6',
            section: 'Section 3.4',
            title: 'Data Retention & Server Backups',
            changeType: 'modified',
            severity: 'low',
            aiInterpretation:
              'Clarified the distinction between immediate account soft-deletion and technical backup archive purging.',
            impact: 'Slightly clearer legal timeline for backup system deletion.',
            oldText:
              'Section 3.4: We retain your content for as long as needed to provide our services. Deletion requests are processed within a reasonable operational timeframe.',
            newText:
              'Section 3.4: Upon receiving a valid account deletion request, your public profile is deactivated within 24 hours. Technical backup copies stored in secondary disaster recovery cold storage are systematically overwritten within 90 calendar days.',
          },
          {
            clauseId: 'diff-7',
            section: 'Section 7.1',
            title: 'Children Privacy & Minimum Age Standards',
            changeType: 'unchanged',
            severity: 'low',
            aiInterpretation:
              'Standard statutory language regarding the 13-year-old minimum age limit remains unchanged from the previous version.',
            impact: 'No material change in age restriction policy.',
            oldText:
              'Section 7.1: Instagram is not directed to children under the age of 13. We do not knowingly collect personal data from minors below statutory thresholds without verifiable parental consent.',
            newText:
              'Section 7.1: Instagram is not directed to children under the age of 13. We do not knowingly collect personal data from minors below statutory thresholds without verifiable parental consent.',
          },
        ],
      },
    },
  },

  whatsapp: {
    serviceName: 'WhatsApp',
    serviceIcon: '💬',
    category: 'Messaging & Social',
    versions: [
      {
        versionId: 'v2026.1',
        label: 'v2026.1 (Current)',
        releaseDate: '2026-01-10',
        trustScore: 7.2,
        riskLevel: 'Medium',
        summary: 'Updated disclosures on Business API telemetry and payment gateway integration metadata.',
      },
      {
        versionId: 'v2025.1',
        label: 'v2025.1 (Previous)',
        releaseDate: '2025-05-18',
        trustScore: 7.5,
        riskLevel: 'Medium',
        summary: 'Added support for Channels broadcast interaction metrics while maintaining end-to-end encryption.',
      },
    ],
    diffs: {
      'v2025.1_v2026.1': {
        scoreShift: {
          previous: 7.5,
          current: 7.2,
          delta: -0.3,
          direction: 'down',
          previousRisk: 'Medium',
          currentRisk: 'Medium',
        },
        overallSeverity: 'medium',
        stats: {
          added: 1,
          modified: 2,
          removed: 0,
          unchanged: 3,
        },
        executiveSummary:
          'WhatsApp’s v2026.1 update maintains strict end-to-end encryption for personal messages and calls, but introduces expanded telemetry collection when interacting with verified Business accounts and payment systems.',
        keyTakeaways: [
          {
            title: 'Business Messaging Metadata',
            risk: 'medium',
            desc: 'When messaging business accounts, metadata about transaction intent and catalog browsing may be hosted on Meta enterprise cloud.',
          },
          {
            title: 'UPI & Payment Gateway Telemetry',
            risk: 'low',
            desc: 'Payment routing disclosures updated to comply with national payment system auditing requirements.',
          },
        ],
        recommendedActions: [
          'Verify that sensitive conversations are kept in standard chats rather than enterprise WhatsApp Business bots.',
          'Review Disappearing Messages timers on sensitive group chats.',
        ],
        clauses: [
          {
            clauseId: 'wa-diff-1',
            section: 'Section 2.4',
            title: 'Business Interactions & Meta Cloud Hosting',
            changeType: 'added',
            severity: 'medium',
            aiInterpretation:
              'Businesses using Meta-managed cloud infrastructure can store conversation logs on Meta servers, which are not end-to-end encrypted under standard customer keys.',
            impact: 'Business customer messages may be accessible to Meta cloud technicians.',
            oldText: null,
            newText:
              'Section 2.4 — Third-Party Cloud Business Hosting: When you communicate with businesses that utilize Meta secure cloud hosting solutions, the business may instruct Meta to process and store messages to manage customer inquiries. Messages to these businesses are encrypted in transit and at rest, but are managed by the business’s own data policies.',
          },
          {
            clauseId: 'wa-diff-2',
            section: 'Section 3.1',
            title: 'Transactions and Payment Telemetry',
            changeType: 'modified',
            severity: 'low',
            aiInterpretation:
              'Updated banking partner disclosure for UPI and local peer-to-peer payment processing.',
            impact: 'Financial metadata is shared with certified banking partners.',
            oldText:
              'Section 3.1: We process payment transaction data including payment method, transaction timestamp, and amount to complete peer-to-peer transfers.',
            newText:
              'Section 3.1: We process payment credentials, transaction reference identifiers, device security tokens, and regulatory audit records with certified banking partners to authenticate transactions and detect fraud.',
          },
          {
            clauseId: 'wa-diff-3',
            section: 'Section 1.1',
            title: 'End-to-End Encryption Guarantee',
            changeType: 'unchanged',
            severity: 'low',
            aiInterpretation:
              'The fundamental core guarantee that personal messages, calls, photos, and voice notes are end-to-end encrypted remains intact.',
            impact: 'Personal messages remain secure from server interception.',
            oldText:
              'Section 1.1: We do not retain your messages in the ordinary course of providing our services. Messages are end-to-end encrypted, meaning neither WhatsApp nor third parties can read or listen to them.',
            newText:
              'Section 1.1: We do not retain your messages in the ordinary course of providing our services. Messages are end-to-end encrypted, meaning neither WhatsApp nor third parties can read or listen to them.',
          },
        ],
      },
    },
  },

  spotify: {
    serviceName: 'Spotify',
    serviceIcon: '🎵',
    category: 'Music & Audio',
    versions: [
      {
        versionId: 'v2026.1',
        label: 'v2026.1 (Current)',
        releaseDate: '2026-02-28',
        trustScore: 8.4,
        riskLevel: 'Low',
        summary: 'Clarified podcast advertising targeting vocabulary and updated AI DJ listening pattern retention.',
      },
      {
        versionId: 'v2025.1',
        label: 'v2025.1 (Previous)',
        releaseDate: '2025-11-10',
        trustScore: 8.5,
        riskLevel: 'Low',
        summary: 'Introduced AI DJ voice feature disclosures and anonymized telemetry models.',
      },
    ],
    diffs: {
      'v2025.1_v2026.1': {
        scoreShift: {
          previous: 8.5,
          current: 8.4,
          delta: -0.1,
          direction: 'down',
          previousRisk: 'Low',
          currentRisk: 'Low',
        },
        overallSeverity: 'low',
        stats: {
          added: 0,
          modified: 2,
          removed: 0,
          unchanged: 3,
        },
        executiveSummary:
          'Spotify’s latest privacy policy update consists primarily of terminology alignments for programmatic advertising and clarifications regarding AI DJ audio listening telemetry.',
        keyTakeaways: [
          {
            title: 'Ad Targeting Terminology Standardized',
            risk: 'low',
            desc: '"Tailored advertisements" has been updated to "personalized commercial communications" across marketing sections.',
          },
          {
            title: 'AI DJ Telemetry Retention',
            risk: 'low',
            desc: 'Voice prompts and song skip speed metrics are aggregated into anonymous cohorts.',
          },
        ],
        recommendedActions: [
          'Review Spotify Settings > Privacy & Social to disable customized ad partner cookies.',
        ],
        clauses: [
          {
            clauseId: 'sp-diff-1',
            section: 'Section 3.2',
            title: 'Podcast & Audio Ad Personalization',
            changeType: 'modified',
            severity: 'low',
            aiInterpretation:
              'Replaced legacy terminology with standardized interactive advertising definitions.',
            impact: 'Minimal operational impact on free tier listener ads.',
            oldText:
              'Section 3.2: We deliver tailored advertising based on your declared preferences, country of residence, and streaming genre selections.',
            newText:
              'Section 3.2: We serve personalized commercial communications based on your declared profile settings, approximate geolocation, and contextual listening session metadata.',
          },
        ],
      },
    },
  },
};

// Helper to get all policy IDs that have version comparison data
export const getAvailableComparisonPolicies = () => {
  return Object.keys(POLICY_VERSION_SNAPSHOTS).map((key) => ({
    id: key,
    name: POLICY_VERSION_SNAPSHOTS[key].serviceName,
    icon: POLICY_VERSION_SNAPSHOTS[key].serviceIcon,
    category: POLICY_VERSION_SNAPSHOTS[key].category,
    versionCount: POLICY_VERSION_SNAPSHOTS[key].versions.length,
  }));
};

// Helper to fetch comparison data for a given policy and version pair
export const getComparisonData = (policyId = 'instagram', baseVersion, targetVersion) => {
  const policySnapshot =
    POLICY_VERSION_SNAPSHOTS[policyId] || POLICY_VERSION_SNAPSHOTS.instagram;

  const versions = policySnapshot.versions;
  const base = baseVersion || versions[1]?.versionId || versions[0].versionId;
  const target = targetVersion || versions[0]?.versionId;

  const diffKey = `${base}_${target}`;
  const reverseKey = `${target}_${base}`;

  let diffData = policySnapshot.diffs[diffKey];

  // If queried in reverse direction, adapt it
  if (!diffData && policySnapshot.diffs[reverseKey]) {
    const original = policySnapshot.diffs[reverseKey];
    diffData = {
      ...original,
      scoreShift: {
        previous: original.scoreShift.current,
        current: original.scoreShift.previous,
        delta: -original.scoreShift.delta,
        direction: original.scoreShift.delta < 0 ? 'up' : 'down',
        previousRisk: original.scoreShift.currentRisk,
        currentRisk: original.scoreShift.previousRisk,
      },
      // Reverse clauses old/new
      clauses: original.clauses.map((c) => ({
        ...c,
        changeType:
          c.changeType === 'added'
            ? 'removed'
            : c.changeType === 'removed'
            ? 'added'
            : c.changeType,
        oldText: c.newText,
        newText: c.oldText,
      })),
    };
  }

  // Fallback if no specific diff key
  if (!diffData) {
    diffData = Object.values(policySnapshot.diffs)[0];
  }

  return {
    policy: {
      id: policyId,
      name: policySnapshot.serviceName,
      icon: policySnapshot.serviceIcon,
      category: policySnapshot.category,
    },
    versions,
    baseVersion: base,
    targetVersion: target,
    ...diffData,
  };
};
