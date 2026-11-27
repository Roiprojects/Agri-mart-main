'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';

export function WmsLoadingState({ label = 'Loading module...' }: { label?: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 flex flex-col items-center justify-center gap-3 text-slate-300">
      <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
      <p className="text-xs font-medium text-slate-400">{label}</p>
    </div>
  );
}
