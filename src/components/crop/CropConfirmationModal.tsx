'use client';

import React, { useState, useEffect } from 'react';
import { Sprout, Trash2, X, AlertTriangle } from 'lucide-react';

export interface CropConfirmationModalProps {
  isOpen: boolean;
  type: 'add' | 'delete';
  cropName?: string;
  showNameInput?: boolean;
  onConfirm: (customName?: string) => void;
  onCancel: () => void;
}

export default function CropConfirmationModal({
  isOpen,
  type,
  cropName,
  showNameInput = false,
  onConfirm,
  onCancel,
}: CropConfirmationModalProps) {
  const [inputCropName, setInputCropName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInputCropName('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(inputCropName.trim());
  };

  const isAdd = type === 'add';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Accent Bar */}
        <div
          className={`h-2 w-full ${
            isAdd
              ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600'
              : 'bg-gradient-to-r from-rose-500 via-red-500 to-amber-600'
          }`}
        />

        <div className="p-6 sm:p-7 space-y-5">
          {/* Header row with Icon & Close */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                  isAdd
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {isAdd ? (
                  <Sprout className="w-6 h-6 animate-pulse" />
                ) : (
                  <Trash2 className="w-6 h-6" />
                )}
              </div>
              <div>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isAdd
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-rose-100 text-rose-900'
                  }`}
                >
                  {isAdd ? 'Crop Management' : 'Remove Confirmation'}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  {isAdd ? 'Add New Crop' : 'Delete Existing Crop'}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onCancel}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Prompt Question */}
          <div className="space-y-2">
            <p className="text-base font-bold text-slate-900">
              {isAdd
                ? 'Do you want to add a new crop?'
                : 'Do you want to delete the existing crop?'}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isAdd
                ? 'Confirm to add a new crop to configure variety, acreage, planting date, and farming schedule.'
                : `Are you sure you want to remove ${
                    cropName ? `"${cropName}"` : 'this crop'
                  }? All associated variety and lifecycle settings for this crop will be removed.`}
            </p>
          </div>

          {/* Optional Name Input (e.g. for homepage quick filter) */}
          {isAdd && showNameInput && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Crop Name (Optional)
              </label>
              <input
                type="text"
                value={inputCropName}
                onChange={(e) => setInputCropName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleConfirm();
                  }
                }}
                placeholder="e.g. Tomato, Sunflower, Turmeric, Ginger"
                className="w-full px-3.5 py-2.5 text-xs text-slate-900 font-semibold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder:text-slate-400"
                autoFocus
              />
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`w-full sm:w-auto px-5 py-2.5 text-xs font-black rounded-xl text-white shadow-md transition cursor-pointer flex items-center justify-center gap-1.5 ${
                isAdd
                  ? 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/20'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
              }`}
            >
              {isAdd ? (
                <>
                  <Sprout className="w-4 h-4" />
                  <span>Yes, Add New Crop</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Yes, Delete Crop</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
