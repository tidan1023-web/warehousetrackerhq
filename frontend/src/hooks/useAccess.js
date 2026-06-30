import { useAuth } from '../context/AuthContext';

const FULL_ACCESS_EMAILS = ['tidan1023@gmail.com'];

export function useAccess() {
  const { user } = useAuth();
  const isPremium = Boolean(user && FULL_ACCESS_EMAILS.includes(user.email?.toLowerCase()));
  return { isPremium };
}
