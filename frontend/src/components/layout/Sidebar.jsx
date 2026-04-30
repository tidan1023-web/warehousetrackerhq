import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard, Calculator, Clock, Database,
  ClipboardList, Settings, LogOut, Building2, Moon, Sun,
} from 'lucide-react';

const NAV = [
  { to: '/app/dashboard',           icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/estimator',           icon: Calculator,      label: 'New Estimate' },
  { to: '/app/estimates',           icon: Clock,           label: 'Estimate History' },
  { to: '/app/historical-projects', icon: Database,        label: 'Historical Projects' },
  { to: '/app/site-reports',        icon: ClipboardList,   label: 'Site Reports' },
];

const ROLE_LABEL = {
  admin:           'Administrator',
  qs:              'Quantity Surveyor',
  project_manager: 'Project Manager',
  client:          'Client',
};

export default function Sidebar({ onClose }) {
  const { user, logout }        = useAuth();
  const { dark, toggle: toggleDark } = useTheme();
  const navigate                = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); onClose?.(); };

  return (
    <aside className="w-64 h-screen bg-primary-900 text-white flex flex-col">
      {/* Brand */}
      <div className="px-4 py-4 border-b border-primary-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
            <Building2 size={18} />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold leading-tight">Pico Bello Projekte</p>
            <p className="text-xs text-blue-300">Estimator</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto min-h-0">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-primary-800 hover:text-white'
              }`
            }>
            <Icon size={16} className="shrink-0" />
            {label}
          </NavLink>
        ))}

        <div className="pt-3 mt-3 border-t border-primary-800">
          <NavLink to="/app/settings" onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-primary-800 hover:text-white'
              }`
            }>
            <Settings size={16} className="shrink-0" />
            Company Settings
          </NavLink>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-primary-800 shrink-0">
        <div className="px-2 py-1 mb-1.5">
          <p className="text-sm font-semibold truncate">{user?.name}</p>
          <p className="text-xs text-blue-300 truncate">{ROLE_LABEL[user?.role] ?? user?.role}</p>
        </div>
        <button onClick={toggleDark}
          className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-sm text-blue-200 hover:bg-primary-800 hover:text-white transition-colors mb-0.5">
          {dark ? <Sun size={15} /> : <Moon size={15} />}
          {dark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-sm text-blue-200 hover:bg-primary-800 hover:text-white transition-colors">
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </aside>
  );
}
