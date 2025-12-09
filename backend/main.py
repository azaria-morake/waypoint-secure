from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.firebase import initialize_firebase, update_journey_status, get_db
from services.analysis import generate_heatmap, calculate_risk

# --- APP SETUP ---
app = FastAPI(
    title="WAYPOINT API",
    description="Smart Layer for Public Safety Intelligence",
    version="1.0.0"
)

# --- CORS POLICY (CRITICAL FOR FRONTEND) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for Hackathon/Dev mode
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize DB on startup
@app.on_event("startup")
async def startup_event():
    initialize_firebase()

# --- DATA MODELS ---
class DispatchRequest(BaseModel):
    journey_id: str
    user_id: str
    location: dict # {lat, lng}

# --- ROUTES ---

# A. Utility & Keep-Alive
@app.get("/")
def health_check():
    """Keep-alive endpoint for Render/Vercel."""
    return {"status": "online", "service": "WAYPOINT_API"}

# B. Intelligence & Data
@app.get("/api/v1/intelligence/heatmap")
def get_heatmap():
    """Returns danger zones for map overlay."""
    data = generate_heatmap()
    return {"count": len(data), "points": data}

# C. Active Logic (The "Smart" Features)
@app.post("/api/v1/journey/{journey_id}/analyze")
def analyze_journey(journey_id: str):
    """
    Trigger a risk analysis. 
    Frontend calls this periodically or when entering a new area.
    """
    analysis = calculate_risk(journey_id)
    
    # Write result back to DB (Mock or Real)
    update_journey_status(journey_id, "active", risk_level=analysis['risk_level'])
    
    return {
        "status": "analyzed",
        "data": analysis
    }


# 1. NEW: Start Journey (Green Dot)
@app.post("/api/v1/journey/{journey_id}/start")
def start_journey(journey_id: str, payload: dict): # payload expects { "user_id": "..." }
    """
    Register a new journey as 'active' (Green) immediately.
    """
    print(f"▶️ [JOURNEY START] ID: {journey_id}")
    success = update_journey_status(journey_id, "active")
    if success:
        return {"status": "success", "message": "Journey started."}
    else:
        raise HTTPException(status_code=500, detail="Failed to start journey")

# 2. NEW: Cancel Alert (False Alarm)
@app.post("/api/v1/alert/{journey_id}/cancel")
def cancel_alert(journey_id: str):
    """
    Reverts status from 'panic' -> 'active'.
    """
    print(f"undo [FALSE ALARM] ID: {journey_id}")
    success = update_journey_status(journey_id, "active")
    if success:
        return {"status": "success", "message": "Alert cancelled."}
    else:
        raise HTTPException(status_code=500, detail="Failed to cancel alert")

@app.post("/api/v1/alert/dispatch")
def dispatch_help(payload: DispatchRequest):
    """
    Simulates sending an alert to emergency services.
    Updates the DB to show 'panic_dispatched'.
    """
    print(f"🚨 [DISPATCH TRIGGERED] User {payload.user_id} at {payload.location}")
    
    # 1. Simulate External API Call (e.g., Twilio/SAPS Gateway)
    print(">> Sending SMS to +27 10 111 0000...")
    
    # 2. Update System State
    success = update_journey_status(payload.journey_id, "panic_dispatched")
    
    if success:
        return {"status": "success", "message": "Units dispatched."}
    else:
        raise HTTPException(status_code=500, detail="Failed to update incident status")

@app.post("/api/v1/journey/{journey_id}/end")
def end_journey(journey_id: str):
    """
    User arrived safely. 
    Update DB status to 'finished' so it drops off the Operator map.
    """
    print(f"✅ [JOURNEY ENDED] ID: {journey_id}")
    
    # Update DB
    success = update_journey_status(journey_id, "finished")
    
    if success:
        return {"status": "success", "message": "Journey closed."}
    else:
        raise HTTPException(status_code=500, detail="Failed to close journey")


# D. Sync (The Glue)
@app.get("/api/v1/journeys")
def get_active_journeys():
    """
    Returns all active journeys from the database.
    Used by the Operator Dashboard to see 'Real' users.
    """
    database = get_db()
    
    # 1. Mock Mode (Memory)
    if database == "MOCK_MODE":
        # In a real app, we'd have a global list variable. 
        # For this hackathon, we can just return a hardcoded 'Real' user if you like,
        # OR better: The Python script needs a simple in-memory store if no Firestore.
        return {"journeys": []} # Fallback
        
    # 2. Firestore Mode (Real)
    try:
        journeys_ref = database.collection('journeys')
        # Get only active or panic journeys
        docs = journeys_ref.where('status', 'in', ['active', 'critical', 'panic_dispatched']).stream()
        
        results = []
        for doc in docs:
            d = doc.to_dict()
            results.append({
                "id": doc.id,
                "name": d.get("user_id", "Unknown"), # Using user_id as name for now
                "status": d.get("status"),
                "x": 50, "y": 50, # Default center if no GPS stream yet
                # In a full app, you'd save {lat, lng} to Firestore and map it here
            })
        return {"journeys": results}
        
    except Exception as e:
        print(f"❌ [DB READ ERROR] {e}")
        return {"journeys": []}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
