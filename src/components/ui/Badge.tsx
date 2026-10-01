import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'golden' | 'lime' | 'pale' | 'neutral' | 'outline' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function Badge({
  children,
  className = '',
  variant = 'brand',
  size = 'md',
  dot = false,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-semibold',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
  };

  const variantStyles = {
    brand: 'bg-agri-green text-white',
    golden: 'bg-agri-yellow text-agri-dark font-bold',
    lime: 'bg-agri-lime text-agri-dark font-bold',
    pale: 'bg-agri-pale text-agri-green-dark border border-emerald-200/80',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    outline: 'bg-white text-agri-green-dark border border-agri-border font-medium',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    success: 'bg-agri-pale text-agri-green-dark border border-emerald-200/80 font-bold',
    warning: 'bg-agri-yellow text-agri-dark font-bold',
  };

  const dotColor = {
    brand: 'bg-white',
    golden: 'bg-agri-dark',
    lime: 'bg-agri-dark',
    pale: 'bg-agri-green',
    neutral: 'bg-slate-500',
    outline: 'bg-agri-green',
    danger: 'bg-rose-600',
    success: 'bg-agri-green',
    warning: 'bg-agri-dark',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full tracking-wide select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor[variant]}`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
