import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, AlertTriangle, LogOut, CheckCircle } from 'lucide-react';

const CitizenHome = () => {
  const { logout, startJourney, endJourney, triggerPanic, myJourneyId, journeys } = useAuth();

  // Find my specific journey object to get status
  const myJourney = journeys.find(j => j.id === myJourneyId);
  const isPanic = myJourney?.status === 'critical';

  if (!myJourneyId) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Hello, Citizen.</h2>
          <p className="text-gray-500 mt-2">Ready to start your commute?</p>
        </div>

        <button 
          onClick={startJourney}
          className="w-48 h-48 bg-blue-50 rounded-full flex flex-col items-center justify-center border-4 border-blue-600 shadow-xl active:scale-95 transition-transform"
        >
          <MapPin className="w-12 h-12 text-blue-600 mb-2" />
          <span className="text-blue-900 font-bold text-lg">START JOURNEY</span>
        </button>

        <button onClick={logout} className="text-gray-400 underline text-sm mt-auto">
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col items-center space-y-6 ${isPanic ? 'bg-red-50 -m-4 p-8' : ''}`}>
      
      {/* Status Badge */}
      <div className={`px-4 py-2 rounded-full flex items-center space-x-2 ${isPanic ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
        <div className={`w-3 h-3 rounded-full ${isPanic ? 'bg-red-600 animate-ping' : 'bg-green-500 animate-pulse'}`} />
        <span className="font-bold text-sm">
          {isPanic ? 'CRITICAL ALERT SENT' : 'LIVE WATCH ACTIVE'}
        </span>
      </div>

      <div className="text-center">
        <p className="text-gray-500 text-sm">Your location is being tracked by Ops.</p>
        <p className="text-xs text-gray-400 font-mono mt-1">ID: #{myJourneyId}</p>
      </div>

      {/* THE BIG RED BUTTON */}
      <div className="flex-1 flex items-center justify-center w-full">
        <button
          onClick={triggerPanic}
          className={`w-64 h-64 rounded-full flex flex-col items-center justify-center border-8 shadow-2xl transition-all duration-300
            ${isPanic 
              ? 'bg-red-600 border-red-800 scale-105 animate-pulse text-white' 
              : 'bg-white border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200'
            }`}
        >
          <AlertTriangle className={`w-20 h-20 mb-2 ${isPanic ? 'text-white' : 'text-red-600'}`} />
          <span className="font-black text-2xl tracking-widest">PANIC</span>
        </button>
      </div>

      <button 
        onClick={endJourney}
        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 active:bg-slate-800"
      >
        <CheckCircle className="w-5 h-5" />
        <span>I have arrived safely</span>
      </button>
    </div>
  );
};

export default CitizenHome;
