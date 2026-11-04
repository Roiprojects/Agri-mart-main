'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  RotateCw,
  Edit,
  Check,
  X,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface PollItem {
  id: string;
  name: string;
  language: string;
  displayOrder: number;
  published: boolean;
  showOnHomePage: boolean;
  startDate: string;
  endDate: string;
}

const initialPolls: PollItem[] = [
  { id: '1', name: 'Which irrigation technique do you plan to adopt this summer?', language: 'English', displayOrder: 1, published: true, showOnHomePage: true, startDate: '04/01/2026', endDate: '06/30/2026' },
  { id: '2', name: 'Would you prefer solar rooftop loans integrated with farm electricity?', language: 'English', displayOrder: 2, published: true, showOnHomePage: false, startDate: '07/01/2026', endDate: '09/30/2026' },
  { id: '3', name: 'How satisfied are you with district agri machinery rental delivery?', language: 'English', displayOrder: 3, published: true, showOnHomePage: true, startDate: '09/01/2026', endDate: '12/31/2026' },
];

export default function PollsPage() {
  const [polls, setPolls] = useState<PollItem[]>(initialPolls);
  const [searchName, setSearchName] = useState('');
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOpen, setSearchOpen] = useState(true);

  const filteredPolls = polls.filter((p) =>
    p.name.toLowerCase().includes(searchName.toLowerCase())
  );

  const totalRecords = filteredPolls.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginatedData = filteredPolls.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div style={{ display: 'none' }} className="hidden space-y-4 max-w-full text-slate-800 pb-16 font-sans">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Polls</h1>
        <Link
          href="/admin/content/polls/new"
          className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add new</span>
        </Link>
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
                Poll name
              </label>
              <div className="md:col-span-9 max-w-md">
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => {
                    setSearchName(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by poll title"
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
                <th className="px-4 py-3">Language</th>
                <th className="px-4 py-3 text-center">Display order</th>
                <th className="px-4 py-3 text-center">Published</th>
                <th className="px-4 py-3 text-center">Show on home page</th>
                <th className="px-4 py-3">Start date</th>
                <th className="px-4 py-3">End date</th>
                <th className="px-4 py-3 text-center w-24">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f4f4]">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400 italic">
                    No polls found
                  </td>
                </tr>
              ) : (
                paginatedData.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">{p.name}</td>
                    <td className="px-4 py-3 text-slate-600">{p.language}</td>
                    <td className="px-4 py-3 text-center font-mono">{p.displayOrder}</td>
                    <td className="px-4 py-3 text-center">
                      {p.published ? (
                        <Check className="w-4 h-4 text-emerald-600 inline-block stroke-[2.5]" />
                      ) : (
                        <X className="w-4 h-4 text-red-500 inline-block stroke-[2.5]" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {p.showOnHomePage ? (
                        <Check className="w-4 h-4 text-emerald-600 inline-block stroke-[2.5]" />
                      ) : (
                        <X className="w-4 h-4 text-red-500 inline-block stroke-[2.5]" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{p.startDate}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{p.endDate}</td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/admin/content/polls/${p.id}`}
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
              onClick={() => setPolls([...initialPolls])}
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
