// PrivyLens AI — Production-Ready Chrome Extension Popup Script
// Communicates with live PrivyLens backend and handles real-time persona auditing

const API_BASE_URL = 'http://localhost:5000/api';
const WEBAPP_BASE_URL = 'http://localhost:5173';

const PERSONA_DETAILS = {
  student: {
    name: 'Student',
    desc: 'Audits EdTech data, campus location tracing, and device telemetry',
  },
  parent: {
    name: 'Parent',
    desc: 'Checks DPDP Sec 9 compliance, child tracking & targeted ads to minors',
  },
  employee: {
    name: 'Employee',
    desc: 'Surfaces workplace monitoring, BYOD surveillance & employer access',
  },
  business: {
    name: 'Business',
    desc: 'Examines vendor risk, data sharing contracts & DPDP/NIST safeguards',
  },
  general: {
    name: 'General',
    desc: 'Plain language checks on ad cookies, data brokers & erasure rights',
  },
};

function extractDomainKeyword(dom) {
  if (!dom) return '';
  const noise = ['com', 'org', 'net', 'edu', 'gov', 'io', 'ai', 'co', 'uk', 'in', 'policies', 'privacy', 'legal', 'help', 'www'];
  const parts = dom.toLowerCase().split('.').filter((p) => !noise.includes(p));
  return parts[parts.length - 1] || dom.split('.')[0];
}

