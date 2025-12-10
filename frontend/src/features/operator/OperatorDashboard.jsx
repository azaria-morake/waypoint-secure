import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import SVGMapEngine from '../../components/map/SVGMapEngine';
import GoogleMapEngine from '../../components/map/GoogleMapEngine';
import { 
  User, Activity, Globe, Map as MapIcon, 
  ChevronDown, ChevronUp, Phone, MapPin, 
  AlertTriangle, PhoneCall, Lock, EyeOff 
} from 'lucide-react';

const OperatorDashboard = () => {
  const { journeys } = useAuth();
  const [viewMode, setViewMode] = useState('tactical');
  
  const [activeCardId, setActiveCardId] = useState(null);
  const [callingContact, setCallingContact] = useState(null);
  const [pinnedMessage, setPinnedMessage] = useState(null);

  const sortedJourneys = [...journeys].sort((a, b) => 
    (a.status === 'critical' ? -1 : 1)
  );

  const handleCall = (name, number) => {
    setCallingContact({ name, number });
    setTimeout(() => setCallingContact(null), 3000);
  };

  const handlePin = (address) => {
    setPinnedMessage(`📍 PINNED: ${address}`);
    setTimeout(() => setPinnedMessage(null), 3000);
  };

  return (
    <div className="w-full h-full flex relative">
      
      {/* CALL MODAL */}
      {callingContact && (
        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <PhoneCall className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Calling {callingContact.name}...</h3>
            {/* Shows Redacted Number if Safe */}
            <p className="text-slate-400 font-mono mb-6 tracking-widest">{callingContact.number}</p>
            <button 
              onClick={() => setCallingContact(null)}
              className="bg-red-600 hover:bg-red-700 text-white w-full py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" /> END CALL
            </button>
          </div>
        </div>
      )}

      {/* TOAST */}
      {pinnedMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white px-6 py-2 rounded-full shadow-xl font-bold text-sm animate-bounce">
          {pinnedMessage}
        </div>
      )}

      {/* LEFT SIDEBAR */}
      <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col flex-none z-20 shadow-xl">
        <div className="p-4 border-b border-slate-800 bg-slate-950">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Units</h2>
          <div className="text-2xl font-mono text-white flex items-baseline gap-2">
            {journeys.length} <span className="text-sm text-slate-600 font-sans font-normal">ONLINE</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
          {sortedJourneys.map((j) => {
            const isExpanded = activeCardId === j.id;
            const isCritical = j.status === 'critical' || j.status === 'panic_dispatched';

            return (
              <div 
                key={j.id} 
                className={`rounded-lg border transition-all duration-300 overflow-hidden ${
                  isCritical
                    ? 'bg-red-950/20 border-red-900/50' 
                    : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800'
                } ${isExpanded ? 'ring-1 ring-blue-500 bg-slate-800' : ''}`}
              >
                {/* HEADER */}
                <div 
                  className="p-3 cursor-pointer"
                  onClick={() => setActiveCardId(isExpanded ? null : j.id)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wider flex items-center gap-1 ${
                      isCritical ? 'bg-red-600 text-white animate-pulse' : 'bg-blue-900/50 text-blue-400'
                    }`}>
                      {isCritical && <AlertTriangle className="w-3 h-3" />}
                      {isCritical ? 'PANIC' : 'SAFE'}
                    </span>
                    <div className="flex items-center gap-1 text-slate-500">
                      <span className="text-[10px] font-mono">#{j.id.slice(-4)}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 mt-2">
                    <div className={`p-2 rounded-full ${isCritical ? 'bg-red-900/50' : 'bg-slate-700'}`}>
                      <User className={`w-4 h-4 ${isCritical ? 'text-red-400' : 'text-slate-300'}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">{j.name}</h4>
                      {!isExpanded && (
                        <p className="text-xs text-slate-500 font-mono">
                          LOC: {j.x.toFixed(0)}, {j.y.toFixed(0)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* DETAILS */}
                {isExpanded && (
                  <div className="px-3 pb-3 pt-0 text-sm border-t border-slate-700/50 mt-1 animate-in slide-in-from-top-2">
                    
                    <div className="grid grid-cols-2 gap-2 mt-3 mb-3">
                        <div className="bg-slate-900/50 p-2 rounded border border-slate-700">
                            <label className="text-[10px] text-slate-500 block">FULL NAME</label>
                            <span className="text-slate-200 font-medium truncate block">{j.fullName || 'Unknown'}</span>
                        </div>
                        <div className={`p-2 rounded border ${isCritical ? 'bg-red-900/20 border-red-900' : 'bg-slate-900/50 border-slate-700'}`}>
                            <label className="text-[10px] text-slate-500 block">ALERT TYPE</label>
                            <span className={`font-bold truncate block ${isCritical ? 'text-red-400' : 'text-blue-400'}`}>
                                {j.alertType || 'General'}
                            </span>
                        </div>
                    </div>

                    {/* ADDRESS - LOCKED IF SAFE */}
                    <div className="mb-3">
                        <label className="text-[10px] text-slate-500 block mb-1">HOME ADDRESS</label>
                        {isCritical ? (
                          <button 
                              onClick={(e) => { e.stopPropagation(); handlePin(j.homeAddress); }}
                              className="w-full flex items-start text-left gap-2 bg-slate-900/50 hover:bg-blue-900/20 p-2 rounded border border-slate-700 hover:border-blue-500/50 transition-colors group"
                          >
                              <MapPin className="w-4 h-4 text-slate-400 group-hover:text-blue-400 mt-0.5 shrink-0" />
                              <span className="text-slate-300 text-xs group-hover:text-white leading-tight">
                                  {j.homeAddress || 'No Address Registered'}
                              </span>
                          </button>
                        ) : (
                          <div className="bg-slate-900/30 p-2 rounded border border-slate-800 flex items-center gap-2 text-slate-600">
                            <Lock className="w-3 h-3" />
                            <span className="text-xs font-mono">•••• ••••• ••••• (ENCRYPTED)</span>
                          </div>
                        )}
                    </div>

                    {/* CONTACTS - BLIND DIALING ENABLED */}
                    <div>
                        <label className="text-[10px] text-slate-500 block mb-1 flex justify-between">
                            EMERGENCY CONTACTS
                            {!isCritical && <span className="flex items-center gap-1 text-[9px] text-blue-400"><EyeOff className="w-3 h-3"/> PRIVACY MODE</span>}
                        </label>
                        
                        <div className="space-y-1">
                            {(j.bestContacts || []).map((contact, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-slate-900/50 p-2 rounded border border-slate-700">
                                    <div className="flex flex-col">
                                        <span className="text-slate-300 text-xs font-medium">{contact.name}</span>
                                        {/* CONDITIONAL REDACTION */}
                                        <span className={`text-[10px] font-mono ${isCritical ? 'text-slate-500' : 'text-slate-600 tracking-widest'}`}>
                                            {isCritical ? contact.phone : '*** *** ****'}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            // Pass redacted or real number to modal
                                            handleCall(contact.name, isCritical ? contact.phone : '*** *** ****'); 
                                        }}
                                        className={`${isCritical ? 'bg-green-600 hover:bg-green-500' : 'bg-slate-700 hover:bg-slate-600'} text-white p-1.5 rounded transition-colors`}
                                        title={isCritical ? "Call Contact" : "Secure Call Bridge"}
                                    >
                                        <Phone className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MAIN CALL BUTTON */}
                    <div className="flex gap-2 mt-4 pt-3 border-t border-slate-700">
                         <button 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                handleCall(j.fullName, isCritical ? j.contactNumber : '*** *** ****'); 
                            }}
                            className={`flex-1 py-2 rounded text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
                              isCritical 
                              ? 'bg-slate-700 hover:bg-green-600 hover:text-white text-slate-300' 
                              : 'bg-slate-800 hover:bg-slate-700 text-blue-400'
                            }`}
                        >
                            {!isCritical && <Lock className="w-3 h-3" />}
                            {isCritical ? 'CALL USER' : 'SECURE CALL'}
                         </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* MAP SECTION */}
      <section className="flex-1 bg-slate-950 p-4 relative flex flex-col min-w-0">
        <div className="absolute top-6 right-8 z-10 flex space-x-4 pointer-events-none">
          <div className="pointer-events-auto flex space-x-4">
            <button 
              onClick={() => setViewMode(prev => prev === 'tactical' ? 'satellite' : 'tactical')}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded shadow-lg transition-all active:scale-95 border border-blue-400"
            >
              {viewMode === 'tactical' ? <Globe className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
              <span className="text-xs font-bold font-mono">
                {viewMode === 'tactical' ? 'SWITCH TO SATELLITE' : 'SWITCH TO TACTICAL'}
              </span>
            </button>
            <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1 rounded border border-slate-700 backdrop-blur">
               <Activity className="w-4 h-4 text-green-500" />
               <span className="text-xs font-mono text-slate-400">SYS: NORMAL</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 relative rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-900">
          {viewMode === 'tactical' ? (
             <SVGMapEngine journeys={journeys} />
          ) : (
             <GoogleMapEngine journeys={journeys} />
          )}
        </div>
      </section>
    </div>
  );
};

export default OperatorDashboard;