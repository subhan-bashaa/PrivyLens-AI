// Mock AI Privacy Assistant Knowledge Base & Intelligent Response Engine

export const POLICY_SUGGESTIONS = {
  global: [
    'Which service has the lowest trust score right now?',
    'What are my statutory rights under GDPR to delete data?',
    'Which monitored apps collect biometric facial vectors?',
    'How do I turn off cross-app ad tracking?',
  ],
  instagram: [
    'Does Instagram sell my personal data to advertisers?',
    'Can Meta train AI models on my uploaded reels & photos?',
    'How does the new Threads profile unification affect me?',
    'Does Instagram track my device serial numbers and Wi-Fi?',
  ],
  whatsapp: [
    'Are personal messages and calls strictly encrypted?',
    'What metadata does WhatsApp share with Meta companies?',
    'Can WhatsApp read messages sent to Business accounts?',
    'How long does account deletion take to clear backups?',
  ],
  spotify: [
    'Does Spotify share my listening history with ad networks?',
    'What data is recorded when using the AI DJ voice feature?',
    'Can I opt out of personalized commercial recommendations?',
  ],
  tiktok: [
    'Does TikTok inspect my device clipboard and keystrokes?',
    'Where is user personal data physically stored?',
    'Can TikTok track my browsing activity outside the app?',
  ],
  notion: [
    'Is my private workspace text used to train AI models?',
    'Does Notion support HIPAA and SOC2 compliance?',
    'Who has access to decrypted team documents?',
  ],
};

export const CHAT_SERVICES = [
  { id: 'global', name: 'General Privacy Advisor', icon: '🛡️' },
  { id: 'instagram', name: 'Instagram', icon: '📸' },
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬' },
  { id: 'spotify', name: 'Spotify', icon: '🎵' },
  { id: 'tiktok', name: 'TikTok', icon: '📱' },
  { id: 'notion', name: 'Notion', icon: '📝' },
];

