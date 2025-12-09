import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
from dotenv import load_dotenv

load_dotenv() # Load .env if present

db = None

def initialize_firebase():
    global db
    
    # Strategy 1: Environment Variable (Production/Render)
    # We will paste the JSON content into a variable named FIREBASE_CREDS
    env_creds = os.getenv("FIREBASE_CREDS")
    
    # Strategy 2: Local File (Development)
    local_file = "serviceAccountKey.json"

    try:
        if env_creds:
            print("Trying ENV connection...")
            # Parse the JSON string from the environment variable
            creds_dict = json.loads(env_creds)
            cred = credentials.Certificate(creds_dict)
            firebase_admin.initialize_app(cred)
            db = firestore.client()
            print("✅ [FIREBASE] Connected via Environment Variable.")
            
        elif os.path.exists(local_file):
            print("Trying FILE connection...")
            cred = credentials.Certificate(local_file)
            firebase_admin.initialize_app(cred)
            db = firestore.client()
            print("✅ [FIREBASE] Connected via Local File.")
            
        else:
            print("⚠️ [FIREBASE] No credentials found. Running in MOCK MEMORY MODE.")
            db = "MOCK_MODE"
            
    except Exception as e:
        print(f"❌ [FIREBASE] Connection failed: {e}")
        db = "MOCK_MODE"

def get_db():
    if db is None:
        initialize_firebase()
    return db

def update_journey_status(journey_id, status, risk_level=None):
    database = get_db()
    
    if database == "MOCK_MODE":
        print(f"📝 [MOCK DB] Updated {journey_id} -> {status}")
        return True
        
    try:
        # In a real app, ensure 'journeys' collection exists
        doc_ref = database.collection('journeys').document(str(journey_id))
        
        # Use set(..., merge=True) to create if not exists, or update if exists
        data = {"status": status, "last_updated": firestore.SERVER_TIMESTAMP}
        if risk_level:
            data["risk_level"] = risk_level
            
        doc_ref.set(data, merge=True)
        return True
    except Exception as e:
        print(f"❌ [DB ERROR] {e}")
        return False