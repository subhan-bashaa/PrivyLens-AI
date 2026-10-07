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

## ✨ Production Features

- **Zero Dummy Data**: All audits, risk scores, and assessments are derived from live LLM intelligence and real Neon PostgreSQL database records.
- **5-Persona Tailored Intelligence**: Choose between **Student**, **Parent**, **Employee**, **Business**, and **General** personas directly from the popup or injected banner to get persona-specific impact analysis.
- **Automatic Privacy Policy Slide-in**: When browsing legal pages or policies (e.g., `/privacy`, `/terms`), a non-intrusive floating Cyber Emerald card slides in on the top-right.
- **Dynamic Cookie Banner Pre-Warning**: Extracts real text tokens from detected cookie consent dialogs and warns against predatory trackers and telemetry before you click "Accept All".
- **Shadow DOM Isolation**: Rendered in an isolated shadow root so it never interferes with the host website's styles or layout.
- **Direct Backend & Database Integration**: Connects to the live PrivyLens backend (`http://localhost:5000/api`) to check if the current domain/URL has already been audited, showing the real trust score and risk tier.
- **1-Click Deep Link to Analysis**: Direct deep-link routes to `http://localhost:5173/login?url=...&persona=...&autoAnalyze=true` to initiate full deterministic AI fact extraction, 11-category weighted risk scoring, and legal reference mapping (DPDP Act 2023, DPDP Rules 2025, NIST Privacy Framework).
- **Customizable Privacy Controls**: Toggle policy detection, cookie detection, or mute sites directly from the extension toolbar popup.
