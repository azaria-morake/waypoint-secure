import firebase_admin
from firebase_admin import credentials, firestore
import os

# Global DB Client
db = None

def initialize_firebase():
    global db
    
    # Check for credentials file
    cred_path = "serviceAccountKey.json"
    
    if os.path.exists(cred_path):
        try:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            db = firestore.client()
            print("✅ [FIREBASE] Connected to Firestore successfully.")
        except Exception as e:
            print(f"❌ [FIREBASE] Connection failed: {e}")
            db = "MOCK_MODE"
    else:
        print("⚠️ [FIREBASE] 'serviceAccountKey.json' not found. Running in MOCK MEMORY MODE.")
        db = "MOCK_MODE"

def get_db():
    if db is None:
        initialize_firebase()
    return db

# Helper to simulate DB updates if we are in Mock Mode
def update_journey_status(journey_id, status, risk_level=None):
    database = get_db()
    
    if database == "MOCK_MODE":
        print(f"📝 [MOCK DB] Updated Journey {journey_id} -> Status: {status}, Risk: {risk_level}")
        return True
        
    try:
        doc_ref = database.collection('journeys').document(journey_id)
        data = {"status": status}
        if risk_level:
            data["risk_level"] = risk_level
        doc_ref.update(data)
        return True
    except Exception as e:
        print(f"❌ [DB ERROR] {e}")
        return False
