'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Truck, CheckCircle, Clock, Package } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { productsApi, getErrorMessage } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProductStatusBadge, ShipReadinessBadge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { PageLoader } from '@/components/ui/LoadingSpinner';

export default function ShipmentsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'verified' | 'dispatched'>('verified');
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);

  const { data: verifiedData, isLoading: loadingVerified } = useQuery({
    queryKey: ['products', { status: 'verified' }],
    queryFn: () => productsApi.list({ status: 'verified', limit: 50 }),
  });

  const { data: dispatchedData, isLoading: loadingDispatched } = useQuery({
    queryKey: ['products', { status: 'dispatched' }],
    queryFn: () => productsApi.list({ status: 'dispatched', limit: 50 }),
  });

  const verifiedProducts: Product[] = verifiedData?.products || [];
  const dispatchedProducts: Product[] = dispatchedData?.products || [];

  const handleDispatch = async () => {
    if (!dispatchingId) return;
    setIsDispatching(true);
    try {
      await productsApi.dispatch(dispatchingId, trackingNumber);
      toast.success('Product dispatched successfully');
      setDispatchingId(null);
      setTrackingNumber('');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsDispatching(false);
    }
  };

  const tabs = [
    { id: 'verified' as const, label: 'Ready to Ship', icon: CheckCircle, count: verifiedProducts.length },
    { id: 'dispatched' as const, label: 'Dispatched', icon: Truck, count: dispatchedProducts.length },
  ];

  const isLoading = loadingVerified || loadingDispatched;

  return (
    <>
      <Header title="Shipments" subtitle="Manage product dispatch and delivery" />

      <div className="p-6 space-y-4">
        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-brand-100 text-brand-700' : 'bg-slate-200 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <PageLoader />
        ) : activeTab === 'verified' ? (
          verifiedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckCircle className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No products ready to ship</p>
              <p className="text-slate-400 text-sm mt-1">Verify products in Inventory to queue them for dispatch</p>
            </div>
          ) : (
            <div className="space-y-2">
              {verifiedProducts.map((product) => {
                const assignee = product.assignedTo as { name: string; employeeId: string } | null;
                return (
                  <Card key={product._id} padding="sm">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-100 rounded-lg shrink-0">
                        <Package className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                          <span className="text-xs text-slate-400 font-mono">{product.sku}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-slate-500">{product.category}</span>
                          {assignee && (
                            <span className="text-xs text-slate-500">
                              {assignee.name} ({assignee.employeeId})
                            </span>
                          )}
                          {product.verifiedAt && (
                            <span className="text-xs text-slate-400">
                              Verified {format(new Date(product.verifiedAt), 'MMM d, yyyy')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <ShipReadinessBadge ready={true} />
                        <Link href={`/inventory/${product._id}`} className="text-xs text-brand-600 hover:underline">
                          View
                        </Link>
                        {user?.role === 'admin' && (
                          <Button
                            size="sm"
                            onClick={() => setDispatchingId(product._id)}
                            leftIcon={<Truck className="h-3.5 w-3.5" />}
                          >
                            Dispatch
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )
        ) : (
          dispatchedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Truck className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No dispatched products yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {dispatchedProducts.map((product) => {
                const dispatchedBy = product.dispatchedBy as { name: string; employeeId: string } | null;
                return (
                  <Card key={product._id} padding="sm">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-purple-100 rounded-lg shrink-0">
                        <Truck className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                          <span className="text-xs text-slate-400 font-mono">{product.sku}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                          {product.dispatchedAt && (
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(product.dispatchedAt), 'MMM d, yyyy h:mm a')}
                            </span>
                          )}
                          {dispatchedBy && (
                            <span className="text-xs text-slate-500">by {dispatchedBy.name}</span>
                          )}
                          {product.trackingNumber && (
                            <span className="text-xs font-mono text-brand-600">
                              #{product.trackingNumber}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <ProductStatusBadge status="dispatched" />
                        <Link href={`/inventory/${product._id}`} className="text-xs text-brand-600 hover:underline">
                          View
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )
        )}
      </div>

      <Modal
        isOpen={!!dispatchingId}
        onClose={() => { setDispatchingId(null); setTrackingNumber(''); }}
        title="Confirm Dispatch"
        footer={
          <>
            <Button variant="outline" onClick={() => { setDispatchingId(null); setTrackingNumber(''); }}>Cancel</Button>
            <Button onClick={handleDispatch} isLoading={isDispatching} leftIcon={<Truck className="h-4 w-4" />}>
              Confirm Dispatch
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              Dispatching:{' '}
              <strong>
                {verifiedProducts.find((p) => p._id === dispatchingId)?.name}
              </strong>
            </p>
          </div>
          <Input
            label="Tracking Number (Optional)"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="e.g. 1Z999AA1012345678"
          />
        </div>
      </Modal>
    </>
  );
}
