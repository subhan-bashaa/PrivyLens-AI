// Mock Reports Data and Generator Templates for PrivyLens AI

export const REPORT_TEMPLATES = [
  {
    templateId: 'executive',
    name: 'Executive Privacy Brief',
    description: 'High-level scorecard summarizing trust metrics, top risks, and leadership action items.',
    format: 'PDF',
    badge: 'Popular',
    icon: 'FileBarChart',
    color: 'from-primary/20 to-secondary/20',
  },
  {
    templateId: 'compliance',
    name: 'Regulatory Compliance Audit',
    description: 'Statutory compliance evaluation against GDPR, CCPA/CPRA, and COPPA frameworks.',
    format: 'PDF',
    badge: 'Legal',
    icon: 'Scale',
    color: 'from-amber-500/20 to-orange-500/20',
  },
  {
    templateId: 'benchmark',
    name: 'Multi-Service Benchmark',
    description: 'Side-by-side comparative matrix evaluating privacy scores across competitor apps.',
    format: 'CSV',
    badge: 'Analytical',
    icon: 'GitCompare',
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    templateId: 'manifest',
    name: 'Full Clause Manifest',
    description: 'Exhaustive data dump of verbatim legal text, severity ratings, and opt-out clauses.',
    format: 'JSON',
    badge: 'Developer',
    icon: 'FileCode',
    color: 'from-emerald-500/20 to-teal-500/20',
  },
];

export const MOCK_REPORTS = [
  {
    reportId: 'rep-001',
    title: 'Instagram Q1 2026 Comprehensive Privacy Audit',
    type: 'executive',
    serviceId: 'instagram',
    serviceName: 'Instagram',
    serviceIcon: '📸',
    generatedAt: '2026-03-10T14:20:00Z',
    format: 'PDF',
    fileSize: '2.4 MB',
    trustScore: 4.8,
    riskLevel: 'High',
    complianceBadges: ['GDPR: Warning', 'CCPA: Compliant', 'COPPA: Non-Compliant'],
    summary:
      'Audit reveals significant privacy regression following the March 2026 Threads data sharing unification. Biometric face telemetry expanded without granular user controls.',
    keyFindings: [
      'Automatic profile synchronization with Threads ad ecosystem.',
      'Facial landmark extraction for generative avatar training.',
      'Removal of legacy 1-click third-party opt-out portal.',
    ],
    sectionsCount: 6,
    author: 'PrivyLens AI Engine v2.4',
  },
  {
    reportId: 'rep-002',
    title: 'WhatsApp Business API Compliance Assessment',
    type: 'compliance',
    serviceId: 'whatsapp',
    serviceName: 'WhatsApp',
    serviceIcon: '💬',
    generatedAt: '2026-03-08T11:00:00Z',
    format: 'PDF',
    fileSize: '1.8 MB',
    trustScore: 7.2,
    riskLevel: 'Medium',
    complianceBadges: ['GDPR: Compliant', 'CCPA: Compliant', 'COPPA: N/A'],
    summary:
      'Personal communications remain strictly end-to-end encrypted. Meta Cloud Business hosting introduces secondary compliance considerations for enterprise interactions.',
    keyFindings: [
      'Core end-to-end encryption architecture verified.',
      'Third-party cloud business hosting logs stored on Meta enterprise infrastructure.',
      'UPI payment routing compliant with local statutory frameworks.',
    ],
    sectionsCount: 5,
    author: 'PrivyLens AI Compliance Module',
  },
  {
    reportId: 'rep-003',
    title: 'Social Media Category Privacy Benchmark Matrix',
    type: 'benchmark',
    serviceId: 'all',
    serviceName: 'Social Platforms',
    serviceIcon: '📊',
    generatedAt: '2026-03-05T09:30:00Z',
    format: 'CSV',
    fileSize: '840 KB',
    trustScore: 6.1,
    riskLevel: 'Medium',
    complianceBadges: ['Multi-Service Matrix', '4 Services Analyzed'],
    summary:
      'Cross-platform comparative analysis evaluating WhatsApp (7.2), Spotify (8.4), Instagram (4.8), and TikTok (3.9) across 6 privacy pillars.',
    keyFindings: [
      'Spotify leads audio/media category with 8.4 trust score.',
      'TikTok ranks lowest in third-party data broker sharing (2.8).',
      'Instagram exhibits highest score volatility following policy revisions.',
    ],
    sectionsCount: 8,
    author: 'Automated Benchmark Pipeline',
  },
  {
    reportId: 'rep-004',
    title: 'Spotify Complete Policy Clauses & Opt-Outs Manifest',
    type: 'manifest',
    serviceId: 'spotify',
    serviceName: 'Spotify',
    serviceIcon: '🎵',
    generatedAt: '2026-03-01T16:45:00Z',
    format: 'JSON',
    fileSize: '420 KB',
    trustScore: 8.4,
    riskLevel: 'Low',
    complianceBadges: ['GDPR: Compliant', 'CCPA: Compliant', 'ePrivacy: Compliant'],
    summary:
      'Machine-readable structured export of all 42 clauses from Spotify v2026.1, with labeled semantic risks and direct deep links to privacy preference toggles.',
    keyFindings: [
      'Zero high-severity red flags identified.',
      'Anonymized AI DJ listening telemetry clearly separated from marketing IDs.',
      'Clear statutory data subject access rights (DSAR) fulfillment instructions.',
    ],
    sectionsCount: 42,
    author: 'PrivyLens JSON Parser',
  },
  {
    reportId: 'rep-005',
    title: 'Notion AI Workspace Privacy & Training Audit',
    type: 'compliance',
    serviceId: 'notion',
    serviceName: 'Notion',
    serviceIcon: '📝',
    generatedAt: '2026-02-26T13:15:00Z',
    format: 'PDF',
    fileSize: '1.5 MB',
    trustScore: 8.9,
    riskLevel: 'Low',
    complianceBadges: ['SOC2: Certified', 'GDPR: Compliant', 'HIPAA: Available'],
    summary:
      'Independent verification confirming customer workspace data is strictly isolated and excluded from foundation AI model training without explicit team admin consent.',
    keyFindings: [
      'Zero customer text retention for public model training confirmed.',
      'AES-256 data encryption at rest and TLS 1.3 in transit.',
      'Granular workspace permission controls audited.',
    ],
    sectionsCount: 4,
    author: 'Enterprise Privacy Review',
  },
  {
    reportId: 'rep-006',
    title: 'TikTok Data Localization & ByteDance Telemetry Brief',
    type: 'executive',
    serviceId: 'tiktok',
    serviceName: 'TikTok',
    serviceIcon: '📱',
    generatedAt: '2026-02-20T10:00:00Z',
    format: 'PDF',
    fileSize: '3.1 MB',
    trustScore: 3.9,
    riskLevel: 'High',
    complianceBadges: ['COPPA: Violation Risk', 'GDPR: Investigated', 'CCPA: Warning'],
    summary:
      'Extensive device fingerprinting, keystroke frequency monitoring, and clipboard inspection clauses pose severe privacy and compliance risks for enterprise deployments.',
    keyFindings: [
      'Continuous clipboard monitoring and keystroke dynamics telemetry.',
      'In-app browser injects JavaScript trackers into external URLs.',
      'Significant data localization ambiguity between regional servers.',
    ],
    sectionsCount: 7,
    author: 'PrivyLens Threat Intelligence',
  },
];

