// PrivyLens AI — Background Service Worker (Manifest V3)

const WEBAPP_BASE_URL = 'http://localhost:5173';

// Set up default settings on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['settings'], (res) => {
    if (!res.settings) {
      chrome.storage.local.set({
        settings: {
          autoDetectPolicy: true,
          autoDetectCookies: true,
          notificationPosition: 'top-right',
          mutedDomains: [],
        },
      });
    }
  });

  console.log('PrivyLens AI Extension installed and active.');
});

// Message bus handling between content scripts, popup, and webapp
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'POLICY_DETECTED') {
    // Update extension badge on the active tab
    if (sender.tab?.id) {
      chrome.action.setBadgeText({ text: 'AI', tabId: sender.tab.id });
      chrome.action.setBadgeBackgroundColor({ color: '#10B981', tabId: sender.tab.id });
    }
    sendResponse({ status: 'acknowledged' });
  }

  if (message.type === 'COOKIE_BANNER_DETECTED') {
    if (sender.tab?.id) {
      chrome.action.setBadgeText({ text: '🍪', tabId: sender.tab.id });
      chrome.action.setBadgeBackgroundColor({ color: '#F59E0B', tabId: sender.tab.id });
    }
    sendResponse({ status: 'acknowledged' });
  }

  if (message.type === 'OPEN_WEBAPP') {
    const persona = message.persona || 'student';
    const targetUrl = message.policyId
      ? `${WEBAPP_BASE_URL}/policy/${message.policyId}/summary?persona=${encodeURIComponent(persona)}`
      : `${WEBAPP_BASE_URL}/analyze?url=${encodeURIComponent(message.url)}&persona=${encodeURIComponent(persona)}&autoAnalyze=true&open=true`;
    chrome.tabs.create({ url: targetUrl });
    sendResponse({ status: 'tab_opened', url: targetUrl });
  }

  if (message.type === 'CHECK_DOMAIN_STATUS') {
    const domain = message.domain || '';
    const url = message.url || '';

    chrome.storage.local.get(['privylens_token'], async (res) => {
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (res.privylens_token) {
          headers['Authorization'] = `Bearer ${res.privylens_token}`;
        }

        const noise = ['com', 'org', 'net', 'edu', 'gov', 'io', 'ai', 'co', 'uk', 'in', 'policies', 'privacy', 'legal', 'help', 'www'];
        const parts = domain.toLowerCase().split('.').filter((p) => !noise.includes(p));
        const keyword = parts[parts.length - 1] || domain.split('.')[0];

        // 1. Direct lookup
        const lookupResp = await fetch(`http://localhost:5000/api/policies/lookup?domain=${encodeURIComponent(keyword)}&url=${encodeURIComponent(url)}`, { headers });
        if (lookupResp.ok) {
          const lBody = await lookupResp.json();
          if (lBody?.data?.policy && lBody.data.policy.overall_score !== undefined) {
            sendResponse({ audited: true, policy: lBody.data.policy });
            return;
          }
        }

        // 2. Policies list fallback
        const resp = await fetch('http://localhost:5000/api/policies', { headers });
        if (resp.ok) {
          const body = await resp.json();
          const policies = body?.data?.policies || [];
          const matched = policies.find(
            (p) =>
              p.policy_url === url ||
              (p.website_url && p.website_url.toLowerCase().includes(domain.toLowerCase())) ||
              (p.policy_url && p.policy_url.toLowerCase().includes(domain.toLowerCase())) ||
              (p.title && keyword && p.title.toLowerCase().includes(keyword.toLowerCase()))
          );
          if (matched && matched.overall_score !== undefined) {
            sendResponse({ audited: true, policy: matched });
            return;
          }
        }
        sendResponse({ audited: false });
      } catch (err) {
        sendResponse({ audited: false, error: err.message });
      }
    });
    return true; // async sendResponse
  }

  return true;
});
