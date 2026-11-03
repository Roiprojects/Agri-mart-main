'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/config';
import { ArrowRight, Tractor } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const STAGE_DETAILS_TIMELINE = [
  {
    id: 1,
    title: 'Preparation of Soil',
    timing: 'Pre-Sowing (30 Days)',
    action: 'Conduct 12-parameter soil health audit. Shatter hardpans using 55HP reversible ploughs.',
    tools: 'Heavy Tractors, Multi-Speed Rotavators, Gypsum',
    link: '/services/tractor-ploughing-services',
  },
  {
    id: 2,
    title: 'Sowing & Seed Treatment',
    timing: 'Onset of Monsoon',
    action: 'Bio-prime certified hybrid seeds with Trichoderma & PSB to eliminate seedling damping-off.',
    tools: 'Certified Hybrids, Bio-Consortia, Pneumatic Drills',
    link: '/categories/seeds-planting-materials',
  },
  {
    id: 3,
    title: 'Manure & Fertilizers',
    timing: '15-45 DAS (Vegetative)',
    action: 'Split nitrogen application into 3 doses. Top-dress chelated Zinc-EDTA and Boron 20%.',
    tools: 'Organic NPK Bio-Fertilizers, Micronutrients, Broadcasters',
    link: '/categories/fertilizers-soil-care',
  },
  {
    id: 4,
    title: 'Precision Irrigation',
    timing: 'Critical Growth Phases',
    action: 'Deploy drip fertigation kits to save 50% water while maintaining optimal soil field capacity.',
    tools: 'Inline Drip Systems, Solar Water Pumps, Tensiometers',
    link: '/shop',
  },
  {
    id: 5,
    title: 'Weed & Pest Protection',
    timing: '25-60 DAS',
    action: 'Mechanized inter-row rotary weeding combined with GPS drone canopy micron-spraying.',
    tools: '7HP Power Weeders, 16L Agri Drones, Neem Bio-Care',
    link: '/rentals/rent-7hp-power-weeder-ridger',
  },
  {
    id: 6,
    title: 'Harvesting Mechanization',
    timing: 'Physiological Maturity',
    action: 'Rapid field cutting with self-propelled reapers to eliminate shatter loss below 1.5%.',
    tools: 'Self-Propelled Paddy Reapers, Multi-Crop Harvesters',
    link: '/services/reaper-harvesting-services',
  },
  {
    id: 7,
    title: 'Safe Grain Storage',
    timing: 'Post-Harvest',
    action: 'Solar-dry grains to <12% moisture and seal inside multi-layer hermetic PICS grain bags.',
    tools: 'Hermetic Storage Bags, HDPE Tarpaulins, Moisture Meters',
    link: '/crop-guidance#stage-7',
  },
];

export default function CropJourneyTimeline() {
  const [activeStageId, setActiveStageId] = useState(1);
  const activeStage = STAGE_DETAILS_TIMELINE.find((s) => s.id === activeStageId) || STAGE_DETAILS_TIMELINE[0];

  const handleKeyDown = (e: React.KeyboardEvent, stageId: number) => {
    if (e.key === 'ArrowRight') {
      const next = stageId < 7 ? stageId + 1 : 1;
      setActiveStageId(next);
    } else if (e.key === 'ArrowLeft') {
      const prev = stageId > 1 ? stageId - 1 : 7;
      setActiveStageId(prev);
    }
  };

  return (
    <div className="space-y-8">
      {/* Horizontal Stepper Indicator */}
      <div className="relative">
        <div className="hidden lg:block absolute top-5 left-8 right-8 h-1 bg-slate-200 -z-0" />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 relative z-10">
          {STAGE_DETAILS_TIMELINE.map((stage) => {
            const isActive = stage.id === activeStageId;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                onKeyDown={(e) => handleKeyDown(e, stage.id)}
                aria-pressed={isActive}
                aria-label={`Select Stage ${stage.id}: ${stage.title}`}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 ease-out flex flex-col justify-between transform ${
                  isActive
                    ? 'bg-agri-pale border-agri-green text-agri-green-dark ring-2 ring-agri-green shadow-sm -translate-y-0.5'
                    : 'bg-white border-agri-border text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center transition-colors duration-200 ${
                      isActive ? 'bg-agri-green text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {stage.id}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Stage 0{stage.id}</span>
                </div>
                <div className="text-xs font-extrabold leading-tight">{stage.title}</div>
                <div className="text-[10px] text-agri-secondary mt-0.5 opacity-80">{stage.timing}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Deep-Dive Card with Smooth Animation */}
      <div
        key={activeStage.id}
        className="bg-white rounded-3xl border border-agri-border p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-fadeIn"
      >
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand" size="md">
              Stage {activeStage.id} &bull; {activeStage.timing}
            </Badge>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
            {activeStage.title} Package of Practices
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed">
            {activeStage.action}
          </p>

          <div className="p-4 bg-agri-cream rounded-2xl border border-agri-border/70 text-xs text-agri-secondary space-y-1">
            <div className="font-extrabold text-agri-dark flex items-center gap-1.5">
              <Tractor className="w-4 h-4 text-agri-green" /> Recommended Tools & Agrochemicals:
            </div>
            <div className="text-agri-green-dark font-medium">{activeStage.tools}</div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
          <Link
            href={activeStage.link}
            className="w-full text-center bg-agri-green hover:bg-agri-green-dark text-white font-bold text-xs py-3.5 px-5 rounded-xl shadow-xs transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            <span>View Stage {activeStage.id} Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href={`/crop-guidance#stage-${activeStage.id}`}
            className="w-full text-center bg-agri-pale hover:bg-emerald-100 text-agri-green-dark font-bold text-xs py-3 px-5 rounded-xl border border-emerald-200 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <span>Full Agronomy Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
