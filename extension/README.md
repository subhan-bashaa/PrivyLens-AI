# 🛡️ PrivyLens AI - Chrome Extension Companion

Real-time browsing companion for **PrivyLens AI** that automatically detects privacy policies, alerts users before accepting predatory cookie banners, and deep-links directly into the full AI Analysis suite.

---

## 🚀 How to Install in Chrome / Edge / Brave

1. Open your Chromium browser and navigate to:
   - **Chrome**: `chrome://extensions/`
   - **Edge**: `edge://extensions/`
   - **Brave**: `brave://extensions/`
2. Toggle the **"Developer mode"** switch in the top-right corner.
3. Click the **"Load unpacked"** button in the top toolbar.
4. Select the `extension/` folder inside the `PrivyLens-AI` project directory:
   ```
   PrivyLens-AI/extension
   ```
5. Pin **PrivyLens AI** to your browser toolbar for instant 1-click access.

---

## ✨ Features

- **Automatic Privacy Policy Slide-in**: When you browse legal pages or policies (e.g., `/privacy`, `/terms`), a non-intrusive floating Cyber Emerald card slides in on the bottom-right.
- **Cookie Banner Pre-Warning**: Warns you with an AI risk badge when complex consent modals try to push "Accept All".
- **Shadow DOM Isolation**: Rendered in a closed shadow root so it never interferes with the host website's styles or layout.
- **1-Click Web App Deep Link**: Click **"View AI Summary"** or **"Analyze in PrivyLens Web App"** to auto-load the target page into `http://localhost:5173/analyze` and trigger real-time AI extraction.
- **Customizable Privacy Controls**: Toggle policy detection, cookie detection, or mute sites directly from the extension toolbar popup.
