'use client';

import React from 'react';
import { WmsProvider, useWmsContext } from './WmsContext';
import { WmsHeader } from './WmsHeader';
import { WmsNavBar } from './WmsNavBar';
import { WmsErrorState } from './WmsErrorState';

function WmsShellInner({ children }: { children: React.ReactNode }) {
  const { error, refreshSummary } = useWmsContext();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6">
      <div className="max-w-[1600px] mx-auto space-y-5">
        <WmsHeader />
        <WmsNavBar />
        {error && <WmsErrorState message={error} onRetry={refreshSummary} />}
        <main className="min-h-[420px]">{children}</main>
      </div>
    </div>
  );
}

export function WmsShell({ children }: { children: React.ReactNode }) {
  return (
    <WmsProvider>
      <WmsShellInner>{children}</WmsShellInner>
    </WmsProvider>
  );
}
