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

-   **Tactical Dashboard:** Dark-mode, data-dense "Command Center" UI
    with collapsible incident cards.
-   **Hybrid Map Engine:**
    -   **Tactical Mode:** Lightweight, low-latency SVG grid for
        high-level awareness.
    -   **Satellite Mode:** Integrated **Google Maps** toggle for
        verifying physical landmarks and terrain.
-   **Interactive Response:**
    -   **Simulated Comms:** "Call User" functionality with
        call-bridging simulation.
    -   **Resource Dispatch:** Pin user locations to the map for ground
        teams.

### 🔒 Cybersecurity & Privacy

-   **Privacy by Design:** Least-Privilege access model.
-   **PII Redaction:** Phone numbers & home addresses are
    **cryptographically blurred/locked** by default.
-   **Context-Aware Access:** Data decrypts only when a **CRITICAL
    PANIC** state is triggered.
-   **Blind Dialing:** Operators can contact "Safe" users via a secure
    bridge without seeing raw numbers.

------------------------------------------------------------------------

## 🏗️ Architecture

### Hybrid Realtime Design

#### Frontend (React + Vite)

-   Local state + simulation loops.
-   **Split Brain Rendering:** `CitizenLayout` vs `OperatorLayout` by
    role.
-   **Rich Mock Data:** Realistic persona generation (e.g., *Thandiwe
    Nkosi*) for demos.

#### Backend (Python FastAPI)

-   **Intelligence Layer:** Alerts, dispatch simulation, journey
    termination.
-   **Persistence:** Google Firestore (Firebase Admin SDK).
-   **Mock Mode:** In-memory storage if Firebase credentials are
    missing.

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
-   Google Cloud Project with **Maps JavaScript API** (Billing enabled)

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

Backend runs at: `http://localhost:8000`

------------------------------------------------------------------------

## 🎨 Frontend Setup

``` bash
cd frontend
npm install
```

### Environment Configuration

Create a `.env` file in `frontend/`:

``` env
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### Run Frontend

``` bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

------------------------------------------------------------------------

## 🎮 Demo Walkthrough

### 1. Split Brain Experience

-   **Operator:** Desktop login, tactical dashboard view.
-   **Citizen:** Mobile / Incognito login.

### 2. Privacy Check

-   Select a **Safe** unit (e.g., Unit 42).
-   Phone number masked.
-   Address locked.
-   Initiate **Secure Call Bridge**.

### 3. Panic Flow

-   Citizen taps **START JOURNEY**, then **PANIC**.
-   Citizen UI → Red.
-   Operator unit → Red.
-   PII decrypts.
-   Verify location via **Satellite Mode**.

### 4. False Alarm

-   Citizen taps **Cancel**.
-   Status resets.
-   Operator data re-locks.

------------------------------------------------------------------------

## ⚠️ Security Notes

-   API keys stored in `.env`.
-   Frontend redaction is demo-only; backend required for production.

------------------------------------------------------------------------

## 📜 License

MIT License\
**Author:** WAYPOINT Dev Team
