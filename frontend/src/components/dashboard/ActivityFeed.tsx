import { formatDistanceToNow } from 'date-fns';
import { AuditLog } from '@/types';
import { Package, User, AlertTriangle, ShoppingBag, LogIn, CheckCircle, Truck } from 'lucide-react';

const actionIcons: Record<string, React.ElementType> = {
  USER_LOGIN: LogIn,
  USER_CREATED: User,
  PRODUCT_CREATED: Package,
  PRODUCT_UPDATED: Package,
  IMAGE_UPLOADED: Package,
  PRODUCT_VERIFIED: CheckCircle,
  PRODUCT_DISPATCHED: Truck,
  DEFECT_LOGGED: AlertTriangle,
  EBAY_LISTING_CREATED: ShoppingBag,
  EBAY_LISTING_SYNCED: ShoppingBag,
};

const actionColors: Record<string, string> = {
  PRODUCT_DISPATCHED: 'bg-purple-100 text-purple-600',
  PRODUCT_VERIFIED: 'bg-green-100 text-green-600',
  DEFECT_LOGGED: 'bg-red-100 text-red-600',
  DISPATCH_BLOCKED: 'bg-red-100 text-red-600',
  EBAY_LISTING_CREATED: 'bg-blue-100 text-blue-600',
};

function actionLabel(action: string): string {
  return action
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function ActivityFeed({ logs }: { logs: AuditLog[] }) {
  if (!logs?.length) {
    return <p className="text-sm text-slate-400 py-4 text-center">No recent activity.</p>;
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => {
        const Icon = actionIcons[log.action] || Package;
        const colorClass = actionColors[log.action] || 'bg-slate-100 text-slate-600';
        return (
          <div key={log._id} className="flex items-start gap-3">
            <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${colorClass}`}>
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-800">
                <span className="font-medium">{log.userName}</span>
                <span className="text-slate-500"> ({log.employeeId})</span>
                {' — '}
                <span>{actionLabel(log.action)}</span>
              </p>
              {log.details && (log.details.sku as string) && (
                <p className="text-xs text-slate-500 mt-0.5">SKU: {log.details.sku as string}</p>
              )}
              <p className="text-xs text-slate-400 mt-0.5">
                {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
