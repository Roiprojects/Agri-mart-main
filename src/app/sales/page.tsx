'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Target,
  Sparkles,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  PlusCircle,
  Eye,
  Building,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface SalesLead {
  id: string;
  leadNumber: string;
  customerName: string;
  mobile: string;
  village: string;
  taluk: string;
  district: string;
  leadSource: string;
  aiHistoryId?: string;
  aiDiagnosisSummary?: string;
  interestedCategory?: string;
  interestedProductTitle?: string;
  estimatedValue: number;
  stage: string;
  assignedExecutiveId: string;
  assignedExecutiveName: string;
  nextFollowUpDate?: string;
  remarks: string;
  communicationLog: { type: string; note: string; timestamp: string }[];
}

interface SalesVisit {
  id: string;
  leadNumber: string;
  farmerName: string;
  executiveName: string;
  visitDate: string;
  gpsLatitude: number;
  gpsLongitude: number;
  cropObserved: string;
  acreage: number;
  visitSummary: string;
  outcome: string;
}

interface SalesTarget {
  executiveId: string;
  executiveName: string;
  month: string;
  targetAmount: number;
  achievedAmount: number;
  leadsTarget: number;
  leadsConverted: number;
}

const LEAD_STAGES = [
  { key: 'NEW', label: 'New', color: 'bg-slate-100 text-slate-800' },
  { key: 'ASSIGNED', label: 'Assigned', color: 'bg-blue-100 text-blue-800' },
  { key: 'CONTACTED', label: 'Contacted', color: 'bg-indigo-100 text-indigo-800' },
  { key: 'INTERESTED', label: 'Interested', color: 'bg-amber-100 text-amber-800' },
  { key: 'FOLLOW_UP', label: 'Follow-up', color: 'bg-orange-100 text-orange-800' },
  { key: 'QUOTATION_SENT', label: 'Quotation Sent', color: 'bg-purple-100 text-purple-800' },
  { key: 'CONVERTED', label: 'Converted', color: 'bg-emerald-100 text-emerald-800' },
  { key: 'CLOSED', label: 'Closed', color: 'bg-rose-100 text-rose-800' },
];

