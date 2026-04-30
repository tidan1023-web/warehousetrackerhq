'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  AlertTriangle,
  Users,
  XCircle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { ProductStatusBadge } from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { Product } from '@/types';
import Link from 'next/link';

type SectionKey = 'stats1' | 'stats2' | 'readyToShip' | 'needsAttention' | 'activity';

function SectionToggle({ label, open, onToggle }: { label: string; open: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
      aria-label={open ? `Collapse ${label}` : `Expand ${label}`}
    >
      {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      {open ? 'Collapse' : 'Expand'}
    </button>
  );
}

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState<Record<SectionKey, boolean>>({
    stats1: false,
    stats2: false,
    readyToShip: false,
    needsAttention: false,
    activity: false,
  });

  const toggle = (key: SectionKey) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getStats,
    refetchInterval: 30_000,
  });

  if (isLoading) {
    return (
      <>
        <Header title="Dashboard" />
        <div className="p-6"><PageLoader /></div>
      </>
    );
  }

  const { stats, alerts, recentActivity } = data || {};

  return (
    <>
      <Header title="Dashboard" subtitle="Real-time inventory overview" />

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Critical Alerts — always visible */}
        {(stats?.criticalDefects > 0 || alerts?.itemsNeedingAttention?.length > 0) && (
          <div className="flex items-start gap-3 p-3.5 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-800 dark:text-red-300">Attention Required</p>
              <p className="text-sm text-red-700 dark:text-red-400 mt-0.5">
                {stats?.criticalDefects > 0 && (
                  <span>{stats.criticalDefects} critical defect{stats.criticalDefects > 1 ? 's' : ''} open. </span>
                )}
                {alerts?.itemsNeedingAttention?.length > 0 && (
                  <span>{alerts.itemsNeedingAttention.length} item{alerts.itemsNeedingAttention.length > 1 ? 's' : ''} need attention.</span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Stats Row 1 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Overview</p>
            <SectionToggle label="Overview" open={!collapsed.stats1} onToggle={() => toggle('stats1')} />
          </div>
          {!collapsed.stats1 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <StatsCard title="Total Products" value={stats?.totalProducts ?? 0} icon={Package} />
              <StatsCard title="Pending" value={stats?.pendingProducts ?? 0} icon={Clock} variant="warning" />
              <StatsCard title="Verified" value={stats?.verifiedProducts ?? 0} icon={CheckCircle} variant="success" />
              <StatsCard title="Dispatched" value={stats?.dispatchedProducts ?? 0} icon={Truck} />
            </div>
          )}
        </div>

        {/* Stats Row 2 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Defects &amp; Users</p>
            <SectionToggle label="Defects & Users" open={!collapsed.stats2} onToggle={() => toggle('stats2')} />
          </div>
          {!collapsed.stats2 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <StatsCard title="Imgs Uploaded" value={stats?.imagesUploadedProducts ?? 0} icon={TrendingUp} variant="info" />
              <StatsCard title="Defective" value={stats?.defectiveProducts ?? 0} icon={XCircle} variant="danger" />
              <StatsCard title="Open Defects" value={stats?.openDefects ?? 0} icon={AlertTriangle} variant="danger" />
              <StatsCard title="Active Users" value={stats?.totalUsers ?? 0} icon={Users} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Ready to Ship */}
          <Card>
            <CardHeader
              title="Ready to Ship"
              subtitle="Verified products awaiting dispatch"
              action={
                <div className="flex items-center gap-3">
                  <Link href="/shipments" className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                    View all
                  </Link>
                  <SectionToggle label="Ready to Ship" open={!collapsed.readyToShip} onToggle={() => toggle('readyToShip')} />
                </div>
              }
            />
            {!collapsed.readyToShip && (
              alerts?.readyToShip?.length > 0 ? (
                <div className="space-y-2">
                  {alerts.readyToShip.slice(0, 5).map((product: Product) => (
                    <Link
                      key={product._id}
                      href={`/inventory/${product._id}`}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{product.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{product.sku}</p>
                      </div>
                      <ProductStatusBadge status="verified" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 dark:text-slate-500 py-4 text-center">No products ready to ship</p>
              )
            )}
          </Card>

          {/* Needs Attention */}
          <Card>
            <CardHeader
              title="Needs Attention"
              subtitle="Items with incomplete images or defects"
              action={
                <div className="flex items-center gap-3">
                  <Link href="/inventory?status=pending" className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                    View all
                  </Link>
                  <SectionToggle label="Needs Attention" open={!collapsed.needsAttention} onToggle={() => toggle('needsAttention')} />
                </div>
              }
            />
            {!collapsed.needsAttention && (
              alerts?.itemsNeedingAttention?.length > 0 ? (
                <div className="space-y-2">
                  {alerts.itemsNeedingAttention.slice(0, 5).map((product: Product) => (
                    <Link
                      key={product._id}
                      href={`/inventory/${product._id}`}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className={`h-2 w-2 rounded-full shrink-0 ${product.status === 'defective' ? 'bg-red-500' : 'bg-amber-500'}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{product.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{product.sku}</p>
                      </div>
                      <ProductStatusBadge status={product.status} />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 dark:text-slate-500 py-4 text-center">No items need attention</p>
              )
            )}
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader
            title="Recent Activity"
            subtitle="Latest actions across the system"
            action={
              <SectionToggle label="Recent Activity" open={!collapsed.activity} onToggle={() => toggle('activity')} />
            }
          />
          {!collapsed.activity && <ActivityFeed logs={recentActivity || []} />}
        </Card>
      </div>
    </>
  );
}
