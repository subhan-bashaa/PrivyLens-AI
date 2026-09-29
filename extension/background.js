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
    // Routes to Login first so user authenticates with their chosen Person Type, then forwards to Analyze
    const targetUrl = `${WEBAPP_BASE_URL}/login?url=${encodeURIComponent(message.url)}&persona=${encodeURIComponent(persona)}&autoAnalyze=true&open=true`;
    chrome.tabs.create({ url: targetUrl });
    sendResponse({ status: 'tab_opened', url: targetUrl });
  }

  return true;
});