export const REPORT_STATS = {
  totalReports: 14,
  compliancePassRate: '78%',
  redFlagsDocumented: 42,
  activeSchedules: 3,
  storageUsed: '18.4 MB',
};

// Generates actual downloadable plain-text or structured mock content
export const generateReportFileContent = (report) => {
  if (report.format === 'JSON') {
    return JSON.stringify(
      {
        reportId: report.reportId,
        title: report.title,
        service: report.serviceName,
        trustScore: report.trustScore,
        riskLevel: report.riskLevel,
        complianceBadges: report.complianceBadges,
        generatedAt: report.generatedAt,
        summary: report.summary,
        keyFindings: report.keyFindings,
        meta: {
          engine: 'PrivyLens AI Compliance Engine v2.4',
          verificationChecksum: 'sha256-a9b8c7d6e5f41234567890',
        },
      },
      null,
      2
    );
  }

  if (report.format === 'CSV') {
    let csv = 'Finding_ID,Category,Service,Risk_Severity,Description\n';
    report.keyFindings.forEach((finding, idx) => {
      csv += `${idx + 1},Privacy Finding,"${report.serviceName}","${report.riskLevel}","${finding.replace(/"/g, '""')}"\n`;
    });
    return csv;
  }

  // Default PDF/Text Executive Brief
  return `================================================================================
                    PRIVYLENS AI — EXECUTIVE PRIVACY REPORT
================================================================================
Report ID      : ${report.reportId}
Title          : ${report.title}
Target Service : ${report.serviceName} (${report.serviceId})
Trust Score    : ${report.trustScore} / 10
Risk Level     : ${report.riskLevel.toUpperCase()}
Generated At   : ${new Date(report.generatedAt).toUTCString()}
Auditor        : ${report.author || 'PrivyLens AI Engine'}

--------------------------------------------------------------------------------
1. EXECUTIVE SUMMARY
--------------------------------------------------------------------------------
${report.summary}

--------------------------------------------------------------------------------
2. KEY FINDINGS & CLAUSE CITATIONS
--------------------------------------------------------------------------------
${report.keyFindings.map((f, i) => `[${i + 1}] ${f}`).join('\n')}

--------------------------------------------------------------------------------
3. STATUTORY COMPLIANCE STATUS
--------------------------------------------------------------------------------
${report.complianceBadges?.join(' | ') || 'Status Verified'}

================================================================================
Generated automatically by PrivyLens AI (https://privylens.ai)
Protecting User Privacy Through Agentic Intelligence
================================================================================`;
};
