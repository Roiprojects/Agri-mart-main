'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/config';
import { SEED_PRODUCTS, ProductType } from '@/lib/seed-data';
import ProductCard from '@/components/shop/ProductCard';
import { Sprout, Layers, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const CROPS = [
  { id: 'all', name: 'All Crops' },
  { id: 'Paddy', name: 'Paddy / Rice' },
  { id: 'Cotton', name: 'Cotton' },
  { id: 'Sugarcane', name: 'Sugarcane' },
  { id: 'Maize', name: 'Maize / Corn' },
  { id: 'Chili', name: 'Byadgi Chili' },
  { id: 'Groundnut', name: 'Groundnut' },
];

export default function CropStageFilter() {
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedStage, setSelectedStage] = useState<number>(3); // default Stage 3 (Vegetative)

  // Filter products by crop and stage
  const filteredProducts = SEED_PRODUCTS.filter((p) => {
    const matchesCrop = selectedCrop === 'all' || p.targetCrops.includes(selectedCrop);
    const matchesStage = p.cropStages.includes(selectedStage);
    return matchesCrop && matchesStage;
  });

  const currentStageInfo = SITE_CONFIG.cropStages.find((s) => s.id === selectedStage);

  return (
    <div className="space-y-6">
      {/* Interactive Controls Bar */}
      <div className="bg-white rounded-2xl border border-agri-border p-4 sm:p-6 shadow-sm space-y-4">
        {/* Crop Selector Tabs */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-agri-secondary mb-2 flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-agri-green" />
            <span>Select Target Crop:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CROPS.map((crop) => (
              <button
                key={crop.id}
                onClick={() => setSelectedCrop(crop.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedCrop === crop.id
                    ? 'bg-agri-green text-white shadow-xs'
                    : 'bg-agri-cream text-agri-dark hover:bg-emerald-50 border border-agri-border/80'
                }`}
              >
                <span>{crop.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 7 Crop Stages Selector Pills */}
        <div className="pt-3 border-t border-slate-100">
          <div className="text-xs font-bold uppercase tracking-wider text-agri-secondary mb-2 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-agri-green" />
            <span>Select Farming Lifecycle Stage (1 to 7):</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
            {SITE_CONFIG.cropStages.map((stage) => {
              const isSelected = selectedStage === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStage(stage.id)}
                  className={`p-2 rounded-xl text-left transition border ${
                    isSelected
                      ? 'bg-agri-pale border-agri-green text-agri-green-dark font-extrabold ring-1 ring-agri-green shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span
                      className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold ${
                        isSelected ? 'bg-agri-green text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {stage.id}
                    </span>
                    <span className="truncate text-[11px]">{stage.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Stage Banner */}
        {currentStageInfo && (
          <div className="p-3 bg-agri-cream/90 rounded-xl border border-agri-border/80 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="font-extrabold text-agri-dark">
                Stage {currentStageInfo.id}: {currentStageInfo.name}
              </span>
              <span className="text-agri-secondary ml-2">&bull; {currentStageInfo.description}</span>
            </div>
            <Link
              href={`/crop-guidance#stage-${currentStageInfo.id}`}
              className="font-bold text-agri-green hover:underline flex items-center gap-1 shrink-0"
            >
              Read POP Guide &rarr;
            </Link>
          </div>
        )}
      </div>

      {/* Filtered Products Results */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <p className="text-sm text-slate-500">
            No specific inputs listed for {selectedCrop} in Stage {selectedStage}.
          </p>
          <Link
            href="/shop"
            className="inline-block text-xs font-bold text-agri-green hover:underline"
          >
            Browse all catalogue inputs &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
