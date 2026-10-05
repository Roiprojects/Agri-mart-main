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

interface TopicItem {
  id: string;
  systemName: string;
  title: string;
  displayOrder: number;
  includeInSitemap: boolean;
  isPasswordProtected: boolean;
}

const initialTopics: TopicItem[] = [
  { id: '1', systemName: 'HomePageText', title: 'Home page welcome overview', displayOrder: 1, includeInSitemap: true, isPasswordProtected: false },
  { id: '2', systemName: 'AboutUs', title: 'About Agri-Mart Mega Network', displayOrder: 10, includeInSitemap: true, isPasswordProtected: false },
  { id: '3', systemName: 'PrivacyInfo', title: 'Privacy Policy & Farmer Data Guarantee', displayOrder: 20, includeInSitemap: true, isPasswordProtected: false },
  { id: '4', systemName: 'ShippingInfo', title: 'Agri Machinery & Seed Dispatch Guide', displayOrder: 30, includeInSitemap: true, isPasswordProtected: false },
  { id: '5', systemName: 'ConditionsOfUse', title: 'Terms and Conditions of Use', displayOrder: 40, includeInSitemap: true, isPasswordProtected: false },
  { id: '6', systemName: 'ContactUs', title: 'Kisan Helpline & District Hub Centers', displayOrder: 50, includeInSitemap: true, isPasswordProtected: false },
  { id: '7', systemName: 'RentalGuidelines', title: 'Harvester and Tractor Rental Policy', displayOrder: 60, includeInSitemap: true, isPasswordProtected: false },
];

export default function TopicsPage() {
  const [topics, setTopics] = useState<TopicItem[]>(initialTopics);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOpen, setSearchOpen] = useState(true);

  const filteredTopics = topics.filter((t) =>
    t.systemName.toLowerCase().includes(searchKeywords.toLowerCase()) ||
    t.title.toLowerCase().includes(searchKeywords.toLowerCase())
  );

  const totalRecords = filteredTopics.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginatedData = filteredTopics.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-16 font-sans">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Topics (pages)</h1>
        <button
          type="button"
          onClick={() => alert('Add new topic page')}
          className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add new</span>
        </button>
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
                  placeholder="Search by system name or title"
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
                <th className="px-4 py-3">System name</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3 text-center">Display order</th>
                <th className="px-4 py-3 text-center">Include in sitemap</th>
                <th className="px-4 py-3 text-center">Is password protected</th>
                <th className="px-4 py-3 text-center w-24">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f4f4]">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400 italic">
                    No records found
                  </td>
                </tr>
              ) : (
                paginatedData.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900 font-mono text-xs">{t.systemName}</td>
                    <td className="px-4 py-3 text-slate-600">{t.title}</td>
                    <td className="px-4 py-3 text-center font-mono">{t.displayOrder}</td>
                    <td className="px-4 py-3 text-center">
                      {t.includeInSitemap ? (
                        <Check className="w-4 h-4 text-emerald-600 inline-block stroke-[2.5]" />
                      ) : (
                        <X className="w-4 h-4 text-red-500 inline-block stroke-[2.5]" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {t.isPasswordProtected ? (
                        <Check className="w-4 h-4 text-emerald-600 inline-block stroke-[2.5]" />
                      ) : (
                        <X className="w-4 h-4 text-red-500 inline-block stroke-[2.5]" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => alert(`Edit ${t.systemName}`)}
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
