# FoodRescue AI – Intelligent Food Surplus Management and Redistribution Platform

Welcome to **FoodRescue AI**, an intelligent, full-stack, AI-powered platform designed to connect food surplus providers (restaurants, supermarkets, farmers, catering, hostels) with verified NGOs, food banks, shelters, and communities in need.

---

## 📌 Project Overview
FoodRescue AI tackles food waste and community hunger by combining:
- **Role-Based Access Control**: Providers, NGOs, Logistics Partners, Administrators.
- **AI Matching Engine**: Multi-criteria recommendation algorithm (distance, urgency, dietary type, capacity).
- **Expiry Urgency Prediction**: Automated priority classification (Critical, Urgent, Moderate, Low).
- **Logistics & Route Planning**: Interactive maps (Leaflet + OpenStreetMap) with status tracking.
- **Surplus Forecasting**: Synthetic historical modeling to predict surplus trends.
- **RescueBot**: Interactive AI assistant for donation, onboarding, and platform navigation.

---

## 🏗️ Project Architecture
- **Frontend (`/client`)**: React 18, Vite, Tailwind CSS, Lucide React, Leaflet, Axios, Recharts/Chart.js.
- **Backend (`/server`)**: Node.js, Express.js, MongoDB & Mongoose, JWT Auth, Bcrypt.
- **AI & Analytics (`/ai`)**: Python 3, Scikit-Learn, Pandas, NumPy for intelligent scoring and surplus analytics.
- **Documentation (`/docs`)**: Architecture diagrams, ER models, API contracts, student project reports.

---

## 🚀 Quick Setup Guide

### 1. Backend Setup
```bash
cd server
npm install
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

### 3. AI Module Setup
```bash
cd ai
python -m venv venv
# Windows:
.\venv\Scripts\activate
pip install -r requirements.txt
python test_ai_env.py
```
