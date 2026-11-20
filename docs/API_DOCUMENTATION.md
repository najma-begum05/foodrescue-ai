# FoodRescue AI – REST API Specification

**Base URL:** `http://localhost:5000/api` (or custom deployment domain)  
**Standard Auth Header:** `Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user with designated role |
| `POST` | `/api/auth/login` | Public | Authenticate credentials and receive signed JWT |
| `GET` | `/api/auth/me` | Private | Retrieve profile of authenticated user |
| `GET` | `/api/auth/users` | Admin | Retrieve all registered users for audit |
| `PUT` | `/api/auth/verify-user/:id` | Admin | Update verification status (`verified`, `rejected`, `pending`) |

### Sample Login Request:
```json
POST /api/auth/login
{
  "email": "provider@foodrescue.org",
  "password": "Password123!"
}
```

---

## 2. Food Listings Routes (`/api/listings`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/listings` | Public | Browse surplus listings (supports category, urgency, search) |
| `GET` | `/api/listings/my/all` | Provider | Retrieve listings authored by current provider |
| `GET` | `/api/listings/:id` | Public | Retrieve detailed listing metadata |
| `POST` | `/api/listings` | Provider | Create and broadcast new food surplus batch |
| `PUT` | `/api/listings/:id` | Provider | Update existing surplus listing attributes |
| `DELETE` | `/api/listings/:id` | Provider | Delete surplus food listing |
| `PATCH` | `/api/listings/:id/status`| Provider | Update listing lifecycle status |

---

## 3. Donation Requests Routes (`/api/requests`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/requests` | NGO | Submit donation claim (activates Inventory Lock) |
| `GET` | `/api/requests/incoming` | Provider | View claims submitted against provider's items |
| `GET` | `/api/requests/outgoing` | NGO | View claims submitted by this NGO |
| `PATCH` | `/api/requests/:id/respond`| Provider | Accept or decline incoming claim |
| `PATCH` | `/api/requests/:id/confirm`| NGO | Confirm collection receipt at handover |
| `DELETE` | `/api/requests/:id/cancel` | NGO | Cancel claim and release locked inventory |

---

## 4. AI Algorithmic Engine Routes (`/api/ai`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/ai/recommendations` | NGO | Get ranked recommendations with match scores & explanations |
| `POST` | `/api/ai/evaluate` | Public | Evaluate match score between custom listing & NGO profile |
| `POST` | `/api/ai/predict-urgency` | Public | Predict expiry urgency (Critical, Urgent, Moderate, Low) |
| `POST` | `/api/ai/forecast-surplus` | Public | Predict end-of-day unsold surplus using historical data |

### Sample Surplus Forecast Request:
```json
POST /api/ai/forecast-surplus
{
  "preparedQuantity": 350,
  "category": "Cooked Meals",
  "dayOfWeek": "Friday",
  "eventType": "Banquet Buffet"
}
```
**Response:**
```json
{
  "success": true,
  "result": {
    "predictedSurplusQuantity": 94,
    "predictedSurplusPercentage": 27.0,
    "predictionConfidence": 93.3,
    "recommendedAction": "Offer 40% community discount at 6:00 PM; donate remaining ~94 portions to youth hostel."
  }
}
```

---

## 5. Fleet Logistics Routes (`/api/logistics`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/logistics/shipments` | Driver / Admin | Fetch assigned food transit shipments |
| `GET` | `/api/logistics/shipments/:id`| Driver | Get tracking metadata and route waypoints |
| `PATCH` | `/api/logistics/shipments/:id/status`| Driver | Progress status (`Pickup Scheduled` $\rightarrow$ `In Transit` $\rightarrow$ `Delivered`) |
| `POST` | `/api/logistics/optimize-route` | Public | Solve multi-stop route sequencing with precedence |
