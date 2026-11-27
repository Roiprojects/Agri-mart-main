'use client';

import React from 'react';

interface WmsBadgeProps {
  count: number;
  active?: boolean;
}

export function WmsBadge({ count, active = false }: WmsBadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[20px] px-1.5 py-0.5 rounded text-[11px] font-semibold tabular-nums ${
        active
          ? 'bg-white/25 text-white'
          : count > 0
          ? 'bg-[#e8f4fa] text-[#2585be] border border-[#b8dcf0]'
          : 'bg-slate-100 text-slate-500 border border-slate-200'
      }`}
    >
      {count}
    </span>
  );
}
