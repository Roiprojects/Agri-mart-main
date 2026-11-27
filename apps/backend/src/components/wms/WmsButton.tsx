'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface WmsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  loading?: boolean;
  icon?: React.ReactNode;
}

const VARIANT_CLASSES: Record<NonNullable<WmsButtonProps['variant']>, string> = {
  primary: 'bg-[#2585be] hover:bg-[#1f72a3] text-white border border-[#1f72a3] shadow-2xs',
  secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-[#d2d6de] shadow-2xs',
  success: 'bg-[#00a65a] hover:bg-[#008d4c] text-white border border-[#008d4c] shadow-2xs',
  danger: 'bg-[#dd4b39] hover:bg-[#c23321] text-white border border-[#c23321] shadow-2xs',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 border border-transparent',
};

const SIZE_CLASSES: Record<NonNullable<WmsButtonProps['size']>, string> = {
  sm: 'px-2.5 py-1 text-xs rounded',
  md: 'px-3 py-1.5 text-xs rounded',
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
      className={`inline-flex items-center justify-center gap-1.5 font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : icon}
      {children}
    </button>
  );
}
