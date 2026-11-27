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
    <div className="bg-rose-50 border border-rose-300 rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-[#dd4b39] shrink-0 mt-0.5" />
        <div>
          <h3 className="text-xs font-semibold text-rose-800">Unable to load WMS data</h3>
          <p className="text-xs text-rose-700 mt-0.5">{message}</p>
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
