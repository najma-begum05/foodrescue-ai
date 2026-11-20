/**
 * FoodRescue AI - Backend AI Matching Service
 * Translates multi-criteria scoring into sub-scores:
 * 1. Haversine Distance (35%)
 * 2. Expiry Urgency & Transit Window (25%)
 * 3. Dietary Compatibility (20%)
 * 4. Capacity & Quantity Absorption (20%)
 */

// Haversine distance formula in kilometers
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371.0;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
};

export const scoreDistance = (distanceKm) => {
  if (distanceKm <= 2.0) return 100.0;
  if (distanceKm <= 5.0) return 92.0 - (distanceKm - 2.0) * 3.0;
  if (distanceKm <= 10.0) return 83.0 - (distanceKm - 5.0) * 3.5;
  if (distanceKm <= 20.0) return 65.0 - (distanceKm - 10.0) * 2.5;
  return Math.max(15.0, 40.0 - (distanceKm - 20.0) * 1.5);
};

export const scoreUrgency = (hoursLeft, category, distanceKm) => {
  if (hoursLeft <= 0) return 0.0;
  if (hoursLeft <= 4) {
    return distanceKm <= 6.0 ? 98.0 : Math.max(20.0, 98.0 - (distanceKm - 6.0) * 8.0);
  }
  if (hoursLeft <= 12) return distanceKm <= 12.0 ? 90.0 : 70.0;
  if (hoursLeft <= 24) return 85.0;
  if (hoursLeft <= 72) return 80.0;
  return 75.0;
};

export const scoreDietary = (listingDietary = 'Vegetarian', ngoPreference = 'Any') => {
  const ld = listingDietary.toLowerCase();
  const nd = ngoPreference.toLowerCase();

  if (nd === 'any' || nd === 'all' || nd === 'none') return 100.0;
  if (ld === nd) return 100.0;
  if (nd === 'vegetarian' && (ld === 'vegan' || ld === 'vegetarian')) return 100.0;
  if (nd === 'vegetarian' && ld === 'non-vegetarian') return 10.0;
  return 60.0;
};

export const scoreCapacity = (quantity = 50, ngoCapacity = 100) => {
  if (ngoCapacity <= 0) return 70.0;
  const ratio = quantity / ngoCapacity;
  if (ratio >= 0.3 && ratio <= 1.2) return 95.0;
  if (ratio < 0.3) return 75.0;
  if (ratio <= 2.0) return 85.0;
  return 60.0;
};

export const generateExplanation = (matchScore, distanceKm, hoursLeft, foodName, ngoName) => {
  const urgencyText = hoursLeft <= 4 ? 'immediate pickup (< 4h shelf-life)' : `${hoursLeft}h remaining shelf-life`;
  const distanceText = distanceKm <= 4.0 ? `only ${distanceKm} km away` : `${distanceKm} km away`;

  if (matchScore >= 90) {
    return `Recommended (Score: ${Math.round(matchScore)}%): ${ngoName} is located ${distanceText} and can distribute '${foodName}' before ${urgencyText}.`;
  }
  if (matchScore >= 75) {
    return `Good match (Score: ${Math.round(matchScore)}%): Compatible dietary profile and acceptable transit distance (${distanceKm} km).`;
  }
  return `Moderate match (Score: ${Math.round(matchScore)}%): Available for claim, though distance (${distanceKm} km) requires coordinated transport.`;
};

/**
 * Evaluates compatibility between a listing and an NGO
 */
export const evaluateMatch = (listing, ngo) => {
  const lCoords = listing.location?.coordinates || [78.4867, 17.3850];
  const nCoords = ngo.location?.coordinates || [78.4636, 17.4042];

  // Coordinates are [lon, lat]
  const distKm = calculateDistance(lCoords[1], lCoords[0], nCoords[1], nCoords[0]);
  const distScore = scoreDistance(distKm);

  const expiryDate = new Date(listing.expiryDate);
  const now = new Date();
  const hoursLeft = Math.max(0, Math.round((expiryDate - now) / (1000 * 60 * 60)));
  const urgencyScore = scoreUrgency(hoursLeft, listing.category || 'Cooked Meals', distKm);

  const dietaryScore = scoreDietary(listing.dietary, ngo.dietaryPreference || 'Any');
  const capacityScore = scoreCapacity(listing.quantity, ngo.capacity || 100);

  // Weights: Distance 35%, Urgency 25%, Dietary 20%, Capacity 20%
  const composite =
    distScore * 0.35 +
    urgencyScore * 0.25 +
    dietaryScore * 0.20 +
    capacityScore * 0.20;

  const finalScore = Number(Math.min(100.0, Math.max(0.0, composite)).toFixed(1));

  const explanation = generateExplanation(
    finalScore,
    distKm,
    hoursLeft,
    listing.foodName || 'Food Surplus',
    ngo.organizationName || ngo.name || 'Charity Shelter'
  );

  return {
    listingId: listing._id,
    matchScore: finalScore,
    distanceKm: distKm,
    hoursRemaining: hoursLeft,
    explanation,
    breakdown: {
      distanceScore: Number(distScore.toFixed(1)),
      urgencyScore: Number(urgencyScore.toFixed(1)),
      dietaryScore: Number(dietaryScore.toFixed(1)),
      capacityScore: Number(capacityScore.toFixed(1))
    }
  };
};
