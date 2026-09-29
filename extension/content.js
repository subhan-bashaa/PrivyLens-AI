// PrivyLens AI — Content Script (Automated Page & Cookie Detection)

(function () {
  // Avoid duplicate injection
  if (window.__privylens_injected) return;
  window.__privylens_injected = true;

  const currentUrl = window.location.href;
  const currentHost = window.location.hostname;

  // 1. PRIVACY POLICY SIGNALS
  const PRIVACY_URL_PATTERNS = [
    /privacy/i,
    /legal\/privacy/i,
    /privacy-policy/i,
    /privacy_policy/i,
    /data-protection/i,
    /cookie-policy/i,
  ];

  const PRIVACY_TITLE_PATTERNS = [
    /privacy policy/i,
    /privacy notice/i,
    /data protection policy/i,
    /privacy statement/i,
    /cookie policy/i,
  ];

  // 2. COOKIE BANNER SELECTORS
  const COOKIE_BANNER_SELECTORS = [
    '#onetrust-banner-sdk',
    '#cookie-law-info-bar',
    '#CybotCookiebotDialog',
    'div[aria-label*="cookie" i]',
    'div[id*="cookie-consent" i]',
    'div[id*="cookie-banner" i]',
    'div[class*="cookie-banner" i]',
    'div[class*="cookie-notice" i]',
    'div[class*="consent-banner" i]',
  ];

  // Check if current domain is muted
  chrome.storage.local.get(['settings'], (res) => {
    const settings = res.settings || { autoDetectPolicy: true, autoDetectCookies: true, mutedDomains: [] };
    if (settings.mutedDomains && settings.mutedDomains.includes(currentHost)) {
      return;
    }

    // Detect Privacy Policy page
    if (settings.autoDetectPolicy && isPrivacyPolicyPage()) {
      notifyBackground('POLICY_DETECTED');
      setTimeout(() => renderDetectionPopup('policy'), 1200);
      return;
    }

    // Detect Cookie Banner
    if (settings.autoDetectCookies) {
      setTimeout(() => {
        if (detectCookieBanner()) {
          notifyBackground('COOKIE_BANNER_DETECTED');
          renderDetectionPopup('cookie');
        }
      }, 2500);
    }
  });

  function isPrivacyPolicyPage() {
    const matchesUrl = PRIVACY_URL_PATTERNS.some((pattern) => pattern.test(currentUrl));
    if (matchesUrl) return true;

    const pageTitle = document.title || '';
    const matchesTitle = PRIVACY_TITLE_PATTERNS.some((pattern) => pattern.test(pageTitle));
    if (matchesTitle) return true;

    const h1 = document.querySelector('h1');
    if (h1 && PRIVACY_TITLE_PATTERNS.some((pattern) => pattern.test(h1.innerText || ''))) {
      return true;
    }

    return false;
  }

  function detectCookieBanner() {
    for (const selector of COOKIE_BANNER_SELECTORS) {
      const el = document.querySelector(selector);
      if (el && el.offsetHeight > 20 && window.getComputedStyle(el).display !== 'none') {
        return true;
      }
    }
    return false;
  }

  function notifyBackground(type) {
    try {
      chrome.runtime.sendMessage({ type, url: currentUrl, title: document.title });
    } catch (e) {
      // Background context invalidated
    }
  }

  // 3. SHADOW DOM INJECTION
  function renderDetectionPopup(detectionType) {
    if (document.getElementById('privylens-detection-host')) return;

    const host = document.createElement('div');
    host.id = 'privylens-detection-host';
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });

    // Styles for Shadow DOM
    const style = document.createElement('style');
    style.textContent = `
      * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      
      .privylens-card {
        width: 320px;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(16, 185, 129, 0.4);
        border-radius: 20px;
        padding: 20px;
        color: #F8FAFC;
        box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(16, 185, 129, 0.2);
        animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      @keyframes slideIn {
        from { opacity: 0; transform: translateX(40px) scale(0.96); }
        to { opacity: 1; transform: translateX(0) scale(1); }
      }

      @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.92); }
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 800;
        color: #10B981;
        letter-spacing: -0.2px;
      }

      .pulse-dot {
        width: 8px;
        height: 8px;
        background-color: #10B981;
        border-radius: 50%;
        box-shadow: 0 0 8px #10B981;
      }

      .close-btn {
        background: transparent;
        border: none;
        color: #94A3B8;
        font-size: 18px;
        cursor: pointer;
        padding: 4px;
        line-height: 1;
        border-radius: 6px;
      }
      .close-btn:hover { color: #FFFFFF; background: rgba(255,255,255,0.1); }

      .title {
        font-size: 15px;
        font-weight: 700;
        color: #FFFFFF;
        margin-bottom: 6px;
        line-height: 1.3;
      }

      .desc {
        font-size: 12px;
        color: #94A3B8;
        line-height: 1.5;
        margin-bottom: 14px;
      }

      .risk-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(245, 158, 11, 0.15);
        color: #F59E0B;
        border: 1px solid rgba(245, 158, 11, 0.3);
        border-radius: 8px;
        padding: 4px 10px;
        font-size: 11px;
        font-weight: 700;
        margin-bottom: 12px;
      }

      .bullet-list {
        list-style: none;
        font-size: 11px;
        color: #CBD5E1;
        margin-bottom: 16px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .bullet-list li {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .bullet-dot {
        width: 4px;
        height: 4px;
        background-color: #F59E0B;
        border-radius: 50%;
      }      .persona-row {
        margin: 10px 0 8px 0;
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      .persona-label {
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 0.5px;
        color: #94A3B8;
      }
      .persona-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      .p-btn {
        background: rgba(30, 41, 59, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #CBD5E1;
        font-size: 10px;
        font-weight: 600;
        padding: 4px 8px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .p-btn:hover {
        background: #334155;
        color: #FFFFFF;
      }
      .p-btn.active {
        background: rgba(16, 185, 129, 0.2);
        border-color: #10B981;
        color: #10B981;
        font-weight: 700;
      }

      .actions {
        display: flex;
        gap: 8px;
        margin-top: 10px;
      }
      .btn-primary {
        flex: 1;
        background: #10B981;
        color: #0F172A;
        border: none;
        border-radius: 12px;
        padding: 9px 14px;
        font-size: 11px;
        font-weight: 800;
        cursor: pointer;
        transition: background 0.2s, transform 0.1s;
        text-align: center;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }
      .btn-primary:hover { background: #059669; color: #FFFFFF; }
      .btn-primary:active { transform: scale(0.98); }

      .btn-secondary {
        background: transparent;
        color: #94A3B8;
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 12px;
        padding: 8px 14px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        text-align: center;
      }
      .btn-secondary:hover { color: #FFFFFF; border-color: rgba(255,255,255,0.4); }

      .mute-option {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 10px;
        color: #64748B;
        cursor: pointer;
      }
      .mute-option input { cursor: pointer; accent-color: #10B981; }
    `;

    const isCookie = detectionType === 'cookie';
    const titleText = isCookie
      ? "Website Cookie Consent Detected"
      : "Privacy Policy Detected";
    const descText = isCookie
      ? "You're about to accept this website's tracking and cookie parameters."
      : "Get an AI breakdown of clauses, tracking red flags, and data sharing in 5 sec.";

    const container = document.createElement('div');
    container.className = 'privylens-card';
    container.innerHTML = `
      <div class="header">
        <div class="brand">
          <span class="pulse-dot"></span>
          <span>🛡️ PrivyLens AI</span>
        </div>
        <button class="close-btn" id="pl-close-btn">&times;</button>
      </div>

      <div class="title">${titleText}</div>
      <div class="desc">${descText}</div>

      <div class="risk-pill">⚠️ Moderate Privacy Risk</div>

      <ul class="bullet-list">
        <li><span class="bullet-dot"></span> Cross-site advertising cookies used</li>
        <li><span class="bullet-dot"></span> Third-party behavioral telemetry logged</li>
        <li><span class="bullet-dot"></span> Approximate location data collected</li>
      </ul>

      <div class="persona-row">
        <div class="persona-label">SELECT YOUR PERSON TYPE:</div>
        <div class="persona-buttons" id="pl-persona-buttons">
          <button type="button" class="p-btn active" data-p="student">🎓 Student</button>
          <button type="button" class="p-btn" data-p="parent">👨‍👩‍👧 Parent</button>
          <button type="button" class="p-btn" data-p="employee">💼 Employee</button>
          <button type="button" class="p-btn" data-p="business">🏢 Business</button>
          <button type="button" class="p-btn" data-p="general">👤 General</button>
        </div>
      </div>

      <div class="actions">
        <button class="btn-primary" id="pl-view-summary">Login & Analyze as Student</button>
        <button class="btn-secondary" id="pl-later-btn">Later</button>
      </div>

      <label class="mute-option">
        <input type="checkbox" id="pl-mute-checkbox" />
        <span>Don't show again on this website</span>
      </label>
    `;

    shadow.appendChild(style);
    shadow.appendChild(container);

    let activePersona = 'student';

    // Event listeners
    const closeBtn = shadow.getElementById('pl-close-btn');
    const laterBtn = shadow.getElementById('pl-later-btn');
    const summaryBtn = shadow.getElementById('pl-view-summary');
    const muteCheckbox = shadow.getElementById('pl-mute-checkbox');
    const personaBtns = shadow.querySelectorAll('.p-btn');

    personaBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        personaBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activePersona = btn.dataset.p;
        const cap = activePersona.charAt(0).toUpperCase() + activePersona.slice(1);
        summaryBtn.textContent = `Login & Analyze as ${cap}`;
      });
    });

    const dismiss = () => {
      if (muteCheckbox && muteCheckbox.checked) {
        chrome.storage.local.get(['settings'], (res) => {
          const s = res.settings || { mutedDomains: [] };
          s.mutedDomains = s.mutedDomains || [];
          if (!s.mutedDomains.includes(currentHost)) {
            s.mutedDomains.push(currentHost);
            chrome.storage.local.set({ settings: s });
          }
        });
      }

      container.style.animation = 'fadeOut 0.25s forwards';
      setTimeout(() => host.remove(), 250);
    };

    closeBtn.addEventListener('click', dismiss);
    laterBtn.addEventListener('click', dismiss);

    summaryBtn.addEventListener('click', () => {
      chrome.runtime.sendMessage({
        type: 'OPEN_WEBAPP',
        url: currentUrl,
        persona: activePersona,
      });
      dismiss();
    });
  }
})();
