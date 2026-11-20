# FoodRescue AI – Database Schema & Data Models

## 1. Overview
The persistence layer of **FoodRescue AI** is built on MongoDB using Mongoose object modeling. It utilizes GeoJSON point structures with `2dsphere` indexing to enable geospatial proximity querying.

```mermaid
erDiagram
    USER ||--o{ FOOD_LISTING : "creates"
    USER ||--o{ DONATION_REQUEST : "submits/receives"
    USER ||--o{ SHIPMENT : "assigned_driver"
    FOOD_LISTING ||--o{ DONATION_REQUEST : "requested_against"
    DONATION_REQUEST ||--o| SHIPMENT : "fulfills"

    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string role "provider | ngo | logistics | admin"
        string organizationName
        string phone
        string address
        GeoPoint location "2dsphere"
        string verificationStatus "verified | pending | rejected"
        date createdAt
    }

    FOOD_LISTING {
        ObjectId _id PK
        ObjectId provider FK
        string providerName
        string foodName
        string category "Cooked Meals | Bakery | Produce | Dairy | Packaged"
        string foodType "cooked | raw | packaged | fresh_produce"
        number quantity
        string unit "meals | kg | litres | pieces | loaves"
        string dietary "Vegetarian | Vegan | Halal | Non-Veg"
        string foodCondition
        string storageRequirements
        date expiryDate
        string pickupLocation
        string pickupWindow
        GeoPoint location "2dsphere [lon, lat]"
        string status "Available | Reserved | Accepted | Picked Up | Delivered | Expired"
        date createdAt
    }

    DONATION_REQUEST {
        ObjectId _id PK
        ObjectId listing FK
        ObjectId ngo FK
        ObjectId provider FK
        number quantityRequested
        string unit
        string pickupSchedule
        string deliveryAddress
        string status "pending | accepted | rejected | completed | cancelled"
        string notes
        date createdAt
    }

    SHIPMENT {
        ObjectId _id PK
        string trackingCode UK
        ObjectId requestId FK
        ObjectId listingId FK
        string foodName
        number quantity
        string urgency "CRITICAL | URGENT | MODERATE | LOW"
        object provider "name, address, coords"
        object recipient "name, address, coords"
        object assignedDriver "name, vehicleNumber"
        number distanceKm
        number estimatedMinutes
        string status "Pickup Scheduled | In Transit | Delivered | Cancelled"
        array waypoints
        object temperatureCompliance
        date createdAt
        date completedAt
    }
```

---

## 2. Geospatial Indexing
The `location` field on both `User` and `FoodListing` implements the standard GeoJSON specification:

```javascript
location: {
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [longitude, latitude] per GeoJSON convention
    required: true
  }
}
```

Indexes are created via:
```javascript
foodListingSchema.index({ location: '2dsphere' });
userSchema.index({ location: '2dsphere' });
```

---

## 3. Concurrency & Multi-Recipient Lock
To ensure inventory consistency under concurrent claim requests without table deadlocks:
- MongoDB `$inc` operator is used to decrement `quantity` conditionally:
```javascript
const updatedListing = await FoodListing.findOneAndUpdate(
  { _id: listingId, quantity: { $gte: requestedQty } },
  { 
    $inc: { quantity: -requestedQty },
    $set: { ...(remaining === 0 ? { status: 'Reserved' } : {}) }
  },
  { new: true }
);
```
- If the document fails to match because `quantity < requestedQty`, the transaction aborts with HTTP 400 (`Insufficient remaining inventory`).
