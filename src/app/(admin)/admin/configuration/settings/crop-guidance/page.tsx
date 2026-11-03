'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Save,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  Sprout,
  ArrowLeft,
  Settings,
} from 'lucide-react';

function HelpTooltip({ text }: { text: string }) {
  return (
    <span
      title={text}
      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] font-bold cursor-help shrink-0 select-none shadow-2xs"
    >
      ?
    </span>
  );
}

export default function CropGuidanceSettingsPage() {
  const [isAdvanced, setIsAdvanced] = useState(true);

  // Collapsible cards
  const [commonOpen, setCommonOpen] = useState(true);
  const [engagementOpen, setEngagementOpen] = useState(true);

  // Card 1: Common Settings
  const [enabled, setEnabled] = useState(true);
  const [defaultCrop, setDefaultCrop] = useState('All Crops (Karnataka)');
  const [stagesCount, setStagesCount] = useState<number | string>(7);
  const [showRecommendedProducts, setShowRecommendedProducts] = useState(true);
  const [showRecommendedTools, setShowRecommendedTools] = useState(true);

  // Card 2: Engagement Settings
  const [enableAiConsultation, setEnableAiConsultation] = useState(true);
  const [enableMachineryBooking, setEnableMachineryBooking] = useState(true);
  const [allowCustomerFeedback, setAllowCustomerFeedback] = useState(true);

  // Status & Notification
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings/crop-guidance');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const d = json.data;
            if (d.enabled !== undefined) setEnabled(d.enabled);
            if (d.defaultCrop !== undefined) setDefaultCrop(d.defaultCrop);
            if (d.stagesCount !== undefined) setStagesCount(d.stagesCount);
            if (d.showRecommendedProducts !== undefined) setShowRecommendedProducts(d.showRecommendedProducts);
            if (d.showRecommendedTools !== undefined) setShowRecommendedTools(d.showRecommendedTools);
            if (d.enableAiConsultation !== undefined) setEnableAiConsultation(d.enableAiConsultation);
            if (d.enableMachineryBooking !== undefined) setEnableMachineryBooking(d.enableMachineryBooking);
            if (d.allowCustomerFeedback !== undefined) setAllowCustomerFeedback(d.allowCustomerFeedback);
          }
        }
      } catch {
        showToast('Error loading crop guidance settings', 'error');
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (stayOnPage = false) => {
    try {
      setSaving(true);
      const payload = {
        enabled,
        defaultCrop,
        stagesCount: Number(stagesCount) || 7,
        showRecommendedProducts,
        showRecommendedTools,
        enableAiConsultation,
        enableMachineryBooking,
        allowCustomerFeedback,
      };

      const res = await fetch('/api/admin/settings/crop-guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        showToast('Crop guidance settings saved successfully', 'success');
        if (!stayOnPage) {
          // Stay or navigate
        }
      } else {
        showToast(json.message || 'Failed to save settings', 'error');
      }
    } catch {
      showToast('Network error saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 pb-12 text-[#333333] text-[13px]">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded shadow-lg text-white text-xs font-semibold transition-all ${
            toast.type === 'success' ? 'bg-[#00a65a]' : 'bg-[#dd4b39]'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#f4f4f4]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded bg-emerald-50 text-emerald-600">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-normal text-[#333333]">Crop Guidance settings</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Link
                href="/admin/content/crop-guidance"
                className="text-xs text-[#3c8dbc] hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" /> back to crop guidance list
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00a65a] hover:bg-[#008d4c] text-white rounded text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Save'}
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00a65a] hover:bg-[#008d4c] text-white rounded text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Save and Continue Edit
          </button>

          {/* Advanced / Basic Switcher */}
          <div className="inline-flex items-center bg-white border border-[#d2d6de] rounded overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setIsAdvanced(false)}
              className={`px-3 py-1.5 font-medium transition cursor-pointer ${
                !isAdvanced ? 'bg-[#3c8dbc] text-white' : 'text-[#555] hover:bg-slate-50'
              }`}
            >
              Basic
            </button>
            <button
              type="button"
              onClick={() => setIsAdvanced(true)}
              className={`px-3 py-1.5 font-medium transition cursor-pointer ${
                isAdvanced ? 'bg-[#3c8dbc] text-white' : 'text-[#555] hover:bg-slate-50'
              }`}
            >
              Advanced
            </button>
          </div>
        </div>
      </div>

      {/* Card 1: Common Settings */}
      <div className="bg-white border border-[#d2d6de] rounded shadow-2xs">
        <div
          className="flex items-center justify-between px-4 py-3 bg-[#f9fafc] border-b border-[#f4f4f4] cursor-pointer select-none"
          onClick={() => setCommonOpen(!commonOpen)}
        >
          <div className="flex items-center gap-2 font-semibold text-[#444444] text-sm">
            <Settings className="w-4 h-4 text-[#3c8dbc]" />
            <span>Common settings</span>
          </div>
          <button type="button" className="text-[#999999] hover:text-[#444444]">
            {commonOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        {commonOpen && (
          <div className="p-4 sm:p-6 space-y-4">
            {/* Enabled */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
              <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-1.5 text-right font-medium text-[#333]">
                <HelpTooltip text="Check to enable Crop Guidance agronomy portal on the storefront (/crop-guidance)." />
                <span>Crop Guidance enabled</span>
              </div>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Default Crop */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
              <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-1.5 text-right font-medium text-[#333]">
                <HelpTooltip text="The default agricultural package of practices displayed to visiting farmers." />
                <span>Default crop selection</span>
              </div>
              <div className="md:col-span-8">
                <select
                  value={defaultCrop}
                  onChange={(e) => setDefaultCrop(e.target.value)}
                  className="w-full max-w-md h-8 px-2.5 text-xs bg-white border border-[#d2d6de] rounded focus:border-[#3c8dbc] focus:outline-hidden"
                >
                  <option value="All Crops (Karnataka)">All Crops (Karnataka 7-Stage Universal)</option>
                  <option value="Paddy (Rice)">Paddy (Rice - Sona Masoori / RNR)</option>
                  <option value="Cotton">Cotton (Bt Cotton - Raichur/Ballari)</option>
                  <option value="Maize">Maize (Hybrid Maize - Davanagere)</option>
                  <option value="Sugarcane">Sugarcane (Belagavi / Mandya)</option>
                  <option value="Arecanut">Arecanut & Spices (Malnad Zone)</option>
                </select>
              </div>
            </div>

            {/* Stages count */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
              <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-1.5 text-right font-medium text-[#333]">
                <HelpTooltip text="Total number of scientific stages shown in the lifecycle progress bar." />
                <span>Number of stages</span>
              </div>
              <div className="md:col-span-8">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={stagesCount}
                  onChange={(e) => setStagesCount(e.target.value)}
                  className="w-24 h-8 px-2.5 text-xs bg-white border border-[#d2d6de] rounded focus:border-[#3c8dbc] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Show recommended products */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
              <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-1.5 text-right font-medium text-[#333]">
                <HelpTooltip text="Display direct product buy links under each guidance stage." />
                <span>Show recommended products</span>
              </div>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={showRecommendedProducts}
                  onChange={(e) => setShowRecommendedProducts(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Show recommended tools */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
              <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-1.5 text-right font-medium text-[#333]">
                <HelpTooltip text="Display recommended farm machinery and implements under each stage." />
                <span>Show recommended tools</span>
              </div>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={showRecommendedTools}
                  onChange={(e) => setShowRecommendedTools(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card 2: Engagement & AI Advisory Settings */}
      {isAdvanced && (
        <div className="bg-white border border-[#d2d6de] rounded shadow-2xs">
          <div
            className="flex items-center justify-between px-4 py-3 bg-[#f9fafc] border-b border-[#f4f4f4] cursor-pointer select-none"
            onClick={() => setEngagementOpen(!engagementOpen)}
          >
            <div className="flex items-center gap-2 font-semibold text-[#444444] text-sm">
              <Sprout className="w-4 h-4 text-[#00a65a]" />
              <span>Farmer Advisory & Service Integrations</span>
            </div>
            <button type="button" className="text-[#999999] hover:text-[#444444]">
              {engagementOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>

          {engagementOpen && (
            <div className="p-4 sm:p-6 space-y-4">
              {/* Enable AI consultation */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
                <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-1.5 text-right font-medium text-[#333]">
                  <HelpTooltip text="Show button linking to the AI Crop Doctor consultation tool." />
                  <span>Enable AI consultation button</span>
                </div>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={enableAiConsultation}
                    onChange={(e) => setEnableAiConsultation(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Enable machinery booking */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
                <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-1.5 text-right font-medium text-[#333]">
                  <HelpTooltip text="Show button allowing direct on-field equipment booking from the guidance page." />
                  <span>Enable machinery booking button</span>
                </div>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={enableMachineryBooking}
                    onChange={(e) => setEnableMachineryBooking(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Allow customer feedback */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
                <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-1.5 text-right font-medium text-[#333]">
                  <HelpTooltip text="Allow farmers to request customized agronomy POP advisory packages." />
                  <span>Allow custom POP schedule requests</span>
                </div>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={allowCustomerFeedback}
                    onChange={(e) => setAllowCustomerFeedback(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
