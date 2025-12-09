import React from 'react';
import { Outlet } from 'react-router-dom';

const CitizenLayout = () => {
  return (
    <div className="min-h-screen bg-slate-200 flex justify-center">
      {/* Mobile Constraint Wrapper */}
      <div className="w-full max-w-[420px] bg-white min-h-screen shadow-2xl flex flex-col relative">
        <header className="bg-blue-600 p-4 text-white flex justify-between items-center sticky top-0 z-10">
            <span className="font-bold tracking-wider">WAYPOINT</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </header>
        
        <main className="flex-1 p-4 flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CitizenLayout;
