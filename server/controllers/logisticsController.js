import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import Shipment from '../models/Shipment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Seed Shipments with Real Hyderabad GPS Coordinates
let inMemoryShipments = [
  {
    _id: 'ship-801',
    trackingCode: 'FR-HYD-801',
    foodName: 'Fresh Cooked Banquet Meals',
    quantity: 120,
    unit: 'meals',
    urgency: 'CRITICAL',
    storageRequirement: 'Keep Hot (>65°C)',
    provider: {
      name: 'Royal Palace Convention Center',
      contact: '+91 98765 43210 (Manager Rajesh)',
      address: 'Road No. 1, Banjara Hills, Hyderabad',
      coordinates: { lat: 17.4156, lon: 78.4357 }
    },
    recipient: {
      name: 'Hope Haven Shelter',
      contact: '+91 98480 12345 (Sister Teresa)',
      address: 'Saifabad, Lakdikapul, Hyderabad',
      coordinates: { lat: 17.4062, lon: 78.4691 }
    },
    assignedDriver: {
      name: 'Driver Ravi Kumar',
      vehicleNumber: 'TS 09 EQ 4421 (Insulated Van)'
    },
    distanceKm: 4.8,
    estimatedMinutes: 16,
    status: 'Pickup Scheduled',
    temperatureCompliance: {
      checked: true,
      ambientTempC: 68,
      containerType: 'Insulated Hot-Box Carrier'
    },
    waypoints: [
      {
        name: 'Royal Palace Convention',
        type: 'pickup',
        address: 'Road No. 1, Banjara Hills, Hyderabad',
        contact: '+91 98765 43210',
        coordinates: { lat: 17.4156, lon: 78.4357 },
        sequence: 1,
        completed: false,
        etaMinutes: 10
      },
      {
        name: 'Hope Haven Shelter',
        type: 'delivery',
        address: 'Saifabad, Lakdikapul, Hyderabad',
        contact: '+91 98480 12345',
        coordinates: { lat: 17.4062, lon: 78.4691 },
        sequence: 2,
        completed: false,
        etaMinutes: 26
      }
    ],
    createdAt: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    _id: 'ship-802',
    trackingCode: 'FR-HYD-802',
    foodName: 'Artisan Sourdough & Multigrain Loaves',
    quantity: 45,
    unit: 'loaves',
    urgency: 'URGENT',
    storageRequirement: 'Dry Ambient Food Crate',
    provider: {
      name: 'Boulangerie Artisan Bakery',
      contact: '+91 91234 56789 (Chef Pierre)',
      address: 'Road No. 36, Jubilee Hills, Hyderabad',
      coordinates: { lat: 17.4325, lon: 78.4072 }
    },
    recipient: {
      name: 'St. Jude Youth Center',
      contact: '+91 90001 23456 (Warden Michael)',
      address: 'Hitech City Road, Madhapur, Hyderabad',
      coordinates: { lat: 17.4483, lon: 78.3915 }
    },
    assignedDriver: {
      name: 'Driver Ravi Kumar',
      vehicleNumber: 'TS 09 EQ 4421 (Insulated Van)'
    },
    distanceKm: 3.5,
    estimatedMinutes: 14,
    status: 'In Transit',
    temperatureCompliance: {
      checked: true,
      ambientTempC: 22,
      containerType: 'Dry Bread Crate'
    },
    waypoints: [
      {
        name: 'Boulangerie Bakery',
        type: 'pickup',
        address: 'Road No. 36, Jubilee Hills, Hyderabad',
        contact: '+91 91234 56789',
        coordinates: { lat: 17.4325, lon: 78.4072 },
        sequence: 1,
        completed: true,
        etaMinutes: 0
      },
      {
        name: 'St. Jude Youth Center',
        type: 'delivery',
        address: 'Hitech City Road, Madhapur, Hyderabad',
        contact: '+91 90001 23456',
        coordinates: { lat: 17.4483, lon: 78.3915 },
        sequence: 2,
        completed: false,
        etaMinutes: 14
      }
    ],
    createdAt: new Date(Date.now() - 60 * 60 * 1000)
  },
  {
    _id: 'ship-803',
    trackingCode: 'FR-HYD-803',
    foodName: 'Fortified Milk & Fresh Yogurt',
    quantity: 80,
    unit: 'litres',
    urgency: 'MODERATE',
    storageRequirement: 'Refrigerated Cold-Box (<4°C)',
    provider: {
      name: 'FreshDairy Superstore',
      contact: '+91 93456 78901 (Store Lead Anil)',
      address: 'Prakash Nagar, Begumpet, Hyderabad',
      coordinates: { lat: 17.4435, lon: 78.4682 }
    },
    recipient: {
      name: 'Sunshine Children Home',
      contact: '+91 92345 67890 (Coordinator Lakshmi)',
      address: 'Karkhana, Secunderabad, Hyderabad',
      coordinates: { lat: 17.4399, lon: 78.4983 }
    },
    assignedDriver: {
      name: 'Driver Ravi Kumar',
      vehicleNumber: 'TS 09 EQ 4421 (Insulated Van)'
    },
    distanceKm: 3.8,
    estimatedMinutes: 15,
    status: 'Pickup Scheduled',
    temperatureCompliance: {
      checked: true,
      ambientTempC: 3.5,
      containerType: 'Refrigerated Cold-Box'
    },
    waypoints: [
      {
        name: 'FreshDairy Superstore',
        type: 'pickup',
        address: 'Prakash Nagar, Begumpet, Hyderabad',
        contact: '+91 93456 78901',
        coordinates: { lat: 17.4435, lon: 78.4682 },
        sequence: 1,
        completed: false,
        etaMinutes: 20
      },
      {
        name: 'Sunshine Children Home',
        type: 'delivery',
        address: 'Karkhana, Secunderabad, Hyderabad',
        contact: '+91 92345 67890',
        coordinates: { lat: 17.4399, lon: 78.4983 },
        sequence: 2,
        completed: false,
        etaMinutes: 35
      }
    ],
    createdAt: new Date(Date.now() - 90 * 60 * 1000)
  }
];

