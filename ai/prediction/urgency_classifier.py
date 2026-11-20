"""
FoodRescue AI - Food Expiry and Urgency Prediction Classifier
Phase 7: Categorical perishability indexing, temperature-storage risk evaluation,
and priority stratification into Critical, Urgent, Moderate, and Low.

Responsible Safety Disclosure:
This algorithmic classifier prioritizes redistribution urgency based on provider timestamps.
It does NOT substitute for physical sensory or microbiological food safety inspection at handover.
"""

from datetime import datetime, timezone

# Perishability index (0.1 = shelf-stable, 1.0 = ultra-perishable cooked meals)
CATEGORY_PERISHABILITY = {
    'cooked meals': 1.0,
    'cooked': 1.0,
    'dairy': 0.85,
    'bakery': 0.65,
    'fresh produce': 0.50,
    'beverages': 0.40,
    'packaged goods': 0.15,
    'other': 0.50
}

# Storage temperature compliance multiplier (1.0 = optimal compliance, 1.8 = temperature abuse risk)
STORAGE_RISK_MULTIPLIERS = {
    'keep hot (>65°c)': 1.0,
    'keep hot': 1.0,
    'keep refrigerated (<4°c)': 1.0,
    'chilled': 1.0,
    'cool ambient storage (<15°c)': 1.15,
    'dry & cool ambient storage': 1.05,
    'ambient': 1.25,
    'room temperature': 1.30,
    'uncontrolled': 1.80
}

class FoodUrgencyClassifier:
    def __init__(self):
        pass

    def classify_urgency(self, category, expiry_date, storage_condition="Ambient", preparation_date=None):
        """
        Classifies listing into:
        - CRITICAL: immediate redistribution needed (< 4h or high perishability)
        - URGENT: collection required within 24h
        - MODERATE: 1 - 5 days shelf life
        - LOW: > 5 days shelf life
        """
        cat_key = category.strip().lower()
        k_cat = CATEGORY_PERISHABILITY.get(cat_key, 0.50)

        storage_key = storage_condition.strip().lower()
        m_storage = 1.0
        for s_name, mult in STORAGE_RISK_MULTIPLIERS.items():
            if s_name in storage_key:
                m_storage = mult
                break

        # Calculate remaining hours
        if isinstance(expiry_date, str):
            try:
                exp_dt = datetime.fromisoformat(expiry_date.replace('Z', '+00:00'))
            except Exception:
                exp_dt = datetime.now(timezone.utc)
        else:
            exp_dt = expiry_date or datetime.now(timezone.utc)

        now_dt = datetime.now(timezone.utc) if exp_dt.tzinfo else datetime.now()
        hours_remaining = max(0, (exp_dt - now_dt).total_seconds() / 3600.0)

        # Effective shelf life factoring category decay & temperature storage
        effective_hours = hours_remaining / (k_cat * m_storage)

        if hours_remaining <= 0:
            priority = "EXPIRED"
            action = "Do not distribute for human consumption. Direct to organic composting."
        elif hours_remaining <= 4.0 or effective_hours <= 6.0:
            priority = "CRITICAL"
            action = "Immediate priority! Dispatch local charity pickup within 60-90 minutes."
        elif hours_remaining <= 24.0 or effective_hours <= 30.0:
            priority = "URGENT"
            action = "Urgent redistribution required before end of today's operational cycle."
        elif hours_remaining <= 120.0:
            priority = "MODERATE"
            action = "Schedule pickup within standard 2-3 day NGO delivery schedule."
        else:
            priority = "LOW"
            action = "Stable shelf staple; batch with routine weekly charity collections."

        return {
            'priority': priority,
            'hoursRemaining': round(hours_remaining, 1),
            'effectiveHours': round(effective_hours, 1),
            'recommendedAction': action,
            'perishabilityIndex': k_cat,
            'safetyNotice': "Human sensory verification required at physical handover. Inspect odor, appearance, and packaging integrity."
        }


if __name__ == '__main__':
    classifier = FoodUrgencyClassifier()

    # Test cases
    test_1 = classifier.classify_urgency(
        category='Cooked Meals',
        expiry_date=datetime.now(timezone.utc).isoformat(),
        storage_condition='Keep Hot (>65°C)'
    )
    print("Test 1 (Cooked Meal - Now):", test_1['priority'])
