'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  RotateCw,
  Edit,
  Check,
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  language: string;
  commentsCount: number;
  approvedComments: number;
  startDate: string;
  endDate: string;
  published: boolean;
  createdOn: string;
}

const initialNews: NewsItem[] = [
  {
    id: '1',
    title: 'Check out our latest offers',
    language: 'EN',
    commentsCount: 0,
    approvedComments: 0,
    startDate: '',
    endDate: '',
    published: true,
    createdOn: '04/03/2019 4:52:48 PM',
  },
  {
    id: '2',
    title: 'Find out about our products',
    language: 'EN',
    commentsCount: 0,
    approvedComments: 0,
    startDate: '',
    endDate: '',
    published: true,
    createdOn: '04/03/2019 4:52:48 PM',
  },
  {
    id: '3',
    title: 'Visit our new store',
    language: 'EN',
    commentsCount: 0,
    approvedComments: 0,
    startDate: '',
    endDate: '',
    published: true,
    createdOn: '04/03/2019 4:52:47 PM',
  },
];

export default function NewsItemsPage() {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [searchTitle, setSearchTitle] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOpen, setSearchOpen] = useState(true);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAppliedSearch(searchTitle.trim());
    setCurrentPage(1);
  };

  const filteredNews = news.filter((n) =>
    n.title.toLowerCase().includes(appliedSearch.toLowerCase())
  );

  const totalRecords = filteredNews.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginatedData = filteredNews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-16 font-sans">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">News items</h1>
        <button
          type="button"
          onClick={() => alert('Add new news item')}
          className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add new</span>
        </button>
      </div>

      {/* ── SEARCH CARD ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        <div
          onClick={() => setSearchOpen(!searchOpen)}
          className="px-4 py-2.5 bg-slate-50/80 border-b border-[#d2d6de] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-100/70 transition"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-normal text-slate-700">Search</span>
          </div>
          {searchOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </div>

        {searchOpen && (
          <form onSubmit={handleSearch} className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-3">
              <label className="text-xs font-medium text-slate-700 flex items-center gap-1 whitespace-nowrap">
                <span>Title</span>
                <span
                  title="A news item title."
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#3c8dbc] text-white text-[10px] font-bold cursor-help"
                >
                  ?
                </span>
              </label>
              <div className="w-full sm:w-80">
                <input
                  type="text"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-2.5 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            <div className="flex justify-center pt-1">
              <button
                type="submit"
                className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-medium px-5 py-2 rounded flex items-center justify-center gap-2 shadow-2xs transition cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── TABLE CARD ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Info link */}
        <div className="px-4 pt-3.5 pb-2.5 text-xs text-slate-600">
          Learn more about{' '}
          <a
            href="https://docs.nopcommerce.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3c8dbc] hover:underline"
          >
            news
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#f9fafb] text-xs font-bold text-slate-800 border-t border-b border-[#d2d6de]">
              <tr>
                <th className="px-4 py-3.5 font-bold">Title</th>
                <th className="px-4 py-3.5 font-bold">Language</th>
                <th className="px-4 py-3.5 font-bold">View comments</th>
                <th className="px-4 py-3.5 font-bold">Start date</th>
                <th className="px-4 py-3.5 font-bold">End date</th>
                <th className="px-4 py-3.5 font-bold text-center">Published</th>
                <th className="px-4 py-3.5 font-bold">Created on</th>
                <th className="px-4 py-3.5 font-bold text-center w-24">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebebeb]">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400 italic">
                    No news items found
                  </td>
                </tr>
              ) : (
                paginatedData.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 text-slate-800">{n.title}</td>
                    <td className="px-4 py-3 text-slate-700">{n.language}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/content/news-comments?newsTitle=${encodeURIComponent(n.title)}`}
                        className="inline-flex items-center px-3 py-1 rounded border border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-xs shadow-2xs font-normal transition cursor-pointer"
                      >
                        View comments - {n.commentsCount} ({n.approvedComments})
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{n.startDate || ''}</td>
                    <td className="px-4 py-3 text-slate-500">{n.endDate || ''}</td>
                    <td className="px-4 py-3 text-center">
                      {n.published ? (
                        <Check className="w-4 h-4 text-[#2489c5] inline-block stroke-[2.5]" />
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{n.createdOn}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => alert(`Edit ${n.title}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-50 text-xs shadow-2xs transition cursor-pointer"
                      >
                        <Edit className="h-3 w-3 text-slate-600" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination matching screenshot */}
        <div className="px-4 py-3 border-t border-[#f4f4f4] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border border-[#d2d6de] rounded-l bg-white text-slate-600 hover:bg-slate-50 disabled:text-slate-300 disabled:hover:bg-white transition cursor-pointer disabled:cursor-not-allowed border-r-0"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-[#3c8dbc] text-white font-medium border border-[#3c8dbc]">
              {currentPage}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 border border-[#d2d6de] rounded-r bg-white text-slate-600 hover:bg-slate-50 disabled:text-slate-300 disabled:hover:bg-white transition cursor-pointer disabled:cursor-not-allowed border-l-0"
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
              onClick={() => {
                setSearchTitle('');
                setAppliedSearch('');
                setCurrentPage(1);
              }}
              className="p-1 border border-[#d2d6de] rounded bg-white hover:bg-slate-100 text-slate-600 transition shadow-2xs"
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
