import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Radio, Smartphone, Lock, Activity } from 'lucide-react';

const LoginScreen = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* BACKGROUND EFFECTS */}
      {/* 1. Tactical Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      
      {/* 2. Ambient Glow (Blue/Purple) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* MAIN CARD */}
      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl relative z-10 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-slate-950/50 p-8 text-center border-b border-slate-800 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
          
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse rounded-full" />
            <Shield className="w-16 h-16 text-blue-500 relative z-10" />
            <div className="absolute bottom-0 right-0 bg-slate-900 rounded-full p-1 border border-slate-700">
               <Activity className="w-4 h-4 text-green-400 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-3xl font-black text-white tracking-[0.2em]">WAYPOINT</h1>
          <p className="text-slate-400 text-xs uppercase tracking-widest mt-2 font-mono">
            Secure Journey Management
          </p>
        </div>

        {/* Action Section */}
        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-slate-200 font-semibold">Identify Yourself</h2>
            <p className="text-slate-500 text-sm">Select your access terminal below.</p>
          </div>

          <div className="space-y-4">
            {/* OPTION 1: CITIZEN */}
            <button
              onClick={() => login('citizen')}
              className="w-full flex items-center p-4 bg-white/5 hover:bg-blue-600/10 border border-slate-700 hover:border-blue-500/50 rounded-xl transition-all duration-300 group"
            >
              <div className="bg-blue-500/10 p-3 rounded-full mr-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Smartphone className="w-6 h-6 text-blue-400 group-hover:text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-200 group-hover:text-blue-200 transition-colors">Citizen Mobile App</h3>
                <p className="text-xs text-slate-500 group-hover:text-blue-300/70">Personal Tracking & Panic Button</p>
              </div>
            </button>

            {/* OPTION 2: OPERATOR */}
            <button
              onClick={() => login('operator')}
              className="w-full flex items-center p-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 rounded-xl transition-all duration-300 group"
            >
              <div className="bg-slate-800 p-3 rounded-full mr-4 group-hover:bg-slate-700 transition-colors">
                <Radio className="w-6 h-6 text-slate-400 group-hover:text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors">Ops Center</h3>
                <p className="text-xs text-slate-500 group-hover:text-slate-400">Tactical Dashboard & Dispatch</p>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 text-center border-t border-slate-800">
           <p className="text-[10px] text-slate-600 flex items-center justify-center gap-2 font-mono">
             <Lock className="w-3 h-3" /> 256-BIT ENCRYPTION ENABLED
           </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;