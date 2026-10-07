'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tractor, Search, Filter, CheckCircle2 } from 'lucide-react';
import { useFilterYmmSettings } from '@/lib/filter-ymm-settings';

const SAMPLE_YEARS = ['2025', '2024', '2023', '2022', '2021', '2020', '2019'];
const SAMPLE_MAKES: Record<string, string[]> = {
  AgriPro: ['7HP Multi-Speed Power Weeder', 'Mini Power Tiller 3.5HP', 'Brush Cutter Pro'],
  KisanKraft: ['KK-IC-200P Power Weeder', 'KK-SPR-1201 Battery Sprayer', 'Heavy Cultivator'],
  Mahindra: ['575 DI Sarpanch', 'OJA 2127 Compact Tractor', 'Yuvo Tech+ 585'],
  'John Deere': ['5050 D 50 HP Tractor', '5310 GearPro', 'W70 Grain Harvester'],
  Kubota: ['MU4501 4WD Farm Tractor', 'B2441 Compact', 'NSP-4W Rice Transplanter'],
  Sonalika: ['DI 745 III Sikander', 'Tiger 50 DI', 'Rotavator Multi-Speed 6ft'],
};

export default function YmmFilterWidget() {
  const router = useRouter();
  const { settings } = useFilterYmmSettings();

  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  if (!settings.filterLevelEnabled || !settings.displayOnHomePage) {
    return null;
  }

  // Active levels configured in admin
  const yearLevel = settings.levels.find((l) => l.name.toLowerCase().includes('year'));
  const makeLevel = settings.levels.find((l) => l.name.toLowerCase().includes('make'));
  const modelLevel = settings.levels.find((l) => l.name.toLowerCase().includes('model'));

  const availableModels = selectedMake && SAMPLE_MAKES[selectedMake] ? SAMPLE_MAKES[selectedMake] : [];

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedYear) params.set('year', selectedYear);
    if (selectedMake) params.set('make', selectedMake);
    if (selectedModel) params.set('model', selectedModel);
    router.push(`/shop?${params.toString()}`);
  };

  const handleReset = () => {
    setSelectedYear('');
    setSelectedMake('');
    setSelectedModel('');
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/60 my-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-agri-green/20 border border-agri-green/40 rounded-2xl text-agri-yellow">
              <Tractor className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-agri-yellow bg-agri-yellow/10 px-2 py-0.5 rounded-full border border-agri-yellow/20">
                  Precision Equipment Match
                </span>
                <span className="text-[10px] text-slate-400">YMM Filter</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                Find Machinery &amp; Parts For Your Exact Farm Equipment
              </h2>
            </div>
          </div>
          {(selectedYear || selectedMake || selectedModel) && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              Reset selection
            </button>
          )}
        </div>

        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Level 1: Year */}
          {(!yearLevel || yearLevel.enabled) && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                {yearLevel?.name || '1. Select Year'}
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-600 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-agri-green cursor-pointer"
              >
                <option value="">All Equipment Years</option>
                {SAMPLE_YEARS.map((y) => (
                  <option key={y} value={y} className="bg-slate-900 text-white">
                    {y}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Level 2: Make */}
          {(!makeLevel || makeLevel.enabled) && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                {makeLevel?.name || '2. Select Make / Brand'}
              </label>
              <select
                value={selectedMake}
                onChange={(e) => {
                  setSelectedMake(e.target.value);
                  setSelectedModel('');
                }}
                className="w-full bg-slate-800/90 border border-slate-600 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-agri-green cursor-pointer"
              >
                <option value="">All Farm Brands</option>
                {Object.keys(SAMPLE_MAKES).map((make) => (
                  <option key={make} value={make} className="bg-slate-900 text-white">
                    {make}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Level 3: Model */}
          {(!modelLevel || modelLevel.enabled) && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                {modelLevel?.name || '3. Select Model / HP'}
              </label>
              <select
                value={selectedModel}
                disabled={!selectedMake}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-600 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-agri-green disabled:opacity-50 cursor-pointer"
              >
                <option value="">
                  {selectedMake ? 'Select Equipment Model' : 'First select Make'}
                </option>
                {availableModels.map((model) => (
                  <option key={model} value={model} className="bg-slate-900 text-white">
                    {model}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-agri-green hover:bg-agri-green-dark text-white font-extrabold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search Compatible Parts</span>
            </button>
          </div>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Guaranteed OEM &amp; Aftermarket fitment across 10,000+ agricultural machinery units</span>
          </div>
          <div className="text-slate-500">
            Active Filter Hierarchy: {settings.levels.filter((l) => l.enabled).map((l) => l.name).join(' → ')}
          </div>
        </div>
      </div>
    </div>
  );
}
