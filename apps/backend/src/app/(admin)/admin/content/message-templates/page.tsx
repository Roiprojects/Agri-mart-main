'use client';

import React, { useState } from 'react';
import {
  RotateCw,
  Edit,
  Check,
  X,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface MessageTemplateItem {
  id: string;
  name: string;
  subject: string;
  isActive: boolean;
  listOfStores: string;
}

const initialTemplates: MessageTemplateItem[] = [
  { id: '1', name: 'Customer.WelcomeMessage', subject: 'Welcome to %Store.Name% Agri Network', isActive: true, listOfStores: 'All' },
  { id: '2', name: 'OrderPlaced.CustomerNotification', subject: 'Your Agri-Mart order #%Order.OrderNumber% has been placed', isActive: true, listOfStores: 'All' },
  { id: '3', name: 'OrderPlaced.VendorNotification', subject: 'New agri order received: #%Order.OrderNumber%', isActive: true, listOfStores: 'All' },
  { id: '4', name: 'OrderShipped.CustomerNotification', subject: 'Your seeds & equipment consignment has shipped', isActive: true, listOfStores: 'All' },
  { id: '5', name: 'Rental.BookingConfirmed', subject: 'Tractor / Equipment booking confirmed for %Rental.StartDate%', isActive: true, listOfStores: 'All' },
  { id: '6', name: 'Service.DroneSprayingAssigned', subject: 'Drone pilot assigned for field spraying schedule', isActive: true, listOfStores: 'All' },
  { id: '7', name: 'Customer.PasswordRecovery', subject: 'Password recovery token for %Store.Name%', isActive: true, listOfStores: 'All' },
  { id: '8', name: 'Campaign.BroadcastNotification', subject: '%Campaign.Subject%', isActive: true, listOfStores: 'All' },
];

export default function MessageTemplatesPage() {
  const [templates, setTemplates] = useState<MessageTemplateItem[]>(initialTemplates);
  const [searchName, setSearchName] = useState('');
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOpen, setSearchOpen] = useState(true);

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchName.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchName.toLowerCase())
  );

  const totalRecords = filteredTemplates.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginatedData = filteredTemplates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-16 font-sans">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Message templates</h1>
      </div>

      {/* ── SEARCH CARD ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        <div
          onClick={() => setSearchOpen(!searchOpen)}
          className="px-4 py-2.5 bg-slate-50 border-b border-[#d2d6de] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Search</span>
          </div>
          {searchOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>

        {searchOpen && (
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right">
                Template name
              </label>
              <div className="md:col-span-9 max-w-md">
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => {
                    setSearchName(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search template name or subject"
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs px-2.5 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── TABLE CARD ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#f9fafb] text-[11px] uppercase tracking-wider text-slate-600 border-b border-[#e5e7eb] font-semibold">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3 text-center">Is active</th>
                <th className="px-4 py-3">Stores</th>
                <th className="px-4 py-3 text-center w-24">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f4f4]">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400 italic">
                    No message templates found
                  </td>
                </tr>
              ) : (
                paginatedData.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900 font-mono text-xs">{t.name}</td>
                    <td className="px-4 py-3 text-slate-600">{t.subject}</td>
                    <td className="px-4 py-3 text-center">
                      {t.isActive ? (
                        <Check className="w-4 h-4 text-emerald-600 inline-block stroke-[2.5]" />
                      ) : (
                        <X className="w-4 h-4 text-red-500 inline-block stroke-[2.5]" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{t.listOfStores}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => alert(`Edit ${t.name}`)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded border border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition cursor-pointer"
                      >
                        <Edit className="h-3 w-3 text-slate-500" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-4 py-3 border-t border-[#f4f4f4] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
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
            </select>
            <span>items</span>
          </div>

          <div className="flex items-center gap-3">
            <span>
              {totalRecords === 0
                ? 'No records'
                : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, totalRecords)} of ${totalRecords} items`}
            </span>
            <button
              type="button"
              onClick={() => {}}
              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition"
              title="Refresh"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
