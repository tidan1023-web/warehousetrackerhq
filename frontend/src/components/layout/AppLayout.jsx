import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAccess } from '../../hooks/useAccess';
import { Lock, PhoneCall, Clock } from 'lucide-react';

// TODO: replace with your actual booking / payment link
const BOOK_CALL_URL = 'https://wa.me/YOUR_NUMBER';

const TITLES = {
  '/app/dashboard':           'Dashboard',
  '/app/projects':            'Projects',
  '/app/contacts':            'Contacts',
  '/app/qs-prices':           'QS Prices',
  '/app/qs-comparison':       'QS Comparison',
  '/app/artisan-prices':      'Artisan Rates',
  '/app/materials':           'Materials',
  '/app/price-intelligence':  'Price Intelligence',
  '/app/boq':                 'BOQ Builder',
  '/app/invoices':            'Invoices',
  '/app/progress':            'Progress Tracker',
  '/app/change-orders':       'Change Orders',
  '/app/site-reports':        'Site Reports',
  '/app/analytics':           'Analytics',
  '/app/estimator':           'New Estimate',
  '/app/simulator':           'Scenario Simulator',
  '/app/estimates':           'Estimate History',
  '/app/historical-projects': 'Historical Projects',
  '/app/settings':            'Company Settings',
};

function TrialExpiredScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Lock size={24} className="text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Your free trial has expired</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Your 7-day free trial has ended. Book a call with us to continue — we'll walk you
          through payment, onboarding, and get you set up on the right plan.
        </p>
        <a
          href={BOOK_CALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary-900 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary-800 transition-colors"
        >
          <PhoneCall size={15} />
          Book a Call to Continue
        </a>
      </div>
    </div>
  );
}

function TrialBanner({ daysLeft }) {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-2 flex items-center justify-between gap-3 text-sm shrink-0">
      <div className="flex items-center gap-2 text-amber-800">
        <Clock size={14} className="shrink-0" />
        <span>
          <strong>{daysLeft} day{daysLeft !== 1 ? 's' : ''}</strong> left in your free trial
        </span>
      </div>
      <a
        href={BOOK_CALL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-lg transition-colors"
      >
        Upgrade →
      </a>
    </div>
  );
}

export default function AppLayout() {
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { trialExpired, isTrialActive, trialDaysLeft } = useAccess();

  const title = TITLES[pathname]
    ?? (pathname.startsWith('/app/estimates/') ? 'Estimate Detail'
      : pathname.startsWith('/app/invoices/')  ? 'Invoice Detail'
      : 'Pico Bello');

  if (trialExpired) return <TrialExpiredScreen />;

  return (
    <div className="flex h-screen overflow-hidden relative">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 lg:static lg:z-auto transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        {isTrialActive && trialDaysLeft <= 3 && <TrialBanner daysLeft={trialDaysLeft} />}
        <main className="flex-1 overflow-auto p-4 sm:p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
