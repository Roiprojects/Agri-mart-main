'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { WmsButton } from './WmsButton';

interface WmsErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function WmsErrorState({ message, onRetry }: WmsErrorStateProps) {
  return (
    <div className="bg-rose-950/30 border border-rose-500/40 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-rose-200">Unable to load WMS data</h3>
          <p className="text-xs text-rose-300/80 mt-0.5">{message}</p>
        </div>
      </div>
      {onRetry && (
        <WmsButton variant="danger" size="sm" onClick={onRetry} icon={<RefreshCw className="w-3.5 h-3.5" />}>
          Retry
        </WmsButton>
      )}
    </div>
  );
}
