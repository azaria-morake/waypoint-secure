import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

// --- RICH MOCK DATA FOR OTHER USERS ---
const INITIAL_MOCKS = [
  { 
    id: 'mock-1', 
    name: 'Unit 42', 
    fullName: 'Chester M.',
    contactNumber: '082 555 0142',
    homeAddress: '42 Francis Baard St, Pretoria Central',
    alertType: 'GBV',
    bestContacts: [
        { name: 'Siski (Sister)', phone: '082 999 0001' },
        { name: 'Ma (Mother)', phone: '071 123 4567' },
        { name: 'Uncle Solly', phone: '061 555 9988' }
    ],
    status: 'safe', 
    x: 20, 
    y: 30 
  },
  { 
    id: 'mock-2', 
    name: 'Sarah L.',
    fullName: 'Sarah Lee',
    contactNumber: '072 555 0199',
    homeAddress: '1098 Burnett St, Hatfield',
    alertType: 'Medical',
    bestContacts: [
        { name: 'Dr. House', phone: '012 333 4444' },
        { name: 'Husband', phone: '083 444 5555' },
        { name: 'Security Gate', phone: '012 999 8888' }
    ],
    status: 'safe', 
    x: 80, 
    y: 15 
  },
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

  // --- 1. PERSISTENCE LAYER ---
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

  useEffect(() => {
    if (myJourneyId) {
      localStorage.setItem('waypoint_id', myJourneyId);
      localStorage.setItem('waypoint_status', myStatus);
      if (user) localStorage.setItem('waypoint_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('waypoint_id');
      localStorage.removeItem('waypoint_status');
      localStorage.removeItem('waypoint_user');
    }
  }, [myJourneyId, myStatus, user]);


  // --- 2. GAME LOOP ---
  useEffect(() => {
    const interval = setInterval(async () => {
      // Move Mocks randomly
      setMockJourneys(prev => prev.map(j => ({
        ...j,
        x: Math.max(0, Math.min(100, j.x + (Math.random() - 0.5) * 2)),
        y: Math.max(0, Math.min(100, j.y + (Math.random() - 0.5) * 2))
      })));

      // Poll Backend for Real Users
      const fromBackend = await api.getActiveJourneys();
      
      const formattedReal = fromBackend.map(j => ({
        ...j,
        id: String(j.id), 
        // Default generic data for other real users if they appear
        fullName: j.user_id || 'Unknown Citizen',
        contactNumber: 'Unknown',
        homeAddress: 'Location Hidden',
        alertType: 'General',
        bestContacts: [],
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
    combined = combined.filter(j => String(j.id) !== myIdStr);
    
    combined.push({
      id: myIdStr,
      name: user?.name || 'Me',
      
      // Demo Data
      fullName: 'Thandiwe Nkosi',
      contactNumber: '071 555 0101',
      homeAddress: '1122 Burnett St, Hatfield, Pretoria',
      
      // 🛠️ FIX: Explicitly check for critical state for the label
      alertType: myStatus === 'critical' ? 'GBV (Panic Button)' : 'Journey Active',
      
      bestContacts: [
          { name: 'Mom', phone: '082 444 1234' },
          { name: 'Boyfriend (Sipho)', phone: '076 999 8877' }
      ],
      
      // 🛠️ FIX: Ensure local status overrides everything for the Demo User
      status: myStatus, 
      x: 50, 
      y: 90
    });
  }
    
    setJourneys(combined);
  }, [mockJourneys, realJourneys, myJourneyId, myStatus, user]);


  // --- ACTIONS ---
  const login = (role) => setUser({ role, name: role === 'citizen' ? 'Citizen' : 'Operator' });
  
  const logout = () => { 
    localStorage.clear(); 
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
    
    // 1. Immediate UI Update (Optimistic)
    setMyStatus('active');
    console.log("✅ [FRONTEND] False Alarm - Resetting to Green");

    // 2. Backend Update
    try {
      await api.cancelAlert(myJourneyId);
    } catch (err) {
      console.error("Backend sync failed, but local state is updated.");
    }
  };

  const endJourney = async () => {
    if (!myJourneyId) return;
    await api.endJourney(myJourneyId);
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