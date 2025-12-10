import React from 'react';
import { Outlet } from 'react-router-dom';
import { Radio, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const OperatorLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="h-screen bg-slate-900 text-slate-200 flex flex-col overflow-hidden">
      {/* Tactical Header */}
      <header className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <Radio className="text-blue-500 w-5 h-5" />
          <span className="font-bold tracking-widest text-sm text-slate-100">WAYPOINT // OPS CENTER</span>
        </div>
        <button 
          onClick={logout}
          className="text-xs text-slate-500 hover:text-white flex items-center gap-2 transition-colors"
        >
          LOGOUT <LogOut className="w-3 h-3" />
        </button>
      </header>
      
      <main className="flex-1 flex overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default OperatorLayout;
