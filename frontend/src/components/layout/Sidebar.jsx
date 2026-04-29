import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FolderOpen, Settings, LogOut, Building2,
  BookOpen, HardHat, Package, BarChart2, FileSpreadsheet,
  Receipt, LayoutGrid, CheckSquare, FileText, MessageSquare,
  TrendingUp, GitMerge, PieChart,
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    title: 'General',
    roles: ['admin', 'qs', 'project_manager'],
    items: [
      { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/app/projects', icon: FolderOpen, label: 'Projects' },
    ],
  },
  {
    title: 'Pricing Libraries',
    roles: ['admin', 'qs', 'project_manager'],
    items: [
      { to: '/app/qs-pricing', icon: BookOpen, label: 'QS Prices', roles: ['admin', 'qs'] },
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
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose?.();
  };

  const canSee = (roles) => !roles || roles.includes(user?.role);

  return (
    <aside className="w-64 min-h-screen bg-primary-900 text-white flex flex-col shrink-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-primary-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shrink-0">
            <Building2 size={22} />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold">Pico Bello</p>
            <p className="text-xs text-blue-300">Projekte BOQ System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto scrollbar-hide">
        {NAV_SECTIONS.map((section) => {
          if (!canSee(section.roles)) return null;
          const visibleItems = section.items.filter((item) => canSee(item.roles));
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title}>
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider px-3 mb-1">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {visibleItems.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-blue-200 hover:bg-primary-800 hover:text-white'
                      }`
                    }
                  >
                    <Icon size={17} className="shrink-0" />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-primary-800">
        <div className="px-3 py-2 mb-1">
          <p className="text-sm font-semibold truncate">{user?.name}</p>
          <p className="text-xs text-blue-300 truncate">{ROLE_LABEL[user?.role] ?? user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-blue-200 hover:bg-primary-800 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
