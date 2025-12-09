import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Radio, Smartphone } from 'lucide-react';

const LoginScreen = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-8 text-center">
          <Shield className="w-12 h-12 text-white mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white tracking-widest">WAYPOINT</h1>
          <p className="text-blue-100 text-sm mt-2">South Africa Safety Initiative</p>
        </div>

        <div className="p-8 space-y-4">
          <p className="text-center text-gray-500 mb-6">Select your interface:</p>

          <button
            onClick={() => login('citizen')}
            className="w-full flex items-center p-4 border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="bg-blue-100 p-3 rounded-full mr-4 group-hover:bg-blue-200">
              <Smartphone className="text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-800">Citizen App</h3>
              <p className="text-xs text-gray-500">Mobile View • Journey Management</p>
            </div>
          </button>

          <button
            onClick={() => login('operator')}
            className="w-full flex items-center p-4 border-2 border-gray-100 rounded-xl hover:border-slate-800 hover:bg-slate-50 transition-all group"
          >
            <div className="bg-slate-200 p-3 rounded-full mr-4 group-hover:bg-slate-300">
              <Radio className="text-slate-800" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-slate-800">Ops Center</h3>
              <p className="text-xs text-gray-500">Desktop View • Command Dashboard</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
