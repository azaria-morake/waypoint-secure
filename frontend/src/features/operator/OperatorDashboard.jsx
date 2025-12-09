import React from 'react';
import { useAuth } from '../../context/AuthContext';
import SVGMapEngine from '../../components/map/SVGMapEngine';
import { AlertCircle, User, Activity } from 'lucide-react';

const OperatorDashboard = () => {
  const { journeys } = useAuth();

  // Sorting: Critical incidents go to the top
  const sortedJourneys = [...journeys].sort((a, b) => 
    (a.status === 'critical' ? -1 : 1)
  );

  return (
    <div className="w-full h-full flex">
      
      {/* LEFT SIDEBAR: Incident Feed */}
      <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Units</h2>
          <div className="text-2xl font-mono text-white">{journeys.length} <span className="text-sm text-slate-600">ONLINE</span></div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {sortedJourneys.map((j) => (
            <div 
              key={j.id} 
              className={`p-3 rounded-lg border transition-all ${
                j.status === 'critical' 
                  ? 'bg-red-950/30 border-red-900 animate-pulse' 
                  : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  j.status === 'critical' ? 'bg-red-600 text-white' : 'bg-blue-900/50 text-blue-400'
                }`}>
                  {j.status === 'critical' ? 'PANIC' : 'SAFE'}
                </span>
                <span className="text-[10px] font-mono text-slate-500">ID: {j.id}</span>
              </div>
              
              <div className="flex items-center space-x-3 mt-2">
                <div className="bg-slate-700 p-1.5 rounded-full">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-200">{j.name}</h4>
                  <p className="text-xs text-slate-500 font-mono">
                    LOC: {j.x.toFixed(0)}, {j.y.toFixed(0)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT: The Map */}
      <section className="flex-1 bg-slate-950 p-6 relative flex flex-col">
        <div className="absolute top-4 right-6 z-10 flex space-x-4">
          <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1 rounded border border-slate-700">
             <Activity className="w-4 h-4 text-green-500" />
             <span className="text-xs font-mono text-slate-400">SYS: NORMAL</span>
          </div>
        </div>
        
        <div className="flex-1">
          <SVGMapEngine journeys={journeys} />
        </div>
      </section>
    </div>
  );
};

export default OperatorDashboard;
