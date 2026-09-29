# PrivyLens AI – Real-Time Privacy Intelligence & Policy Summarization Platform

An enterprise-grade privacy analysis and compliance platform built with **React 19 + Vite + Tailwind CSS (Frontend)** and a **Chromium Browser Companion (Manifest V3 Extension)**, featuring multi-pillar AI privacy risk scoring, dark-pattern cookie detection, and anti-hallucination clause evidence verification.

---

## 🌟 Architecture Overview

```text
               ┌──────────────────────────────────────────────────────────────┐
               │    Chromium Browser Extension Companion (Manifest V3)         │
               │  - Passive Legal Page Detector (/privacy, /terms regex)      │
               │  - Dark-Pattern Cookie Banner Sniffer (MutationObserver)     │
               │  - Closed Shadow DOM Floating Emerald Notification Card      │
               │  - Toolbar Quick-Inspection & Site-Mute Popup Modal          │
               └──────────────────────────────┬───────────────────────────────┘
                                              │ 1-Click Deep Link (/analyze?url=...)
                                              ▼
               ┌──────────────────────────────────────────────────────────────┐
               │           Frontend (React 19 + Vite + Tailwind CSS v4)       │
               │  - Dashboard & Score Distribution (Recharts Analytics)       │
               │  - Dual-Input Policy Analyzer (Deep-Link URL & Raw Text)     │
               │  - 5-Pillar Score Breakdown & Trust Recommendation Cards     │
               │  - Clause-by-Clause Audit Table & GDPR/CCPA Compliance Flags │
               │  - Side-by-Side Version Diffing & Net Risk Delta Tracker     │
               │  - Context-Grounded "Ask AI Assistant" Chat Modal            │
               │  - Real-Time Policy Drift Alerts & Monitoring Manager        │
               │  - Compliance Audit Report Generator & PDF/JSON Exporter     │
               │  - BYOK (Bring Your Own Key) Settings (OpenAI / Claude / Gemini)
               └──────────────────────────────┬───────────────────────────────┘
                                              │ Axios Service Layer (services/api.js)
                                              ▼
               ┌──────────────────────────────────────────────────────────────┐
               │        AI Reasoning & Evidence Verification Engine           │
               │  - 5-Pillar NLP Categorization & Clause Segmentation         │
               │  - Weighted Privacy Risk Scoring (0–100 Normalized Scale)    │
               │  - Bidirectional Anti-Hallucination Clause Citation Locator  │
               │  - Grounded Context Synthesis for AI Q&A Assistant           │
               └──────────────────────────────┬───────────────────────────────┘
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼ (Current Phase: Local Mock Engine)            ▼ (Planned Next Phase)
           ┌────────────────────────────────────┐         ┌────────────────────────────────────┐
           │   Deterministic In-Memory Engine   │         │    Backend & Relational Database   │
           │  - 5 Full Real-World Policy Demos  │         │  - Node.js / Express or FastAPI    │
           │  - Historic Version Diffs (24 vs 26│         │  - PostgreSQL Relational Schema    │
           │  - Active Monitoring & Alert Feeds │         │  - pgvector / ChromaDB Embeddings  │
           │  - LocalStorage BYOK Key Vault     │         │  - Automated Cron Scraping Workers │
           └────────────────────────────────────┘         └────────────────────────────────────┘
```

---

## 🚀 Key Capabilities

### Privacy Intelligence Lifecycle
```text
Policy URL / Raw Text ⟶ Clause Segmentation ⟶ 5-Pillar NLP Classification ⟶ Risk Scoring (0–100) ⟶ Anti-Hallucination Evidence Mapping ⟶ Interactive AI Q&A ⟶ Version Drift Tracking
```

- **5-Pillar Comprehensive Privacy Risk Scoring**:
  Standardizes disparate, multi-thousand-word legalese into 5 consistent evaluative pillars:
  1. **Data Collection & Tracking**: Telemetry, biometrics, hardware identifiers, location traces.
  2. **Third-Party Data Sharing & Brokers**: External disclosures, ad-tech networks, corporate affiliates.
  3. **Data Retention & Deletion**: Storage lifecycles, backup purges, right-to-be-forgotten adherence.
  4. **User Rights & Regulatory Compliance**: Explicit GDPR (Articles 15-22) and CCPA opt-out conformity.
  5. **Security & Encryption Standards**: In-transit and at-rest encryption, SOC2/ISO compliance, breach protocols.

