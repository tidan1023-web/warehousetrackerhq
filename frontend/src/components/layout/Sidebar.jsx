import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard, FolderOpen, Settings, LogOut, Building2,
  BookOpen, HardHat, Package, BarChart2, FileSpreadsheet,
  Receipt, LayoutGrid, CheckSquare, FileText, MessageSquare,
  TrendingUp, GitMerge, PieChart, ClipboardList, Users2,
  GitCompare, Moon, Sun,
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    title: 'General',
    roles: ['admin', 'qs', 'project_manager'],
    items: [
      { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/app/projects', icon: FolderOpen, label: 'Projects' },
      { to: '/app/contacts', icon: Users2, label: 'Contacts' },
    ],
  },
  {
    title: 'Pricing Libraries',
    roles: ['admin', 'qs', 'project_manager'],
    items: [
      { to: '/app/qs-pricing', icon: BookOpen, label: 'QS Prices', roles: ['admin', 'qs'] },
      { to: '/app/qs-comparison', icon: GitCompare, label: 'QS Comparison', roles: ['admin', 'qs'] },
      { to: '/app/artisan-pricing', icon: HardHat, label: 'Artisan Rates', roles: ['admin', 'qs'] },
      { to: '/app/material-pricing', icon: Package, label: 'Materials', roles: ['admin', 'qs'] },
      { to: '/app/pricing-intelligence', icon: BarChart2, label: 'Price Intelligence' },
    ],
  },
  {
    title: 'BOQ & Invoices',
    roles: ['admin', 'qs', 'project_manager'],
    items: [
      { to: '/app/boq', icon: FileSpreadsheet, label: 'BOQ Builder' },
      { to: '/app/invoices', icon: Receipt, label: 'Invoices' },
    ],
  },
  {
    title: 'Execution',
    roles: ['admin', 'qs', 'project_manager'],
    items: [
      { to: '/app/progress', icon: TrendingUp, label: 'Progress Tracker' },
      { to: '/app/change-orders', icon: GitMerge, label: 'Change Orders' },
      { to: '/app/site-reports', icon: ClipboardList, label: 'Site Reports' },
      { to: '/app/analytics', icon: PieChart, label: 'Analytics' },
    ],
  },
  {
    title: 'Client Portal',
    roles: ['client'],
    items: [
      { to: '/app/client-portal', icon: LayoutGrid, label: 'My Projects' },
      { to: '/app/client-boq', icon: CheckSquare, label: 'Review BOQ' },
      { to: '/app/client-invoices', icon: FileText, label: 'My Invoices' },
      { to: '/app/client-comments', icon: MessageSquare, label: 'Comments' },
    ],
  },
  {
    title: 'Admin',
    items: [
      { to: '/app/settings', icon: Settings, label: 'Company Settings', roles: ['admin'] },
    ],
  },
];

const ROLE_LABEL = {
  admin: 'Administrator',
  qs: 'Quantity Surveyor',
  project_manager: 'Project Manager',
  client: 'Client',
};

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  const { dark, toggle: toggleDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose?.();
  };

  const canSee = (roles) => !roles || roles.includes(user?.role);

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
            <p className="text-xs text-blue-300">Limited · BOQ System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto min-h-0">
        {NAV_SECTIONS.map((section) => {
          if (!canSee(section.roles)) return null;
          const visibleItems = section.items.filter((item) => canSee(item.roles));
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title}>
              <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider px-2 mb-0.5 mt-1">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {visibleItems.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-blue-200 hover:bg-primary-800 hover:text-white'
                      }`
                    }
                  >
                    <Icon size={15} className="shrink-0" />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-2 py-3 border-t border-primary-800 shrink-0">
        <div className="px-2 py-1 mb-1">
          <p className="text-sm font-semibold truncate">{user?.name}</p>
          <p className="text-xs text-blue-300 truncate">{ROLE_LABEL[user?.role] ?? user?.role}</p>
        </div>
        <button
          onClick={toggleDark}
          className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-md text-sm text-blue-200 hover:bg-primary-800 hover:text-white transition-colors mb-0.5"
        >
          {dark ? <Sun size={15} /> : <Moon size={15} />}
          {dark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-md text-sm text-blue-200 hover:bg-primary-800 hover:text-white transition-colors"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </aside>
  );
}
