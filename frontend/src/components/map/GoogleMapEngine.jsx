import React from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

// PRETORIA / HATFIELD AREA (Demo Center)
const MAP_CENTER = { lat: -25.7479, lng: 28.2293 };

const GoogleMapEngine = ({ journeys }) => {
  
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!API_KEY) {
    console.error("🔴 Google Maps API Key is missing! Check your .env file.");
    return <div className="p-4 text-red-500 bg-red-100 font-mono">MISSING API KEY</div>;
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-2xl border border-slate-700 relative">
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={MAP_CENTER}
          defaultZoom={15}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          mapId={"DEMO_MAP_ID"}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        >
          {journeys.map((j) => (
            <Marker
              key={j.id}
              position={{ lat: j.x, lng: j.y }}
              title={j.name}
              icon={{
                path: window.google?.maps?.SymbolPath?.CIRCLE,
                scale: 8,
                fillColor: j.status === 'critical' ? '#EF4444' : '#3B82F6',
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: '#FFFFFF',
              }}
            />
          ))}
        </Map>
      </APIProvider>

      {/* Tactical HUD Overlay */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur px-4 py-2 rounded border border-slate-600 z-10">
        <div className="text-xs text-slate-400 font-mono">SATELLITE FEED</div>
        <div className="text-green-400 font-bold text-sm flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          LIVE TRACKING
        </div>
      </div>
    </div>
  );
};

export default GoogleMapEngine;