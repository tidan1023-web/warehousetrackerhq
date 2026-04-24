'use client';

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

export default function DashboardPage() {
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

      <div className="p-6 space-y-6">
        {/* Critical Alerts */}
        {(stats?.criticalDefects > 0 || alerts?.itemsNeedingAttention?.length > 0) && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-800">Attention Required</p>
              <p className="text-sm text-red-700 mt-0.5">
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Products" value={stats?.totalProducts ?? 0} icon={Package} />
          <StatsCard title="Pending" value={stats?.pendingProducts ?? 0} icon={Clock} variant="warning" />
          <StatsCard title="Verified" value={stats?.verifiedProducts ?? 0} icon={CheckCircle} variant="success" />
          <StatsCard title="Dispatched" value={stats?.dispatchedProducts ?? 0} icon={Truck} />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Images Uploaded" value={stats?.imagesUploadedProducts ?? 0} icon={TrendingUp} variant="info" />
          <StatsCard title="Defective" value={stats?.defectiveProducts ?? 0} icon={XCircle} variant="danger" />
          <StatsCard title="Open Defects" value={stats?.openDefects ?? 0} icon={AlertTriangle} variant="danger" />
          <StatsCard title="Active Users" value={stats?.totalUsers ?? 0} icon={Users} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ready to Ship */}
          <Card>
            <CardHeader
              title="Ready to Ship"
              subtitle="Verified products awaiting dispatch"
              action={
                <Link href="/shipments" className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                  View all
                </Link>
              }
            />
            {alerts?.readyToShip?.length > 0 ? (
              <div className="space-y-2">
                {alerts.readyToShip.slice(0, 5).map((product: Product) => (
                  <Link
                    key={product._id}
                    href={`/inventory/${product._id}`}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 truncate">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.sku}</p>
                    </div>
                    <ProductStatusBadge status="verified" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 py-4 text-center">No products ready to ship</p>
            )}
          </Card>

          {/* Needs Attention */}
          <Card>
            <CardHeader
              title="Needs Attention"
              subtitle="Items with incomplete images or defects"
              action={
                <Link href="/inventory?status=pending" className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                  View all
                </Link>
              }
            />
            {alerts?.itemsNeedingAttention?.length > 0 ? (
              <div className="space-y-2">
                {alerts.itemsNeedingAttention.slice(0, 5).map((product: Product) => (
                  <Link
                    key={product._id}
                    href={`/inventory/${product._id}`}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className={`h-2 w-2 rounded-full shrink-0 ${product.status === 'defective' ? 'bg-red-500' : 'bg-amber-500'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 truncate">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.sku}</p>
                    </div>
                    <ProductStatusBadge status={product.status} />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 py-4 text-center">No items need attention</p>
            )}
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader title="Recent Activity" subtitle="Latest actions across the system" />
          <ActivityFeed logs={recentActivity || []} />
        </Card>
      </div>
    </>
  );
}
