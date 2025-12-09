import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

// Mock Initial Data
const MOCK_JOURNEYS = [
  { id: 1, name: 'Thabo M.', status: 'safe', x: 20, y: 30 },
  { id: 2, name: 'Sarah L.', status: 'safe', x: 80, y: 15 },
  { id: 3, name: 'Unit 42', status: 'critical', x: 50, y: 50 }, // Start with one incident
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { role: 'citizen' | 'operator', name: string }
  const [journeys, setJourneys] = useState(MOCK_JOURNEYS);
  const [myJourneyId, setMyJourneyId] = useState(null);

  // --- SIMULATION ENGINE (The "Random Walk") ---
  useEffect(() => {
    const interval = setInterval(() => {
      setJourneys((prevJourneys) =>
        prevJourneys.map((j) => {
          // 1. Move slightly (Random Walk)
          const moveX = (Math.random() - 0.5) * 2; // -1 to 1
          const moveY = (Math.random() - 0.5) * 2;
          
          // 2. Clamp coordinates to 0-100 grid
          let newX = Math.max(0, Math.min(100, j.x + moveX));
          let newY = Math.max(0, Math.min(100, j.y + moveY));

          return { ...j, x: newX, y: newY };
        })
      );
    }, 2000); // Update every 2 seconds

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

  // Citizen Actions
  const startJourney = () => {
    const newId = Date.now();
    const newJourney = { id: newId, name: 'Me (Citizen)', status: 'safe', x: 50, y: 90 };
    setJourneys((prev) => [...prev, newJourney]);
    setMyJourneyId(newId);
  };

  const triggerPanic = () => {
    if (!myJourneyId) return;
    setJourneys((prev) =>
      prev.map((j) => (j.id === myJourneyId ? { ...j, status: 'critical' } : j))
    );
  };

  const endJourney = () => {
    setJourneys((prev) => prev.filter((j) => j.id !== myJourneyId));
    setMyJourneyId(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, journeys, startJourney, triggerPanic, endJourney, myJourneyId }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
