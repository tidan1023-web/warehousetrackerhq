import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const TITLES = {
  '/app/dashboard': 'Dashboard',
  '/app/projects': 'Projects',
  '/app/qs-pricing': 'QS Pricing Library',
  '/app/artisan-pricing': 'Artisan Rates',
  '/app/material-pricing': 'Material Prices',
  '/app/pricing-intelligence': 'Pricing Intelligence',
  '/app/boq': 'BOQ Builder',
  '/app/invoices': 'Invoices',
  '/app/client-portal': 'My Projects',
  '/app/client-boq': 'Review BOQ',
  '/app/client-invoices': 'My Invoices',
  '/app/client-comments': 'Project Comments',
  '/app/settings': 'Company Settings',
};

export default function AppLayout() {
  const { pathname } = useLocation();
  // Dynamic route fallback: /app/invoices/:id → 'Invoice Detail'
  const title = TITLES[pathname]
    ?? (pathname.startsWith('/app/invoices/') ? 'Invoice Detail' : 'Pico Bello Projekte');

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} />
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
