'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { ShoppingBag, ExternalLink, RefreshCw, Link2, Link2Off } from 'lucide-react';
import { format } from 'date-fns';
import { ebayApi, productsApi } from '@/lib/api';
import { Product } from '@/types';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/LoadingSpinner';

export default function EbayPage() {
  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ['ebay-status'],
    queryFn: ebayApi.getStatus,
  });

  const { data: listedData, isLoading: listedLoading } = useQuery({
    queryKey: ['products', { ebaySynced: true }],
    queryFn: () => productsApi.list({ limit: 50 }),
    select: (data) => ({
      ...data,
      products: (data.products as Product[]).filter((p) => p.ebaySynced),
    }),
  });

  const { data: eligibleData } = useQuery({
    queryKey: ['products', { status: 'verified', ebaySynced: false }],
    queryFn: () => productsApi.list({ status: 'verified', limit: 50 }),
    select: (data) => ({
      ...data,
      products: (data.products as Product[]).filter((p) => !p.ebaySynced),
    }),
  });

  const handleConnect = async () => {
    const data = await ebayApi.getAuthUrl();
    window.location.href = data.authUrl;
  };

  const ebayConnected = statusData?.connected && !statusData?.isExpired;
  const listedProducts: Product[] = listedData?.products || [];
  const eligibleProducts: Product[] = eligibleData?.products || [];

  return (
    <>
      <Header title="eBay Listings" subtitle="Sync verified products to eBay marketplace" />

      <div className="p-6 space-y-6">
        {/* Connection Status */}
        <Card>
          <CardHeader title="eBay Connection" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${ebayConnected ? 'bg-green-100' : 'bg-slate-100'}`}>
                {ebayConnected ? (
                  <Link2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Link2Off className="h-5 w-5 text-slate-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {ebayConnected ? 'Connected to eBay' : 'Not Connected'}
                </p>
                {statusData?.expiresAt && ebayConnected && (
                  <p className="text-xs text-slate-500">
                    Token expires {format(new Date(statusData.expiresAt), 'MMM d, yyyy')}
                  </p>
                )}
                {statusData?.isExpired && (
                  <p className="text-xs text-red-600">Token expired — reconnect required</p>
                )}
              </div>
            </div>
            <Button
              variant={ebayConnected ? 'outline' : 'primary'}
              onClick={handleConnect}
              leftIcon={<ShoppingBag className="h-4 w-4" />}
            >
              {ebayConnected ? 'Reconnect' : 'Connect eBay Account'}
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Eligible for listing */}
          <Card>
            <CardHeader
              title="Ready to List"
              subtitle="Verified products not yet on eBay"
            />
            {eligibleProducts.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">No eligible products</p>
            ) : (
              <div className="space-y-2">
                {eligibleProducts.slice(0, 8).map((product) => (
                  <div key={product._id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 truncate">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.sku} · {product.images.length} images</p>
                    </div>
                    <Link href={`/inventory/${product._id}`}>
                      <Button size="sm" variant="outline" disabled={!ebayConnected}>
                        List
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Already listed */}
          <Card>
            <CardHeader
              title="Active Listings"
              subtitle={`${listedProducts.length} products on eBay`}
            />
            {listedLoading ? (
              <PageLoader />
            ) : listedProducts.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">No active eBay listings</p>
            ) : (
              <div className="space-y-2">
                {listedProducts.map((product) => (
                  <div key={product._id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900 truncate">{product.name}</p>
                        <Badge variant="green" size="sm">Listed</Badge>
                      </div>
                      <p className="text-xs text-slate-500">
                        {product.sku}
                        {product.ebaySyncedAt && ` · Listed ${format(new Date(product.ebaySyncedAt), 'MMM d, yyyy')}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {product.ebayItemId && (
                        <a
                          href={`https://www.ebay.com/itm/${product.ebayItemId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-brand-600"
                          title="View on eBay"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <Link href={`/inventory/${product._id}`}>
                        <button className="p-1.5 text-slate-400 hover:text-brand-600" title="Re-sync">
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {!ebayConnected && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-800">
              <strong>Setup required:</strong> Connect your eBay seller account to enable listing. You&apos;ll need an eBay Developer account with your App ID, Cert ID, and Dev ID configured in the backend environment.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
