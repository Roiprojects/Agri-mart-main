import { clsx } from 'clsx';

type BadgeVariant =
  | 'PLACED' | 'CONFIRMED' | 'PACKED' | 'DISPATCHED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
  | 'PENDING' | 'PAID' | 'FAILED'
  | 'PENDING_APPROVAL' | 'APPROVED' | 'ACTIVE' | 'RETURNED_ON_TIME' | 'RETURNED_LATE' | 'RETURNED_DAMAGED'
  | 'REQUESTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED'
  | 'APPROVED_REVIEW' | 'REJECTED'
  | 'PUBLISHED' | 'DRAFT'
  | 'IN_WARRANTY' | 'OUT_OF_WARRANTY'
  | string;

const variantStyles: Record<string, string> = {
  // Order statuses
  PLACED: 'bg-blue-50 text-blue-700 border-blue-200',
  CONFIRMED: 'bg-sky-50 text-sky-700 border-sky-200',
  PACKED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  DISPATCHED: 'bg-purple-50 text-purple-700 border-purple-200',
  OUT_FOR_DELIVERY: 'bg-amber-50 text-amber-700 border-amber-200',
  DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
  REFUNDED: 'bg-pink-50 text-pink-700 border-pink-200',
  // Payment
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  PAID: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  FAILED: 'bg-rose-50 text-rose-700 border-rose-200',
  // Rental
  PENDING_APPROVAL: 'bg-amber-50 text-amber-700 border-amber-200',
  APPROVED: 'bg-sky-50 text-sky-700 border-sky-200',
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  RETURNED_ON_TIME: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  RETURNED_LATE: 'bg-orange-50 text-orange-700 border-orange-200',
  RETURNED_DAMAGED: 'bg-red-50 text-red-700 border-red-200',
  // Service
  REQUESTED: 'bg-blue-50 text-blue-700 border-blue-200',
  ASSIGNED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  IN_PROGRESS: 'bg-purple-50 text-purple-700 border-purple-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  // Reviews
  APPROVED_REVIEW: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
  // Content
  PUBLISHED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  DRAFT: 'bg-slate-100 text-slate-600 border-slate-200',
  // Warranty
  IN_WARRANTY: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  OUT_OF_WARRANTY: 'bg-slate-100 text-slate-600 border-slate-200',
};

const defaultStyle = 'bg-slate-100 text-slate-600 border-slate-200';

interface StatusBadgeProps {
  status: BadgeVariant;
  label?: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
  const style = variantStyles[status] ?? defaultStyle;
  const displayLabel = label ?? status.replace(/_/g, ' ');

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        style
      )}
    >
      {displayLabel}
    </span>
  );
}
