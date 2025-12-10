# WAYPOINT 🛡️

**A "Smart Layer" Public Safety Platform**\
*South African Safety MVP shifting focus from "Panic Buttons" to
"Journey Management".*

WAYPOINT is a full-stack Progressive Web App (PWA) designed to serve two
distinct user bases from a single codebase. It utilizes a **"Split
Brain" architecture** to dynamically render a mobile-first interface for
Citizens and a tactical dashboard for Operators.

![Status](https://img.shields.io/badge/Status-Prototype-blue)
![Stack](https://img.shields.io/badge/Stack-React_%7C_FastAPI_%7C_Firebase-orange)

------------------------------------------------------------------------

## 🌟 Key Features

### 📱 Citizen View (Mobile)

-   **Journey Management:** Users "Start" a journey rather than just
    waiting for emergencies.
-   **Live Watch:** Real-time GPS simulation tracking the user along a
    specific route (Pretoria/Hatfield demo).
-   **Panic Logic:** One-tap "Panic" triggering with a "False
    Alarm/Cancel" safety mechanism.
-   **Persistence:** Session recovery allows the app to survive browser
    refreshes.

### 🖥️ Operator View (Desktop)

-   **Tactical Dashboard:** Dark-mode, data-dense "Command Center" UI.
-   **Real-time Map:** Integration with **Google Maps** to visualize
    active units.
-   **Live Sync:** Polling architecture to fetch status updates (Active,
    Critical, Safe).
-   **Mock Simulation:** Background simulation of other "Ghost Units" to
    demonstrate scale.

------------------------------------------------------------------------

## 🏗️ Architecture

The system uses a **Hybrid Realtime** approach:

### 1. Frontend (React + Vite)

-   Manages local state and simulation loops.
-   **Split Brain Rendering:** Displays either `CitizenLayout` or
    `OperatorLayout` based on user role.
-   **Persistence:** Uses `localStorage` to maintain journey state.

### 2. Backend (Python FastAPI)

-   **Intelligence Layer:** Handles alerts, dispatch simulation, and
    journey termination.
-   **Data Source:** Google Firestore via Firebase Admin SDK.
-   **Mock Mode:** Automatically falls back to in-memory storage if
    Firebase keys are missing.

------------------------------------------------------------------------

## 🛠️ Technology Stack

-   **Frontend:** React 18, Tailwind CSS, Lucide React,
    `@vis.gl/react-google-maps`
-   **Backend:** Python 3.10+, FastAPI, Uvicorn
-   **Database:** Google Firestore
-   **State Management:** React Context API

------------------------------------------------------------------------

## 🚀 Getting Started

### Prerequisites

-   Node.js v18+
-   Python v3.10+
-   Google Cloud Project with **Maps JavaScript API**
-   Firebase Project with **Firestore** enabled

------------------------------------------------------------------------

## 🔧 Backend Setup

``` bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Firebase Configuration

1.  Firebase Console → Project Settings → Service Accounts\
2.  Generate new private key\
3.  Rename to `serviceAccountKey.json`\
4.  Place inside `backend/`

> If omitted, the backend runs in **Mock Memory Mode**.

### Run Backend

``` bash
uvicorn main:app --reload
```

Server runs at: `http://localhost:8000`

------------------------------------------------------------------------

## 🎨 Frontend Setup

``` bash
cd frontend
npm install
npm run dev
```

App runs at: `http://localhost:5173`

### Google Maps Configuration

Edit:

    src/components/map/GoogleMapEngine.jsx

Replace:

    YOUR_GOOGLE_MAPS_API_KEY_HERE

------------------------------------------------------------------------

## 🎮 Demo Walkthrough

### Split Brain Experience

Open two browser windows:

**Operator (Desktop):** - Login as Ops Center - View tactical dashboard
with live units

**Citizen (Mobile / Incognito):** - Login as Citizen - Click **Start
Journey** - User appears on Operator map (Green)

------------------------------------------------------------------------

### Panic Flow

-   Citizen taps **PANIC**
-   Citizen UI turns Red
-   Operator Map unit turns Red
-   Backend logs: 🚨 `DISPATCH TRIGGERED`

### False Alarm

-   Citizen taps **Cancel**
-   Status resets to Active
-   Backend logs: `FALSE ALARM`

### Arrived Safely

-   Journey ends
-   User removed from Operator map
-   Session cleared

------------------------------------------------------------------------

## 📂 Project Structure

    waypoint/
    ├── backend/
    │   ├── main.py
    │   ├── services/
    │   │   ├── firebase.py
    │   │   └── analysis.py
    │   └── serviceAccountKey.json
    │
    └── frontend/
        ├── src/
        │   ├── components/map/
        │   ├── context/
        │   ├── features/
        │   │   ├── citizen/
        │   │   └── operator/
        │   └── services/

------------------------------------------------------------------------

## ⚠️ Deployment Notes

-   **Environment Variables:** Pass Firebase credentials via
    `FIREBASE_CREDS`
-   **Google Maps:** Billing must be enabled
-   **Security:** Never commit serviceAccountKey.json

------------------------------------------------------------------------

## 📜 License

MIT License\
**Author:** WAYPOINT Dev Team
