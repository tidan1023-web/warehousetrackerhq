import React from 'react';
import { Lock, PhoneCall } from 'lucide-react';
import { useAccess } from '../hooks/useAccess';

// TODO: replace with your actual booking / payment link
export const BOOK_CALL_URL = 'https://wa.me/YOUR_NUMBER';

export default function PaywallGuard({ children }) {
  const { hasAccess } = useAccess();
  if (hasAccess) return children;
  return null; // blocked at AppLayout level via TrialGuard
}
