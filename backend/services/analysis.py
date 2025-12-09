import random

# --- MOCK DATA ---
# Simulating crime hotspots in Johannesburg/Pretoria context
JHB_HOTSPOTS = [
    {"lat": -26.2041, "lng": 28.0473, "weight": 0.9}, # JHB CBD
    {"lat": -26.1952, "lng": 28.0340, "weight": 0.7}, # Braamfontein
    {"lat": -26.1633, "lng": 27.9351, "weight": 0.6}, # Westbury
    {"lat": -25.7479, "lng": 28.2293, "weight": 0.5}, # Pretoria CBD
]

def generate_heatmap():
    """Returns a static list of weighted coordinates for the frontend heat layer."""
    return JHB_HOTSPOTS

def calculate_risk(journey_id: str):
    """
    Simulates a complex ML model that analyzes path deviation and velocity.
    For MVP: Returns a random risk score (1-5).
    """
    # In a real app, we would fetch coordinates from Firestore here.
    # mock_path_analysis = fetch_path(journey_id)
    
    risk_score = random.randint(1, 5)
    
    risk_factors = []
    if risk_score > 3:
        risk_factors.append("Entering high-crime zone")
        risk_factors.append("Stationary for > 2 mins")
        
    return {
        "journey_id": journey_id,
        "risk_level": risk_score,
        "factors": risk_factors
    }
