'use client';

import React from 'react';
import { Inbox } from 'lucide-react';

interface WmsEmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function WmsEmptyState({ title, description, icon, action }: WmsEmptyStateProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center flex flex-col items-center justify-center gap-2.5">
      <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400">
        {icon || <Inbox className="w-5 h-5" />}
      </div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="text-xs text-slate-400 max-w-md">{description}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
