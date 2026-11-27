'use client';

import React from 'react';
import { CheckCircle2, Layers } from 'lucide-react';
import { useWmsContext } from './WmsContext';
import { WmsLoadingState } from './WmsLoadingState';
import { WmsEmptyState } from './WmsEmptyState';
import { WmsButton } from './WmsButton';

interface WmsModuleFoundationProps {
  moduleCode: string;
  title: string;
  description: string;
  countKey: keyof ReturnType<typeof useWmsContext>['counts'];
  emptyTitle?: string;
  emptyDescription?: string;
  nextStepNote: string;
}

export function WmsModuleFoundation({
  moduleCode,
  title,
  description,
  countKey,
  emptyTitle,
  emptyDescription,
  nextStepNote,
}: WmsModuleFoundationProps) {
  const { loading, counts, refreshSummary, activeLocationId } = useWmsContext();

  if (loading) {
    return <WmsLoadingState label={`Loading ${title}...`} />;
  }

  const recordCount = counts[countKey] ?? 0;

  return (
    <div className="space-y-4">
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-semibold">
              Module {moduleCode}
            </span>
            <h2 className="text-base font-semibold text-white">{title}</h2>
          </div>
          <p className="text-xs text-slate-400">{description}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-right">
            <div className="text-[10px] uppercase tracking-wider text-slate-400">
              Live Records ({activeLocationId === 'ALL' ? 'All Locations' : activeLocationId})
            </div>
            <div className="text-lg font-semibold text-emerald-400 tabular-nums">{recordCount}</div>
          </div>
        </div>
      </section>

      {recordCount === 0 && emptyTitle && emptyDescription ? (
        <WmsEmptyState
          title={emptyTitle}
          description={emptyDescription}
          action={
            <WmsButton variant="primary" size="sm" onClick={refreshSummary}>
              Refresh Live Count
            </WmsButton>
          }
        />
      ) : (
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
            <CheckCircle2 className="w-4 h-4" />
            <span>Phase 1 Application Shell Ready</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            This route is wired to the shared WMS navigation shell, active staff/location context,
            and live backend summary API (<code className="text-emerald-300">/api/warehouse/summary</code>).
          </p>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 flex items-start gap-2.5 text-xs text-slate-400">
            <Layers className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">Next Implementation Phase:</strong> {nextStepNote}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
