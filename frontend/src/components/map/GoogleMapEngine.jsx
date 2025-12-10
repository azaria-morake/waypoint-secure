import React from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

// PRETORIA / HATFIELD AREA (Demo Center)
const MAP_CENTER = { lat: -25.7479, lng: 28.2293 };

const GoogleMapEngine = ({ journeys }) => {
  // ⚠️ REPLACE WITH YOUR REAL API KEY FOR THE DEMO ⚠️
  // If you don't have one, the map will show a "Development Purposes Only" watermark, 
  // which is usually fine for local hackathon demos.
  const API_KEY = "YOUR_GOOGLE_MAPS_API_KEY_HERE";

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-2xl border border-slate-700 relative">
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={MAP_CENTER}
          defaultZoom={15}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          mapId={"DEMO_MAP_ID"} // Optional: Required only for AdvancedMarkers
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Render All Active Journeys */}
          {journeys.map((j) => (
            <Marker
              key={j.id}
              position={{ lat: j.x, lng: j.y }} // Note: We map x->lat, y->lng in Context now
              title={j.name}
              icon={{
                // Green/Blue for Safe, Red for Panic
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

      {/* Tactical HUD Overlay (Keeps the "Ops" vibe) */}
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
