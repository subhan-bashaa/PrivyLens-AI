import { useState } from 'react';
import {
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Eye,
  Database,
  Share2,
  Clock,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const PERSONAS = [
  {
    id: 'student',
    label: 'Student',
    icon: '🎓',
    tagline: 'Focus on EdTech data, campus location tracking, and device telemetry',
    color: 'emerald',
  },
  {
    id: 'parent',
    label: 'Parent',
    icon: '👨‍👩‍👧',
    tagline: 'Focus on DPDP Sec 9, child profiling, targeted ads to minors & consent',
    color: 'teal',
  },
  {
    id: 'employee',
    label: 'Employee',
    icon: '💼',
    tagline: 'Focus on workplace monitoring, BYOD surveillance & employer access',
    color: 'cyan',
  },
  {
    id: 'business',
    label: 'Business User',
    icon: '🏢',
    tagline: 'Focus on vendor liability, DPA terms, and DPDP/NIST enterprise controls',
    color: 'blue',
  },
  {
    id: 'general',
    label: 'General Consumer',
    icon: '👤',
    tagline: 'Plain language checks on ad cookies, data brokers & erasure rights',
    color: 'indigo',
  },
];

// Helper to generate rich persona answers if not already pre-calculated by backend
function buildPersonaInsights(personaId, policy) {
  const norm = (personaId || 'student').toLowerCase();
  const pe = policy.personaExplanations || policy.persona_explanations || {};
  const stored = pe[norm] || pe.general || pe.student;

  const title = policy.name || policy.title || 'This service';
  const risk = (policy.riskLevel || 'Moderate').toLowerCase();
  const collected = policy.structuredSummary?.data_collected || 'Personal identifiers, contact info, and device telemetry';
  const sharing = policy.structuredSummary?.data_sharing || 'Authorized third-party service providers';
  const tracking = policy.structuredSummary?.tracking?.summary || 'Cookies, web beacons, and mobile telemetry identifiers';
  const retention = policy.structuredSummary?.data_retention || 'Stored as needed to provide online platform services';
  const rights = policy.structuredSummary?.user_rights || 'Right to access, data correction, and consent withdrawal';

  if (stored && stored.whatItMeansForYou && stored.personaQuestions) {
    return {
      whatItMeans: stored.whatItMeansForYou,
      verdict: stored.recommendationStatus || (risk === 'high' ? 'High Risk Action Required' : risk === 'low' ? 'Safe to Use' : 'Proceed with Caution'),
      questions: {
        doesItTrackMe: stored.personaQuestions.doesItTrackMe || `${title} monitors interactions via cookies and device signals.`,
        whatDoesItCollect: stored.personaQuestions.whatDoesItCollect || collected,
        whyDoesItCollect: stored.personaQuestions.whyDoesItCollect || policy.structuredSummary?.purpose_of_data_use || 'Service optimization and security.',
        whoReceivesIt: stored.personaQuestions.whoReceivesIt || sharing,
        howLongKept: stored.personaQuestions.howLongKept || retention,
        whatRightsDoIHave: stored.personaQuestions.whatRightsDoIHave || rights,
      },
      concerns: stored.personaQuestions.biggestConcerns || ['Third-party service sharing', 'Telemetry analytics'],
      actionSteps: stored.personaQuestions.whatShouldIDo || [
        'Review account privacy settings and toggle off personalized tracking.',
        'Use privacy-friendly browser settings to block third-party cookies.',
        'Exercise data erasure rights under DPDP Act when terminating usage.',
      ],
    };
  }

  // Dynamic tailoring based on persona type
  switch (norm) {
    case 'student':
      return {
        whatItMeans: `As a student, using ${title} exposes your device identifiers, IP location, and app usage patterns. If you access ${title} around college or home, background telemetry can reveal routines and study locations. Third-party ad trackers may build behavioral profiles used for student loans or targeted promotions.`,
        verdict: risk === 'high' ? 'High Risk for Students' : risk === 'low' ? 'Student Friendly' : 'Use Caution on Campus Networks',
        questions: {
          doesItTrackMe: `Yes. ${title} traces your IP address, device model, and active browsing session. If location access is enabled, it records where you log in.`,
          whatDoesItCollect: `${collected}. In addition, device telemetry and social graph interactions are logged.`,
          whyDoesItCollect: 'To operate platform features, personalize promotional content, and deliver targeted ads.',
          whoReceivesIt: `${sharing}. Advertising partners and cloud infrastructure providers receive anonymized and pseudonymized telemetry.`,
          howLongKept: `${retention}. Backups may hold records longer unless an explicit deletion request is sent.`,
          whatRightsDoIHave: `${rights}. You can request full export or deletion of your student activity profile.`,
        },
        concerns: [
          'Campus & home location logging via device telemetry',
          'Targeted commercial profiling based on interaction history',
          'Automated data sharing with analytics and ad brokers',
        ],
        actionSteps: [
          'Turn off precise location permissions in your phone/browser settings for this app.',
          'Reject non-essential advertising and analytics cookies upon visiting.',
          'Avoid linking your primary university email to consumer social platforms.',
        ],
      };

    case 'parent':
      return {
        whatItMeans: `As a parent, your primary priority is shielding children from behavioral profiling and unmonitored location tracking. Under Section 9 of the DPDP Act 2023, platforms must obtain verifiable parental consent before processing minors' personal data and cannot engage in tracking or targeted ads directed at children.`,
        verdict: risk === 'high' ? 'Parental Warning: High Minor Exposure' : risk === 'low' ? 'Family-Safe Privacy Standards' : 'Requires Parental Supervision',
        questions: {
          doesItTrackMe: `${title} logs device identifiers and cookies. Check whether minor accounts can disable targeted ad profiling.`,
          whatDoesItCollect: `${collected}. May include photos, messages, and contact lists if permission is granted.`,
          whyDoesItCollect: 'Core application delivery, fraud detection, and engagement algorithms.',
          whoReceivesIt: `${sharing}. Ensure vendors do not repurpose family data for commercial marketing.`,
          howLongKept: `${retention}. Statutory standards require rapid deletion upon parental request.`,
          whatRightsDoIHave: `Verifiable parental withdrawal of consent, immediate profile purging, and access to child data records under DPDP Act 2023.`,
        },
        concerns: [
          'Potential tracking and behavioral profiling of underage family members',
          'Third-party analytics SDKs collecting minor device telemetry',
          'Lack of prominent one-click parental consent revocation',
        ],
        actionSteps: [
          'Audit the app’s account settings and toggle off personalized ads and public profile discovery.',
          'Review device permissions: disable camera, microphone, and location access when idle.',
          'Submit a formal data deletion request if your child stops using the service.',
        ],
      };

    case 'employee':
      return {
        whatItMeans: `As an employee, using ${title} on workplace hardware or Bring-Your-Own-Device (BYOD) phones may lead to telemetry overlap between personal browsing and enterprise activity. Review whether employer administrators or service sub-processors have visibility into your communications or logs.`,
        verdict: risk === 'high' ? 'Workplace Risk: High Activity Logging' : risk === 'low' ? 'Safe for Workplace Use' : 'Review BYOD & Employer Policies',
        questions: {
          doesItTrackMe: `Yes. IP addresses, session duration, and device hardware specifications are recorded.`,
          whatDoesItCollect: `${collected}. Work email addresses and domain-level network logs may be captured.`,
          whyDoesItCollect: 'Account administration, corporate compliance, and platform operations.',
          whoReceivesIt: `${sharing}. Sub-processors and cloud service vendors manage infrastructure.`,
          howLongKept: `${retention}. Corporate agreements may mandate multi-year audit log preservation.`,
          whatRightsDoIHave: `Standard access and rectification. If operated under an enterprise contract, employer policies govern final deletion.`,
        },
        concerns: [
          'Workplace activity logs shared across cloud sub-processors',
          'Telemetry bleed between personal and corporate BYOD accounts',
          'Post-employment data retention in disaster-recovery backups',
        ],
        actionSteps: [
          'Keep personal accounts strictly separated from corporate email addresses.',
          'Do not use workplace Wi-Fi or VPNs for sensitive personal account interactions.',
          'Consult your organization’s Data Protection Officer (DPO) regarding vendor risk.',
        ],
      };

    case 'business':
      return {
        whatItMeans: `As a business stakeholder, ${title}'s policy must be evaluated against enterprise liability, Data Processing Agreements (DPAs), and statutory standards (DPDP Act 2023 & NIST Privacy Framework). Cross-border data flows and vendor sub-processor transparency are critical risk factors.`,
        verdict: risk === 'high' ? 'High Vendor Liability Risk' : risk === 'low' ? 'Enterprise Compliance Ready' : 'DPA & Vendor Safeguards Required',
        questions: {
          doesItTrackMe: `Platform utilizes session analytics and operational telemetry across API endpoints.`,
          whatDoesItCollect: `${collected}. Business user details, payment records, and contract metadata.`,
          whyDoesItCollect: 'Contractual fulfillment, service billing, and security incident investigations.',
          whoReceivesIt: `${sharing}. Sub-processors operating cloud infrastructure and payment gateways.`,
          howLongKept: `${retention}. Financial and tax records retained per statutory limitation periods.`,
          whatRightsDoIHave: `Enterprise right to audit, data portability in open formats, and guaranteed breach notification SLAs.`,
        },
        concerns: [
          'Vague sub-processor notification and liability indemnity clauses',
          'Potential cross-border data transfer without contractual safeguards',
          'Lack of specified security incident notification turnaround time',
        ],
        actionSteps: [
          'Execute a formalized Data Processing Agreement (DPA) before sharing customer data.',
          'Require annual SOC 2 Type II or ISO 27001 third-party audit reports from the vendor.',
          'Verify that data encryption in transit (TLS 1.3) and at rest (AES-256) are contractually guaranteed.',
        ],
      };

    case 'general':
    default:
      return {
        whatItMeans: `For everyday browsing, ${title} collects baseline personal identifiers and tracks your digital footprint using cookies and device beacons. Before agreeing to these terms, understand whether your data is monetized or shared with third-party advertising brokers.`,
        verdict: risk === 'high' ? 'Proceed with Extreme Caution' : risk === 'low' ? 'Generally Safe to Use' : 'Proceed with Caution',
        questions: {
          doesItTrackMe: `Yes. Cookies and tracking pixels track page views, clicks, and session metrics.`,
          whatDoesItCollect: `${collected}.`,
          whyDoesItCollect: 'Providing services, personalizing content, and running ad campaigns.',
          whoReceivesIt: `${sharing}. Third-party marketing networks and technology service vendors.`,
          howLongKept: `${retention}.`,
          whatRightsDoIHave: `${rights}. You can request a copy of your records or permanently delete your account.`,
        },
        concerns: [
          'Third-party commercial ad profiling without clear opt-out links',
          'Retention of telemetry logs after account inactivity',
          'Broad rights granted to platform for policy updates without direct notice',
        ],
        actionSteps: [
          'Adjust privacy preferences inside the application to reject targeted ads.',
          'Clear cookies and cache regularly or browse in a privacy-focused browser.',
          'Delete your profile and revoke third-party permissions when no longer using the app.',
        ],
      };
  }
}

const PersonaPerspectiveCard = ({ policy, currentPersona = 'student', onPersonaChange }) => {
  const [selectedPersona, setSelectedPersona] = useState(currentPersona);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const activePersonaObj = PERSONAS.find((p) => p.id === selectedPersona) || PERSONAS[0];
  const insights = buildPersonaInsights(selectedPersona, policy);

  const handleSelect = (id) => {
    setSelectedPersona(id);
    if (onPersonaChange) onPersonaChange(id);
  };

  const toggleQuestion = (key) => {
    setExpandedQuestion(expandedQuestion === key ? null : key);
  };

  const questionItems = [
    { key: 'doesItTrackMe', icon: Eye, label: 'Does It Track Me?', answer: insights.questions.doesItTrackMe },
    { key: 'whatDoesItCollect', icon: Database, label: 'What Does It Collect?', answer: insights.questions.whatDoesItCollect },
    { key: 'whyDoesItCollect', icon: HelpCircle, label: 'Why Does It Need My Data?', answer: insights.questions.whyDoesItCollect },
    { key: 'whoReceivesIt', icon: Share2, label: 'Who Receives or Buys It?', answer: insights.questions.whoReceivesIt },
    { key: 'howLongKept', icon: Clock, label: 'How Long Is It Kept?', answer: insights.questions.howLongKept },
    { key: 'whatRightsDoIHave', icon: UserCheck, label: 'What Rights Do I Have?', answer: insights.questions.whatRightsDoIHave },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
      {/* 1. Header with Persona Selector */}
      <div className="space-y-3 pb-4 border-b border-border/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-lg">
              <span>{activePersonaObj.icon}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-text-primary tracking-tight">
                  User Perspective Audit
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/15 text-primary border border-primary/25 uppercase">
                  Tailored View
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                {activePersonaObj.tagline}
              </p>
            </div>
          </div>

          <div className="text-xs font-semibold text-text-tertiary">
            Switch Perspective:
          </div>
        </div>

        {/* Persona Switcher Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {PERSONAS.map((p) => {
            const isActive = selectedPersona === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelect(p.id)}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border
                  ${
                    isActive
                      ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20 scale-[1.02]'
                      : 'bg-page-bg text-text-secondary border-border hover:border-primary/40 hover:text-text-primary'
                  }
                `}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Persona Impact Synthesis */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-primary/5 via-page-bg to-primary/10 border border-primary/20 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-extrabold text-primary uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>What This Means For You as a {activePersonaObj.label}</span>
          </div>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-card border border-border text-text-primary shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            Verdict: <span className="text-primary">{insights.verdict}</span>
          </span>
        </div>

        <p className="text-sm text-text-primary leading-relaxed font-medium">
          {insights.whatItMeans}
        </p>

        {/* Top Persona Concerns Warning Badges */}
        {insights.concerns && insights.concerns.length > 0 && (
          <div className="pt-2 border-t border-border/50">
            <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Key Red Flags for {activePersonaObj.label}s:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {insights.concerns.map((concern, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-danger/10 text-danger border border-danger/20"
                >
                  <ShieldAlert className="w-3 h-3 shrink-0" />
                  <span>{concern}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Direct Q&A Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-extrabold text-text-primary tracking-tight flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span>Direct Answers to Your Privacy Questions</span>
          </h4>
          <span className="text-[11px] text-text-tertiary">
            Plain English Answers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {questionItems.map((q) => {
            const Icon = q.icon;
            const isExpanded = expandedQuestion === q.key;

            return (
              <div
                key={q.key}
                className="bg-page-bg/70 border border-border/80 hover:border-primary/40 rounded-xl p-3.5 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="text-xs font-bold text-text-primary">
                      {q.label}
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed font-medium">
                      {q.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Action Steps Checklist: What You Should Do Right Now */}
      {insights.actionSteps && insights.actionSteps.length > 0 && (
        <div className="p-4 rounded-xl bg-card border border-border/90 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-extrabold text-text-primary">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Recommended Actions for {activePersonaObj.label}s:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {insights.actionSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-page-bg border border-border/70 flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed"
              >
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonaPerspectiveCard;
