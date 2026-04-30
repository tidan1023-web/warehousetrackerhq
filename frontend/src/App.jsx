import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import CompanySettings from './pages/CompanySettings';
import QsPricing from './pages/QsPricing';
import ArtisanPricing from './pages/ArtisanPricing';
import MaterialPricing from './pages/MaterialPricing';
import PricingIntelligence from './pages/PricingIntelligence';
import BoqBuilder from './pages/BoqBuilder';
import Invoices from './pages/Invoices';
import InvoiceDetail from './pages/InvoiceDetail';
import ClientPortal from './pages/ClientPortal';
import ClientBOQ from './pages/ClientBOQ';
import ClientInvoices from './pages/ClientInvoices';
import ClientComments from './pages/ClientComments';
import ProgressTracker from './pages/ProgressTracker';
import ChangeOrders from './pages/ChangeOrders';
import Analytics from './pages/Analytics';
import SiteReports from './pages/SiteReports';
import Contacts from './pages/Contacts';
import QsComparison from './pages/QsComparison';

export default function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
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
          <Route path="invoices" element={<Invoices />} />
          <Route path="invoices/:id" element={<InvoiceDetail />} />
          <Route path="client-portal" element={<ClientPortal />} />
          <Route path="client-boq" element={<ClientBOQ />} />
          <Route path="client-invoices" element={<ClientInvoices />} />
          <Route path="client-comments" element={<ClientComments />} />
          <Route path="progress" element={<ProgressTracker />} />
          <Route path="change-orders" element={<ChangeOrders />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="site-reports" element={<SiteReports />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="qs-comparison" element={<QsComparison />} />
          <Route path="settings" element={<CompanySettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
    </ThemeProvider>
  );
}
