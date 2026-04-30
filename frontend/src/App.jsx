import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Landing            from './pages/Landing';
import Login              from './pages/auth/Login';
import Register           from './pages/auth/Register';
import ForgotPassword     from './pages/auth/ForgotPassword';
import ResetPassword      from './pages/auth/ResetPassword';

import Dashboard          from './pages/Dashboard';
import Estimator          from './pages/Estimator';
import EstimateDetail     from './pages/EstimateDetail';
import EstimateHistory    from './pages/EstimateHistory';
import HistoricalProjects from './pages/HistoricalProjects';
import SiteReports        from './pages/SiteReports';
import CompanySettings    from './pages/CompanySettings';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/"                        element={<Landing />} />
          <Route path="/login"                   element={<Login />} />
          <Route path="/register"                element={<Register />} />
          <Route path="/forgot-password"         element={<ForgotPassword />} />
          <Route path="/reset-password/:token"   element={<ResetPassword />} />

          <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index                         element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard"              element={<Dashboard />} />
            <Route path="estimator"              element={<Estimator />} />
            <Route path="estimates"              element={<EstimateHistory />} />
            <Route path="estimates/:id"          element={<EstimateDetail />} />
            <Route path="historical-projects"    element={<HistoricalProjects />} />
            <Route path="site-reports"           element={<SiteReports />} />
            <Route path="settings"               element={<CompanySettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}
