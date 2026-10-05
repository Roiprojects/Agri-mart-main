'use client';

import React, { useState } from 'react';
import {
  RotateCw,
  Trash2,
  Check,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface NewsCommentItem {
  id: string;
  newsTitle: string;
  customerName: string;
  comment: string;
  createdOn: string;
  approved: boolean;
}

const initialComments: NewsCommentItem[] = [
  { id: '1', newsTitle: 'Kharif MSP Rates Announced for 2026-27 Season', customerName: 'Suresh Gowda', comment: 'Are pulses and oilseeds covered under the revision as well?', createdOn: '5/29/2026 11:20 AM', approved: true },
  { id: '2', newsTitle: 'Government Launches Subsidized Solar Pump Direct Scheme', customerName: 'Vijay Kumar', comment: 'Where can we submit the land registration certificate for this?', createdOn: '7/16/2026 9:40 AM', approved: true },
  { id: '3', newsTitle: 'Monsoon Pest Watch Advisory Issued for Paddy & Cotton', customerName: 'Anand Patil', comment: 'Very useful advisory on avoiding high doses of nitrogen during rain spells.', createdOn: '8/02/2026 3:15 PM', approved: true },
];

export default function NewsCommentsPage() {
  const [comments, setComments] = useState<NewsCommentItem[]>(initialComments);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOpen, setSearchOpen] = useState(true);

  const filteredComments = comments.filter((c) =>
    c.newsTitle.toLowerCase().includes(searchKeywords.toLowerCase()) ||
    c.customerName.toLowerCase().includes(searchKeywords.toLowerCase()) ||
    c.comment.toLowerCase().includes(searchKeywords.toLowerCase())
  );

  const totalRecords = filteredComments.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginatedData = filteredComments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-16 font-sans">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">News comments</h1>
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
                Keywords
              </label>
              <div className="md:col-span-9 max-w-md">
                <input
                  type="text"
                  value={searchKeywords}
                  onChange={(e) => {
                    setSearchKeywords(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by customer, comment, or news item"
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
                <th className="px-4 py-3">News item</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Comment</th>
                <th className="px-4 py-3">Created on</th>
                <th className="px-4 py-3 text-center">Approved</th>
                <th className="px-4 py-3 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f4f4]">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400 italic">
                    No comments found
                  </td>
                </tr>
              ) : (
                paginatedData.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">{c.newsTitle}</td>
                    <td className="px-4 py-3 text-[#2489c5] font-semibold">{c.customerName}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{c.comment}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{c.createdOn}</td>
                    <td className="px-4 py-3 text-center">
                      <Check className="w-4 h-4 text-emerald-600 inline-block stroke-[2.5]" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => setComments(comments.filter(item => item.id !== c.id))}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-red-200 bg-white text-red-600 hover:bg-red-50 text-xs font-semibold shadow-2xs transition cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
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