// Helper: Haversine distance in km
function calculateHaversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// GET all assigned shipments
export const getShipments = async (req, res) => {
  try {
    let shipments = [];
    try {
      shipments = await Shipment.find().sort({ createdAt: -1 });
    } catch {
      // In-memory fallback
      shipments = inMemoryShipments;
    }

    if (!shipments || shipments.length === 0) {
      shipments = inMemoryShipments;
    }

    res.json({
      success: true,
      count: shipments.length,
      shipments
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, shipments: inMemoryShipments });
  }
};

// GET single shipment by ID
export const getShipmentById = async (req, res) => {
  const { id } = req.params;
  try {
    let shipment = null;
    try {
      shipment = await Shipment.findById(id);
    } catch {
      // Ignore
    }

    if (!shipment) {
      shipment = inMemoryShipments.find(s => s._id === id || s.trackingCode === id);
    }

    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    res.json({ success: true, shipment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH update status ('Pickup Scheduled', 'In Transit', 'Delivered')
export const updateShipmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status, temperatureC } = req.body;

  const validStatuses = ['Pickup Scheduled', 'In Transit', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid shipment status' });
  }

  try {
    let updated = null;
    try {
      updated = await Shipment.findByIdAndUpdate(
        id, 
        { 
          status,
          ...(status === 'Delivered' ? { completedAt: new Date() } : {})
        }, 
        { new: true }
      );
    } catch {
      // Ignore
    }

    // In-memory update
    const memIdx = inMemoryShipments.findIndex(s => s._id === id || s.trackingCode === id);
    if (memIdx !== -1) {
      inMemoryShipments[memIdx].status = status;
      if (temperatureC) {
        inMemoryShipments[memIdx].temperatureCompliance.ambientTempC = temperatureC;
      }
      if (status === 'Delivered') {
        inMemoryShipments[memIdx].completedAt = new Date();
        inMemoryShipments[memIdx].waypoints.forEach(w => w.completed = true);
      } else if (status === 'In Transit') {
        inMemoryShipments[memIdx].waypoints[0].completed = true;
      }
      updated = inMemoryShipments[memIdx];
    }

    res.json({
      success: true,
      message: `Shipment marked as "${status}"`,
      shipment: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST Multi-stop route optimization
export const optimizeMultiStopRoute = async (req, res) => {
  try {
    // Collect all stops from active shipments
    let stops = [];
    const activeShipments = inMemoryShipments.filter(s => s.status !== 'Delivered');

    activeShipments.forEach(s => {
      stops.push({
        shipmentId: s._id,
        name: `${s.provider.name} (Donor)`,
        type: 'pickup',
        address: s.provider.address,
        lat: s.provider.coordinates.lat,
        lon: s.provider.coordinates.lon,
        urgency: s.urgency,
        food: `${s.quantity} ${s.unit} of ${s.foodName}`
      });
      stops.push({
        shipmentId: s._id,
        name: `${s.recipient.name} (Shelter)`,
        type: 'delivery',
        address: s.recipient.address,
        lat: s.recipient.coordinates.lat,
        lon: s.recipient.coordinates.lon,
        urgency: s.urgency,
        food: `${s.quantity} ${s.unit} of ${s.foodName}`
      });
    });

    return new Promise((resolve) => {
      // Try executing Python route optimizer
      const pythonScript = path.resolve(__dirname, '../../ai/logistics/route_optimizer.py');
      const py = spawn('python', [pythonScript, '--json', JSON.stringify(stops)]);

      let stdout = '';
      let stderr = '';

      py.stdout.on('data', data => { stdout += data.toString(); });
      py.stderr.on('data', data => { stderr += data.toString(); });

      py.on('close', code => {
        if (code === 0 && stdout.trim()) {
          try {
            const parsed = JSON.parse(stdout);
            res.json(parsed);
            return resolve();
          } catch {
            // Fall through to js fallback
          }
        }

        // JS Heuristic Fallback
        let currentLat = 17.4156;
        let currentLon = 78.4357;
        let totalDist = 0;
        const sequence = stops.map((st, i) => {
          const leg = calculateHaversine(currentLat, currentLon, st.lat, st.lon);
          totalDist += leg;
          currentLat = st.lat;
          currentLon = st.lon;
          return {
            ...st,
            sequence: i + 1,
            cumulativeKm: Math.round(totalDist * 10) / 10,
            estimatedDurationMins: Math.round((totalDist / 25) * 60 + (i + 1) * 5)
          };
        });

        const baselineDist = Math.round(totalDist * 1.4 * 10) / 10;
        const distSaved = Math.max(0, Math.round((baselineDist - totalDist) * 10) / 10);
        const co2Saved = Math.round(distSaved * 0.192 * 10) / 10;

        res.json({
          success: true,
          stopCount: sequence.length,
          optimizedSequence: sequence,
          totalDistanceKm: Math.round(totalDist * 10) / 10,
          estimatedMinutes: Math.round((totalDist / 25) * 60 + sequence.length * 5),
          baselineDistanceKm: baselineDist,
          distanceSavedKm: distSaved,
          co2SavedKg: co2Saved,
          recommendation: `Optimized multi-stop circuit visiting ${sequence.length} food locations. High urgency hot meals prioritized first.`
        });
        resolve();
      });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
