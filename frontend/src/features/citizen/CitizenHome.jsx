import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, AlertTriangle, XCircle, CheckCircle, Shield, Navigation, LogOut } from 'lucide-react';

const CitizenHome = () => {
  const { 
    logout, startJourney, endJourney, triggerPanic, cancelPanic, 
    myStatus, myJourneyId 
  } = useAuth();

  const isPanic = myStatus === 'critical';

  // --- VIEW 1: IDLE / START SCREEN ---
  if (!myJourneyId) {
    return (
      <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50 -m-4 p-8">
        
        {/* Header / Brand */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-2 text-blue-600">
            <Shield className="w-6 h-6 fill-current" />
            <span className="font-bold tracking-wider text-slate-800">WAYPOINT</span>
          </div>
          <button onClick={logout} className="p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-slate-600">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Main Action Area */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 z-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity animate-pulse"></div>
            <button 
              onClick={startJourney}
              className="relative w-56 h-56 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex flex-col items-center justify-center shadow-2xl text-white hover:scale-105 active:scale-95 transition-all duration-300 border-8 border-blue-50/50"
            >
              <Navigation className="w-16 h-16 mb-2" />
              <span className="font-bold text-xl tracking-wide">START JOURNEY</span>
              <span className="text-blue-100 text-xs mt-1 font-medium">Tap to Begin</span>
            </button>
          </div>
          
          <div className="text-center space-y-2 max-w-xs">
            <h2 className="text-2xl font-bold text-slate-800">Where to today?</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              We'll keep an eye on you. Your location will be shared securely with our Ops Center.
            </p>
          </div>
        </div>

        {/* Decorative BG Elements */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>
    );
  }

  // --- VIEW 2: ACTIVE JOURNEY ---
  return (
    <div className={`flex-1 flex flex-col -m-4 p-6 transition-colors duration-500 relative overflow-hidden ${isPanic ? 'bg-red-50' : 'bg-slate-50'}`}>
      
      {/* Dynamic Background Pulse for Panic */}
      {isPanic && (
        <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />
      )}

      {/* Header Info Card */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 z-10">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">CURRENT STATUS</p>
            <div className={`flex items-center space-x-2 ${isPanic ? 'text-red-600' : 'text-green-600'}`}>
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPanic ? 'bg-red-500' : 'bg-green-500'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isPanic ? 'bg-red-600' : 'bg-green-600'}`}></span>
              </span>
              <span className="font-bold text-lg">{isPanic ? 'CRITICAL ALERT' : 'LIVE MONITORING'}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">SESSION ID</p>
            <p className="font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded text-xs">#{myJourneyId}</p>
          </div>
        </div>
      </div>

      {/* THE BIG BUTTONS */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 z-10 py-8">
        
        {/* Panic Button Container */}
        <div className="relative">
            {/* Outer Rings (Visual Only) */}
            <div className={`absolute inset-0 rounded-full border-2 opacity-50 animate-ping ${isPanic ? 'border-red-500' : 'border-slate-300'}`} style={{ animationDuration: '2s' }}></div>
            <div className={`absolute inset-[-15px] rounded-full border border-dashed opacity-30 ${isPanic ? 'border-red-500 animate-spin-slow' : 'border-slate-400'}`}></div>

            <button
              onClick={triggerPanic}
              disabled={isPanic}
              className={`relative w-64 h-64 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 border-[10px] 
                ${isPanic 
                  ? 'bg-red-600 border-red-500 text-white scale-95 shadow-red-500/50' 
                  : 'bg-white border-slate-100 text-slate-700 hover:border-red-50 active:scale-95 shadow-slate-200'
                }`}
            >
              <AlertTriangle className={`w-20 h-20 mb-3 transition-colors ${isPanic ? 'text-white' : 'text-red-500'}`} />
              <div className="text-center">
                <span className="block font-black text-3xl tracking-widest">{isPanic ? 'HELP SENT' : 'PANIC'}</span>
                {!isPanic && <span className="text-xs text-slate-400 uppercase mt-1 font-semibold">Tap for Emergency</span>}
              </div>
            </button>
        </div>

        {/* Cancel Action */}
        <div className={`transition-all duration-300 transform ${isPanic ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
             <button 
                onClick={cancelPanic}
                className="flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-lg border border-red-100 text-red-600 hover:bg-red-50 active:scale-95 transition-all"
            >
                <XCircle className="w-5 h-5" />
                <span className="font-bold text-sm">CANCEL FALSE ALARM</span>
            </button>
        </div>
      </div>

      {/* Footer Action */}
      <button 
        onClick={endJourney}
        className="w-full bg-slate-900 text-white py-5 rounded-xl font-bold flex items-center justify-center space-x-3 shadow-xl active:bg-slate-800 transition-colors z-10"
      >
        <CheckCircle className="w-6 h-6 text-green-400" />
        <span className="tracking-wide">I HAVE ARRIVED SAFELY</span>
      </button>

    </div>
  );
};

export default CitizenHome;