// Contextual Knowledge Graph & Intent Engine
export const generateAiChatResponse = (query, policyId = 'global', persona = 'balanced') => {
  const q = query.toLowerCase();

  // 1. DATA SELLING INTENT
  if (q.includes('sell') || q.includes('sale') || q.includes('broker')) {
    if (policyId === 'instagram') {
      return {
        text: `**Instagram does not technically "sell" your raw name or phone number for direct cash**, complying with traditional statutory definitions. 

However, under CCPA/CPRA, their practice of sharing **behavioral telemetry, hashed device IDs, and contact interaction graphs** with third-party ad networks constitutes a **"Sale or Sharing for Cross-Context Behavioral Advertising"**.`,
        citations: [
          { section: 'Section 4.1', title: 'Meta Companies Sharing & Profiling', link: '/policy/instagram/details' },
          { section: 'Section 2.2', title: 'Device Attributes & Identifiers', link: '/policy/instagram/details' },
        ],
        risk: 'high',
        actions: ['Visit Meta Accounts Center to disable Third-Party Ad Partner Matching.'],
      };
    }

    if (policyId === 'whatsapp') {
      return {
        text: `**WhatsApp explicitly states they do not sell your personal data.** Because message content is protected by end-to-end encryption, Meta cannot inspect message text for ad selling. 

However, communication metadata (IP address, operating system, and contact lists) may be shared across Meta entities for service optimization.`,
        citations: [
          { section: 'Section 4.2', title: 'Meta Entity Collaboration', link: '/policy/whatsapp/details' },
        ],
        risk: 'low',
        actions: ['Review Disappearing Messages settings in WhatsApp Preferences.'],
      };
    }

    return {
      text: `Under modern data privacy regulations (GDPR and CCPA/CPRA), most major consumer tech platforms avoid direct monetary data sales. Instead, they operate **"data cooperative" or "audience matching"** frameworks where device tokens, browsing activity, and location vectors are shared with ad brokers.`,
      citations: [
        { section: 'General', title: 'Statutory Data Sharing Benchmarks', link: '/reports' },
      ],
      risk: 'medium',
      actions: ['Audit connected apps and permissions in PrivyLens Monitoring.'],
    };
  }

  // 2. AI MODEL TRAINING INTENT
  if (q.includes('train') || q.includes('ai model') || q.includes('reels') || q.includes('photos') || q.includes('generative')) {
    if (policyId === 'instagram') {
      return {
        text: `**Yes, Meta utilizes public Instagram posts, captions, and reels to train its foundation AI models.** 

Under the updated March 2026 policy:
- **Public content:** Photos, videos, and comments published to public accounts are indexed into Meta AI training datasets.
- **Private messages:** Meta explicitly states that end-to-end encrypted private DMs are excluded from AI training.
- **European Users:** Users in the EU/UK possess a statutory GDPR Article 21 right to object, which Meta must respect.`,
        citations: [
          { section: 'Section 1.3', title: 'Camera & Biometric Vector Processing', link: '/policy/instagram/details' },
          { section: 'Section 6.1', title: 'Mandatory AI Content Disclosures', link: '/policy/instagram/details' },
        ],
        risk: 'critical',
        actions: [
          'Switch your account to Private if you do not want public reels ingested.',
          'Submit a formal GDPR Article 21 Objection Form via Meta Privacy Centre.',
        ],
      };
    }

    if (policyId === 'notion') {
      return {
        text: `**No, Notion AI does not train general foundation models on your private customer workspace data.** 

Notion’s agreements with model partners (Anthropic & OpenAI) legally prohibit data retention or use of customer prompts for model training. Data is processed transiently in memory and discarded.`,
        citations: [
          { section: 'Section 3.4', title: 'Notion AI Sub-processors & Isolation', link: '/policy/notion/details' },
        ],
        risk: 'safe',
        actions: ['Workspace administrators can toggle Notion AI features off globally.'],
      };
    }

    return {
      text: `Several major platforms now actively ingest user-generated content for generative AI training. Instagram, Reddit, and X include broad clauses granting license to user media, while enterprise workspace tools like Notion strictly quarantine customer data.`,
      citations: [
        { section: 'AI Benchmark', title: 'PrivyLens AI Training Matrix', link: '/compare' },
      ],
      risk: 'high',
      actions: ['Review the Policy Version Comparison page for recent AI clause diffs.'],
    };
  }

  // 3. ENCRYPTION INTENT
  if (q.includes('encrypt') || q.includes('message') || q.includes('read') || q.includes('call') || q.includes('wiretap')) {
    if (policyId === 'whatsapp') {
      return {
        text: `**WhatsApp uses the Signal Protocol for end-to-end encryption (E2EE) by default.** 

- **Protected:** Personal messages, voice calls, video calls, media attachments, and status updates cannot be decrypted by WhatsApp, Meta, or law enforcement in transit.
- **Exception (Business Accounts):** When you chat with a business using Meta Cloud Hosting, the business may store and decrypt messages on Meta servers.`,
        citations: [
          { section: 'Section 1.1', title: 'End-to-End Encryption Guarantee', link: '/policy/whatsapp/details' },
          { section: 'Section 2.4', title: 'Business Interactions & Meta Cloud Hosting', link: '/policy/whatsapp/details' },
        ],
        risk: 'safe',
        actions: ['Look for the gold encryption padlock banner in all personal chats.'],
      };
    }

    return {
      text: `End-to-end encryption ensures that only sender and recipient hold the cryptographic keys to decode messages. While WhatsApp, Signal, and iMessage enforce default E2EE, platforms like Instagram DMs and TikTok store messages with server-accessible keys.`,
      citations: [
        { section: 'Encryption Audit', title: 'Security Architecture Scores', link: '/reports' },
      ],
      risk: 'medium',
      actions: ['Use dedicated privacy messengers for highly sensitive communications.'],
    };
  }

  // 4. DELETION & RETENTION INTENT
  if (q.includes('delete') || q.includes('erasure') || q.includes('retention') || q.includes('leave') || q.includes('remove')) {
    if (policyId === 'instagram') {
      return {
        text: `**You can request account deletion, but full data purging takes up to 90 days.** 

- **Immediate:** Your profile and photos become invisible to other users within 24 hours.
- **Backup copies:** Disaster recovery backups may retain encrypted snapshots for up to **90 calendar days**.
- **Legal retention:** Financial transaction records or accounts flagged for Terms violations may be retained indefinitely.`,
        citations: [
          { section: 'Section 3.4', title: 'Data Retention & Server Backups', link: '/policy/instagram/details' },
        ],
        risk: 'medium',
        actions: ['Download an archive of your data via Settings > Download Your Information first.'],
      };
    }

    if (policyId === 'tiktok') {
      return {
        text: `**TikTok implements a 30-day "Deactivation Period" before permanent deletion commences.** 

During these 30 days, logging in reactivates the account. After 30 days, personal data is scheduled for deletion across primary storage systems, though aggregated anonymized telemetry remains on ByteDance servers.`,
        citations: [
          { section: 'Section 5.1', title: 'Account Deletion & Grace Timelines', link: '/policy/tiktok/details' },
        ],
        risk: 'high',
        actions: ['Avoid re-opening the TikTok mobile app for 30 consecutive days after deletion.'],
      };
    }

    return {
      text: `Under GDPR Article 17 ("Right to Erasure"), you have the statutory right to request that any service erase all personal records. Most services require 30 to 90 days to clear cold-storage backups.`,
      citations: [
        { section: 'Statutory Rights', title: 'GDPR Article 17 Guidance', link: '/reports' },
      ],
      risk: 'low',
      actions: ['Submit a formal Data Erasure request via the service privacy portal.'],
    };
  }

  // 5. BIOMETRICS & FACIAL DATA INTENT
  if (q.includes('face') || q.includes('biometric') || q.includes('camera') || q.includes('sensor')) {
    if (policyId === 'instagram') {
      return {
        text: `**Instagram's latest policy update significantly expands facial data collection.** 

While older versions claimed AR face filter data was processed transiently on-device, **Section 1.3 now states that facial geometry metrics may be uploaded to cloud infrastructure for up to 90 days** to train generative avatar algorithms.`,
        citations: [
          { section: 'Section 1.3', title: 'Sensor, Camera & Biometric Vector Processing', link: '/policy/instagram/details' },
        ],
        risk: 'critical',
        actions: [
          'Revoke Camera permissions in mobile OS settings when not actively posting.',
          'Review the Phase 12 Version Comparison diff for Section 1.3.',
        ],
      };
    }

    return {
      text: `Biometric information (face geometry, voiceprints, and keystroke dynamics) is subject to strict state and international protections (e.g. Illinois BIPA, GDPR Article 9). Always review camera and microphone permissions closely.`,
      citations: [
        { section: 'Biometric Watch', title: 'High-Risk Biometric Clauses', link: '/alerts' },
      ],
      risk: 'critical',
      actions: ['Inspect active camera authorizations in your mobile settings.'],
    };
  }

  // 6. THREADS UNIFICATION (Specific to Instagram)
  if (q.includes('threads') || q.includes('unification') || q.includes('cross-app')) {
    return {
      text: `**The Threads integration in Instagram v2026.1 automatically unifies your social identity across both platforms.** 

Your Instagram contact book, interaction history, ad engagement telemetry, and profile identifiers are continuously synchronized with Threads to deliver unified algorithmic feeds and targeted ads without requesting separate credentials.`,
      citations: [
        { section: 'Section 4.1.4', title: 'Threads and Connected Services Integration', link: '/policy/instagram/details' },
      ],
      risk: 'critical',
      actions: ['Navigate to Meta Accounts Center > Logging & Sharing to disable profile sync.'],
    };
  }

  // 7. DEFAULT SYNTHESIZED RESPONSE
  const serviceName = CHAT_SERVICES.find((s) => s.id === policyId)?.name || 'the service';
  return {
    text: `Based on the latest parsed privacy policy for **${serviceName}**, PrivyLens AI evaluates this under standard data governance standards. 

Key considerations regarding **"${query}"**:
- Check whether data is processed on-device vs. uploaded to third-party cloud sub-processors.
- Look out for broad language permitting "affiliate sharing" without user re-authentication.
- Verify whether an explicit opt-out portal exists in settings.`,
    citations: [
      { section: 'Audit Summary', title: `${serviceName} Trust Scorecard`, link: `/policy/${policyId === 'global' ? 'instagram' : policyId}/summary` },
    ],
    risk: persona === 'strict' ? 'high' : 'medium',
    actions: ['Explore the full clause explorer or review our automated compliance audit.'],
  };
};
