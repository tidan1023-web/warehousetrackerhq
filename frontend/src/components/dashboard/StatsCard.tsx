import { clsx } from 'clsx';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  variant?: 'default' | 'warning' | 'success' | 'danger' | 'info';
  className?: string;
}

const variantStyles = {
  default: { card: '', icon: 'bg-slate-100 text-slate-600', value: 'text-slate-900' },
  warning: { card: '', icon: 'bg-amber-100 text-amber-600', value: 'text-amber-700' },
  success: { card: '', icon: 'bg-green-100 text-green-600', value: 'text-green-700' },
  danger: { card: 'border-red-200', icon: 'bg-red-100 text-red-600', value: 'text-red-700' },
  info: { card: '', icon: 'bg-blue-100 text-blue-600', value: 'text-blue-700' },
};

export function StatsCard({ title, value, icon: Icon, trend, variant = 'default', className }: StatsCardProps) {
  const styles = variantStyles[variant];
  return (
    <div
      className={clsx(
        'bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-start gap-4',
        styles.card,
        className
      )}
    >
      <div className={clsx('p-2.5 rounded-lg shrink-0', styles.icon)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500 truncate">{title}</p>
        <p className={clsx('text-2xl font-bold mt-0.5', styles.value)}>{value}</p>
        {trend && (
          <p className={clsx('text-xs mt-1', trend.value >= 0 ? 'text-green-600' : 'text-red-600')}>
            {trend.value >= 0 ? '+' : ''}
            {trend.value} {trend.label}
          </p>
        )}
      </div>
    </div>
  );
}
