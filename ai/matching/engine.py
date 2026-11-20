"""
FoodRescue AI - Intelligent Multi-Criteria Matching Engine
Phase 6: Multi-Factor Recommendation Algorithm with Natural Language Explanations.

Evaluates 4 core sub-score dimensions:
1. Distance Compatibility (Haversine formula) - Weight: 35%
2. Expiry Urgency & Transit Viability - Weight: 25%
3. Dietary Preference Alignment - Weight: 20%
4. Capacity & Quantity Absorption Ratio - Weight: 20%
"""

import math
from datetime import datetime, timezone

class FoodMatchingEngine:
    def __init__(self, weights=None):
        # Default criteria weights summing to 1.0 (100%)
        self.weights = weights or {
            'distance': 0.35,
            'urgency': 0.25,
            'dietary': 0.20,
            'capacity': 0.20
        }

    @staticmethod
    def haversine_distance(lat1, lon1, lat2, lon2):
        """
        Calculates great-circle distance between two GPS coordinates in kilometers.
        """
        R = 6371.0  # Earth's radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (math.sin(dlat / 2) ** 2 +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
             math.sin(dlon / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return round(R * c, 2)

    def calculate_distance_score(self, distance_km):
        """
        Scores geographic proximity. Shorter distance = higher score.
        """
        if distance_km <= 2.0:
            return 100.0
        elif distance_km <= 5.0:
            return 92.0 - (distance_km - 2.0) * 3.0
        elif distance_km <= 10.0:
            return 83.0 - (distance_km - 5.0) * 3.5
        elif distance_km <= 20.0:
            return 65.0 - (distance_km - 10.0) * 2.5
        else:
            return max(15.0, 40.0 - (distance_km - 20.0) * 1.5)

    def calculate_urgency_score(self, hours_left, food_category, distance_km):
        """
        Evaluates remaining shelf-life vs transit feasibility.
        Critical perishable food (<4h) receives high score if close, but penalized if too far.
        """
        is_cooked = food_category.lower() in ['cooked meals', 'cooked']
        
        if hours_left <= 0:
            return 0.0  # Expired

        if hours_left <= 4:
            # Critical urgency: highly rewarded if within 6 km
            if distance_km <= 6.0:
                return 98.0
            else:
                return max(20.0, 98.0 - (distance_km - 6.0) * 8.0)
        elif hours_left <= 12:
            return 90.0 if distance_km <= 12.0 else 70.0
        elif hours_left <= 24:
            return 85.0
        elif hours_left <= 72:
            return 80.0
        else:
            return 75.0  # Long shelf life staple (less urgent)

    def calculate_dietary_score(self, listing_dietary, ngo_dietary_pref):
        """
        Evaluates dietary alignment.
        """
        listing_d = listing_dietary.lower()
        ngo_d = ngo_dietary_pref.lower()

        if ngo_d in ['any', 'all', 'none']:
            return 100.0
        if listing_d == ngo_d:
            return 100.0
        if ngo_d == 'vegetarian' and listing_d in ['vegan', 'vegetarian']:
            return 100.0
        if ngo_d == 'vegan' and listing_d == 'vegan':
            return 100.0
        if ngo_d == 'vegetarian' and listing_d == 'non-vegetarian':
            return 10.0  # Incompatible
        return 60.0

    def calculate_capacity_score(self, available_quantity, ngo_capacity):
        """
        Compares quantity with NGO beneficiary intake capacity.
        """
        if ngo_capacity <= 0:
            return 70.0

        ratio = available_quantity / ngo_capacity
        if 0.3 <= ratio <= 1.2:
            return 95.0
        elif ratio < 0.3:
            return 75.0  # Small donation compared to large shelter
        elif ratio <= 2.0:
            return 85.0  # Slightly excess, can be stored or shared
        else:
            return 60.0  # Way too large for single shelter

    def generate_explanation(self, match_score, distance_km, hours_left, food_name, ngo_name):
        """
        Generates clear, human-readable natural language reasoning.
        """
        urgency_text = "immediate pickup (< 4h left)" if hours_left <= 4 else f"{hours_left}h shelf-life"
        distance_text = f"only {distance_km} km away" if distance_km <= 4.0 else f"{distance_km} km away"
        
        if match_score >= 90:
            return f"Highly recommended (Score: {int(match_score)}%): {ngo_name} is located {distance_text} and can rapidly distribute '{food_name}' before {urgency_text}."
        elif match_score >= 75:
            return f"Good match (Score: {int(match_score)}%): Compatible dietary profile and acceptable transit distance ({distance_km} km)."
        else:
            return f"Moderate match (Score: {int(match_score)}%): Available for claim, though geographic distance ({distance_km} km) requires coordination."

    def evaluate_match(self, listing, ngo):
        """
        Computes final composite match score (0 to 100) and full sub-metric breakdown.
        """
        # 1. Distance
        l_coords = listing.get('location', {}).get('coordinates', [78.4867, 17.3850])
        n_coords = ngo.get('location', {}).get('coordinates', [78.4636, 17.4042])
        
        # GeoJSON is [lon, lat]
        dist_km = self.haversine_distance(l_coords[1], l_coords[0], n_coords[1], n_coords[0])
        score_dist = self.calculate_distance_score(dist_km)

        # 2. Urgency
        expiry = listing.get('expiryDate')
        if isinstance(expiry, str):
            try:
                exp_dt = datetime.fromisoformat(expiry.replace('Z', '+00:00'))
            except Exception:
                exp_dt = datetime.now(timezone.utc)
        else:
            exp_dt = expiry or datetime.now(timezone.utc)
            
        now_dt = datetime.now(timezone.utc) if exp_dt.tzinfo else datetime.now()
        hours_left = max(0, int((exp_dt - now_dt).total_seconds() / 3600))
        score_urgency = self.calculate_urgency_score(hours_left, listing.get('category', 'Cooked Meals'), dist_km)

        # 3. Dietary
        score_dietary = self.calculate_dietary_score(
            listing.get('dietary', 'Vegetarian'),
            ngo.get('dietaryPreference', 'Any')
        )

        # 4. Capacity
        score_capacity = self.calculate_capacity_score(
            listing.get('quantity', 50),
            ngo.get('capacity', 100)
        )

        # Weighted Composite Score
        composite = (
            score_dist * self.weights['distance'] +
            score_urgency * self.weights['urgency'] +
            score_dietary * self.weights['dietary'] +
            score_capacity * self.weights['capacity']
        )
        final_score = round(min(100.0, max(0.0, composite)), 1)

        explanation = self.generate_explanation(
            final_score, dist_km, hours_left,
            listing.get('foodName', 'Food Surplus'),
            ngo.get('name', 'Community Shelter')
        )

        return {
            'matchScore': final_score,
            'distanceKm': dist_km,
            'hoursRemaining': hours_left,
            'explanation': explanation,
            'breakdown': {
                'distanceScore': round(score_dist, 1),
                'urgencyScore': round(score_urgency, 1),
                'dietaryScore': round(score_dietary, 1),
                'capacityScore': round(score_capacity, 1)
            }
        }


# Quick Verification Test
if __name__ == '__main__':
    engine = FoodMatchingEngine()

    sample_listing = {
        'foodName': '100 kg Basmati Rice & Dal',
        'category': 'Cooked Meals',
        'quantity': 100,
        'dietary': 'Vegetarian',
        'expiryDate': datetime.now(timezone.utc).isoformat(),
        'location': {'coordinates': [78.4482, 17.4156]} # Banjara Hills
    }

    sample_ngo = {
        'name': 'Hope Haven Shelter',
        'capacity': 120,
        'dietaryPreference': 'Vegetarian',
        'location': {'coordinates': [78.4636, 17.4042]} # Lakdikapul (~2.1 km)
    }

    result = engine.evaluate_match(sample_listing, sample_ngo)
    print("==================================================")
    print("🌾 AI MATCHING ENGINE BENCHMARK TEST")
    print(f"🎯 Match Score: {result['matchScore']}%")
    print(f"📍 Distance: {result['distanceKm']} km")
    print(f"💡 Explanation: {result['explanation']}")
    print(f"📊 Breakdown: {result['breakdown']}")
    print("==================================================")
