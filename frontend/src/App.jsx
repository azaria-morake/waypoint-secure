import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import Features
import LoginScreen from './features/auth/LoginScreen';
import CitizenLayout from './features/citizen/CitizenLayout';
import CitizenHome from './features/citizen/CitizenHome';
import OperatorLayout from './features/operator/OperatorLayout';
import OperatorDashboard from './features/operator/OperatorDashboard';

const AppRoutes = () => {
  const { user } = useAuth();

  // 1. Not Logged In
  if (!user) {
    return <LoginScreen />;
  }

  // 2. Logged In as Citizen
  if (user.role === 'citizen') {
    return (
      <Routes>
        <Route path="/" element={<CitizenLayout />}>
          <Route index element={<CitizenHome />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  // 3. Logged In as Operator
  if (user.role === 'operator') {
    return (
      <Routes>
        <Route path="/" element={<OperatorLayout />}>
          <Route index element={<OperatorDashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