- **Zero-Conflict Closed Shadow DOM Browser Extension**:
  - Injected notification cards render inside a `#shadow-root (closed)` wrapper, guaranteeing zero CSS collisions with host websites.
  - Automatically identifies privacy pages and warns against dark-pattern cookie consent modals before users click "Accept All".
  - Features 1-click deep linking into the frontend web suite (`http://localhost:5173/analyze?url=...`).

- **Bidirectional Anti-Hallucination Evidence Verification**:
  - Every critical flag and AI score deduction is bound to verbatim source clause quotes with section references and line numbers.
  - Users and compliance auditors can verify findings directly against source text with zero AI fabrication.

- **Interactive Context-Grounded AI Assistant ("Ask PrivyLens")**:
  - Conversational Q&A modal with pre-configured prompts (*"Does this company sell my biometric data?"*, *"How do I delete my account?"*, *"Are minors protected under COPPA?"*).
  - Responses reference exact policy clauses for verifiable answers.

- **Side-by-Side Version Diffing & Drift Alerts**:
  - Comparative split-view diff viewer highlighting inserted, modified, and deleted terms.
  - Computes net risk score deltas (e.g. `+14% Risk increase detected in 2026 revision`) and notifies users of stealth changes.

- **Bring-Your-Own-Key (BYOK) Client Storage**:
  - Supports custom OpenAI, Anthropic Claude, and Google Gemini API keys stored safely in browser local storage.

- **State-of-the-Art Cyber Emerald Design System**:
  - High-trust dark obsidian aesthetics with glowing emerald accents, acrylic glassmorphism panels, and full light/dark theme toggle.

---

## 📂 Project Structure

