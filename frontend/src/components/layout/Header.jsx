import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../NotificationBell';
import { registerPushSubscription } from '../../services/notifications';

export default function Header({ title }) {
  const { user } = useAuth();
  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    registerPushSubscription();
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <span className="text-sm text-gray-500 hidden sm:block">{user?.email}</span>
        <div className="w-8 h-8 bg-primary-900 text-white rounded-full flex items-center justify-center text-xs font-bold ml-1">
          {initials}
        </div>
      </div>
    </header>
  );
}
