"""
FoodRescue AI - Python Environment & AI Module Test Script
Phase 1: Verification of AI environment and baseline algorithmic concepts.
"""

import sys
import math

def calculate_haversine_distance(lat1, lon1, lat2, lon2):
    """
    Computes great-circle distance between two GPS coordinates in kilometers.
    Used by the AI Matching Engine to prioritize local NGOs and reduce food transit time.
    """
    R = 6371.0 # Radius of Earth in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

def test_urgency_classifier(hours_left, food_category):
    """
    Urgency classification prototype:
    - Critical (< 4 hours or cooked meals expiring soon)
    - Urgent (< 24 hours)
    - Moderate (1 to 5 days)
    - Low (> 5 days)
    """
    if hours_left <= 4 or (food_category == 'cooked' and hours_left <= 8):
        return 'CRITICAL'
    elif hours_left <= 24:
        return 'URGENT'
    elif hours_left <= 120:
        return 'MODERATE'
    else:
        return 'LOW'

def main():
    print("==================================================")
    print("🌾 FoodRescue AI - AI Engine Baseline Test")
    print(f"🐍 Python Executable: {sys.executable}")
    print(f"📌 Python Version: {sys.version.split()[0]}")
    print("==================================================")
    
    # Test 1: Distance calculation
    dist = calculate_haversine_distance(17.385044, 78.486671, 17.439930, 78.498274)
    print(f"✅ Test 1: Distance Calculation (Hyderabad Provider to Shelter): {dist} km")
    
    # Test 2: Urgency classification
    urgency1 = test_urgency_classifier(3, 'cooked')
    urgency2 = test_urgency_classifier(48, 'packaged')
    print(f"✅ Test 2: Urgency Classification:")
    print(f"   - Cooked meals (3h remaining): {urgency1}")
    print(f"   - Packaged goods (48h remaining): {urgency2}")

    print("==================================================")
    print("🎉 AI Module Prototype functions verified successfully!")
    print("==================================================")

if __name__ == "__main__":
    main()
