'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sprout,
  PhoneCall,
  Calendar,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ChevronRight,
  TrendingUp,
  Search,
  Filter,
  Check,
  MapPin,
  Leaf,
  Layers,
} from 'lucide-react';

interface FarmerProfile {
  id: string;
  userId?: string;
  farmerName: string;
  mobile: string;
  village: string;
  taluk: string;
  district: string;
  totalAcreage: number;
  soilType: string;
  primaryCrops: string[];
  currentCropStage: string;
  sowingDate: string;
  expectedHarvestDate: string;
  totalSpend: number;
  successfulOrdersCount: number;
  assignedAgronomist?: string;
  notes?: string;
}

interface FollowUp {
  id: string;
  farmerProfileId: string;
  farmerName: string;
  mobile: string;
  crop: string;
  cropStage: string;
  scheduledDate: string;
  purpose: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';
  agronomistNotes?: string;
  assignedAgronomist: string;
}

interface ProductUsage {
  id: string;
  farmerProfileId: string;
  productName: string;
  crop: string;
  quantityUsed: string;
  appliedDate: string;
  season: string;
  notes?: string;
}

const CROP_STAGES = [
  { key: 'LAND_PREPARATION', label: '1. Land Prep', color: 'bg-amber-100 text-amber-800' },
  { key: 'GERMINATION', label: '2. Germination', color: 'bg-lime-100 text-lime-800' },
  { key: 'TILLERING_VEGETATIVE', label: '3. Vegetative / Tillering', color: 'bg-emerald-100 text-emerald-800' },
  { key: 'FLOWERING', label: '4. Flowering', color: 'bg-pink-100 text-pink-800' },
  { key: 'GRAIN_FORMATION', label: '5. Grain Filling', color: 'bg-blue-100 text-blue-800' },
  { key: 'HARVEST_READY', label: '6. Harvest Ready', color: 'bg-yellow-100 text-yellow-800' },
];