```text
PrivyLens-AI/
├── README.md                                    # Project documentation & architectural blueprints
│
├── extension/                                   # BROWSER EXTENSION COMPANION (Manifest V3)
│   ├── manifest.json                            # Extension metadata, permissions & content script declarations
│   ├── background.js                            # Background service worker (badge manager & tab listener)
│   ├── content.js                               # Content script (closed Shadow DOM card & cookie sniffer)
│   ├── content.css                              # Host wrapper positioning & isolation styles
│   ├── popup.html                               # Extension toolbar popup interface
│   ├── popup.js                                 # Popup logic, active tab domain inspection & mute toggles
│   ├── popup.css                                # Cyber Emerald styling for extension toolbar popup
│   └── icons/                                   # High-resolution brand icons (16px, 48px, 128px)
│
├── frontend/                                    # FRONTEND WEB APPLICATION (React 19 + Vite)
│   ├── index.html                               # Single Page Application HTML shell
│   ├── package.json                             # Frontend dependencies, build scripts & metadata
│   ├── vite.config.js                           # Vite bundler plugins (React + Tailwind CSS v4)
│   ├── .oxlintrc.json                           # Oxlint performance linter configuration
│   ├── public/                                  # Static frontend public assets (logos, favicons)
│   │
│   └── src/                                     # React 19 source code
│       ├── main.jsx                             # Application mounting entrypoint
│       ├── App.jsx                              # Route definitions & global provider tree
│       ├── index.css                            # Tailwind CSS v4 imports, custom tokens & glassmorphism
│       │
│       ├── services/                            # Frontend API & service layer
│       │   └── api.js                           # Axios client with auth interceptors & mock fallback stubs
│       │
│       ├── context/                             # Global state providers (Auth, Chat, Theme)
│       │   ├── AuthContext.jsx                  # User login state & session persistence
│       │   ├── ChatContext.jsx                  # AI Assistant conversation state & grounded citations
│       │   └── ThemeContext.jsx                 # Cyber Emerald dark/light mode toggle provider
│       │
│       ├── data/                                # Mock datasets for deterministic local simulation
│       │   ├── mockPolicies.js                  # Realistic policies (WhatsApp, Spotify, Instagram, etc.)
│       │   ├── mockVersions.js                  # Side-by-side policy version diffs (2024 vs 2026 revisions)
│       │   ├── mockAlerts.js                    # Policy drift notifications & critical severity warnings
│       │   ├── mockMonitoring.js                # Monitored domain metrics, scan frequencies & health scores
│       │   ├── mockChatData.js                  # Pre-grounded Q&A prompt templates & citation snippets
│       │   └── mockReports.js                   # Audit-ready compliance report exports
│       │
│       ├── pages/                               # Routed view components (17 Pages)
│       │   ├── Landing.jsx                      # High-conversion public landing page with live simulator
│       │   ├── Login.jsx                        # User authentication page
│       │   ├── Register.jsx                     # New user registration page
│       │   ├── ForgotPassword.jsx               # Password recovery workflow
│       │   ├── Dashboard.jsx                    # Primary KPI analytics dashboard with Recharts
│       │   ├── AnalyzePolicy.jsx                # URL scraper & raw text policy submission console
│       │   ├── MyPolicies.jsx                   # User's policy portfolio library
│       │   ├── PolicySummary.jsx                # 5-Pillar category overview & trust recommendation
│       │   ├── PolicyDetails.jsx                # In-depth clause inspector & GDPR/CCPA compliance flags
│       │   ├── CompareVersions.jsx              # Side-by-side version diffing & net delta calculator
│       │   ├── Monitoring.jsx                   # Tracked domains control center & check intervals
│       │   ├── Alerts.jsx                       # Real-time policy change alert notification feed
│       │   ├── Bookmarks.jsx                    # Saved policy vault with custom tags & search filters
│       │   ├── Reports.jsx                      # Compliance audit report generator & exporter
│       │   ├── Profile.jsx                      # User profile, privacy persona & scan stats
│       │   ├── Settings.jsx                     # BYOK API keys (OpenAI/Claude/Gemini) & preferences
│       │   └── HelpSupport.jsx                  # Documentation, knowledge base & support tickets
│       │
│       └── components/                          # Modular reusable component suites
│           ├── layout/                          # AppLayout, Sidebar, Header, LandingNavbar, Footer
│           ├── dashboard/                       # KeyInsightsGrid, PolicyHeroCard, ScoreGauge, ScoreBreakdownChart
│           ├── analysis/                        # AnalysisInput, ExtractionProgress, SampleButtons
│           ├── policy/                          # PolicySummaryHeader, CategoryScoresList, AskAiAssistantModal
│           ├── policy-details/                  # ClauseCard, ClauseFilterBar, ComplianceDashboard
│           ├── compare/                         # ClauseDiffCard, CompareDeltaStats, CompareHighlightsView
│           ├── monitoring/                      # PolicyMonitorCard, MonitoredPoliciesGrid, MonitoringStatsBar
│           ├── alerts/                          # AlertCard, AlertFilterBar, AlertDetailsModal
│           ├── reports/                         # ReportsTable, ReportTemplateGrid, ReportPreviewModal
│           ├── chat/                            # ChatDrawer, ChatMessageBubble, ChatInput
│           ├── profile/                         # ProfileHeader, AccountDetailsForm, PrivacyPersonaCard
│           ├── settings/                        # ApiKeysSettingsTab, GeneralSettingsTab, NotificationSettingsTab
│           ├── auth/                            # AuthPopupCard, SocialAuthButtons
│           └── common/                          # Button, Modal, Badge, Tooltip, SearchBar, Tabs
│
└── backend/                                     # 🔮 UPCOMING BACKEND (Node.js / Express or FastAPI + PostgreSQL)
```

---

## 🧪 Verified Demonstration Policies

The platform includes exhaustive real-world demonstration policies with complete clause breakdowns, regulatory ratings, and evidence quotes:

