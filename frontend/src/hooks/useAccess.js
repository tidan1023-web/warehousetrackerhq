import { useAuth } from '../context/AuthContext';

const FULL_ACCESS_EMAILS = [];
const TRIAL_DAYS = 7;

export function useAccess() {
  const { user } = useAuth();

  if (!user) {
    return { isPremium: false, isTrialActive: false, trialDaysLeft: 0, trialExpired: false, hasAccess: false };
  }

  if (FULL_ACCESS_EMAILS.includes(user.email?.toLowerCase())) {
    return { isPremium: true, isTrialActive: false, trialDaysLeft: null, trialExpired: false, hasAccess: true };
  }

  const trialStart  = new Date(user.createdAt || Date.now());
  const daysElapsed = (Date.now() - trialStart.getTime()) / (1000 * 60 * 60 * 24);
  const trialDaysLeft  = Math.max(0, Math.ceil(TRIAL_DAYS - daysElapsed));
  const isTrialActive  = daysElapsed < TRIAL_DAYS;

  return {
    isPremium:    false,
    isTrialActive,
    trialDaysLeft,
    trialExpired: !isTrialActive,
    hasAccess:    isTrialActive,
  };
}
