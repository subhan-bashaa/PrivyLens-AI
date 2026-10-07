# Authoritative Regulatory Frameworks & Compliance Baselines

This directory contains the 4 core authoritative privacy legislation and benchmark framework documents used by **PrivyLens AI** for statutory compliance evaluation, risk scoring, and evidence-grounded RAG retrieval.

---

## 📁 Repository Document Index

| # | Document File | Official Title | Jurisdiction / Authority | Key Focus Areas in PrivyLens AI |
|---|---|---|---|---|
| 1 | `DPDP-2023 RULES.pdf` | **The Digital Personal Data Protection Act, 2023** (Act No. 22 of 2023) | 🇮🇳 India / Ministry of Law & Justice | Notice mandates (§5), Consent validity (§6), Fiduciary duties (§8), Child privacy protections (§9), Significant Data Fiduciaries (§10), Data Principal rights (§11-§14), Breach notifications, Penalties up to ₹250 Cr (§33). |
| 2 | `DPDP-2025 RULES.pdf` | **Digital Personal Data Protection Rules, 2025** (G.S.R. 846(E)) | 🇮🇳 India / Ministry of Electronics & IT (MeitY) | Itemised notice requirements (Rule 3), Consent Manager registration & obligations (Rule 4, Sched. 1), Reasonable security safeguards (Rule 6), 72-hr breach intimation (Rule 7), Data retention & 48-hr pre-erasure notices (Rule 8), Verifiable parental consent (Rule 10), Grievance redressal 90-day window (Rule 14). |
| 3 | `GDPR-REGULATIONS.pdf` | **General Data Protection Regulation (EU) 2016/679** | 🇪🇺 European Union / European Parliament & Council | Principles relating to processing (Art. 5), Lawfulness & Consent (Art. 6-7), Special category data (Art. 9), Data subject rights (Art. 12-22), DPO obligations (Art. 37-39), 72-hr Supervisory breach reporting (Art. 33), Cross-border transfers (Art. 44-49), Administrative fines up to €20M / 4% turnover (Art. 83). |
| 4 | `NIST.CSWP.01162020.pdf` | **NIST Privacy Framework: Enterprise Risk Management (v1.0)** | 🇺🇸 United States / NIST (Dept. of Commerce) | 5 Core Functions: `IDENTIFY-P` (Inventory, Mapping, Risk Assessment), `GOVERN-P` (Policies, Strategy, Training), `CONTROL-P` (Data Processing, Disassociated Processing), `COMMUNICATE-P` (Transparency, Awareness), and `PROTECT-P` (Access Control, Data Security, System Maintenance). |

---

## 🧠 System Integration in PrivyLens AI

These statutory benchmarks directly drive:
1. **Compliance Risk Scoring Engine** (`backend/src/services/policy.service.js`):
   - Maps policy clauses against statutory requirements (DPDP Act, DPDP Rules, GDPR, and NIST).
   - Evaluates child protection, consent specificity, data retention limits, and breach notification readiness.
2. **Authoritative Reference Retrieval** (`backend/src/services/referenceRetrievalService.js`):
   - Chunks and stores legal baselines with citations (Section, Act, Page) in ChromaDB vector store.
3. **Evidence-Grounded RAG Assistant** (`backend/src/services/ragChatService.js`):
   - Enforces strict grounding, citing policy clauses alongside the relevant legal standard for students, parents, employees, and businesses.
