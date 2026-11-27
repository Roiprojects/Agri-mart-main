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
    <div className="bg-white border border-[#d2d6de] rounded shadow-2xs p-8 text-center flex flex-col items-center justify-center gap-2">
      <div className="p-2.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500">
        {icon || <Inbox className="w-5 h-5" />}
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 max-w-md">{description}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
