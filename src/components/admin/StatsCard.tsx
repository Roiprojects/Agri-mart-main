import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; label: string };
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  iconColor = 'text-emerald-700',
  iconBg = 'bg-emerald-50 border border-emerald-100',
}: StatsCardProps) {
  const TrendIcon =
    trend && trend.value > 0 ? TrendingUp : trend && trend.value < 0 ? TrendingDown : Minus;
  const trendColor =
    trend && trend.value > 0
      ? 'text-emerald-700'
      : trend && trend.value < 0
      ? 'text-red-600'
      : 'text-slate-500';

  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-xs p-5 flex flex-col justify-between gap-3 hover:shadow-sm transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="mt-1.5 text-2xl font-bold text-slate-900">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className={clsx('rounded-lg p-2.5 shadow-2xs', iconBg)}>
          <Icon className={clsx('h-5 w-5', iconColor)} />
        </div>
      </div>
      {trend && (
        <div className={clsx('flex items-center gap-1.5 text-xs font-medium', trendColor)}>
          <TrendIcon className="h-3.5 w-3.5" />
          <span>
            {trend.value > 0 ? '+' : ''}
            {trend.value}% {trend.label}
          </span>
        </div>
      )}
    </div>
  );
}
