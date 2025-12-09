import React from 'react';

const SVGMapEngine = ({ journeys }) => {
  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden rounded-lg border border-slate-700 shadow-2xl">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      {/* The SVG Engine */}
      <svg viewBox="0 0 100 100" className="w-full h-full preserve-3d">
        {/* Map Border/Safe Zone */}
        <rect x="5" y="5" width="90" height="90" fill="none" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />

        {journeys.map((j) => (
          <g key={j.id} className="transition-all duration-1000 ease-linear" style={{ transform: `translate(${j.x}px, ${j.y}px)` }}>
            {/* The Dot */}
            <circle
              cx={j.x} cy={j.y} r="1.5"
              className={`${j.status === 'critical' ? 'fill-red-500' : 'fill-blue-400'}`}
            />
            
            {/* Ping Animation for Active Units */}
            <circle
              cx={j.x} cy={j.y} r="3"
              className={`origin-center animate-ping opacity-75 ${
                j.status === 'critical' ? 'stroke-red-500' : 'stroke-blue-400'
              }`}
              fill="none" strokeWidth="0.5"
            />

            {/* Label (Only visible on high zoom/large screens logically, but rendered here for demo) */}
            <text x={j.x} y={j.y + 4} fontSize="3" fill="white" textAnchor="middle" className="font-mono opacity-60">
              {j.name}
            </text>
          </g>
        ))}
      </svg>
      
      {/* HUD Overlay */}
      <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur px-3 py-1 rounded text-xs text-slate-400 font-mono border border-slate-600">
        LIVE FEED // GPS: ACTIVE
      </div>
    </div>
  );
};

export default SVGMapEngine;
