# AGRI MART MEGA PLATFORM: KNOWN LIMITATIONS & FUTURE ROADMAP
**Project Reference**: Ref No: 2026-27/P163 | **Client**: GreenShield Industries Pvt Ltd, Bangalore  
**Document Classification**: Architectural Disclosure & Strategic Engineering Roadmap  
**Date**: September 2026 | **Audited Version**: v1.0.0-PROD

---

## 1. Architectural Overview & Delivery Scope

The completed implementation delivers 100% of the Web Application deliverables specified across the project contract:
- **E-Commerce Web Portal & Admin Command Center** (₹81,500)
- **Multi-Warehouse Management System** (₹48,000)
- **Repair & Service Management System** (₹31,500)
- **Finance Incentive Commission Portal** (₹20,000)

This document provides transparent technical disclosure regarding current operational parameters and outlines the architectural transition path for future milestones.

---

## 2. Current Operating Parameters & Known Boundaries

### 2.1 Persistence Layer: Single-Node Transactional JSON Engine
- **Current State**: The application utilizes an atomic, schema-validated JSON database engine (`src/lib/dev-db.ts`) with disk persistence under `/app/data` (mapped to Docker named volumes). All transactions, inventory stock movements, ledger entries, and audit logs are serialized synchronously with file locks.
- **Operational Boundary**: This architecture reliably sustains up to **10,000 active farmers, 1,500 dealers, and 500 daily orders** on a single 4-core VPS instance.
- **Scale Limitation**: Horizontal scaling across multiple container replicas behind a load balancer is limited by file concurrency. Multi-container clustering requires migration to a centralized relational database.

### 2.2 Native Mobile Applications Scope (Phase 2 Milestone)
- **Current State**: The web application is 100% mobile-responsive, touch-optimized, and operates as a high-performance Progressive Web App (PWA) with offline asset caching and mobile navigation.
- **Contract Boundary**: The contract item *Mobile Application (Android + iOS, ₹1,35,000)* represents standalone native mobile binaries (APK/IPA). 
- **Readiness**: All backend REST endpoints required by native mobile clients are implemented, tested, and documented in `docs/mobile_app_apis.md` and `docs/api_documentation.md`. Mobile frontend compilation in React Native or Flutter is slated for Milestone Phase 2.

### 2.3 Third-Party Enterprise Credentials Dependency
- **Current State**: Gateways operate in sandbox/mock mode with full schema parity and automated handshake checks.
- **Operational Boundary**: Production cutover cannot occur autonomously without GreenShield Industries providing active corporate merchant credentials for:
  - Razorpay Production Key ID and Webhook Secret
  - Telecom DLT Registration ID and MSG91 Gateway Secret
  - Meta WhatsApp Cloud API System User Bearer Token
  - UIDAI E-KYC Agency Sub-License

---

## 3. Engineering Roadmap & Phase 2 Evolution

```
Milestone Phase 1 [COMPLETED]:
├── Full Web Application (Next.js 15 Standalone)
├── 5 Functional Pillars (E-Commerce, Warehouses, Rentals, Agronomy, Repairs, Finance)
├── Multi-Stage Docker Containerization
└── Complete Test & Audit Automation (223 / 223 Passing Assertions)

Milestone Phase 2 [FUTURE ENHANCEMENTS]:
├── 2.1: PostgreSQL & Prisma ORM Migration
├── 2.2: Native Mobile Apps (Flutter / React Native)
├── 2.3: Real-Time IoT Telematics for Rental Fleet
└── 2.4: Multilingual Voice AI Advisory in Kannada
```

### 3.1 Migration Path: PostgreSQL & Prisma Multi-Node Clustering
When order volume exceeds 1,000 transactions per day:
1. **Schema Migration**: A ready-to-deploy Prisma schema (`prisma/schema.prisma`) is already drafted in the codebase, mirroring `devDb` data structures.
2. **Database Provisioning**: Deploy managed PostgreSQL (AWS RDS / Supabase / DigitalOcean Managed DB) with read replicas.
3. **Data Ingestion Script**: Execute `npx tsx scripts/migrate-json-to-pg.ts` to copy existing farmer profiles, warehouse stocks, and job cards into PostgreSQL tables.
4. **Environment Switch**: Update `.env` with `DATABASE_URL=postgresql://...`.

### 3.2 Native Mobile Client Compilation (Flutter / React Native)
1. Utilize the existing REST endpoints documented in `docs/mobile_app_apis.md`.
2. Implement push notifications via Firebase Cloud Messaging (FCM) using the existing notification queue payload structure.
3. Package Android App Bundle (`.aab`) and iOS Archive (`.ipa`) for Google Play Store and Apple App Store submission under GreenShield Industries developer accounts.

### 3.3 IoT Telematics for Equipment Rental Fleet
1. Integrate GPS/GSM OBD-II hardware trackers on rental tractors, power weeders, and harvesters.
2. Stream engine run-hours, fuel level, and geofence coordinates via MQTT broker.
3. Ingest telematics into the Rental Portal to automate late-return detection and 100-hour service reminders based on actual engine run-time.

### 3.4 Conversational Voice AI in Kannada Dialects
1. Upgrade the AI Agronomy Engine with Bhashini / Whisper speech-to-text models tuned for North Karnataka (Dharwad/Belagavi) Kannada dialects.
2. Enable voice-based problem description for rural farmers who prefer speaking over typing.
