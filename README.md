# FoodRescue AI – Intelligent Food Surplus Management & Redistribution Platform

[![Full-Stack MERN](https://img.shields.io/badge/Stack-MERN%20%2B%20Python-emerald.svg)](https://github.com)
[![OpenStreetMap Leaflet](https://img.shields.io/badge/Maps-OpenStreetMap%20%2F%20Leaflet-blue.svg)](https://leafletjs.com)
[![Automated E2E Tests](https://img.shields.io/badge/Tests-22%2F22%20Passing%20(100%25)-brightgreen.svg)](tests/in_process_test_suite.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**FoodRescue AI** is an intelligent, full-stack, AI-powered food surplus management and redistribution platform that connects commercial food surplus providers (restaurants, hotels, caterers, supermarkets, bakeries, hostels, farms) with certified recipient organizations (NGOs, charities, food banks, shelters, community kitchens) and logistics fleets.

---

## 🌟 Key Highlights & Engineering Features

1. **4 Role-Based Access Control (RBAC) Portals:**
   - **Food Providers:** Publish surplus batches, forecast end-of-day waste, manage charity claims.
   - **NGOs / Charities:** Browse available food, receive AI matching recommendations, lock inventory, verify collection receipts.
   - **Logistics Fleets:** Live OpenStreetMap dispatch grid, multi-stop route sequencing, temperature compliance checks.
   - **Administrators:** Platform governance, user verification auditing (80G/12A), system-wide impact analytics.

2. **Atomic Multi-Recipient Inventory Lock:**
   - Prevents double-claiming race conditions: automatically decrements available portions ($Q_{\text{req}} \le Q_{\text{avail}}$) and transitions listings to `Reserved` when fully claimed.
   - Restores stock automatically if a claim is declined or cancelled.

3. **AI Multi-Criteria Matching Engine (0–100 Score):**
   - Evaluates Distance ($35\%$), Expiry Urgency ($25\%$), Dietary Alignment ($20\%$), and Intake Capacity ($20\%$).
   - Generates transparent natural language explanations for every recommendation.

4. **Predictive Food Urgency & Decay Classification:**
   - Categorizes shelf life into **Critical**, **Urgent**, **Moderate**, and **Low** based on category decay rates ($K_{\text{cat}}$) and temperature storage multipliers ($M_{\text{storage}}$).
   - Prominently enforces mandatory 3-point human sensory inspection (visual, odor, thermal probe) at handover.

5. **AI End-of-Day Surplus Forecasting:**
   - Predicts unsold surplus batches in advance using synthetic time-series hospitality benchmarks.
   - 1-click pre-fill into surplus listing drafts.

6. **OpenStreetMap & Leaflet Multi-Stop Fleet Routing:**
   - Free OpenStreetMap tiles with custom pulsing HTML DivIcon pins.
   - Solves Traveling Salesperson delivery circuits with **Precedence Constraints** (pickups strictly precede dropoffs) and hot-meal priority, calculating distance and carbon emission offsets ($\text{kg CO}_2$ prevented).

7. **In-App Real-Time Notification Center & RescueBot AI:**
   - Filterable notification drawer tracking claims, critical shelf-life alerts, and dispatch updates.
   - Floating interactive RescueBot AI chatbot answering food safety policies, matching algorithms, and platform workflows.

---

## 🏗️ Technical Architecture

```
foodsecurity/
├── client/                     # Vite + React 18 Single Page Application
│   ├── src/
│   │   ├── components/         # LogisticsMap, RescueBot, NotificationCenter, AnalyticsCharts, Modals
│   │   ├── dashboards/         # ProviderDashboard, NgoDashboard, LogisticsDashboard, AdminDashboard
│   │   ├── pages/              # LandingPage, AvailableFoodPage, ImpactPage, AboutPage, HowItWorksPage
│   │   ├── context/            # AuthContext (JWT session management)
│   │   └── services/           # api.js (Axios API client with Bearer interceptors)
├── server/                     # Node.js + Express REST API Gateway
│   ├── src/server.js           # Server bootstrap & in-memory / MongoDB dual-mode connection
│   ├── controllers/            # authController, listingController, requestController, aiController, logisticsController
│   ├── models/                 # User, FoodListing, DonationRequest, Shipment
│   ├── middleware/             # authMiddleware (JWT protect & role authorization)
│   └── routes/                 # authRoutes, listingRoutes, requestRoutes, aiRoutes, logisticsRoutes
├── ai/                         # Python Algorithmic & Scientific Core
│   ├── matching/engine.py      # Haversine multi-criteria recommendation scoring
│   ├── prediction/             # urgency_classifier.py, surplus_forecaster.py
│   ├── logistics/              # route_optimizer.py (TSP multi-stop router)
│   └── datasets/               # historical_surplus.csv (hospitality benchmarks)
├── tests/                      # Automated Verification
│   ├── in_process_test_suite.js # Zero-socket E2E test runner (22/22 Passing)
│   └── test_suite.js           # HTTP socket test suite
└── docs/                       # Academic & Technical Documentation
    ├── ARCHITECTURE.md         # 3-tier distributed systems architecture
    ├── DATABASE_SCHEMA.md      # MongoDB entity-relationship models & 2dsphere indexing
    ├── API_DOCUMENTATION.md    # Complete REST API specification
    └── VIVA_DEFENSE_GUIDE.md   # Comprehensive academic viva defense Q&A preparation
```

---

## ⚡ Quick Start Instructions

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v20/v24)
- **Python** 3.10+
- **npm** v9+

### 2. Backend Installation & Startup
```bash
cd server
npm install
npm run dev
```
*Note:* The backend features a zero-dependency dual-mode architecture. It automatically connects to MongoDB when `MONGODB_URI` is provided in `server/.env`, and gracefully defaults to an in-memory session store pre-seeded with live Hyderabad demo records for instant zero-config testing.

### 3. Frontend Installation & Startup
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Deploying on Render

The root `render.yaml` Blueprint provisions the API and frontend. After syncing it, set `MONGODB_URI` on the API service to a MongoDB Atlas connection string for persistent data. Confirm `CLIENT_URL` on the API and `VITE_API_BASE_URL` on the frontend match the actual Render service URLs; changing the frontend variable requires a new frontend build/deploy.

### 5. Running Automated Integration Tests
```bash
node tests/in_process_test_suite.js
```
Runs 22 comprehensive integration tests across all 9 modules with 100% pass rate.

---

## 🔑 Quick Demo Login Credentials

You can click any **1-Click Quick Demo Login** button on the Login page (`/login`) or use:

| Role | Email | Password | Organization |
|---|---|---|---|
| **Food Provider** | `provider@foodrescue.org` | `Password123!` | Grand Horizon Convention Hotels |
| **Verified NGO** | `ngo@foodrescue.org` | `Password123!` | Hope Haven Community Kitchen & Shelter |
| **Logistics Driver** | `driver@foodrescue.org` | `Password123!` | Urban Food Rescue Volunteer Fleet |
| **Administrator** | `admin@foodrescue.org` | `Password123!` | FoodRescue AI Platform Oversight HQ |

---

## 📚 Technical Documentation & Viva Defense Deliverables

- [Architecture Design & System Workflow](docs/ARCHITECTURE.md)
- [MongoDB Schema & Concurrency Locking](docs/DATABASE_SCHEMA.md)
- [Complete REST API Documentation](docs/API_DOCUMENTATION.md)
- [Academic Defense & Viva Voce Q&A Guide](docs/VIVA_DEFENSE_GUIDE.md)

---

## 📜 Regulatory & Food Safety Disclosure
FoodRescue AI prioritizes redistribution urgency and logistical efficiency. The system does not independently guarantee microbiological food safety. All donating providers and recipient organizations must follow local food handling standards and perform mandatory visual, olfactory, and thermal inspection checks before accepting food items.