| Policy Target | Category | Trust Score | Risk Level | Scenario Demonstrated |
| :--- | :--- | :---: | :---: | :--- |
| **WhatsApp** (`whatsapp`) | Messaging & Social | **7.2 / 10** | **Medium** | **Metadata Sharing vs E2EE**: Message content encrypted via Signal Protocol, but interaction metadata and device telemetry shared with Meta corporate family. |
| **Spotify** (`spotify`) | Audio & Streaming | **5.4 / 10** | **High** | **Advertising Profiling**: Aggressive third-party ad-broker network sharing, background acoustic telemetry, and location fingerprinting. |
| **Instagram** (`instagram`) | Social Media | **3.8 / 10** | **Critical** | **Biometric & Cross-App Tracking**: Facial geometry recognition, cross-device browsing tracking, and automatic targeted ad synchronization. |
| **Zoom Video** (`zoom`) | Video & SaaS | **7.8 / 10** | **Medium** | **AI Model Training Clause Audit**: Customer meeting audio/video exempted from AI training, but diagnostic telemetry harvested for product analytics. |
| **Notion** (`notion`) | Productivity & SaaS | **8.5 / 10** | **Low** | **Enterprise Compliance**: SOC2 Type II certification, strict zero-sale data broker policy, and rapid GDPR deletion workflows. |

---

## 🏃 Quick Start Guide

### 1. Frontend Web App Setup

1. Open your terminal in the frontend directory:
   ```bash
   cd c:\Users\subha\Downloads\PROJECTS\FINAL-YEAR-PROJECT\PrivyLens-AI\frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server (Port 5173):
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   👉 **`http://localhost:5173`**

   *Key routes to explore:*
   - `http://localhost:5173/` — Landing page with interactive score preview.
   - `http://localhost:5173/dashboard` — Analytics KPIs, score radar, and recent scans.
   - `http://localhost:5173/analyze` — Test URL ingestion or paste privacy policy text.
   - `http://localhost:5173/policy/whatsapp/summary` — 5-Pillar breakdown, trust cards, and AI Assistant.
   - `http://localhost:5173/compare` — Side-by-side policy version diff viewer.
   - `http://localhost:5173/settings` — Configure custom OpenAI, Claude, or Gemini API keys.

---

### 2. Browser Companion Extension Setup

1. Open your Chromium-based browser and navigate to the extensions console:
   - **Google Chrome**: `chrome://extensions/`
   - **Microsoft Edge**: `edge://extensions/`
   - **Brave**: `brave://extensions/`
2. Toggle the **"Developer mode"** switch in the top-right corner.
3. Click the **"Load unpacked"** button in the top-left toolbar.
4. Select the `extension/` folder inside the project:
   ```
   c:\Users\subha\Downloads\PROJECTS\FINAL-YEAR-PROJECT\PrivyLens-AI\extension
   ```
5. Pin the **PrivyLens AI** extension icon to your toolbar.
6. Visit any website (e.g. `https://spotify.com` or any `/privacy` page).
7. Notice the floating Cyber Emerald slide-in notification card in the bottom-right corner!
8. Click **"Analyze in PrivyLens"** to auto-load the page into your running frontend web app at `http://localhost:5173/analyze`.

---

## 📡 REST API & Service Reference

