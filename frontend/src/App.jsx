import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PaywallGuard from './components/PaywallGuard';

// Auth
import Landing            from './pages/Landing';
import Login              from './pages/auth/Login';
import Register           from './pages/auth/Register';
import ForgotPassword     from './pages/auth/ForgotPassword';
import ResetPassword      from './pages/auth/ResetPassword';

// Dashboard
import Dashboard          from './pages/Dashboard';

// Projects & Contacts
import Projects           from './pages/Projects';
import Contacts           from './pages/Contacts';

// Pricing Libraries
import QsPricing          from './pages/QsPricing';
import QsComparison       from './pages/QsComparison';
import ArtisanPricing     from './pages/ArtisanPricing';
import MaterialPricing    from './pages/MaterialPricing';
import PricingIntelligence from './pages/PricingIntelligence';

// BOQ & Invoices
import BoqBuilder         from './pages/BoqBuilder';
import Invoices           from './pages/Invoices';
import InvoiceDetail      from './pages/InvoiceDetail';

// Execution
import ProgressTracker    from './pages/ProgressTracker';
import ChangeOrders       from './pages/ChangeOrders';
import SiteReports        from './pages/SiteReports';
import Analytics          from './pages/Analytics';

// Estimator (kept)
import Estimator          from './pages/Estimator';
import EstimateDetail     from './pages/EstimateDetail';
import EstimateHistory    from './pages/EstimateHistory';
import HistoricalProjects from './pages/HistoricalProjects';
import Simulator          from './pages/Simulator';

// Admin
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
            <Route index                          element={<Navigate to="/app/dashboard" replace />} />

            {/* Dashboard */}
            <Route path="dashboard"              element={<Dashboard />} />

            {/* Projects & Contacts — premium */}
            <Route path="projects"               element={<PaywallGuard feature="Projects"><Projects /></PaywallGuard>} />
            <Route path="contacts"               element={<PaywallGuard feature="Contacts"><Contacts /></PaywallGuard>} />

            {/* Pricing Libraries — premium */}
            <Route path="qs-prices"              element={<PaywallGuard feature="QS Prices"><QsPricing /></PaywallGuard>} />
            <Route path="qs-comparison"          element={<PaywallGuard feature="QS Comparison"><QsComparison /></PaywallGuard>} />
            <Route path="artisan-prices"         element={<PaywallGuard feature="Artisan Rates"><ArtisanPricing /></PaywallGuard>} />
            <Route path="materials"              element={<PaywallGuard feature="Materials"><MaterialPricing /></PaywallGuard>} />
            <Route path="price-intelligence"     element={<PaywallGuard feature="Price Intelligence"><PricingIntelligence /></PaywallGuard>} />

            {/* BOQ & Invoices — premium */}
            <Route path="boq"                    element={<PaywallGuard feature="BOQ Builder"><BoqBuilder /></PaywallGuard>} />
            <Route path="invoices"               element={<PaywallGuard feature="Invoices"><Invoices /></PaywallGuard>} />
            <Route path="invoices/:id"           element={<PaywallGuard feature="Invoices"><InvoiceDetail /></PaywallGuard>} />

            {/* Execution — premium */}
            <Route path="progress"               element={<PaywallGuard feature="Progress Tracker"><ProgressTracker /></PaywallGuard>} />
            <Route path="change-orders"          element={<PaywallGuard feature="Change Orders"><ChangeOrders /></PaywallGuard>} />
            <Route path="site-reports"           element={<PaywallGuard feature="Site Reports"><SiteReports /></PaywallGuard>} />
            <Route path="analytics"              element={<PaywallGuard feature="Analytics"><Analytics /></PaywallGuard>} />

            {/* Estimator — free for everyone */}
            <Route path="estimator"              element={<Estimator />} />
            <Route path="estimates"              element={<EstimateHistory />} />
            <Route path="estimates/:id"          element={<EstimateDetail />} />
            <Route path="historical-projects"    element={<HistoricalProjects />} />
            <Route path="simulator"              element={<PaywallGuard feature="Scenario Simulator"><Simulator /></PaywallGuard>} />

            {/* Admin — premium */}
            <Route path="settings"               element={<PaywallGuard feature="Company Settings"><CompanySettings /></PaywallGuard>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}
