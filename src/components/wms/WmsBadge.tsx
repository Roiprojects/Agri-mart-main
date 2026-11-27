'use client';

import React from 'react';

interface WmsBadgeProps {
  count: number;
  active?: boolean;
}

export function WmsBadge({ count, active = false }: WmsBadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[20px] px-1.5 py-0.5 rounded-md text-[11px] font-semibold tabular-nums ${
        active
          ? 'bg-white/20 text-white'
          : count > 0
          ? 'bg-slate-800 text-emerald-300 border border-slate-700'
          : 'bg-slate-800/80 text-slate-400'
      }`}
    >
      {count}
    </span>
  );
}
