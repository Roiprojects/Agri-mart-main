'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Send,
  Plus,
  Search,
  Check,
  X,
  Edit,
  Mail,
  Calendar,
  Clock,
} from 'lucide-react';

interface CampaignItem {
  id: string;
  name: string;
  subject: string;
  createdOn: string;
  dontSendBefore: string;
  targetRole: string;
  status: 'Draft' | 'Scheduled' | 'Sent';
}

const initialCampaigns: CampaignItem[] = [
  {
    id: 'camp-1',
    name: 'Kharif Pre-Monsoon Machinery Advisory',
    subject: 'Book heavy tillers and seeders before seasonal surge',
    createdOn: '2026-05-20',
    dontSendBefore: '2026-05-25 08:00',
    targetRole: 'All Farmers',
    status: 'Sent',
  },
  {
    id: 'camp-2',
    name: 'Monsoon Fungicide Special Broadcast',
    subject: 'Protect your crops with tested bio-fungicides & copper sprayers',
    createdOn: '2026-07-10',
    dontSendBefore: '2026-07-15 09:30',
    targetRole: 'Horticulture & Vegetable Growers',
    status: 'Sent',
  },
  {
    id: 'camp-3',
    name: 'Drip Irrigation Subsidy Notification',
    subject: 'Avail government aligned drip kit packages at 15% discount',
    createdOn: '2026-09-01',
    dontSendBefore: '2026-09-05 10:00',
    targetRole: 'Registered Landowners',
    status: 'Scheduled',
  },
  {
    id: 'camp-4',
    name: 'Harvest Season Drone Spraying Bookings Open',
    subject: 'Drone crop spray bookings now live across 14 districts',
    createdOn: '2026-10-01',
    dontSendBefore: '2026-10-10 07:00',
    targetRole: 'All Customers',
    status: 'Draft',
  },
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(initialCampaigns);
  const [searchName, setSearchName] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchName.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchName.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Mail className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Campaigns</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage promotional email broadcasts, seasonal push advisories, and SMS campaigns to farmers.
          </p>
        </div>
        <button
          type="button"
          onClick={() => alert('Add campaign modal / form will be configured with your custom fields.')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add new
        </button>
      </div>

      {/* Search Filter Panel */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Campaign Name or Subject
            </label>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search by campaign name or subject…"
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Delivery Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Sent">Sent</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              setSearchName('');
              setStatusFilter('All');
            }}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
          >
            Reset
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-xs"
          >
            <Search className="h-3.5 w-3.5" />
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="px-4 py-3">Campaign Name</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Created On</th>
                <th className="px-4 py-3">Don't Send Before</th>
                <th className="px-4 py-3">Target Customer Role</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No campaigns found.
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {camp.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                      {camp.subject}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                      {camp.createdOn}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                      {camp.dontSendBefore}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {camp.targetRole}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          camp.status === 'Sent'
                            ? 'bg-emerald-100 text-emerald-800'
                            : camp.status === 'Scheduled'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {camp.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`Edit campaign ${camp.name}`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 font-semibold transition text-xs"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
