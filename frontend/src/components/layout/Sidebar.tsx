'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Truck,
  AlertTriangle,
  ClipboardList,
  ShoppingBag,
  Users,
  LogOut,
  Menu,
  X,
  Warehouse,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/inventory', label: 'Inventory', icon: Package },
  { href: '/shipments', label: 'Shipments', icon: Truck },
  { href: '/defects', label: 'Defects', icon: AlertTriangle },
  { href: '/audit', label: 'Audit Trail', icon: ClipboardList, adminOnly: true },
  { href: '/ebay', label: 'eBay Listings', icon: ShoppingBag, adminOnly: true },
  { href: '/users', label: 'Users', icon: Users, adminOnly: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleItems = navItems.filter((item) => !item.adminOnly || user?.role === 'admin');

  const NavContent = () => (
    <>
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-slate-700">
        <div className="p-1.5 bg-brand-600 rounded-lg">
          <Warehouse className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-tight">Warehouse HQ</p>
          <p className="text-xs text-slate-400">Inventory System</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-700 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-slate-700">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs font-medium text-white truncate">{user?.name}</p>
          <p className="text-xs text-slate-400 truncate">{user?.employeeId} · {user?.role}</p>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800 text-white lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 flex flex-col transition-transform duration-300 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <NavContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-slate-800">
        <NavContent />
      </aside>
    </>
  );
}
