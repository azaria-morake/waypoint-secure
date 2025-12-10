import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

const INITIAL_MOCKS = [
  { id: 'mock-1', name: 'Unit 42', status: 'safe', x: 20, y: 30 },
  { id: 'mock-2', name: 'Sarah L.', status: 'safe', x: 80, y: 15 },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  // State
  const [mockJourneys, setMockJourneys] = useState(INITIAL_MOCKS);
  const [realJourneys, setRealJourneys] = useState([]); 
  const [journeys, setJourneys] = useState([]);
  
  const [myJourneyId, setMyJourneyId] = useState(null);
  const [myStatus, setMyStatus] = useState('idle'); 
  
  const [heatmap, setHeatmap] = useState([]);

  // --- 1. PERSISTENCE LAYER (The Fix) ---
  // Load session from browser storage on startup
  useEffect(() => {
    const savedId = localStorage.getItem('waypoint_id');
    const savedStatus = localStorage.getItem('waypoint_status');
    const savedUser = localStorage.getItem('waypoint_user');

    if (savedId && savedStatus) {
      console.log("🔄 Restoring previous session:", savedId);
      setMyJourneyId(savedId);
      setMyStatus(savedStatus);
      if (savedUser) setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save session whenever it changes
  useEffect(() => {
    if (myJourneyId) {
      localStorage.setItem('waypoint_id', myJourneyId);
      localStorage.setItem('waypoint_status', myStatus);
      if (user) localStorage.setItem('waypoint_user', JSON.stringify(user));
    } else {
      // Clear storage when journey ends
      localStorage.removeItem('waypoint_id');
      localStorage.removeItem('waypoint_status');
      localStorage.removeItem('waypoint_user');
    }
  }, [myJourneyId, myStatus, user]);


  // --- 2. GAME LOOP ---
  useEffect(() => {
    const interval = setInterval(async () => {
      // Move Mocks
      setMockJourneys(prev => prev.map(j => ({
        ...j,
        x: Math.max(0, Math.min(100, j.x + (Math.random() - 0.5) * 2)),
        y: Math.max(0, Math.min(100, j.y + (Math.random() - 0.5) * 2))
      })));

      // Poll Backend
      const fromBackend = await api.getActiveJourneys();
      
      const formattedReal = fromBackend.map(j => ({
        ...j,
        id: String(j.id), 
        x: j.x || 50, 
        y: j.y || 50,
        isReal: true
      }));
      setRealJourneys(formattedReal);

    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // --- 3. MERGE STATE ---
  useEffect(() => {
    let combined = [...mockJourneys, ...realJourneys];
    
    if (myJourneyId) {
      const myIdStr = String(myJourneyId);

      // Remove backend version of me to avoid duplicates
      combined = combined.filter(j => String(j.id) !== myIdStr);
      
      // Add local version of me
      combined.push({
        id: myIdStr,
        name: user?.name || 'Me',
        status: myStatus === 'critical' ? 'critical' : 'active', 
        x: 50, 
        y: 90
      });
    }
    
    setJourneys(combined);
  }, [mockJourneys, realJourneys, myJourneyId, myStatus, user]);


  // --- ACTIONS ---

  const login = (role) => setUser({ role, name: role === 'citizen' ? 'Citizen' : 'Operator' });
  
  const logout = () => { 
    localStorage.clear(); // Clear all data
    setUser(null); 
    setMyJourneyId(null); 
    setMyStatus('idle');
  };

  const startJourney = async () => {
    const newId = String(Date.now());
    setMyJourneyId(newId);
    setMyStatus('active'); 
    
    await api.startJourney(newId, user.name);
  };

  const triggerPanic = async () => {
    if (!myJourneyId) return;
    if (myStatus === 'critical') return; 

    setMyStatus('critical');
    console.log("🚨 Sending Alert...");
    await api.dispatchPanic(myJourneyId, user.name, 50, 90);
  };

  const cancelPanic = async () => {
    if (!myJourneyId) return;
    
    setMyStatus('active');
    console.log("undo False Alarm sent...");
    await api.cancelAlert(myJourneyId);
  };

  const endJourney = async () => {
    if (!myJourneyId) return;
    
    await api.endJourney(myJourneyId);
    
    // Clear State & Storage
    setMyJourneyId(null);
    setMyStatus('idle');
    localStorage.removeItem('waypoint_id');
    localStorage.removeItem('waypoint_status');
  };

  return (
    <AuthContext.Provider value={{ 
        user, login, logout, journeys, 
        startJourney, triggerPanic, cancelPanic, endJourney, 
        myJourneyId, myStatus, heatmap 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);