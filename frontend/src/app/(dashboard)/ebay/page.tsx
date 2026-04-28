'use client';

import { useQuery } from '@tanstack/react-query';
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
import { ExportButton } from '@/components/ui/ExportButton';

export default function EbayPage() {
  const { data: statusData } = useQuery({
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

  const exportRows = listedProducts.map((p) => ({
    SKU: p.sku,
    Name: p.name,
    'eBay Item ID': p.ebayItemId || '',
    'Listed At': p.ebaySyncedAt ? format(new Date(p.ebaySyncedAt), 'yyyy-MM-dd') : '',
    Status: p.status,
  }));

  return (
    <>
      <Header
        title="eBay Listings"
        subtitle="Sync verified products to eBay marketplace"
        actions={
          listedProducts.length > 0 ? (
            <ExportButton
              rows={exportRows}
              columns={[
                { header: 'SKU', key: 'SKU' },
                { header: 'Name', key: 'Name' },
                { header: 'eBay Item ID', key: 'eBay Item ID' },
                { header: 'Listed At', key: 'Listed At' },
                { header: 'Status', key: 'Status' },
              ]}
              baseName="ebay-listings"
              title="eBay Listings Report"
            />
          ) : undefined
        }
      />

      <div className="p-4 sm:p-6 space-y-5">
        {/* Connection Status */}
        <Card>
          <CardHeader title="eBay Connection" />
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${ebayConnected ? 'bg-green-100 dark:bg-green-900/40' : 'bg-slate-100 dark:bg-slate-700'}`}>
                {ebayConnected
                  ? <Link2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  : <Link2Off className="h-5 w-5 text-slate-400 dark:text-slate-500" />}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {ebayConnected ? 'Connected to eBay' : 'Not Connected'}
                </p>
                {statusData?.expiresAt && ebayConnected && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Expires {format(new Date(statusData.expiresAt), 'MMM d, yyyy')}
                  </p>
                )}
                {statusData?.isExpired && (
                  <p className="text-xs text-red-600 dark:text-red-400">Token expired — reconnect required</p>
                )}
              </div>
            </div>
            <Button
              variant={ebayConnected ? 'outline' : 'primary'}
              onClick={handleConnect}
              leftIcon={<ShoppingBag className="h-4 w-4" />}
            >
              {ebayConnected ? 'Reconnect' : 'Connect eBay'}
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Eligible */}
          <Card>
            <CardHeader title="Ready to List" subtitle="Verified — not yet on eBay" />
            {eligibleProducts.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500 py-4 text-center">No eligible products</p>
            ) : (
              <div className="space-y-1.5">
                {eligibleProducts.slice(0, 8).map((product) => (
                  <div key={product._id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{product.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{product.sku} · {product.images.length} imgs</p>
                    </div>
                    <Link href={`/inventory/${product._id}`}>
                      <Button size="sm" variant="outline" disabled={!ebayConnected}>List</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Listed */}
          <Card>
            <CardHeader title="Active Listings" subtitle={`${listedProducts.length} on eBay`} />
            {listedLoading ? (
              <PageLoader />
            ) : listedProducts.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500 py-4 text-center">No active eBay listings</p>
            ) : (
              <div className="space-y-1.5">
                {listedProducts.map((product) => (
                  <div key={product._id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{product.name}</p>
                        <Badge variant="green" size="sm">Listed</Badge>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {product.sku}
                        {product.ebaySyncedAt && ` · ${format(new Date(product.ebaySyncedAt), 'MMM d, yyyy')}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {product.ebayItemId && (
                        <a href={`https://www.ebay.com/itm/${product.ebayItemId}`} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <Link href={`/inventory/${product._id}`}>
                        <button className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400">
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
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Setup required:</strong> Connect your eBay seller account to enable listing.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
