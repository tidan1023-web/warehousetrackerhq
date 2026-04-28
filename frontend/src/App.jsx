import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import CompanySettings from './pages/CompanySettings';
import QsPricing from './pages/QsPricing';
import ArtisanPricing from './pages/ArtisanPricing';
import MaterialPricing from './pages/MaterialPricing';
import PricingIntelligence from './pages/PricingIntelligence';
import BoqBuilder from './pages/BoqBuilder';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="qs-pricing" element={<QsPricing />} />
          <Route path="artisan-pricing" element={<ArtisanPricing />} />
          <Route path="material-pricing" element={<MaterialPricing />} />
          <Route path="pricing-intelligence" element={<PricingIntelligence />} />
          <Route path="boq" element={<BoqBuilder />} />
          <Route path="settings" element={<CompanySettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
