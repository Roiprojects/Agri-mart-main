'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';

export function WmsLoadingState({ label = 'Loading data...' }: { label?: string }) {
  return (
    <div className="bg-white border border-[#d2d6de] rounded shadow-2xs p-10 flex flex-col items-center justify-center gap-2.5 text-slate-600">
      <RefreshCw className="w-5 h-5 animate-spin text-[#2585be]" />
      <p className="text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}
