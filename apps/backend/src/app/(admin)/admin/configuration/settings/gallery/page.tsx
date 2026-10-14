'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Save,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  ArrowLeft,
  Settings,
  Camera,
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

export default function GallerySettingsPage() {
  const [isAdvanced, setIsAdvanced] = useState(true);

  // Collapsible cards
  const [commonOpen, setCommonOpen] = useState(true);
  const [metadataOpen, setMetadataOpen] = useState(true);

  // Card 1: Common Settings
  const [enabled, setEnabled] = useState(true);
  const [pageSize, setPageSize] = useState<number | string>(12);
  const [allowLightbox, setAllowLightbox] = useState(true);
  const [enableCategories, setEnableCategories] = useState(true);

  // Card 2: Metadata & Display
  const [showPhotographer, setShowPhotographer] = useState(true);
  const [showLocation, setShowLocation] = useState(true);
  const [showLicense, setShowLicense] = useState(true);

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
        const res = await fetch('/api/admin/settings/gallery');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const d = json.data;
            if (d.enabled !== undefined) setEnabled(d.enabled);
            if (d.pageSize !== undefined) setPageSize(d.pageSize);
            if (d.allowLightbox !== undefined) setAllowLightbox(d.allowLightbox);
            if (d.enableCategories !== undefined) setEnableCategories(d.enableCategories);
            if (d.showPhotographer !== undefined) setShowPhotographer(d.showPhotographer);
            if (d.showLocation !== undefined) setShowLocation(d.showLocation);
            if (d.showLicense !== undefined) setShowLicense(d.showLicense);
          }
        }
      } catch {
        showToast('Error loading gallery settings', 'error');
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (stayOnPage = false) => {
    try {
      setSaving(true);
      const payload = {
        enabled,
        pageSize: Number(pageSize) || 12,
        allowLightbox,
        enableCategories,
        showPhotographer,
        showLocation,
        showLicense,
      };

      const res = await fetch('/api/admin/settings/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        showToast('Gallery settings saved successfully', 'success');
      } else {
        showToast(json.message || 'Failed to save gallery settings', 'error');
      }
    } catch {
      showToast('Network error saving gallery settings', 'error');
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
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-normal text-[#333333]">Gallery settings</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Link
                href="/admin/content/gallery"
                className="text-xs text-[#3c8dbc] hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" /> back to gallery photographs list
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
                <HelpTooltip text="Check to enable Agricultural Gallery showcase on the storefront (/gallery)." />
                <span>Gallery enabled</span>
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

            {/* Photos page size */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
              <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-1.5 text-right font-medium text-[#333]">
                <HelpTooltip text="Number of photographs displayed per page on the gallery grid." />
                <span>Photos per page</span>
              </div>
              <div className="md:col-span-8">
                <input
                  type="number"
                  min="4"
                  max="60"
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                  className="w-24 h-8 px-2.5 text-xs bg-white border border-[#d2d6de] rounded focus:border-[#3c8dbc] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Allow Lightbox */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
              <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-1.5 text-right font-medium text-[#333]">
                <HelpTooltip text="Enable full-screen lightbox modal and slideshow on photograph click." />
                <span>Allow lightbox zoom & viewer</span>
              </div>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={allowLightbox}
                  onChange={(e) => setAllowLightbox(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Enable Category Filter Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
              <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-1.5 text-right font-medium text-[#333]">
                <HelpTooltip text="Display category filter tabs above the photo grid." />
                <span>Show category filter tabs</span>
              </div>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={enableCategories}
                  onChange={(e) => setEnableCategories(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card 2: Metadata & Attribution */}
      {isAdvanced && (
        <div className="bg-white border border-[#d2d6de] rounded shadow-2xs">
          <div
            className="flex items-center justify-between px-4 py-3 bg-[#f9fafc] border-b border-[#f4f4f4] cursor-pointer select-none"
            onClick={() => setMetadataOpen(!metadataOpen)}
          >
            <div className="flex items-center gap-2 font-semibold text-[#444444] text-sm">
              <Camera className="w-4 h-4 text-[#3c8dbc]" />
              <span>Photograph Metadata & Credits</span>
            </div>
            <button type="button" className="text-[#999999] hover:text-[#444444]">
              {metadataOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>

          {metadataOpen && (
            <div className="p-4 sm:p-6 space-y-4">
              {/* Show Photographer */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
                <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-1.5 text-right font-medium text-[#333]">
                  <HelpTooltip text="Display photographer name on photos and inside the lightbox." />
                  <span>Display photographer credits</span>
                </div>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={showPhotographer}
                    onChange={(e) => setShowPhotographer(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Show Location */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
                <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-1.5 text-right font-medium text-[#333]">
                  <HelpTooltip text="Display field location (e.g., Karnataka, India)." />
                  <span>Display location badge</span>
                </div>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={showLocation}
                    onChange={(e) => setShowLocation(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Show License */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
                <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-1.5 text-right font-medium text-[#333]">
                  <HelpTooltip text="Display licensing information (e.g. Unsplash commercial license)." />
                  <span>Display license info</span>
                </div>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={showLicense}
                    onChange={(e) => setShowLicense(e.target.checked)}
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
