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

interface BlogCommentItem {
  id: string;
  blogPostTitle: string;
  customerName: string;
  comment: string;
  createdOn: string;
  approved: boolean;
}

const initialBlogComments: BlogCommentItem[] = [
  { id: '1', blogPostTitle: 'Top 5 Organic Fertilizers for Cotton Yield Maximization', customerName: 'Ramesh Patel', comment: 'Tried vermicompost with neem cake formulation and saw 15% better boll retention!', createdOn: '9/14/2026 8:45 AM', approved: true },
  { id: '2', blogPostTitle: 'Drip vs Sprinkler: Which irrigation saves more groundwater?', customerName: 'Sunita Devi', comment: 'Can we install automated solenoids with solar timers on drip pipes?', createdOn: '9/22/2026 4:10 PM', approved: true },
  { id: '3', blogPostTitle: 'How Drone Spraying Cuts Chemical Costs by 30%', customerName: 'Mahesh Patil', comment: 'Booked 10 acres of aerial spray last week, droplet coverage was very uniform.', createdOn: '10/02/2026 1:05 PM', approved: true },
];

export default function BlogCommentsPage() {
  const [comments, setComments] = useState<BlogCommentItem[]>(initialBlogComments);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOpen, setSearchOpen] = useState(true);

  const filteredComments = comments.filter((c) =>
    c.blogPostTitle.toLowerCase().includes(searchKeywords.toLowerCase()) ||
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
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Blog comments</h1>
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
                  placeholder="Search by customer, comment, or blog title"
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
                <th className="px-4 py-3">Blog post</th>
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
                    No blog comments found
                  </td>
                </tr>
              ) : (
                paginatedData.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">{c.blogPostTitle}</td>
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
