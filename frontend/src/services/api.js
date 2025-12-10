const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_URL = `${BASE_URL}/api/v1`;

// --- COORDINATE MAPPER (Real World -> SVG Grid) ---
// We define a Bounding Box around JHB/Pretoria for the demo
const BOUNDS = {
  minLat: -26.5, maxLat: -25.5, // Latitude Range
  minLng: 27.5,  maxLng: 28.5   // Longitude Range
};

export const toGrid = (lat, lng) => {
  // Normalize lat/lng to 0-1 (Clamped)
  const yPct = (lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat);
  const xPct = (lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng);
  
  // Flip Y because Screen Y goes down, Latitude goes up (technically North is + but here we just map 0-100)
  // We map to 0-100 for the SVG
  return {
    x: Math.max(0, Math.min(100, (xPct * 100))),
    y: Math.max(0, Math.min(100, (100 - (yPct * 100)))) // Invert Lat for screen coords
  };
};

// --- API CALLS ---

export const api = {
  // 1. Check Backend Health
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_URL}/`);
      return await res.json();
    } catch (e) {
      console.error("Backend Offline");
      return null;
    }
  },

  // 2. Get Intelligence (Heatmap)
  getHeatmap: async () => {
    try {
      const res = await fetch(`${API_URL}/intelligence/heatmap`);
      const data = await res.json();
      
      // Transform Real Lat/Lng to Grid Coordinates
      return data.points.map(p => ({
        ...toGrid(p.lat, p.lng),
        weight: p.weight
      }));
    } catch (e) {
      console.error("Failed to fetch heatmap", e);
      return [];
    }
  },

  // 3. Dispatch Panic
  dispatchPanic: async (journeyId, userId, x, y) => {
    try {
      const res = await fetch(`${API_URL}/alert/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journey_id: String(journeyId),
          user_id: userId || 'anon',
          location: { lat: x, lng: y } // Sending Grid coords for MVP context
        })
      });
      return await res.json();
    } catch (e) {
      console.error("Dispatch Failed", e);
      return { status: 'offline' };
    }
  },

  // 4. End Journey (Arrived Safely)
  endJourney: async (journeyId) => {
    try {
      await fetch(`${API_URL}/journey/${journeyId}/end`, {
        method: 'POST'
      });
      return true;
    } catch (e) {
      console.error("Failed to end journey", e);
      return false;
    }
  },

  // 5. Get Active Journeys (Sync)
  getActiveJourneys: async () => {
    try {
      const res = await fetch(`${API_URL}/journeys`);
      const data = await res.json();
      return data.journeys || [];
    } catch (e) {
      return [];
    }
  }
,

  // 6. Start Journey (Register on Ops Map)
  startJourney: async (journeyId, userId) => {
    try {
      await fetch(`${API_URL}/journey/${journeyId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
      return true;
    } catch (e) {
      console.error("Failed to start", e);
      return false;
    }
  },

  // 7. Cancel Alert (False Alarm)
  cancelAlert: async (journeyId) => {
    try {
      await fetch(`${API_URL}/alert/${journeyId}/cancel`, {
        method: 'POST'
      });
      return true;
    } catch (e) {
      console.error("Failed to cancel", e);
      return false;
    }
  }
};
