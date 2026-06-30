import React from 'react';
import { Lock, PhoneCall } from 'lucide-react';
import { useAccess } from '../hooks/useAccess';

// TODO: replace with your actual booking link
const BOOK_CALL_URL = 'https://wa.me/YOUR_NUMBER';

export default function PaywallGuard({ children, feature = 'This feature' }) {
  const { isPremium } = useAccess();

  if (isPremium) return children;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md w-full">
        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Lock size={24} className="text-gray-400" />
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">{feature}</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          This is a premium feature. Book a call with us — we'll walk you through
          onboarding, payment, and get you set up on the right plan.
        </p>
        <a
          href={BOOK_CALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary-900 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary-800 transition-colors"
        >
          <PhoneCall size={15} />
          Book a Call to Unlock
        </a>
      </div>
    </div>
  );
}
