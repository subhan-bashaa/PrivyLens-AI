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

  let detectedBannerSnippet = '';

  function detectCookieBanner() {
    for (const selector of COOKIE_BANNER_SELECTORS) {
      const el = document.querySelector(selector);
      if (el && el.offsetHeight > 20 && window.getComputedStyle(el).display !== 'none') {
        const text = (el.innerText || '').toLowerCase();
        detectedBannerSnippet = text;
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

    // Check if domain is already audited in PrivyLens database
    chrome.runtime.sendMessage(
      { type: 'CHECK_DOMAIN_STATUS', domain: currentHost, url: currentUrl },
      (response) => {
        buildPopupUI(detectionType, response);
      }
    );
  }

  function buildPopupUI(detectionType, auditResponse) {
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
        width: 330px;
        background: rgba(15, 23, 42, 0.96);
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
        margin-bottom: 4px;
        line-height: 1.3;
      }

      .domain-tag {
        font-size: 11px;
        color: #10B981;
        font-weight: 600;
        margin-bottom: 8px;
      }

      .desc {
        font-size: 12px;
        color: #94A3B8;
        line-height: 1.5;
        margin-bottom: 12px;
      }

      .status-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(16, 185, 129, 0.15);
        color: #10B981;
        border: 1px solid rgba(16, 185, 129, 0.3);
        border-radius: 8px;
        padding: 4px 10px;
        font-size: 11px;
        font-weight: 700;
        margin-bottom: 12px;
      }

      .status-pill.audited {
        background: rgba(59, 130, 246, 0.15);
        color: #60A5FA;
        border-color: rgba(59, 130, 246, 0.3);
      }

      .bullet-list {
        list-style: none;
        font-size: 11px;
        color: #CBD5E1;
        margin-bottom: 14px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .bullet-list li {
        display: flex;
        align-items: flex-start;
        gap: 6px;
        line-height: 1.4;
      }

      .bullet-dot {
        width: 5px;
        height: 5px;
        background-color: #10B981;
        border-radius: 50%;
        margin-top: 5px;
        shrink: 0;
      }

      .persona-row {
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
        margin-top: 10px;
      }
      .mute-option input { cursor: pointer; accent-color: #10B981; }
    `;

    const isAudited = Boolean(auditResponse?.audited && auditResponse?.policy);
    const auditedPolicy = auditResponse?.policy;

    let titleText = 'Privacy Document Detected';
    let pillText = 'Shield Active';
    let pillClass = 'status-pill';
    let descText = `Official privacy disclosure page detected on ${currentHost}.`;
    let bullets = [];

    if (isAudited) {
      const score = parseFloat(auditedPolicy.overall_score || 0).toFixed(1);
      const risk = (auditedPolicy.risk_level || 'Moderate').toUpperCase();
      titleText = auditedPolicy.title || 'Audited Privacy Policy';
      pillText = `★ Risk Score: ${score}/10 (${risk} Risk)`;
      pillClass = 'status-pill audited';
      const structured = auditedPolicy.structured_summary || auditedPolicy.persona_explanations?.structured_summary || {};
      descText = structured.purpose_of_data_use || auditedPolicy.summary || 'Privacy policy audited in your PrivyLens repository.';
      if (descText.length > 130) descText = descText.slice(0, 130) + '...';
      bullets = [];
      if (structured.data_collected) {
        bullets.push(`📦 Collected: ${structured.data_collected.slice(0, 75)}...`);
      }
      if (structured.data_sharing) {
        bullets.push(`🔄 Sharing: ${structured.data_sharing.slice(0, 75)}...`);
      }
      if (structured.data_retention) {
        bullets.push(`⏳ Retention: ${structured.data_retention.slice(0, 75)}...`);
      }
      if (bullets.length === 0) {
        bullets.push('Deterministic fact extraction & DPDP compliance verified');
        bullets.push('Continuous automated drift monitoring active');
      }
    } else if (detectionType === 'cookie') {
      titleText = 'Cookie Consent Gate Detected';
      pillText = '🛡️ Tracking Dialogue Active';
      descText = `This website is prompting for consent before storing cookies on ${currentHost}.`;

      // Extract real signals from detected banner snippet
      if (detectedBannerSnippet.includes('advertis') || detectedBannerSnippet.includes('ad ') || detectedBannerSnippet.includes('partner')) {
        bullets.push('Targeted advertising & partner disclosures found in notice');
      }
      if (detectedBannerSnippet.includes('analytic') || detectedBannerSnippet.includes('measure') || detectedBannerSnippet.includes('telemetry')) {
        bullets.push('Visitor behavior & analytics telemetry specified');
      }
      if (detectedBannerSnippet.includes('device') || detectedBannerSnippet.includes('store') || detectedBannerSnippet.includes('access information')) {
        bullets.push('Device storage access & identifier parameters requested');
      }
      if (bullets.length === 0) {
        bullets.push('Pre-consent checkpoint: inspect privacy obligations before accepting');
        bullets.push('DPDP Act 2023 Sec 6 requires clear, withdrawal-capable consent');
      }
    } else {
      titleText = 'Privacy Policy Page Detected';
      pillText = '📄 Legal Document';
      descText = `Privacy and personal data processing terms identified on ${currentHost}.`;
      bullets.push(`Page: "${document.title ? document.title.slice(0, 45) : 'Privacy Policy'}"`);
      bullets.push('11-category weighted risk scoring & DPDP Act compliance audit');
      bullets.push('Evidence quotes & citations extracted directly from text');
    }

    const bulletsHtml = bullets
      .map((b) => `<li><span class="bullet-dot"></span><span>${b}</span></li>`)
      .join('');

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

      <div class="domain-tag">🌐 ${currentHost}</div>
      <div class="title">${titleText}</div>
      <div class="desc">${descText}</div>

      <div class="${pillClass}">${pillText}</div>

      <ul class="bullet-list">
        ${bulletsHtml}
      </ul>

      <div class="persona-row">
        <div class="persona-label">SELECT YOUR PERSONA:</div>
        <div class="persona-buttons" id="pl-persona-buttons">
          <button type="button" class="p-btn active" data-p="student">🎓 Student</button>
          <button type="button" class="p-btn" data-p="parent">👨‍👩‍👧 Parent</button>
          <button type="button" class="p-btn" data-p="employee">💼 Employee</button>
          <button type="button" class="p-btn" data-p="business">🏢 Business</button>
          <button type="button" class="p-btn" data-p="general">👤 General</button>
        </div>
      </div>

      <div class="actions">
        <button class="btn-primary" id="pl-view-summary">
          ${isAudited ? 'View Full Analysis in Web ↗' : 'Analyze on Web App ↗'}
        </button>
        <button class="btn-secondary" id="pl-later-btn">Dismiss</button>
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
        if (isAudited) {
          summaryBtn.textContent = `View Audit (${cap})`;
        } else {
          summaryBtn.textContent = `Analyze as ${cap}`;
        }
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
        policyId: auditedPolicy?.id || null,
        persona: activePersona,
      });
      dismiss();
    });
  }
})();
