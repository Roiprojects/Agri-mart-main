'use client';

import React, { useState } from 'react';
import { generateFarmerRecommendations, QuestionnaireInput, RecommendationResult } from '@/lib/ai-recommendation';
import ProductCard from '@/components/shop/ProductCard';
import { Sparkles, CheckCircle2, Bot, ArrowRight, ShieldCheck, ShoppingCart, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AIAdvisoryPage() {
  const [formData, setFormData] = useState<QuestionnaireInput>({
    crop: 'Sugarcane',
    soilType: 'Red & Yellow',
    acreage: 4.5,
    farmingStage: 3,
    pestProblems: 'Stem borer & shoot borer',
    irrigationMethod: 'Drip',
    budgetRange: 'MEDIUM',
    location: 'Mandya, Karnataka',
    objective: 'Maximum sugar recovery & organic soil health',
  });

  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(() =>
    generateFarmerRecommendations({
      crop: 'Sugarcane',
      soilType: 'Red & Yellow',
      acreage: 4.5,
      farmingStage: 3,
      pestProblems: 'Stem borer & shoot borer',
      irrigationMethod: 'Drip',
      budgetRange: 'MEDIUM',
      location: 'Mandya, Karnataka',
      objective: 'Maximum sugar recovery & organic soil health',
    })
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setTimeout(() => {
      const results = generateFarmerRecommendations(formData);
      setRecommendations(results);
      setIsAnalyzing(false);
    }, 450);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-agri-dark via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-4 border border-emerald-900/40">
        <div className="inline-flex items-center gap-1.5 bg-agri-yellow text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
          <Sparkles className="w-3.5 h-3.5" /> Google Gemini AI Recommendation Engine
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
          Intelligent AI Crop & Machinery Advisory
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
          Answer 9 questions about your field, soil, and crop stage. Our agronomy algorithm generates
          targeted fertilizer schedules, pest control recipes, and acreage-sized machinery recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 9-Point Questionnaire Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-agri-border shadow-sm p-6 space-y-4 text-xs">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bot className="w-4 h-4 text-agri-green" />
            9-Point Farmer Questionnaire
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4">
            {/* 1. Crop */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">1. What crop are you growing? *</label>
              <select
                value={formData.crop}
                onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none transition-colors duration-150"
              >
                <option value="Paddy">Paddy / Rice</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Cotton">Cotton</option>
                <option value="Maize">Maize</option>
                <option value="Tomato">Tomato & Vegetables</option>
                <option value="Arecanut">Arecanut</option>
                <option value="Coffee">Coffee</option>
              </select>
            </div>

            {/* 2. Soil Type */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">2. Soil Type *</label>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none transition-colors duration-150"
              >
                <option value="Red & Yellow">Red & Yellow Loam (Typical Karnataka)</option>
                <option value="Black/Regur">Black Cotton Soil (Deep & Heavy)</option>
                <option value="Alluvial">Alluvial River Basin</option>
                <option value="Laterite">Laterite (Coastal & Malnad)</option>
                <option value="Sandy Loam">Sandy Loam</option>
              </select>
            </div>

            {/* 3. Acreage */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">3. Farm Size (Acres) *</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={formData.acreage}
                onChange={(e) => setFormData({ ...formData, acreage: parseFloat(e.target.value) || 1 })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none transition-colors duration-150"
              />
            </div>

            {/* 4. Current Farming Stage */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">4. Current Farming Stage (1 - 7) *</label>
              <select
                value={formData.farmingStage}
                onChange={(e) => setFormData({ ...formData, farmingStage: parseInt(e.target.value) || 1 })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none transition-colors duration-150"
              >
                <option value="1">Stage 1: Preparation of Soil</option>
                <option value="2">Stage 2: Sowing & Seedling</option>
                <option value="3">Stage 3: Manure & Fertilizers (Vegetative)</option>
                <option value="4">Stage 4: Irrigation & Moisture Management</option>
                <option value="5">Stage 5: Protection from Weeds & Pests</option>
                <option value="6">Stage 6: Harvesting & Mechanized Cutting</option>
                <option value="7">Stage 7: Storage & Post-Harvest</option>
              </select>
            </div>

            {/* 5. Pest Problems */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">5. Observed Pest / Disease Symptoms</label>
              <input
                type="text"
                value={formData.pestProblems}
                onChange={(e) => setFormData({ ...formData, pestProblems: e.target.value })}
                placeholder="e.g. Yellow leaf spots, stem borer, whitefly..."
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none transition-colors duration-150"
              />
            </div>

            {/* 6. Irrigation Method */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">6. Irrigation Method *</label>
              <select
                value={formData.irrigationMethod}
                onChange={(e) => setFormData({ ...formData, irrigationMethod: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none transition-colors duration-150"
              >
                <option value="Drip">Drip Irrigation</option>
                <option value="Sprinkler">Sprinkler / Rain Gun</option>
                <option value="Flood">Borewell Flood / Furrow</option>
                <option value="Rain Fed">Rain-Fed (Monsoon dependent)</option>
              </select>
            </div>

            {/* 7. Budget */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">7. Budget Range</label>
              <div className="grid grid-cols-3 gap-2">
                {(['LOW', 'MEDIUM', 'HIGH'] as const).map((b) => (
                  <button
                    type="button"
                    key={b}
                    onClick={() => setFormData({ ...formData, budgetRange: b })}
                    className={`py-2 rounded-xl border text-center font-bold transition-all duration-150 ${
                      formData.budgetRange === b
                        ? 'bg-agri-green text-white border-agri-green shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* 8. Location */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">8. Location / Region *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none transition-colors duration-150"
              />
            </div>

            {/* 9. Objective */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">9. Farming Objective</label>
              <input
                type="text"
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none transition-colors duration-150"
              />
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full bg-agri-green hover:bg-agri-green-dark text-white font-extrabold text-xs py-3.5 rounded-xl shadow-xs transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-98"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-agri-yellow" />
                  <span>Analyzing Field Parameters...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-agri-yellow" />
                  <span>Generate AI Recommendations</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* AI Recommendations Output Area */}
        <div className="lg:col-span-7 space-y-6">
          {isAnalyzing ? (
            <div className="bg-white rounded-3xl border border-agri-border p-12 text-center space-y-4 animate-gentlePulse shadow-subtle">
              <div className="w-14 h-14 rounded-2xl bg-agri-pale text-agri-green mx-auto flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-agri-green" />
              </div>
              <h4 className="font-extrabold text-base text-slate-900">
                Evaluating Soil Carbon, Crop Phenology & Agronomy Rules...
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Applying UAS Dharwad fertilizer splits and mechanized equipment recommendations for{' '}
                <strong>{formData.crop}</strong> in <strong>{formData.location}</strong>.
              </p>
            </div>
          ) : recommendations ? (
            <div className="space-y-6 animate-fadeSlideUp">
              {/* Summary Box */}
              <div className="bg-agri-pale/80 rounded-3xl border border-emerald-200/80 p-6 sm:p-8 space-y-4 shadow-subtle">
                <div className="flex items-center gap-2 text-agri-green-dark font-extrabold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-agri-green" /> AI Agronomy Diagnosis
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {recommendations.summary}
                </h3>

                <div className="space-y-2 pt-3 border-t border-emerald-200/60 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {recommendations.agronomistAdvice.map((advice, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-agri-green font-bold">&bull;</span>
                      <span>{advice}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Power Combo Deal */}
              {recommendations.recommendedCombos.map((combo, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border-2 border-agri-yellow/60 p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      Recommended Combo Package
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      Save ₹{combo.savings.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">{combo.title}</h4>
                    <p className="text-xs text-slate-600 mt-1">{combo.description}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400 line-through">
                        ₹{combo.originalPrice.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xl font-black text-slate-900">
                        ₹{combo.bundlePrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <Link
                      href="/cart"
                      className="bg-agri-green hover:bg-agri-green-dark text-white font-bold text-xs px-5 py-3 rounded-xl transition flex items-center gap-1.5 shadow-xs"
                    >
                      <ShoppingCart className="w-4 h-4" /> Add Combo to Cart
                    </Link>
                  </div>
                </div>
              ))}

              {/* Product Cards */}
              {(() => {
                const combinedProducts = [
                  ...recommendations.fertilizers,
                  ...recommendations.pestProtection,
                  ...recommendations.equipment,
                ];
                return (
                  <div className="space-y-3">
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Recommended Equipment &amp; Bio-Inputs ({combinedProducts.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {combinedProducts.map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
