# PrivyLens AI — Backend Platform

Production-ready Node.js, Express, Neon PostgreSQL, ChromaDB, and Groq/Llama backend for the **PrivyLens AI** Privacy Intelligence Platform.

---

## 🚀 Features Implemented in Phase 1 to 5

- **Express Framework Foundation**: Security-hardened with Helmet, rate limiters, Morgan logging, and CORS supporting both the React frontend and Chromium extensions.
- **Neon PostgreSQL Integration**: Pooled connection with SSL support and complete relational schema for users, policies, versions, scores, monitoring, alerts, and reports.
- **JWT Authentication Engine**:
  - Secure bcrypt password hashing with 12 salt rounds
  - User registration with default privacy persona (`student`, `parent`, `employee`, `business`, `general`)
  - Session verification middleware (`requireAuth` & `optionalAuth`)
  - Profile preferences & settings management
- **Centralized Error Handling**: Unified JSON response structure with distinct error codes.

---

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your database credentials:
```bash
cp .env.example .env
```

Ensure `DATABASE_URL` points to your Neon PostgreSQL instance:
```env
DATABASE_URL=postgresql://[user]:[password]@[endpoint].neon.tech/[dbname]?sslmode=require
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

### 3. Initialize PostgreSQL Database Schema
Run the schema runner to generate all 10 tables, foreign keys, and indexes:
```bash
npm run db:init
```

### 4. Start the Backend Server
```bash
# Development (with hot-reload)
npm run dev

# Production
npm start
```

---

## 📡 Core Auth Endpoints

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new user + initial persona | ❌ |
| `POST` | `/api/auth/login` | Authenticate user & retrieve JWT | ❌ |
| `POST` | `/api/auth/logout` | Client session termination | ❌ |
| `GET` | `/api/auth/me` | Fetch active user profile & preferences | ✅ |
| `POST` | `/api/auth/change-password` | Update user password | ✅ |
| `GET` | `/api/health` | Health check & uptime diagnostic | ❌ |

---

## 📡 User & Profile Endpoints (Phase 6)

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/users/profile` | Get user persona, device type & preferences | ✅ |
| `PUT` | `/api/users/profile` | Update profile attributes & privacy settings | ✅ |
| `GET` | `/api/users/settings` | Get email/monitoring notifications & theme | ✅ |
| `PUT` | `/api/users/settings` | Update user settings | ✅ |
| `GET` | `/api/users/stats` | KPI stats (total policies, alerts, avg score) | ✅ |

---

## 📡 Policy & AI Intelligence Endpoints (Phase 7 & 8)

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/policies/analyze` | Ingest & analyze policy by URL or raw text | ✅ |
| `POST` | `/api/policies/upload-pdf` | Upload PDF policy document (up to 15MB) | ✅ |
| `GET` | `/api/policies` | List all analyzed policies for user | ✅ |
| `GET` | `/api/policies/:id` | Full policy report with scores & clauses | ✅ |
| `GET` | `/api/policies/:id/summary` | 5-Pillar scores, trust rating & red flags | ✅ |
| `GET` | `/api/policies/:id/details` | In-depth clause breakdown by pillar | ✅ |
| `GET` | `/api/policies/:id/versions` | Policy version revisions & audit trail | ✅ |
| `DELETE` | `/api/policies/:id` | Remove policy from library | ✅ |

---

## 📡 RAG & AI Grounded Chat Endpoints (Phase 11, 12 & 13)

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/ai/chat` | Ask AI questions with verbatim clause citations | ✅ |
| `POST` | `/api/ai/ask` | Alias for contextual policy Q&A | ✅ |

---

## 📡 Version Comparison & Drift Endpoints (Phase 15)

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/policies/:id/compare?from=1&to=2` | Side-by-side AST diff & Net Risk Delta | ✅ |

---

## 📡 Scheduled Monitoring Endpoints (Phase 14)

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/monitoring/enable` | Enable automated policy monitoring | ✅ |
| `POST` | `/api/monitoring/disable` | Disable automated policy monitoring | ✅ |
| `GET` | `/api/monitoring` | List monitored policies & health check times | ✅ |
| `POST` | `/api/monitoring/:id/check` | Trigger on-demand drift inspection | ✅ |

---

## 📡 Alerts & Drift Notifications (Phase 16)

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/alerts` | List unread & historical policy drift alerts | ✅ |
| `PATCH` | `/api/alerts/:id/read` | Mark individual alert as read | ✅ |
| `PATCH` | `/api/alerts/read-all` | Mark all alerts as read | ✅ |
| `DELETE` | `/api/alerts/:id` | Dismiss and delete alert | ✅ |

---

## 📡 Compliance Reports Export (Phase 17)

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/reports/:policyId` | Generate full compliance audit report | ✅ |
| `GET` | `/api/reports` | List generated user reports | ✅ |
| `GET` | `/api/reports/:id` | View specific compliance report | ✅ |



