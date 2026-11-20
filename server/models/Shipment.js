import mongoose from 'mongoose';

const waypointSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['pickup', 'delivery'], required: true },
  address: { type: String, required: true },
  contact: { type: String, default: '' },
  coordinates: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
  },
  sequence: { type: Number, default: 1 },
  completed: { type: Boolean, default: false },
  etaMinutes: { type: Number, default: 15 }
}, { _id: false });

const shipmentSchema = new mongoose.Schema({
  trackingCode: {
    type: String,
    required: true,
    unique: true
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DonationRequest'
  },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodListing'
  },
  foodName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'meals'
  },
  urgency: {
    type: String,
    enum: ['CRITICAL', 'URGENT', 'MODERATE', 'LOW'],
    default: 'URGENT'
  },
  storageRequirement: {
    type: String,
    default: 'Keep Hot (>65°C)'
  },
  provider: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    contact: { type: String, default: '' },
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true }
    }
  },
  recipient: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    contact: { type: String, default: '' },
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true }
    }
  },
  assignedDriver: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, default: 'Driver Ravi Kumar' },
    vehicleNumber: { type: String, default: 'TS 09 EQ 4421 (Insulated Van)' }
  },
  distanceKm: {
    type: Number,
    required: true
  },
  estimatedMinutes: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pickup Scheduled', 'In Transit', 'Delivered', 'Cancelled'],
    default: 'Pickup Scheduled'
  },
  waypoints: [waypointSchema],
  temperatureCompliance: {
    checked: { type: Boolean, default: true },
    ambientTempC: { type: Number, default: 68 },
    containerType: { type: String, default: 'Thermal Hot-Box' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, { timestamps: true });

const Shipment = mongoose.models.Shipment || mongoose.model('Shipment', shipmentSchema);

export default Shipment;
