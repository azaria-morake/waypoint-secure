from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.firebase import initialize_firebase, update_journey_status
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
