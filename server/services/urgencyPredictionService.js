/**
 * FoodRescue AI - Expiry Urgency & Surplus Prediction Service
 * Module 7: Categorical perishability indexing & priority stratification.
 * Module 8: End-of-day surplus volume forecasting.
 */

const CATEGORY_PERISHABILITY = {
  'cooked meals': 1.0,
  'cooked': 1.0,
  'dairy': 0.85,
  'bakery': 0.65,
  'fresh produce': 0.50,
  'beverages': 0.40,
  'packaged goods': 0.15,
  'other': 0.50
};

const STORAGE_RISK_MULTIPLIERS = {
  'keep hot': 1.0,
  'refrigerated': 1.0,
  'chilled': 1.0,
  'cool ambient': 1.15,
  'dry': 1.05,
  'ambient': 1.25,
  'room temperature': 1.30
};

export const classifyFoodUrgency = (category, expiryDate, storageCondition = 'Ambient') => {
  const catKey = (category || 'Cooked Meals').toLowerCase();
  const kCat = CATEGORY_PERISHABILITY[catKey] || 0.50;

  const storageKey = (storageCondition || 'Ambient').toLowerCase();
  let mStorage = 1.2;
  for (const [key, mult] of Object.entries(STORAGE_RISK_MULTIPLIERS)) {
    if (storageKey.includes(key)) {
      mStorage = mult;
      break;
    }
  }

  const expDate = new Date(expiryDate);
  const now = new Date();
  const hoursRemaining = Math.max(0, (expDate - now) / (1000 * 60 * 60));
  const effectiveHours = hoursRemaining / (kCat * mStorage);

  let priority = 'MODERATE';
  let recommendedAction = 'Standard collection schedule';

  if (hoursRemaining <= 0) {
    priority = 'EXPIRED';
    recommendedAction = 'Do not distribute for human consumption. Route to composting.';
  } else if (hoursRemaining <= 4.0 || effectiveHours <= 6.0) {
    priority = 'CRITICAL';
    recommendedAction = 'Immediate priority! Dispatch local charity pickup within 60-90 minutes.';
  } else if (hoursRemaining <= 24.0 || effectiveHours <= 30.0) {
    priority = 'URGENT';
    recommendedAction = 'Urgent redistribution required before end of daily cycle.';
  } else if (hoursRemaining <= 120.0) {
    priority = 'MODERATE';
    recommendedAction = 'Schedule pickup within standard 2-3 day NGO delivery schedule.';
  } else {
    priority = 'LOW';
    recommendedAction = 'Stable shelf staple; batch with routine weekly charity collections.';
  }

  return {
    priority,
    hoursRemaining: Number(hoursRemaining.toFixed(1)),
    effectiveHours: Number(effectiveHours.toFixed(1)),
    recommendedAction,
    perishabilityIndex: kCat,
    safetyNotice: 'Human sensory verification required at physical handover. Inspect odor, appearance, and packaging integrity.'
  };
};

export const forecastSurplusVolume = (preparedQuantity, category, dayOfWeek = 'Friday', eventType = 'normal') => {
  const catKey = (category || 'Cooked Meals').toLowerCase();
  const baseRates = {
    'cooked meals': 0.175,
    'bakery': 0.160,
    'fresh produce': 0.145,
    'dairy': 0.105,
    'packaged goods': 0.045
  };
  const baseRate = baseRates[catKey] || 0.12;

  const dayFactors = {
    monday: 0.95,
    tuesday: 0.90,
    wednesday: 0.92,
    thursday: 1.05,
    friday: 1.25,
    saturday: 1.35,
    sunday: 1.20
  };
  const dayMult = dayFactors[dayOfWeek.toLowerCase()] || 1.0;

  const eventFactors = {
    normal: 1.0,
    'rainy day': 1.35,
    'corporate event': 1.25,
    'banquet buffet': 1.40,
    'wedding banquet': 1.55,
    'festival holiday': 1.15
  };
  const eventMult = eventFactors[eventType.toLowerCase()] || 1.0;

  const estimatedRate = Math.min(0.45, baseRate * dayMult * eventMult);
  const predictedSurplus = Math.round(Number(preparedQuantity) * estimatedRate);

  const confidence = Number(
    Math.min(96.0, Math.max(82.0, 94.0 - Math.abs(Number(preparedQuantity) - 250) * 0.015)).toFixed(1)
  );

  let strategy = '';
  if (catKey.includes('cooked')) {
    strategy = `Pre-alert nearby shelter before 3:00 PM for ~${predictedSurplus} portions to prevent evening expiry.`;
  } else if (catKey.includes('bakery')) {
    strategy = `Offer 40% community discount at 6:00 PM; donate remaining ~${predictedSurplus} loaves to youth shelter.`;
  } else if (catKey.includes('produce')) {
    strategy = `Direct ~${predictedSurplus} kg ripe fruits to community breakfast soup kitchen or smoothie batching.`;
  } else {
    strategy = `Surplus (~${predictedSurplus} units) is non-perishable; batch with routine weekly charity collection.`;
  }

  return {
    preparedQuantity: Number(preparedQuantity),
    predictedSurplusQuantity: predictedSurplus,
    predictedSurplusPercentage: Number((estimatedRate * 100).toFixed(1)),
    predictionConfidence: confidence,
    recommendedAction: strategy,
    disclaimer: 'Demonstration model based on synthetic historical hospitality benchmarks.'
  };
};
