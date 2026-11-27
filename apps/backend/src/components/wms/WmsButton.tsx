'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface WmsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  loading?: boolean;
  icon?: React.ReactNode;
}

const VARIANT_CLASSES: Record<NonNullable<WmsButtonProps['variant']>, string> = {
  primary: 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/40 shadow-sm',
  secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700',
  ghost: 'bg-transparent hover:bg-slate-800/70 text-slate-300 border border-transparent',
  danger: 'bg-rose-700 hover:bg-rose-600 text-white border border-rose-500/40',
};

const SIZE_CLASSES: Record<NonNullable<WmsButtonProps['size']>, string> = {
  sm: 'px-2.5 py-1.5 text-xs rounded-lg',
  md: 'px-3.5 py-2 text-xs rounded-lg',
};

export function WmsButton({
  variant = 'secondary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: WmsButtonProps) {
  return (
    <button
      type={props.type || 'button'}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-1.5 font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : icon}
      {children}
    </button>
  );
}