export default function SalesCrmPortalPage() {
  const [leads, setLeads] = useState<SalesLead[]>([]);
  const [visits, setVisits] = useState<SalesVisit[]>([]);
  const [targets, setTargets] = useState<SalesTarget[]>([]);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'visits' | 'targets'>('pipeline');
  const [selectedExecutive, setSelectedExecutive] = useState('all');
  const [selectedLead, setSelectedLead] = useState<SalesLead | null>(null);
  const [aiModalLead, setAiModalLead] = useState<SalesLead | null>(null);
  const [visitModalLead, setVisitModalLead] = useState<SalesLead | null>(null);
  const [newLeadModal, setNewLeadModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Form states
  const [newStage, setNewStage] = useState('CONTACTED');
  const [stageRemarks, setStageRemarks] = useState('');
  const [visitGpsLat, setVisitGpsLat] = useState('12.5218');
  const [visitGpsLon, setVisitGpsLon] = useState('76.8951');
  const [visitCrop, setVisitCrop] = useState('Sugarcane');
  const [visitAcreage, setVisitAcreage] = useState('10');
  const [visitSummary, setVisitSummary] = useState('On-farm product demo conducted. Farmer expressed keen interest in 7HP weeder.');
  const [visitOutcome, setVisitOutcome] = useState('PROPOSAL_SUBMITTED');

  // New lead form
  const [newCustName, setNewCustName] = useState('');
  const [newCustMobile, setNewCustMobile] = useState('');
  const [newCustSource, setNewCustSource] = useState('FIELD_CAMP');
  const [newCustValue, setNewCustValue] = useState(35000);
  const [newCustRemarks, setNewCustRemarks] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/sales/leads?executiveId=${selectedExecutive}`);
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
        setVisits(data.visits || []);
        setTargets(data.targets || []);
      }
    } catch (err) {
      console.error('Failed to fetch CRM data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedExecutive]);

  const handleUpdateStage = async (leadId: string) => {
    try {
      const res = await fetch('/api/sales/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_STAGE',
          leadId,
          stage: newStage,
          remarks: stageRemarks || `Transitioned to ${newStage}`,
          actionType: 'CALL',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`Lead stage successfully updated to ${newStage}!`);
        setSelectedLead(null);
        setStageRemarks('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogVisit = async () => {
    if (!visitModalLead) return;
    try {
      const res = await fetch('/api/sales/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'LOG_VISIT',
          leadId: visitModalLead.id,
          leadNumber: visitModalLead.leadNumber,
          farmerName: visitModalLead.customerName,
          executiveId: visitModalLead.assignedExecutiveId,
          executiveName: visitModalLead.assignedExecutiveName,
          gpsLatitude: Number(visitGpsLat),
          gpsLongitude: Number(visitGpsLon),
          cropObserved: visitCrop,
          acreage: Number(visitAcreage),
          visitSummary,
          outcome: visitOutcome,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`Farm visit for ${visitModalLead.customerName} logged with GPS coordinates!`);
        setVisitModalLead(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/sales/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_LEAD',
          customerName: newCustName,
          mobile: newCustMobile,
          leadSource: newCustSource,
          estimatedValue: Number(newCustValue),
          remarks: newCustRemarks || 'New lead registered',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`New lead #${data.lead?.leadNumber} created!`);
        setNewLeadModal(false);
        setNewCustName('');
        setNewCustMobile('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-800 text-xs">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-[#183526] to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-emerald-900/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#B4D334] text-slate-950 uppercase tracking-wide">
            Pillar 4: Field Sales & Agronomy CRM
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1 text-white flex items-center gap-2.5">
            <Users className="w-7 h-7 text-[#F7C629]" />
            Sales CRM & Field Lead Pipeline
          </h1>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl">
            8-stage lead funnel, direct links to AI Advisory symptom histories, GPS farm visit verification, and monthly quota achievement meters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedExecutive}
            onChange={(e) => setSelectedExecutive(e.target.value)}
            className="bg-slate-900 text-[#F7C629] font-bold px-3 py-1.5 rounded-lg border border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">All Regional Field Executives</option>
            <option value="exec-01">Sunil Kumar (Mandya & South)</option>
            <option value="exec-02">Anand Patil (Kittur & Haveri)</option>
            <option value="exec-03">Priya Nayak (Belagavi Hub)</option>
          </select>
          <button
            onClick={() => setNewLeadModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm flex items-center gap-1.5 transition"
          >
            <PlusCircle className="w-3.5 h-3.5" /> New Lead
          </button>
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
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`pb-2.5 font-bold text-xs flex items-center gap-2 border-b-2 transition ${
            activeTab === 'pipeline'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" /> 8-Stage Lead Pipeline ({leads.length})
        </button>
        <button
          onClick={() => setActiveTab('visits')}
          className={`pb-2.5 font-bold text-xs flex items-center gap-2 border-b-2 transition ${
            activeTab === 'visits'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" /> GPS Farm Visits ({visits.length})
        </button>
        <button
          onClick={() => setActiveTab('targets')}
          className={`pb-2.5 font-bold text-xs flex items-center gap-2 border-b-2 transition ${
            activeTab === 'targets'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" /> Monthly Quotas & Achievements
        </button>
      </div>

      {/* TAB 1: 8-STAGE LEAD PIPELINE */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {LEAD_STAGES.map((st) => {
              const count = leads.filter((l) => l.stage === st.key).length;
              return (
                <div key={st.key} className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-sm">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">{st.label}</div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">{count}</div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider bg-slate-50">
                    <th className="py-2.5 px-3">Lead # & Source</th>
                    <th className="py-2.5 px-3">Farmer & Location</th>
                    <th className="py-2.5 px-3">Interest / Product</th>
                    <th className="py-2.5 px-3">Est. Value</th>
                    <th className="py-2.5 px-3">Current Stage</th>
                    <th className="py-2.5 px-3">Executive</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3">
                        <div className="font-extrabold text-slate-900">{lead.leadNumber}</div>
                        <span className="text-[9px] bg-slate-100 text-slate-700 font-bold px-1.5 py-0.2 rounded uppercase">
                          {lead.leadSource}
                        </span>
                        {lead.aiDiagnosisSummary && (
                          <button
                            onClick={() => setAiModalLead(lead)}
                            className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 font-bold hover:underline"
                          >
                            <Sparkles className="w-3 h-3 text-[#F7C629]" /> View AI Advisory Link
                          </button>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{lead.customerName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{lead.mobile}</div>
                        <div className="text-[10px] text-slate-400">
                          {lead.village}, {lead.taluk}
                        </div>
                      </td>

                      <td className="py-3 px-3 max-w-xs">
                        <div className="font-semibold text-slate-800 line-clamp-1">
                          {lead.interestedProductTitle || lead.interestedCategory || 'Farm Machinery'}
                        </div>
                        <div className="text-[10px] text-slate-400 italic line-clamp-1">{lead.remarks}</div>
                      </td>

                      <td className="py-3 px-3 font-black text-slate-900">
                        ₹{lead.estimatedValue.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            lead.stage === 'CONVERTED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : lead.stage === 'QUOTATION_SENT'
                              ? 'bg-purple-100 text-purple-800'
                              : lead.stage === 'INTERESTED'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {lead.stage}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-medium text-slate-700">{lead.assignedExecutiveName}</td>

                      <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setNewStage(lead.stage);
                          }}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-2 py-1 rounded text-[11px] shadow-sm transition"
                        >
                          Stage Change
                        </button>
                        <button
                          onClick={() => setVisitModalLead(lead)}
                          className="border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold px-2 py-1 rounded text-[11px] transition inline-flex items-center gap-1"
                        >
                          <MapPin className="w-3 h-3 text-slate-500" /> Log Visit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GPS FARM VISITS */}
      {activeTab === 'visits' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" />
              Verified On-Field Farm Visits with GPS Coordinates
            </h3>
            <p className="text-[11px] text-slate-500">
              Field executives capture real-time GPS locations and crop health observations on the farmer’s plot.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visits.map((v) => (
              <div key={v.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">Ref: {v.leadNumber}</span>
                    <h4 className="font-black text-sm text-slate-900">{v.farmerName}</h4>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      v.outcome === 'CLOSED_WON'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {v.outcome}
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/60 font-mono">
                  <div>📍 GPS: <strong>{v.gpsLatitude}, {v.gpsLongitude}</strong></div>
                  <div>🌾 Crop: <strong>{v.cropObserved}</strong> ({v.acreage} Acres)</div>
                  <div>📅 Date: {v.visitDate} • Exec: <strong>{v.executiveName}</strong></div>
                </div>

                <p className="text-xs text-slate-700">{v.visitSummary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TARGETS & ACHIEVEMENTS */}
      {activeTab === 'targets' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-700" />
              Monthly Sales Targets vs Achievements Meter
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {targets.map((t) => {
              const pct = Math.round((t.achievedAmount / t.targetAmount) * 100);
              return (
                <div key={t.executiveId} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{t.month}</span>
                    <span className="font-extrabold text-emerald-700 text-sm">{pct}% Achieved</span>
                  </div>
                  <h4 className="font-black text-sm text-slate-900">{t.executiveName}</h4>

                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-600 to-lime-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs font-bold pt-1">
                    <span className="text-slate-500">Achieved: ₹{t.achievedAmount.toLocaleString('en-IN')}</span>
                    <span className="text-slate-900">Target: ₹{t.targetAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 flex justify-between">
                    <span>Leads Target: {t.leadsTarget}</span>
                    <span className="font-bold text-emerald-800">Converted: {t.leadsConverted}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL 1: AI ADVISORY LINK VIEWER */}
      {aiModalLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-emerald-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-emerald-700 font-bold uppercase text-[10px]">AI Advisory Consultation Record</span>
                <h3 className="font-black text-base text-slate-900">
                  AI Crop Doctor Diagnosis: {aiModalLead.customerName}
                </h3>
              </div>
              <button onClick={() => setAiModalLead(null)} className="text-slate-400 hover:text-slate-700 text-lg">
                &times;
              </button>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4 text-[#F7C629]" />
                Automated Disease / Machinery Recommendation
              </div>
              <p className="text-slate-700 leading-relaxed">{aiModalLead.aiDiagnosisSummary}</p>
              <div className="text-[10px] text-slate-500 pt-1">
                Consultation Ref: <code>{aiModalLead.aiHistoryId || 'ai-session-live'}</code>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setAiModalLead(null)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: STAGE CHANGE & COMMUNICATION LOG */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-300">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px]">Pipeline Management</span>
                <h3 className="font-black text-base text-slate-900">
                  Update Stage for {selectedLead.customerName}
                </h3>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-slate-700 text-lg">
                &times;
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">New Pipeline Stage:</label>
                <select
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold"
                >
                  {LEAD_STAGES.map((st) => (
                    <option key={st.key} value={st.key}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">Remarks & Next Action:</label>
                <textarea
                  rows={2}
                  value={stageRemarks}
                  onChange={(e) => setStageRemarks(e.target.value)}
                  placeholder="e.g. Spoke to farmer; agreed to visit farm plot tomorrow for live tiller test."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold text-[10px] uppercase mb-1">Recent Communication Timeline:</label>
                <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px]">
                  {selectedLead.communicationLog.map((c, i) => (
                    <div key={i} className="text-slate-700">
                      <span className="font-bold text-emerald-800">[{c.type}]</span> {c.note}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStage(selectedLead.id)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-md transition"
              >
                Save Stage Transition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: LOG FARM VISIT WITH GPS */}
      {visitModalLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-300">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px]">On-Field Verification</span>
                <h3 className="font-black text-base text-slate-900">
                  Log Farm Visit for {visitModalLead.customerName}
                </h3>
              </div>
              <button onClick={() => setVisitModalLead(null)} className="text-slate-400 hover:text-slate-700 text-lg">
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">GPS Latitude:</label>
                <input
                  type="text"
                  value={visitGpsLat}
                  onChange={(e) => setVisitGpsLat(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">GPS Longitude:</label>
                <input
                  type="text"
                  value={visitGpsLon}
                  onChange={(e) => setVisitGpsLon(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">Observed Crop:</label>
                <input
                  type="text"
                  value={visitCrop}
                  onChange={(e) => setVisitCrop(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">Farm Acreage:</label>
                <input
                  type="number"
                  value={visitAcreage}
                  onChange={(e) => setVisitAcreage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">Visit Summary & Farmer Response:</label>
              <textarea
                rows={2}
                value={visitSummary}
                onChange={(e) => setVisitSummary(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">Visit Outcome:</label>
              <select
                value={visitOutcome}
                onChange={(e) => setVisitOutcome(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
              >
                <option value="FOLLOW_UP_REQUIRED">Follow-up Required</option>
                <option value="PROPOSAL_SUBMITTED">Commercial Proposal Submitted</option>
                <option value="CLOSED_WON">Closed Won (Order Executed)</option>
                <option value="CLOSED_LOST">Closed Lost</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setVisitModalLead(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleLogVisit}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-md transition"
              >
                Save Farm Visit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: CREATE NEW LEAD */}
      {newLeadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateLead} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-300">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900">Register Fresh Field Lead</h3>
              <button type="button" onClick={() => setNewLeadModal(false)} className="text-slate-400 hover:text-slate-700 text-lg">
                &times;
              </button>
            </div>

            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">Farmer / Customer Name:</label>
              <input
                type="text"
                required
                value={newCustName}
                onChange={(e) => setNewCustName(e.target.value)}
                placeholder="e.g. Veeranna Gowda"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">Mobile Number:</label>
              <input
                type="tel"
                required
                value={newCustMobile}
                onChange={(e) => setNewCustMobile(e.target.value)}
                placeholder="e.g. 9845100000"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">Lead Source:</label>
                <select
                  value={newCustSource}
                  onChange={(e) => setNewCustSource(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                >
                  <option value="FIELD_CAMP">Field Camp / Kisan Mela</option>
                  <option value="WEBSITE">Website Form</option>
                  <option value="AI_ADVISORY">AI Advisory Bot</option>
                  <option value="WHATSAPP">WhatsApp Enquiry</option>
                  <option value="REFERRAL">Farmer Referral</option>
                  <option value="TOLL_FREE">Toll-Free Helpline</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">Estimated Value (₹):</label>
                <input
                  type="number"
                  value={newCustValue}
                  onChange={(e) => setNewCustValue(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">Initial Requirement / Remarks:</label>
              <textarea
                rows={2}
                value={newCustRemarks}
                onChange={(e) => setNewCustRemarks(e.target.value)}
                placeholder="e.g. Inquired about 4-stroke brush cutter with paddy attachment."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNewLeadModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-md transition"
              >
                Create Lead
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
