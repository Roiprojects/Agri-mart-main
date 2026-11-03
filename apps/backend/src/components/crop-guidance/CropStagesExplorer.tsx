'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Tractor, X } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';

export interface StageDetailItem {
  id: number;
  title: string;
  checklistTitle?: string;
  subtitle: string;
  summary: string;
  keyActions: string[];
  recommendedTools: string[];
  recommendedProducts?: any[];
}

interface CropStagesExplorerProps {
  stages: StageDetailItem[];
  allProducts: any[];
}

export default function CropStagesExplorer({
  stages,
  allProducts,
}: CropStagesExplorerProps) {
  const [selectedStageId, setSelectedStageId] = useState<number>(
    stages[0]?.id ?? 1
  );

  const selectedStage =
    stages.find((s) => s.id === selectedStageId) || stages[0] || null;
  const stageProducts = selectedStage
    ? allProducts
        .filter((p) => Array.isArray(p.cropStages) && p.cropStages.includes(selectedStage.id))
        .slice(0, 2)
    : [];

  return (
    <div className="space-y-6">
      {/* Quick Navigation: 7 Stages of Agricultural Production */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Quick Navigation: {stages.length} Stages of Agricultural Production
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
          {stages.map((stage) => {
            const isSelected = selectedStage?.id === stage.id;
            const shortLabel = stage.title.includes(': ')
              ? stage.title.split(': ')[1]
              : stage.title;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setSelectedStageId(stage.id)}
                className={`p-2.5 rounded-xl border font-semibold transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 hover:bg-emerald-50 border-slate-200 hover:border-emerald-500/40 text-slate-800 hover:text-emerald-800'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                    isSelected
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-700 text-white'
                  }`}
                >
                  {stage.id}
                </span>
                <span className="line-clamp-1">{shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Opened Stage Detail Card (Only visible when a stage button is clicked) */}
      {selectedStage && (
        <div
          id={`stage-${selectedStage.id}`}
          className="bg-white rounded-3xl border-2 border-emerald-600/40 p-6 sm:p-8 shadow-md space-y-6 transition animate-fadeIn"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                  Stage {selectedStage.id}
                </span>
                <span className="text-xs text-slate-600 font-semibold">Standard POP</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {selectedStage.title}
              </h3>
              <div className="text-xs sm:text-sm font-bold text-emerald-700 mt-0.5">
                {selectedStage.subtitle}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={`/shop?stage=${selectedStage.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900"
              >
                View Stage {selectedStage.id} Products <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">{selectedStage.summary}</p>

          {/* Key Agronomy Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Agronomist Action Checklist
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-800">
                {selectedStage.keyActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <Tractor className="w-4 h-4 text-emerald-700" /> Mechanized Tools &amp; Equipment
              </h4>
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedStage.recommendedTools.map((tool, i) => (
                  <span
                    key={i}
                    className="bg-white text-slate-900 text-xs px-3 py-1.5 rounded-xl font-semibold border border-emerald-200 shadow-xs"
                  >
                    {tool}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-emerald-200">
                <div className="text-xs text-slate-700 font-medium">
                  Need tractor or operator assistance for this stage?
                </div>
                <Link
                  href="/services"
                  className="inline-block text-xs font-bold text-emerald-700 hover:underline mt-1"
                >
                  Book Stage {selectedStage.id} Mechanization Services &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Recommended Products for this stage */}
          {stageProducts.length > 0 && (
            <div className="pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                Recommended Inputs for Stage {selectedStage.id}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stageProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
