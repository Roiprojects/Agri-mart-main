'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Check, ChevronDown, Sparkles, X } from 'lucide-react';

interface WarehouseHub {
  pincode: string;
  name: string;
  district: string;
  hub: string;
  expressAvailable: boolean;
}

const KARNATAKA_HUBS: WarehouseHub[] = [
  { pincode: '580026', name: 'Hubballi (Tarihal)', district: 'Dharwad', hub: 'Central Dark Hub #1', expressAvailable: true },
  { pincode: '590001', name: 'Belagavi City', district: 'Belagavi', hub: 'North Dark Hub #2', expressAvailable: true },
  { pincode: '577002', name: 'Davanagere Industrial', district: 'Davanagere', hub: 'Central-South Hub #3', expressAvailable: true },
  { pincode: '581110', name: 'Haveri APMC', district: 'Haveri', hub: 'Agri-Belt Hub #4', expressAvailable: true },
  { pincode: '582101', name: 'Gadag Market', district: 'Gadag', hub: 'Hubballi Express Grid', expressAvailable: true },
  { pincode: '587101', name: 'Bagalkote Vidyanagar', district: 'Bagalkote', hub: 'Northern Reach Grid', expressAvailable: true },
];

export default function DeliveryLocationSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHub, setSelectedHub] = useState<WarehouseHub>(KARNATAKA_HUBS[0]);
  const [inputPincode, setInputPincode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('agrimart_pincode');
    if (saved) {
      const match = KARNATAKA_HUBS.find((h) => h.pincode === saved);
      if (match) setSelectedHub(match);
    }
  }, []);

  const handleSelect = (hub: WarehouseHub) => {
    setSelectedHub(hub);
    localStorage.setItem('agrimart_pincode', hub.pincode);
    setIsOpen(false);
    setErrorMsg('');
  };

  const handleCustomPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(inputPincode)) {
      setErrorMsg('Please enter a valid 6-digit PIN code.');
      return;
    }

    const match = KARNATAKA_HUBS.find((h) => h.pincode === inputPincode);
    if (match) {
      handleSelect(match);
    } else {
      const custom: WarehouseHub = {
        pincode: inputPincode,
        name: `Karnataka PIN ${inputPincode}`,
        district: 'Karnataka',
        hub: 'Hubballi Central Dispatch Grid (40-60km)',
        expressAvailable: true,
      };
      setSelectedHub(custom);
      localStorage.setItem('agrimart_pincode', inputPincode);
      setIsOpen(false);
      setErrorMsg('');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 text-left px-2.5 py-1.5 rounded-xl hover:bg-agri-cream border border-transparent hover:border-agri-border transition focus-ring text-xs group"
        title="Change delivery location"
      >
        <div className="w-7 h-7 rounded-lg bg-agri-pale text-agri-green flex items-center justify-center shrink-0 group-hover:bg-emerald-200 transition">
          <MapPin className="w-4 h-4" />
        </div>
        <div className="leading-tight">
          <span className="text-[10px] text-agri-secondary block">Deliver to:</span>
          <span className="font-extrabold text-agri-dark text-xs flex items-center gap-0.5">
            <span className="truncate max-w-[105px]">{selectedHub.name.split(' ')[0]}</span>
            <span className="text-agri-secondary font-mono text-[11px]">({selectedHub.pincode})</span>
            <ChevronDown className="w-3 h-3 text-agri-secondary ml-0.5" />
          </span>
        </div>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-agri-pale text-agri-green flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Choose Delivery Location</h3>
                  <p className="text-[11px] text-slate-500">Dark warehouse dispatch within 40-60 km</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCustomPincode} className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Enter Your Delivery PIN Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 580026"
                  value={inputPincode}
                  onChange={(e) => setInputPincode(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-agri-green focus:border-agri-green outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-agri-green hover:bg-agri-green-dark text-white text-xs font-bold rounded-xl transition shadow-xs"
                >
                  Verify
                </button>
              </div>
              {errorMsg && <p className="text-xs text-rose-600">{errorMsg}</p>}
            </form>

            {/* Quick Karnataka Hubs */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Major Karnataka Dark Hubs
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {KARNATAKA_HUBS.map((hub) => {
                  const isSelected = selectedHub.pincode === hub.pincode;
                  return (
                    <button
                      key={hub.pincode}
                      type="button"
                      onClick={() => handleSelect(hub)}
                      className={`p-2.5 rounded-xl border text-left transition flex items-start justify-between ${
                        isSelected
                          ? 'border-agri-green bg-agri-pale text-agri-green-dark font-bold ring-1 ring-agri-green'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-extrabold">{hub.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{hub.pincode} &bull; {hub.district}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-agri-green shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Hub status */}
            <div className="p-3 bg-agri-cream rounded-2xl border border-agri-border/80 text-xs text-agri-secondary space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-agri-dark">
                <Sparkles className="w-3.5 h-3.5 text-agri-yellow-dark" />
                <span>Active Dark Hub Coverage</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Orders dispatched to <strong>{selectedHub.name} ({selectedHub.pincode})</strong> are serviced via{' '}
                <strong>{selectedHub.hub}</strong> with 24 to 48-hr farm gate delivery.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