All frontend service calls route through [frontend/src/services/api.js](file:///c:/Users/subha/Downloads/PROJECTS/FINAL-YEAR-PROJECT/PrivyLens-AI/frontend/src/services/api.js). The frontend currently utilizes deterministic mock data stubs and will seamlessly connect to the backend server via `VITE_API_URL` (Port 5000) in the upcoming phase:

| Method | Endpoint | Description | Current Status |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/policies/analyze` | Initiates URL scraping or text parsing & NLP categorization | ✅ Mock Stub Active (Ready for Backend) |
| `GET` | `/api/policies/:id` | Retrieves comprehensive policy metadata and overall score | ✅ Mock Stub Active |
| `GET` | `/api/policies/:id/summary` | Retrieves 5-Pillar breakdown scores and trust recommendation | ✅ Mock Stub Active |
| `GET` | `/api/policies/:id/details` | Retrieves full clause-by-clause audit with regulatory flags | ✅ Mock Stub Active |
| `GET` | `/api/policies/:id/evidence/:findingId`| Fetches verbatim clause quote and line number citations | ✅ Mock Stub Active |
| `POST` | `/api/policies/:id/ask` | Context-grounded AI Assistant Q&A response with citations | ✅ Mock Stub Active (Grounded Data) |
| `GET` | `/api/policies/:id/versions`| Retrieves historical policy version diffs and risk deltas | ✅ Mock Stub Active |
| `POST` | `/api/policies/:id/monitoring` | Enables or updates automated check intervals for a domain | ✅ Mock Stub Active |
| `GET` | `/api/alerts` | Fetches real-time policy drift and change notifications | ✅ Mock Stub Active |
| `GET` | `/api/reports` | Generates and fetches compliance audit summary reports | ✅ Mock Stub Active |

---

## 🔒 Security & Privacy Highlights

- **Zero CSS Bleed (Closed Shadow DOM)**:
  The companion browser card renders in an isolated shadow root, guaranteeing host sites cannot read or alter PrivyLens UI state.
- **Anti-Hallucination Guarantee**:
  AI findings and risk score calculations are strictly bound to verbatim source clause quotes. The platform never generates speculative risks without citations.
- **Client-Side Key Sovereignty (BYOK)**:
  User-provided OpenAI, Anthropic, or Gemini API keys are held exclusively in browser client storage (`localStorage`) and never transmitted to third-party tracking servers.
- **Decoupled Architecture**:
  The frontend and extension companion are fully decoupled, allowing the web app to function as a standalone enterprise portal or in tandem with the browser extension.

---

## 🔮 Upcoming: Backend & Database Integration (Planned Architecture)

In the upcoming development phase, PrivyLens AI will integrate a dedicated backend service and persistent relational database to support enterprise multi-user monitoring, live web scraping workers, and hybrid RAG vector search:

```text
               ┌──────────────────────────────────────────────┐
               │    Frontend (React 19) + Browser Extension   │
               └──────────────────────┬───────────────────────┘
                                      │ Axios REST (Port 5000)
                                      ▼
               ┌──────────────────────────────────────────────┐
               │        Backend (Node.js + Express.js)        │
               │  - Rate Limiting (express-rate-limit)        │
               │  - Input Validation (Joi / Zod Schemas)      │
               │  - Headless Scraper Workers (Playwright)     │
               │  - JWT Authentication & RBAC Middleware      │
               └───────────┬──────────────────────┬───────────┘
                           │                      │
                           ▼                      ▼
               ┌──────────────────────┐ ┌─────────────────────┐
               │ PostgreSQL Database  │ │ Redis / Memory Cache│
               │ - users & orgs       │ └─────────┬───────────┘
               │ - policies           │           │
               │ - policy_versions    │           ▼
               │ - policy_clauses     │ ┌─────────────────────┐
               │ - risk_scores        │ │ Multi-LLM Provider  │
               │ - evidence_citations │ │   Fallback Chain    │
               │ - monitored_domains  │ │ Gemini ──► Claude   │
               │ - audit_reports      │ │        ──► OpenAI   │
               │ - pgvector embeddings│ └─────────────────────┘
               └──────────────────────┘
```

### Planned Backend Additions:
1. **Node.js + Express (or Python FastAPI) Backend (Port 5000)**:
   - Dedicated REST API implementing the endpoints outlined in `src/services/api.js`.
   - Headless Playwright scraper to bypass anti-bot protections and extract clean policy text from any live URL.
2. **PostgreSQL Relational Schema with `pgvector`**:
   - Strict relational foreign keys for policies, versions, categorized clauses, and audit logs.
   - Vector embeddings of clause chunks using `pgvector` or ChromaDB for sub-second semantic retrieval across 100+ page terms.
3. **Multi-Provider LLM Fallback Pipeline**:
   - Automated routing across Google Gemini, Anthropic Claude, and OpenAI GPT-4o with deterministic JSON schema enforcement.
4. **Automated Cron Scraping & Webhook/Email Alerts**:
   - Background worker to automatically fetch monitored domains weekly, compute AST clause diffs, and dispatch push/email alerts when predatory changes occur.
5. **Redis Caching**:
   - High-throughput caching of frequently requested policy analyses to eliminate redundant LLM API calls and optimize performance.

---

<div align="center">
  <sub>PrivyLens AI — Final Year Project | Shielding Digital Privacy & User Sovereignty</sub>
</div>
