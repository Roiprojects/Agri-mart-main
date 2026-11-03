'use client';

import React, { useState } from 'react';
import { Save, CheckCircle2, MapPin, Calendar, Sprout, FileCheck } from 'lucide-react';

export default function CustomerDataForm() {
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState({
    // Section 26.1
    slNo: 'AM-FARM-2026-081',
    name: 'Ramesh Kumar Gowda',
    mobile: '+91 98451 90812',
    email: 'ramesh.gowda@gmail.com',
    date: '2026-09-17',
    state: 'Karnataka',
    district: 'Mandya',
    taluk: 'Mandya',
    villagePanchayat: 'Kothathi',
    address: 'Sy. No 124, Kothathi Village, Maddur Road',
    pincode: '571401',
    surveyNumber: '124/2A & 124/3',
    vleFpoNumber: 'FPO-MND-2024-089',
    acreage: '4.5',
    jobWorkLocation: 'Near Cauvery Canal Branch No. 4',
    distanceFromVle: '3.5 km',
    irrigationType: 'Drip',
    // Section 26.2
    farmOperations: ['Soil Preparation', 'Wet Weeding', 'Spraying', 'Harvesting', 'Logistics'],
    cropName: 'Sugarcane (Co 86032)',
    cropCycleDays: '360',
    popAttached: true,
    // Section 26.3 Activity Schedule
    sownDate: '2026-06-10',
    soilPrepDate: '2026-06-01',
    manuringDate: '2026-07-25',
    irrigationSchedule: 'Drip fertigation every 4 days',
    weedingSchedule: '2026-09-18 (Power Weeder pass)',
    sprayingSchedule: '2026-10-05 (Preventive borer spray)',
    maintenanceSchedule: 'Earthing up at 120 days',
    harvestingSchedule: '2027-05-15 (Targeting 60 t/ac)',
  });

  const allFarmOperations = [
    'Chaff Cutting',
    'Fodder Preparing',
    'Dry Shredding',
    'Wet Weeding',
    'Spraying',
    'Harvesting',
    'Soil Preparation',
    'Logistics',
  ];

  const handleToggleOperation = (op: string) => {
    setFormData((prev) => {
      const exists = prev.farmOperations.includes(op);
      return {
        ...prev,
        farmOperations: exists
          ? prev.farmOperations.filter((o) => o !== op)
          : [...prev.farmOperations, op],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8 text-xs">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Official Document Format</span>
          <h2 className="text-xl font-extrabold text-slate-900">CUSTOMER DATA FORM (Farmer Onboarding)</h2>
          <p className="text-slate-500 text-[11px] mt-0.5">
            Compliant with Section 26 of Agri Mart Specifications. Feeds CRM, AI Advisory, and Procurement follow-up calendars.
          </p>
        </div>
        <div className="text-right">
          <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-[11px]">
            Sl. No: {formData.slNo}
          </span>
        </div>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span className="font-semibold">Customer Data Form successfully updated and saved!</span>
        </div>
      )}

      {/* 26.1 Personal & Farm Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-900 text-emerald-800 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-700" />
          26.1 Personal & Farm Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Farmer Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
            <input
              type="text"
              required
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Id</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">VLE / FPO Number</label>
            <input
              type="text"
              value={formData.vleFpoNumber}
              onChange={(e) => setFormData({ ...formData, vleFpoNumber: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">State</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">District</label>
            <input
              type="text"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Taluk</label>
            <input
              type="text"
              value={formData.taluk}
              onChange={(e) => setFormData({ ...formData, taluk: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Village Panchayat (V.P.)</label>
            <input
              type="text"
              value={formData.villagePanchayat}
              onChange={(e) => setFormData({ ...formData, villagePanchayat: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Full Postal Address *</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Pin Code *</label>
            <input
              type="text"
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Survey Number</label>
            <input
              type="text"
              value={formData.surveyNumber}
              onChange={(e) => setFormData({ ...formData, surveyNumber: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Farm Size (Acre(s)) *</label>
            <input
              type="number"
              step="0.1"
              value={formData.acreage}
              onChange={(e) => setFormData({ ...formData, acreage: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Distance from VLE/FPO</label>
            <input
              type="text"
              value={formData.distanceFromVle}
              onChange={(e) => setFormData({ ...formData, distanceFromVle: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Job Work Location (Canal/Landmark)</label>
            <input
              type="text"
              value={formData.jobWorkLocation}
              onChange={(e) => setFormData({ ...formData, jobWorkLocation: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Irrigation Method *</label>
            <select
              value={formData.irrigationType}
              onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            >
              <option value="Well">Well</option>
              <option value="Borewell">Borewell</option>
              <option value="Rain Fed">Rain Fed</option>
              <option value="Channel">Channel / Canal</option>
              <option value="Drip">Drip Irrigation</option>
              <option value="Sprinkler">Sprinkler</option>
            </select>
          </div>
        </div>
      </div>

      {/* 26.2 Farm Operations Details */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h3 className="font-bold text-sm text-slate-900 text-emerald-800 flex items-center gap-2">
          <Sprout className="w-4 h-4 text-emerald-700" />
          26.2 Farm Operations Details
        </h3>

        <div>
          <label className="block font-semibold text-slate-700 mb-2">Job Work Operations (Select all required):</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {allFarmOperations.map((op) => {
              const checked = formData.farmOperations.includes(op);
              return (
                <button
                  type="button"
                  key={op}
                  onClick={() => handleToggleOperation(op)}
                  className={`p-2.5 rounded-lg border text-left transition flex items-center gap-2 ${
                    checked
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${checked ? 'bg-emerald-700 text-white' : 'border border-slate-300'}`}>
                    {checked && '✓'}
                  </span>
                  <span>{op}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Primary Crop Cultivated *</label>
            <input
              type="text"
              value={formData.cropName}
              onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Crop Cycle Duration (Days)</label>
            <input
              type="number"
              value={formData.cropCycleDays}
              onChange={(e) => setFormData({ ...formData, cropCycleDays: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="flex items-center gap-3 pt-5">
            <input
              type="checkbox"
              id="popAttached"
              checked={formData.popAttached}
              onChange={(e) => setFormData({ ...formData, popAttached: e.target.checked })}
              className="w-4 h-4 text-emerald-700 rounded focus:ring-emerald-600"
            />
            <label htmlFor="popAttached" className="font-semibold text-slate-700">
              POP (Package of Practices) Attached
            </label>
          </div>
        </div>
      </div>

      {/* 26.3 Crop Activity Schedule */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h3 className="font-bold text-sm text-slate-900 text-emerald-800 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-700" />
          26.3 Crop Activity Schedule (Feeds Procurement Calendar & AI Follow-ups)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Sown Date</label>
            <input
              type="date"
              value={formData.sownDate}
              onChange={(e) => setFormData({ ...formData, sownDate: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Soil Preparation Date</label>
            <input
              type="date"
              value={formData.soilPrepDate}
              onChange={(e) => setFormData({ ...formData, soilPrepDate: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Manuring Schedule</label>
            <input
              type="text"
              value={formData.manuringDate}
              onChange={(e) => setFormData({ ...formData, manuringDate: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Irrigation Schedule</label>
            <input
              type="text"
              value={formData.irrigationSchedule}
              onChange={(e) => setFormData({ ...formData, irrigationSchedule: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Weeding Schedule</label>
            <input
              type="text"
              value={formData.weedingSchedule}
              onChange={(e) => setFormData({ ...formData, weedingSchedule: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Spraying Schedule</label>
            <input
              type="text"
              value={formData.sprayingSchedule}
              onChange={(e) => setFormData({ ...formData, sprayingSchedule: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Maintenance Schedule</label>
            <input
              type="text"
              value={formData.maintenanceSchedule}
              onChange={(e) => setFormData({ ...formData, maintenanceSchedule: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Harvesting Schedule</label>
            <input
              type="text"
              value={formData.harvestingSchedule}
              onChange={(e) => setFormData({ ...formData, harvestingSchedule: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 px-6 rounded-xl shadow transition"
        >
          <Save className="w-4 h-4" />
          <span>Save Customer & Farm Profile</span>
        </button>
      </div>
    </form>
  );
}
