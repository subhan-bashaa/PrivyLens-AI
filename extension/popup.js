// PrivyLens AI Extension Popup Script
const KNOWN_SCORES = {
  'instagram.com': { score: 4.8, status: 'High Risk', class: 'risk-high', headline: 'Excessive Ad Tracking', subtext: 'Shares biometric data & cross-site trackers' },
  'tiktok.com': { score: 3.9, status: 'Severe Risk', class: 'risk-high', headline: 'Intrusive Telemetry', subtext: 'Aggressive device fingerprinting detected' },
  'whatsapp.com': { score: 7.2, status: 'Moderate Risk', class: 'risk-medium', headline: 'End-to-End Encrypted', subtext: 'Meta sharing clauses require attention' },
  'spotify.com': { score: 8.4, status: 'Good Standing', class: 'risk-low', headline: 'Transparent Licensing', subtext: 'Standard audio usage analytics' },
  'notion.so': { score: 8.9, status: 'Enterprise Grade', class: 'risk-low', headline: 'Strong Security Posture', subtext: 'Strict workspace data isolation' },
  'github.com': { score: 9.1, status: 'Excellent', class: 'risk-low', headline: 'Developer Privacy First', subtext: 'Clear telemetry opt-outs' }
};

const PERSONA_DETAILS = {
  student: {
    name: 'Student',
    desc: 'Audits EdTech data, academic surveillance, and device telemetry',
  },
  parent: {
    name: 'Parent',
    desc: 'Checks COPPA compliance, child data collection & location tracking',
  },
  employee: {
    name: 'Employee',
    desc: 'Surfaces workplace monitoring, BYOD policies & employee tracking logs',
  },
  business: {
    name: 'Business',
    desc: 'Examines DPA terms, intellectual property, SLA & third-party liability',
  },
  general: {
    name: 'General',
    desc: 'Standard checks on ad cookies, data selling & account deletion rights',
  },
};

document.addEventListener('DOMContentLoaded', async () => {
  const domainEl = document.getElementById('site-domain');
  const badgeEl = document.getElementById('risk-badge');
  const scoreEl = document.getElementById('trust-score');
  const headlineEl = document.getElementById('score-headline');
  const subtextEl = document.getElementById('score-subtext');
  const btnAnalyze = document.getElementById('btn-analyze');
  const btnAnalyzeText = document.getElementById('btn-analyze-text');
  const personaDesc = document.getElementById('persona-desc');
  const personaChips = document.querySelectorAll('.persona-chip');
  const btnOpenDashboard = document.getElementById('btn-open-dashboard');
  const btnClearMutes = document.getElementById('btn-clear-mutes');
  const togglePolicy = document.getElementById('toggle-policy');
  const toggleCookies = document.getElementById('toggle-cookies');

  let currentTabUrl = '';
  let currentDomain = '';
  let selectedPersona = 'student';

  // 1. Fetch current active tab
  if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && tabs[0].url) {
        currentTabUrl = tabs[0].url;
        try {
          const urlObj = new URL(currentTabUrl);
          currentDomain = urlObj.hostname.replace(/^www\./, '');
          domainEl.textContent = currentDomain;

          // Check if internal browser page
          if (urlObj.protocol === 'chrome:' || urlObj.protocol === 'edge:' || urlObj.protocol === 'about:') {
            domainEl.textContent = 'System Page';
            badgeEl.textContent = 'Internal';
            badgeEl.className = 'risk-badge';
            scoreEl.textContent = '10';
            headlineEl.textContent = 'Browser Internal Page';
            subtextEl.textContent = 'Safe system utility page';
            btnAnalyze.disabled = true;
            btnAnalyze.style.opacity = '0.5';
            return;
          }

          // Evaluate domain score
          evaluateDomain(currentDomain);
        } catch (e) {
          domainEl.textContent = 'Unknown Page';
        }
      }
    });

    // 2. Load stored settings & persona
    chrome.storage.local.get(['autoDetectPolicy', 'autoDetectCookies', 'selectedPersona'], (res) => {
      if (res.autoDetectPolicy !== undefined) togglePolicy.checked = res.autoDetectPolicy;
      if (res.autoDetectCookies !== undefined) toggleCookies.checked = res.autoDetectCookies;
      if (res.selectedPersona && PERSONA_DETAILS[res.selectedPersona]) {
        activatePersona(res.selectedPersona);
      }
    });
  } else {
    // Fallback preview mode
    domainEl.textContent = 'spotify.com';
    evaluateDomain('spotify.com');
  }

  function evaluateDomain(domain) {
    let matched = null;
    for (const key of Object.keys(KNOWN_SCORES)) {
      if (domain.includes(key)) {
        matched = KNOWN_SCORES[key];
        break;
      }
    }

    if (matched) {
      scoreEl.textContent = matched.score.toFixed(1);
      badgeEl.textContent = matched.status;
      badgeEl.className = `risk-badge ${matched.class}`;
      headlineEl.textContent = matched.headline;
      subtextEl.textContent = matched.subtext;
    } else {
      // Deterministic fallback rating
      const charSum = domain.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const score = (6.5 + (charSum % 30) / 10).toFixed(1);
      const isLow = score >= 8.0;
      scoreEl.textContent = score;
      badgeEl.textContent = isLow ? 'Good Standing' : 'Moderate Risk';
      badgeEl.className = `risk-badge ${isLow ? 'risk-low' : 'risk-medium'}`;
      headlineEl.textContent = 'Privacy Analysis Available';
      subtextEl.textContent = 'Select your persona and click below to run AI audit';
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
    btnAnalyzeText.textContent = `Analyze as ${info.name}`;
    personaDesc.textContent = info.desc;

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

  // 5. Action: Ask Person Type -> Proceed to Login -> Webpage
  btnAnalyze.addEventListener('click', () => {
    const targetUrl = currentTabUrl || window.location.href;
    // Direct to /login with target URL and selected persona attached
    const webAppUrl = `http://localhost:5173/login?url=${encodeURIComponent(targetUrl)}&persona=${encodeURIComponent(selectedPersona)}&autoAnalyze=true&open=true`;

    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url: webAppUrl });
    } else {
      window.open(webAppUrl, '_blank');
    }
  });

  // 6. Open Web Dashboard
  btnOpenDashboard.addEventListener('click', () => {
    const webAppUrl = 'http://localhost:5173/dashboard';
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
