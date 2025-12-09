import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api'; // <--- IMPORT API

const AuthContext = createContext();

const MOCK_JOURNEYS = [
  { id: 1, name: 'Thabo M.', status: 'safe', x: 20, y: 30 },
  { id: 2, name: 'Sarah L.', status: 'safe', x: 80, y: 15 },
  { id: 3, name: 'Unit 42', status: 'critical', x: 50, y: 50 },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [journeys, setJourneys] = useState(MOCK_JOURNEYS);
  const [myJourneyId, setMyJourneyId] = useState(null);
  
  // New State for Backend Data
  const [heatmap, setHeatmap] = useState([]); 
  const [backendStatus, setBackendStatus] = useState('checking');

  // --- INITIALIZATION ---
  useEffect(() => {
    // 1. Check Backend Connection
    api.checkHealth().then(status => {
      setBackendStatus(status ? 'online' : 'offline');
    });

    // 2. Load Intelligence Data
    api.getHeatmap().then(points => {
      setHeatmap(points);
    });

    // 3. Start Simulation Loop
    const interval = setInterval(() => {
      setJourneys((prev) =>
        prev.map((j) => {
          const moveX = (Math.random() - 0.5) * 2;
          const moveY = (Math.random() - 0.5) * 2;
          return { 
            ...j, 
            x: Math.max(0, Math.min(100, j.x + moveX)), 
            y: Math.max(0, Math.min(100, j.y + moveY)) 
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // --- ACTIONS ---

  const login = (role) => {
    setUser({ role, name: role === 'citizen' ? 'Citizen User' : 'Ops Commander' });
  };

  const logout = () => {
    setUser(null);
    setMyJourneyId(null);
  };

  const startJourney = () => {
    const newId = Date.now();
    const newJourney = { id: newId, name: 'Me (Citizen)', status: 'safe', x: 50, y: 90 };
    setJourneys((prev) => [...prev, newJourney]);
    setMyJourneyId(newId);
  };

  const triggerPanic = async () => {
    if (!myJourneyId) return;

    // 1. Optimistic UI Update (Immediate Red Status)
    const myJ = journeys.find(j => j.id === myJourneyId);
    setJourneys((prev) =>
      prev.map((j) => (j.id === myJourneyId ? { ...j, status: 'critical' } : j))
    );

    // 2. Call Backend
    console.log("🚨 Sending Alert to Backend...");
    await api.dispatchPanic(myJourneyId, user.name, myJ?.x, myJ?.y);
  };

  const endJourney = () => {
    setJourneys((prev) => prev.filter((j) => j.id !== myJourneyId));
    setMyJourneyId(null);
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, login, logout, 
        journeys, startJourney, triggerPanic, endJourney, myJourneyId,
        heatmap, backendStatus // <--- Expose these
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