document.addEventListener('DOMContentLoaded', async () => {
  const domainEl = document.getElementById('site-domain');
  const badgeEl = document.getElementById('risk-badge');
  const scoreEl = document.getElementById('trust-score');
  const headlineEl = document.getElementById('score-headline');
  const subtextEl = document.getElementById('score-subtext');
  const btnAnalyze = document.getElementById('btn-analyze');
  const btnAnalyzeText = document.getElementById('btn-analyze-text');
  const btnSubText = document.getElementById('btn-sub-text');
  const personaDesc = document.getElementById('persona-desc');
  const personaChips = document.querySelectorAll('.persona-chip');
  const btnOpenDashboard = document.getElementById('btn-open-dashboard');
  const btnClearMutes = document.getElementById('btn-clear-mutes');
  const togglePolicy = document.getElementById('toggle-policy');
  const toggleCookies = document.getElementById('toggle-cookies');
  const simpleSummaryCard = document.getElementById('simple-summary-card');
  const simpleSummaryText = document.getElementById('simple-summary-text');
  const simpleHighlights = document.getElementById('simple-highlights');
  const btnExtraWeb = document.getElementById('btn-extra-web');

  let currentTabUrl = '';
  let currentDomain = '';
  let selectedPersona = 'student';
  let isAudited = false;
  let auditedPolicyId = null;

  // Extra Information button handler
  if (btnExtraWeb) {
    btnExtraWeb.addEventListener('click', () => {
      const targetUrl = auditedPolicyId
        ? `${WEBAPP_BASE_URL}/policy/${auditedPolicyId}/summary?persona=${selectedPersona}`
        : `${WEBAPP_BASE_URL}/analyze?url=${encodeURIComponent(currentTabUrl)}&persona=${selectedPersona}&autoAnalyze=true&open=true`;
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.create({ url: targetUrl });
      } else {
        window.open(targetUrl, '_blank');
      }
    });
  }

  // 1. Fetch Active Tab
  if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs && tabs[0] && tabs[0].url) {
        currentTabUrl = tabs[0].url;
        try {
          const urlObj = new URL(currentTabUrl);
          currentDomain = urlObj.hostname.replace(/^www\./, '');
          domainEl.textContent = currentDomain;

          // Strict Browser Internal Page Guard
          if (
            urlObj.protocol === 'chrome:' ||
            urlObj.protocol === 'chrome-extension:' ||
            urlObj.protocol === 'edge:' ||
            urlObj.protocol === 'about:' ||
            urlObj.protocol === 'brave:'
          ) {
            domainEl.textContent = 'System Utility';
            badgeEl.textContent = 'Safe System';
            badgeEl.className = 'risk-badge risk-low';
            scoreEl.textContent = '10';
            headlineEl.textContent = 'Browser Internal Page';
            subtextEl.textContent = 'Safe system utility page. No external data processing.';
            btnAnalyze.disabled = true;
            btnAnalyze.style.opacity = '0.5';
            return;
          }

          // Query Real Backend Status
          await checkRealBackendPolicy(currentDomain, currentTabUrl);
        } catch (e) {
          domainEl.textContent = 'Active Webpage';
          setUnanalyzedState();
        }
      }
    });

    // 2. Load stored preferences
    chrome.storage.local.get(['autoDetectPolicy', 'autoDetectCookies', 'selectedPersona'], (res) => {
      if (res.autoDetectPolicy !== undefined) togglePolicy.checked = res.autoDetectPolicy;
      if (res.autoDetectCookies !== undefined) toggleCookies.checked = res.autoDetectCookies;
      if (res.selectedPersona && PERSONA_DETAILS[res.selectedPersona]) {
        activatePersona(res.selectedPersona);
      }
    });
  } else {
    domainEl.textContent = 'Active Page';
    setUnanalyzedState();
  }

  // Check live backend database for an audit record of this domain/URL
  async function checkRealBackendPolicy(domain, fullUrl) {
    badgeEl.textContent = 'Checking...';
    headlineEl.textContent = 'Connecting to PrivyLens AI...';
    subtextEl.textContent = 'Querying live privacy intelligence database';

    try {
      const storage = await new Promise((resolve) =>
        chrome.storage.local.get(['privylens_token'], resolve)
      );
      const token = storage?.privylens_token;

      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // A. Try direct domain & URL lookup endpoint
      const keyword = extractDomainKeyword(domain);
      const lookupUrl = `${API_BASE_URL}/policies/lookup?domain=${encodeURIComponent(keyword)}&url=${encodeURIComponent(fullUrl)}`;
      const lookupRes = await fetch(lookupUrl, { headers });

      if (lookupRes.ok) {
        const lookupBody = await lookupRes.json();
        if (lookupBody.data?.policy && lookupBody.data.policy.overall_score !== undefined) {
          renderRealAudit(lookupBody.data.policy);
          return;
        }
      }

      // B. Query recent policies list as fallback
      const res = await fetch(`${API_BASE_URL}/policies`, { headers });
      if (res.ok) {
        const body = await res.json();
        const policies = body.data?.policies || [];
        const matched = policies.find(
          (p) =>
            p.policy_url === fullUrl ||
            (p.website_url && p.website_url.toLowerCase().includes(domain.toLowerCase())) ||
            (p.policy_url && p.policy_url.toLowerCase().includes(domain.toLowerCase())) ||
            (p.title && keyword && p.title.toLowerCase().includes(keyword.toLowerCase()))
        );

        if (matched && matched.overall_score !== undefined) {
          renderRealAudit(matched);
          return;
        }
      }

      // No previous audit record found
      setUnanalyzedState();
    } catch (err) {
      setUnanalyzedState();
    }
  }

  function renderRealAudit(policyData) {
    let scoreVal = 0.0;
    if (policyData.score?.display) {
      scoreVal = parseFloat(policyData.score.display) || 0.0;
    } else if (policyData.overall_score !== undefined && policyData.overall_score !== null) {
      scoreVal = parseFloat(policyData.overall_score) || 0.0;
    } else if (policyData.score?.value !== undefined) {
      scoreVal = (parseFloat(policyData.score.value) || 0) / 10;
    }

    scoreEl.textContent = scoreVal.toFixed(1);

    const level = (policyData.risk_level || policyData.score?.riskLevel || 'Moderate').toUpperCase();
    if (level === 'LOW' || scoreVal <= 3.0) {
      badgeEl.textContent = 'Low Risk';
      badgeEl.className = 'risk-badge risk-low';
    } else if (level === 'HIGH' || level === 'VERY HIGH' || scoreVal >= 6.1) {
      badgeEl.textContent = `${level} Risk`;
      badgeEl.className = 'risk-badge risk-high';
    } else {
      badgeEl.textContent = 'Moderate Risk';
      badgeEl.className = 'risk-badge risk-medium';
    }

    headlineEl.textContent = policyData.title || policyData.policy?.title || 'Audited Privacy Policy';
    const summaryText =
      policyData.summary?.whatItMeansForYou ||
      (typeof policyData.summary === 'string' ? policyData.summary : '') ||
      'Full statutory compliance audit available in dashboard';
    subtextEl.textContent = summaryText.length > 85 ? summaryText.substring(0, 85) + '...' : summaryText;

    // Render Simple Summary and Key Highlights
    const structured = policyData.structured_summary || policyData.persona_explanations?.structured_summary || {};
    if (simpleSummaryCard && simpleSummaryText) {
      simpleSummaryCard.style.display = 'flex';
      const cleanSummary =
        structured.purpose_of_data_use ||
        summaryText.split('\n')[0] ||
        'Real-time statutory privacy analysis completed for this website.';
      simpleSummaryText.textContent = cleanSummary;

      if (simpleHighlights) {
        const dataCol = structured.data_collected || (Array.isArray(policyData.data_collection) ? policyData.data_collection.slice(0, 4).join(', ') : policyData.data_collection?.summary || 'User & telemetry info');
        const dataShare = structured.data_sharing || (Array.isArray(policyData.data_sharing) ? policyData.data_sharing.slice(0, 3).join(', ') : policyData.data_sharing?.summary || 'Authorized service vendors');
        const dataRet = structured.data_retention || policyData.retention?.duration_statement || policyData.retention?.summary || 'Active account lifecycle';
        const topConcern = (Array.isArray(policyData.red_flags) && policyData.red_flags[0])
          ? (typeof policyData.red_flags[0] === 'string' ? policyData.red_flags[0] : policyData.red_flags[0].title || policyData.red_flags[0].description)
          : null;

        simpleHighlights.innerHTML = `
          <div class="highlight-row">
            <span class="highlight-badge">📦 Data:</span>
            <span>${dataCol.length > 80 ? dataCol.substring(0, 80) + '...' : dataCol}</span>
          </div>
          <div class="highlight-row">
            <span class="highlight-badge">🔄 Sharing:</span>
            <span>${dataShare.length > 80 ? dataShare.substring(0, 80) + '...' : dataShare}</span>
          </div>
          <div class="highlight-row">
            <span class="highlight-badge">⏳ Retention:</span>
            <span>${dataRet.length > 80 ? dataRet.substring(0, 80) + '...' : dataRet}</span>
          </div>
          ${topConcern ? `
            <div class="highlight-row">
              <span class="highlight-badge" style="color: #EF4444;">⚠️ Concern:</span>
              <span>${topConcern.length > 80 ? topConcern.substring(0, 80) + '...' : topConcern}</span>
            </div>
          ` : ''}
        `;
      }
    }

    isAudited = true;
    auditedPolicyId = policyData.id || policyData.policy?.id;

    // Hide the duplicate bottom 'Full Report' button since 'View on Web App' is the single clear CTA
    if (btnAnalyze) {
      btnAnalyze.style.display = 'none';
    }

    const btnExtraWebText = document.getElementById('btn-extra-web-text');
    if (btnExtraWebText) {
      btnExtraWebText.textContent = `View on Web App (${PERSONA_DETAILS[selectedPersona]?.name || 'Tailored'})`;
    }
  }

  function setUnanalyzedState() {
    isAudited = false;
    scoreEl.textContent = '--';
    badgeEl.textContent = 'Ready for Audit';
    badgeEl.className = 'risk-badge';
    headlineEl.textContent = 'Privacy Analysis Ready';
    subtextEl.textContent = 'Select your persona and click below to run real-time AI audit';
    if (simpleSummaryCard) {
      simpleSummaryCard.style.display = 'none';
    }
    if (btnAnalyze) {
      btnAnalyze.style.display = 'flex';
      btnAnalyze.disabled = false;
      btnAnalyze.style.opacity = '1';
    }
    if (btnAnalyzeText) {
      btnAnalyzeText.textContent = `Analyze as ${PERSONA_DETAILS[selectedPersona]?.name || 'Student'}`;
    }
    if (btnSubText) {
      btnSubText.textContent = 'Run Real-Time AI Privacy Audit';
    }
  }

  // 3. Persona Switching
  function activatePersona(pKey) {
    if (!PERSONA_DETAILS[pKey]) return;
    selectedPersona = pKey;
    personaChips.forEach((chip) => {
      if (chip.dataset.persona === pKey) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });

    const info = PERSONA_DETAILS[pKey];
    personaDesc.textContent = info.desc;

    const btnExtraWebText = document.getElementById('btn-extra-web-text');
    if (btnExtraWebText) {
      btnExtraWebText.textContent = `View on Web App (${info.name})`;
    }

    if (!isAudited) {
      if (btnAnalyzeText) btnAnalyzeText.textContent = `Analyze as ${info.name}`;
      if (btnSubText) btnSubText.textContent = 'Run Real-Time AI Privacy Audit';
    }

    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ selectedPersona: pKey });
    }
  }

  personaChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      activatePersona(chip.dataset.persona);
    });
  });

  // 4. Settings Toggles
  togglePolicy.addEventListener('change', () => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ autoDetectPolicy: togglePolicy.checked });
    }
  });

  toggleCookies.addEventListener('change', () => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ autoDetectCookies: toggleCookies.checked });
    }
  });

  // 5. Action: Analyze as Persona / Open Report
  btnAnalyze.addEventListener('click', async () => {
    if (isAudited) {
      // If already audited, open the dashboard
      const targetPath = auditedPolicyId ? `/policy/${auditedPolicyId}/summary` : `/policies`;
      const webAppUrl = `${WEBAPP_BASE_URL}${targetPath}`;
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.create({ url: webAppUrl });
      } else {
        window.open(webAppUrl, '_blank');
      }
      return;
    }

    // Run real-time AI Audit
    const targetUrl = currentTabUrl || window.location.href;
    btnAnalyze.disabled = true;
    btnAnalyze.style.opacity = '0.85';
    if (btnAnalyzeText) btnAnalyzeText.textContent = 'Auditing with AI...';
    if (btnSubText) btnSubText.textContent = 'Analyzing legal clauses & risk...';
    badgeEl.textContent = 'Auditing...';
    badgeEl.className = 'risk-badge';
    headlineEl.textContent = 'AI Persona Audit in Progress...';
    subtextEl.textContent = 'Extracting privacy policy text & computing statutory risk score';

    try {
      const storage = await new Promise((resolve) =>
        chrome.storage.local.get(['privylens_token'], resolve)
      );
      const token = storage?.privylens_token;

      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/policies/analyze`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          url: targetUrl,
          role: selectedPersona,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Analysis failed (${res.status})`);
      }

      const body = await res.json();
      const auditResult = body.data || body;
      renderRealAudit(auditResult);
    } catch (err) {
      badgeEl.textContent = 'Audit Failed';
      badgeEl.className = 'risk-badge risk-high';
      headlineEl.textContent = 'Analysis Incomplete';
      subtextEl.textContent = err.message || 'Could not parse webpage policy';
      if (btnAnalyzeText) btnAnalyzeText.textContent = `Retry as ${PERSONA_DETAILS[selectedPersona]?.name || 'Student'}`;
      if (btnSubText) btnSubText.textContent = 'Click to re-attempt AI audit';
      btnAnalyze.disabled = false;
      btnAnalyze.style.opacity = '1';
    }
  });

  // 6. Open Web Dashboard
  btnOpenDashboard.addEventListener('click', () => {
    const webAppUrl = `${WEBAPP_BASE_URL}/dashboard`;
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url: webAppUrl });
    } else {
      window.open(webAppUrl, '_blank');
    }
  });

  // 7. Reset Mutes
  btnClearMutes.addEventListener('click', () => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.remove('privylens_mutes', () => {
        btnClearMutes.textContent = '✓ Mutes Cleared';
        setTimeout(() => {
          btnClearMutes.textContent = 'Reset Mutes';
        }, 1800);
      });
    }
  });
});
