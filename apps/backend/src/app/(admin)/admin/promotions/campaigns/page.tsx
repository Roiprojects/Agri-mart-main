'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  RotateCw,
  Edit,
  X,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface CampaignItem {
  id: string;
  name: string;
  subject?: string;
  createdOn: string;
  plannedDateOfSending: string;
  body?: string;
}

const initialDemoCampaigns: CampaignItem[] = [
  {
    id: 'camp-1',
    name: 'Kharif Pre-Monsoon Machinery Advisory',
    subject: 'Book heavy tillers and seeders before seasonal surge',
    createdOn: '5/20/2026 8:30:00 AM',
    plannedDateOfSending: '5/25/2026 8:00:00 AM',
    body: 'Dear Farmer, prepare your fields with verified heavy equipment before seasonal demand peak.',
  },
  {
    id: 'camp-2',
    name: 'Monsoon Fungicide Special Broadcast',
    subject: 'Protect your crops with tested bio-fungicides & copper sprayers',
    createdOn: '7/10/2026 10:15:00 AM',
    plannedDateOfSending: '7/15/2026 9:30:00 AM',
    body: 'Safeguard your horticultural crops against fungal blast with government approved bio-inputs.',
  },
  {
    id: 'camp-3',
    name: 'Drip Irrigation Subsidy Notification',
    subject: 'Avail government aligned drip kit packages at 15% discount',
    createdOn: '9/1/2026 11:00:00 AM',
    plannedDateOfSending: '9/5/2026 10:00:00 AM',
    body: 'Special PMKSY aligned subsidy kits available for direct farmer online booking.',
  },
  {
    id: 'camp-4',
    name: 'Harvest Season Drone Spraying Bookings Open',
    subject: 'Drone crop spray bookings now live across 14 districts',
    createdOn: '10/1/2026 9:00:00 AM',
    plannedDateOfSending: '10/10/2026 7:00:00 AM',
    body: 'Book high-precision aerial spraying for paddy and cotton harvest protection.',
  },
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(initialDemoCampaigns);
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CampaignItem | null>(null);
  const [modalForm, setModalForm] = useState({
    name: '',
    subject: '',
    plannedDateOfSending: '',
    body: '',
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/admin/promotions/campaigns');
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setCampaigns(json.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const totalRecords = campaigns.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginatedData = campaigns.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleOpenAdd = () => {
    setEditingCampaign(null);
    setModalForm({
      name: '',
      subject: '',
      plannedDateOfSending: '',
      body: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: CampaignItem) => {
    setEditingCampaign(c);
    setModalForm({
      name: c.name,
      subject: c.subject || c.name,
      plannedDateOfSending: c.plannedDateOfSending !== '—' ? c.plannedDateOfSending : '',
      body: c.body || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.name.trim()) return;

    try {
      if (editingCampaign) {
        // Edit
        const res = await fetch(`/api/admin/promotions/campaigns/${editingCampaign.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: modalForm.name.trim(),
            subject: modalForm.subject.trim(),
            plannedDateOfSending: modalForm.plannedDateOfSending.trim() || '—',
            body: modalForm.body.trim(),
          }),
        });
        const json = await res.json();
        if (json.success) {
          showToast('Campaign has been updated successfully.', 'success');
          setCampaigns((prev) =>
            prev.map((item) =>
              item.id === editingCampaign.id
                ? {
                    ...item,
                    name: modalForm.name.trim(),
                    subject: modalForm.subject.trim(),
                    plannedDateOfSending: modalForm.plannedDateOfSending.trim() || '—',
                    body: modalForm.body.trim(),
                  }
                : item
            )
          );
        } else {
          showToast(json.error || 'Failed to update campaign', 'error');
        }
      } else {
        // Add
        const res = await fetch('/api/admin/promotions/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: modalForm.name.trim(),
            subject: modalForm.subject.trim(),
            plannedDateOfSending: modalForm.plannedDateOfSending.trim() || '—',
            body: modalForm.body.trim(),
          }),
        });
        const json = await res.json();
        if (json.success) {
          showToast('The new campaign has been added successfully.', 'success');
          setCampaigns((prev) => [json.data, ...prev]);
        } else {
          showToast(json.error || 'Failed to add campaign', 'error');
        }
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-16 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded shadow-lg text-white text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
            toast.type === 'success' ? 'bg-[#00a65a]' : 'bg-[#dd4b39]'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ── TOP HEADER: Campaigns + Add new button (Matching media_1791180337566.png) ── */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Campaigns</h1>
        <Link
          href="/admin/promotions/campaigns/new"
          className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add new</span>
        </Link>
      </div>

      {/* ── TABLE CARD (Matching media_1791180337566.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Top Info link matching screenshot */}
        <div className="px-4 py-3 text-xs text-slate-600 border-b border-[#f4f4f4]">
          Learn more about{' '}
          <a
            href="https://docs.nopcommerce.com/en/running-your-store/promotions/campaigns.html"
            target="_blank"
            rel="noreferrer"
            className="text-[#3c8dbc] hover:underline"
          >
            email campaigns
          </a>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-[#f9fafc] text-xs font-bold text-slate-700">
                <th className="px-4 py-2.5">Name</th>
                <th className="px-4 py-2.5">Created on</th>
                <th className="px-4 py-2.5">Planned date of sending</th>
                <th className="px-4 py-2.5 text-center">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f4f4] text-xs text-slate-700">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-6 text-center text-slate-600 text-xs bg-white"
                  >
                    No data available in table
                  </td>
                </tr>
              ) : (
                paginatedData.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">{c.name}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                      {c.createdOn}
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                      {c.plannedDateOfSending}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/admin/promotions/campaigns/${c.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded border border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition cursor-pointer"
                      >
                        <Edit className="h-3 w-3 text-slate-500" />
                        <span>Edit</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination matching media_1791180337566.png */}
        <div className="px-4 py-3 border-t border-[#f4f4f4] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          {/* Previous / Next */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded border border-[#d2d6de] bg-white text-slate-600 hover:bg-slate-50 disabled:text-slate-300 disabled:hover:bg-white transition cursor-pointer disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded border border-[#d2d6de] bg-white text-slate-600 hover:bg-slate-50 disabled:text-slate-300 disabled:hover:bg-white transition cursor-pointer disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          {/* Show [15] items */}
          <div className="flex items-center gap-1.5">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-[#d2d6de] rounded px-2 py-1 bg-white text-xs text-slate-700 focus:outline-none focus:border-[#3c8dbc]"
            >
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>items</span>
          </div>

          {/* Records & Refresh */}
          <div className="flex items-center gap-3">
            <span>
              {totalRecords === 0
                ? 'No records'
                : `${(currentPage - 1) * pageSize + 1}-${Math.min(
                    currentPage * pageSize,
                    totalRecords
                  )} of ${totalRecords} items`}
            </span>
            <button
              type="button"
              onClick={fetchCampaigns}
              title="Refresh"
              className="p-1 rounded border border-[#d2d6de] bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── ADD / EDIT CAMPAIGN MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-lg border border-[#d2d6de] shadow-xl w-full max-w-lg overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-[#f4f4f4] flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-semibold text-slate-800">
                {editingCampaign ? 'Edit Campaign' : 'Add New Campaign'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveModal} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.name}
                  onChange={(e) => setModalForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Rabi Season Seed Sowing Advisory"
                  className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={modalForm.subject}
                  onChange={(e) => setModalForm((f) => ({ ...f, subject: e.target.value }))}
                  placeholder="e.g. Special seed subsidies live this week"
                  className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Planned Date of Sending
                </label>
                <input
                  type="text"
                  value={modalForm.plannedDateOfSending}
                  onChange={(e) =>
                    setModalForm((f) => ({ ...f, plannedDateOfSending: e.target.value }))
                  }
                  placeholder="e.g. 10/15/2026 8:00:00 AM"
                  className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Body / Message</label>
                <textarea
                  rows={4}
                  value={modalForm.body}
                  onChange={(e) => setModalForm((f) => ({ ...f, body: e.target.value }))}
                  placeholder="Write the campaign message for farmers..."
                  className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f4f4f4]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 border border-[#d2d6de] rounded bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#2489c5] hover:bg-[#1f72a3] text-white font-semibold shadow-xs transition cursor-pointer"
                >
                  {editingCampaign ? 'Update Campaign' : 'Save Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