export default function ProcurementPortalPage() {
  const [profiles, setProfiles] = useState<FarmerProfile[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [usageLogs, setUsageLogs] = useState<ProductUsage[]>([]);
  const [recentDemand, setRecentDemand] = useState<any[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'farmers' | 'calls' | 'demand'>('farmers');
  const [callNotesModal, setCallNotesModal] = useState<FollowUp | null>(null);
  const [agronomistNotes, setAgronomistNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [popFormsCount, setPopFormsCount] = useState<number>(0);

  const fetchData = async () => {
    try {
      const [res, popRes] = await Promise.all([
        fetch('/api/procurement/farmers'),
        fetch('/api/package-of-practice').catch(() => null),
      ]);
      const data = await res.json();
      if (data.success) {
        setProfiles(data.profiles || []);
        setFollowUps(data.followUps || []);
        setUsageLogs(data.usageLogs || []);
        setRecentDemand(data.recentDemandOrders || []);
        if (data.profiles?.length > 0 && !selectedFarmer) {
          setSelectedFarmer(data.profiles[0]);
        }
      }
      if (popRes && popRes.ok) {
        const popData = await popRes.json();
        if (popData?.records) {
          setPopFormsCount(popData.records.length);
        }
      }
    } catch (err) {
      console.error('Failed to load procurement data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStage = async (farmerId: string, newStage: string) => {
    try {
      const res = await fetch('/api/procurement/farmers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_STAGE',
          farmerProfileId: farmerId,
          stage: newStage,
          notes: `Crop stage transitioned to ${newStage} by Agronomy Procurement Team`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`Updated ${selectedFarmer?.farmerName}'s crop stage to ${newStage}`);
        fetchData();
        if (selectedFarmer && selectedFarmer.id === farmerId) {
          setSelectedFarmer({ ...selectedFarmer, currentCropStage: newStage });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteCall = async () => {
    if (!callNotesModal) return;
    try {
      const res = await fetch('/api/procurement/farmers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'COMPLETE_FOLLOWUP',
          followUpId: callNotesModal.id,
          agronomistNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`Follow-up call with ${callNotesModal.farmerName} logged & resolved!`);
        setCallNotesModal(null);
        setAgronomistNotes('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredFarmers = profiles.filter(
    (p) =>
      p.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mobile.includes(searchQuery)
  );

  const selectedFarmerUsage = usageLogs.filter((u) => u.farmerProfileId === selectedFarmer?.id);
  const selectedFarmerFollowUps = followUps.filter((f) => f.farmerProfileId === selectedFarmer?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-800 text-xs">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-[#183526] to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-emerald-900/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#B4D334] text-slate-950 uppercase tracking-wide">
            Pillar 4: Agronomy Lifecycle & Demand Procurement
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1 text-white flex items-center gap-2.5">
            <Sprout className="w-7 h-7 text-[#F7C629]" />
            Procurement & Farmer Lifecycle Command
          </h1>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl">
            Track successful order demand signals, 6-stage crop growth journeys, farmer input usage logs, and scheduled agronomist check-in calls.
          </p>
        </div>

        <div className="flex flex-nowrap items-stretch gap-3 shrink-0">
          <Link
            href="/procurement/pop-forms"
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-center transition whitespace-nowrap"
          >
            <div className="text-[10px] text-emerald-200 font-bold uppercase flex items-center justify-center gap-1">
              <FileText className="w-3 h-3" /> Submitted Farmer POP Forms
            </div>
            <div className="text-xl font-black text-[#F7C629]">{popFormsCount}</div>
          </Link>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-center whitespace-nowrap">
            <div className="text-[10px] text-emerald-200 font-bold uppercase">Active Farmers</div>
            <div className="text-xl font-black text-[#F7C629]">{profiles.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-center whitespace-nowrap">
            <div className="text-[10px] text-emerald-200 font-bold uppercase">Pending Calls</div>
            <div className="text-xl font-black text-rose-400">
              {followUps.filter((f) => f.status === 'SCHEDULED' || f.status === 'OVERDUE').length}
            </div>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-slate-500 hover:text-slate-800">
            &times;
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 gap-4 items-center">
        <button
          onClick={() => setActiveTab('farmers')}
          className={`pb-2.5 font-bold text-xs flex items-center gap-2 border-b-2 transition ${
            activeTab === 'farmers'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" /> Active Farmer Profiles & Crop Stages
        </button>
        <Link
          href="/procurement/pop-forms"
          className="pb-2.5 font-bold text-xs flex items-center gap-2 border-b-2 border-transparent text-emerald-700 hover:text-emerald-900 hover:border-emerald-500 transition"
        >
          <FileText className="w-4 h-4" /> Submitted Farmer Data & POP Forms (Separate Page) &rarr;
        </Link>
        <button
          onClick={() => setActiveTab('calls')}
          className={`pb-2.5 font-bold text-xs flex items-center gap-2 border-b-2 transition ${
            activeTab === 'calls'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <PhoneCall className="w-4 h-4" /> Agronomy Call Calendar ({followUps.length})
        </button>
        <button
          onClick={() => setActiveTab('demand')}
          className={`pb-2.5 font-bold text-xs flex items-center gap-2 border-b-2 transition ${
            activeTab === 'demand'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Demand Signals & Orders Stream
        </button>
      </div>

      {/* TAB 1: FARMER PROFILES & CROP JOURNEY */}
      {activeTab === 'farmers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Farmer List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by farmer, mobile, or village..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {filteredFarmers.map((f) => (
                <div
                  key={f.id}
                  onClick={() => setSelectedFarmer(f)}
                  className={`p-3 rounded-xl cursor-pointer transition ${
                    selectedFarmer?.id === f.id
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-950'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-extrabold text-slate-900 text-xs">{f.farmerName}</div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                      {f.totalAcreage} Acres
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" /> {f.village}, {f.taluk}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Crops: <strong className="text-slate-700">{f.primaryCrops.join(', ')}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 2 Columns: Detailed Farmer Profile & Crop Journey */}
          {selectedFarmer && (
            <div className="lg:col-span-2 space-y-6">
              {/* Farmer Bio Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">{selectedFarmer.farmerName}</h2>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>📞 {selectedFarmer.mobile}</span>
                      <span>•</span>
                      <span>📍 {selectedFarmer.village}, {selectedFarmer.taluk}, {selectedFarmer.district}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Total AgriMart Purchases</div>
                    <div className="text-base font-black text-emerald-700">
                      ₹{selectedFarmer.totalSpend.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl">
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase font-bold">Soil Composition</div>
                    <div className="font-extrabold text-slate-800 text-xs mt-0.5">{selectedFarmer.soilType}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase font-bold">Sowing Date</div>
                    <div className="font-extrabold text-slate-800 text-xs mt-0.5">{selectedFarmer.sowingDate}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase font-bold">Expected Harvest</div>
                    <div className="font-extrabold text-slate-800 text-xs mt-0.5">{selectedFarmer.expectedHarvestDate}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase font-bold">Assigned Agronomist</div>
                    <div className="font-extrabold text-emerald-800 text-xs mt-0.5">{selectedFarmer.assignedAgronomist || 'Dr. H. M. Patil'}</div>
                  </div>
                </div>

                {/* 6-Stage Crop Journey Visualizer */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                      <Leaf className="w-4 h-4 text-emerald-700" />
                      Active Crop Lifecycle Stage Tracker
                    </span>
                    <span className="text-[10px] text-slate-400">Click stage to update</span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {CROP_STAGES.map((st) => {
                      const isCurrent = selectedFarmer.currentCropStage === st.key;
                      return (
                        <button
                          key={st.key}
                          onClick={() => handleUpdateStage(selectedFarmer.id, st.key)}
                          className={`p-2 rounded-xl text-center border font-bold transition flex flex-col items-center justify-center gap-1 ${
                            isCurrent
                              ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-[10px] leading-tight">{st.label}</span>
                          {isCurrent && <Check className="w-3 h-3 text-[#F7C629]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedFarmer.notes && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                    <strong>Agronomist Field Notes:</strong> {selectedFarmer.notes}
                  </div>
                )}
              </div>

              {/* Input Usage History */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-700" />
                  Product Usage & Soil Application Ledger
                </h3>

                {selectedFarmerUsage.length === 0 ? (
                  <div className="text-slate-400 py-4 text-center">No recorded input applications yet.</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {selectedFarmerUsage.map((u) => (
                      <div key={u.id} className="py-2.5 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-slate-900">{u.productName}</div>
                          <div className="text-[10px] text-slate-400">
                            Crop: <strong>{u.crop}</strong> • Applied: {u.appliedDate} ({u.season})
                          </div>
                          {u.notes && <div className="text-[10px] text-slate-500 italic mt-0.5">{u.notes}</div>}
                        </div>
                        <div className="text-right font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                          {u.quantityUsed}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AGRONOMY CALL CALENDAR */}
      {activeTab === 'calls' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-700" />
                Scheduled Agronomy Advisory & Check-in Calls
              </h3>
              <p className="text-[11px] text-slate-500">
                Proactive outreach timed to farmer crop growth phases to maximize yield and soil conditioning.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider bg-slate-50">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Farmer & Contact</th>
                  <th className="py-2.5 px-3">Crop & Phase</th>
                  <th className="py-2.5 px-3">Consultation Purpose</th>
                  <th className="py-2.5 px-3">Agronomist</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {followUps.map((call) => (
                  <tr key={call.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{call.scheduledDate}</td>
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-slate-900">{call.farmerName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{call.mobile}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">{call.crop}</div>
                      <span className="text-[9px] bg-slate-100 text-slate-700 font-semibold px-1.5 py-0.5 rounded">
                        {call.cropStage}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs">
                      <div>{call.purpose}</div>
                      {call.agronomistNotes && (
                        <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                          ✓ Notes: {call.agronomistNotes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">{call.assignedAgronomist}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          call.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {call.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {call.status !== 'COMPLETED' && (
                        <button
                          onClick={() => setCallNotesModal(call)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-2.5 py-1 rounded text-[11px] shadow-sm transition"
                        >
                          Log Call & Advice
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DEMAND SIGNALS FROM ORDERS */}
      {activeTab === 'demand' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              Real-Time Farm Demand Signals (Successful Orders)
            </h3>
            <p className="text-[11px] text-slate-500">
              Informs procurement teams on regional seed, bio-care, and mechanization consumption patterns.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider bg-slate-50">
                  <th className="py-2 px-3">Order #</th>
                  <th className="py-2 px-3">Farmer & Location</th>
                  <th className="py-2 px-3">Items Demanded</th>
                  <th className="py-2 px-3">Fulfillment Warehouse</th>
                  <th className="py-2 px-3">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {recentDemand.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{ord.orderNumber}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold">{ord.shippingAddress?.fullName}</div>
                      <div className="text-[10px] text-slate-400">
                        {ord.shippingAddress?.taluk} ({ord.shippingAddress?.pincode})
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      {ord.items?.map((i: any, idx: number) => (
                        <div key={idx} className="text-[11px] text-slate-800">
                          • {i.productName} ({i.quantity} units)
                        </div>
                      ))}
                    </td>
                    <td className="py-2.5 px-3 text-emerald-800 font-semibold">{ord.assignedWarehouseName}</td>
                    <td className="py-2.5 px-3 font-black text-slate-900">
                      ₹{ord.totalAmount?.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CALL LOG MODAL */}
      {callNotesModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-emerald-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-emerald-700 font-bold uppercase text-[10px]">Agronomy Call Resolution</span>
                <h3 className="font-extrabold text-base text-slate-900">
                  Advisory Notes for {callNotesModal.farmerName}
                </h3>
              </div>
              <button onClick={() => setCallNotesModal(null)} className="text-slate-400 hover:text-slate-700 text-lg">
                &times;
              </button>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl space-y-1">
              <div><strong>Crop:</strong> {callNotesModal.crop} ({callNotesModal.cropStage})</div>
              <div><strong>Scheduled Purpose:</strong> {callNotesModal.purpose}</div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">Agronomist Recommendation & Advice:</label>
              <textarea
                rows={3}
                value={agronomistNotes}
                onChange={(e) => setAgronomistNotes(e.target.value)}
                placeholder="e.g. Advised 2.5ml Neem-Guard foliar spray; inspect undersides of leaves in 48 hours."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCallNotesModal(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteCall}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-md transition"
              >
                Save & Mark Completed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
