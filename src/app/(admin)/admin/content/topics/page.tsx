'use client';

import React, { useState, useEffect } from 'react';
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
  Save,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

function HelpTooltip({ text }: { text: string }) {
  return (
    <span
      title={text}
      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] font-bold cursor-help shrink-0 shadow-2xs select-none"
    >
      ?
    </span>
  );
}

interface TopicItem {
  id: string;
  name: string;
  published: boolean;
  passwordProtected: boolean;
  includeInSitemap: boolean;
  displayOrder: number;
  body?: string;
}

// Exactly matches media_1791184287710.png and media_1791184285548.png
const initialTopics: TopicItem[] = [
  { id: '1', name: 'FAQ', published: false, passwordProtected: false, includeInSitemap: false, displayOrder: 0 },
  { id: '2', name: 'Help', published: false, passwordProtected: false, includeInSitemap: false, displayOrder: 0 },
  { id: '3', name: 'ApplyVendor', published: true, passwordProtected: false, includeInSitemap: false, displayOrder: 1 },
  { id: '4', name: 'CheckoutAsGuestOrRegister', published: true, passwordProtected: false, includeInSitemap: false, displayOrder: 1 },
  { id: '5', name: 'ContactUs', published: true, passwordProtected: false, includeInSitemap: false, displayOrder: 1 },
  { id: '6', name: 'ForumWelcomeMessage', published: true, passwordProtected: false, includeInSitemap: false, displayOrder: 1 },
  { id: '7', name: 'HomePageText', published: false, passwordProtected: false, includeInSitemap: false, displayOrder: 1 },
  { id: '8', name: 'LoginRegistrationInfo', published: true, passwordProtected: false, includeInSitemap: false, displayOrder: 1 },
  { id: '9', name: 'PageNotFound', published: true, passwordProtected: false, includeInSitemap: false, displayOrder: 1 },
  { id: '10', name: 'VendorTermsOfService', published: true, passwordProtected: false, includeInSitemap: false, displayOrder: 1 },
  { id: '11', name: 'ShippingInfo', published: true, passwordProtected: false, includeInSitemap: false, displayOrder: 5 },
  { id: '12', name: 'PrivacyInfo', published: true, passwordProtected: false, includeInSitemap: false, displayOrder: 10 },
  { id: '13', name: 'ConditionsOfUse', published: true, passwordProtected: false, includeInSitemap: false, displayOrder: 15 },
  { id: '14', name: 'AboutUs', published: true, passwordProtected: false, includeInSitemap: false, displayOrder: 20 },
];

export default function TopicsPage() {
  const [topics, setTopics] = useState<TopicItem[]>(initialTopics);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [searchOpen, setSearchOpen] = useState(true);
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<TopicItem | null>(null);
  const [modalForm, setModalForm] = useState({
    name: '',
    published: true,
    passwordProtected: false,
    includeInSitemap: false,
    displayOrder: 1,
    body: '',
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchTopics = async () => {
    try {
      const res = await fetch('/api/admin/content/topics');
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setTopics(json.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedKeyword(searchKeywords.trim());
    setCurrentPage(1);
  };

  const filteredTopics = topics.filter((t) => {
    if (!appliedKeyword) return true;
    return t.name.toLowerCase().includes(appliedKeyword.toLowerCase());
  });

  const totalRecords = filteredTopics.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginatedData = filteredTopics.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleOpenAdd = () => {
    setEditingTopic(null);
    setModalForm({
      name: '',
      published: true,
      passwordProtected: false,
      includeInSitemap: false,
      displayOrder: 1,
      body: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: TopicItem) => {
    setEditingTopic(t);
    setModalForm({
      name: t.name,
      published: t.published,
      passwordProtected: t.passwordProtected,
      includeInSitemap: t.includeInSitemap,
      displayOrder: t.displayOrder,
      body: t.body || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = async () => {
    if (!modalForm.name.trim()) {
      showToast('Topic name is required', 'error');
      return;
    }

    try {
      if (editingTopic) {
        const res = await fetch(`/api/admin/content/topics/${editingTopic.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(modalForm),
        });
        const json = await res.json();
        if (json.success) {
          showToast('Topic updated successfully.', 'success');
          setTopics((prev) =>
            prev.map((item) => (item.id === editingTopic.id ? { ...item, ...modalForm } : item))
          );
        } else {
          showToast(json.error || 'Failed to update topic', 'error');
        }
      } else {
        const res = await fetch('/api/admin/content/topics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(modalForm),
        });
        const json = await res.json();
        if (json.success) {
          showToast('Topic created successfully.', 'success');
          setTopics((prev) => [...prev, json.data]);
        } else {
          showToast(json.error || 'Failed to create topic', 'error');
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

      {/* ── TOP HEADER (Matching media_1791184287710.png) ── */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Topics (pages)</h1>
        <Link
          href="/admin/content/topics/new"
          className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add new</span>
        </Link>
      </div>

      {/* ── SEARCH CARD (Matching media_1791184287710.png) ── */}
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
          <form onSubmit={handleSearchSubmit} className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
                <span>Search keywords</span>
                <HelpTooltip text="Keywords to search topic pages by name." />
              </div>
              <div className="md:col-span-9 max-w-md">
                <input
                  type="text"
                  value={searchKeywords}
                  onChange={(e) => setSearchKeywords(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs px-2.5 py-1.5 text-xs text-slate-800 bg-white transition"
                />
              </div>
            </div>

            {/* Centered Search Button matching screenshot */}
            <div className="text-center pt-1">
              <button
                type="submit"
                className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-4 py-1.5 rounded inline-flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Search</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── TABLE CARD (Matching media_1791184287710.png & media_1791184285548.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Help Link */}
        <div className="px-4 py-3 text-xs text-slate-600 border-b border-[#f4f4f4]">
          Learn more about{' '}
          <span className="text-[#2489c5] hover:underline cursor-pointer">topics (pages)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#f9fafb] text-xs text-slate-800 border-b border-[#e5e7eb] font-semibold select-none">
              <tr>
                <th className="px-4 py-3.5 font-bold">Name</th>
                <th className="px-4 py-3.5 text-center font-bold">Published</th>
                <th className="px-4 py-3.5 text-center font-bold">Password protected</th>
                <th className="px-4 py-3.5 text-center font-bold">Include in sitemap</th>
                <th className="px-4 py-3.5 text-center font-bold">Display order</th>
                <th className="px-4 py-3.5 text-center font-bold w-28">Edit</th>
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
                paginatedData.map((t, idx) => (
                  <tr
                    key={t.id}
                    className={`${idx % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'} hover:bg-blue-50/40 transition-colors`}
                  >
                    <td className="px-4 py-3 text-slate-800 font-normal">{t.name}</td>
                    <td className="px-4 py-3 text-center">
                      {t.published ? (
                        <Check className="w-4 h-4 text-[#2489c5] stroke-[2.5] inline-block" />
                      ) : (
                        <X className="w-4 h-4 text-red-500 stroke-[2.5] inline-block" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {t.passwordProtected ? (
                        <Check className="w-4 h-4 text-[#2489c5] stroke-[2.5] inline-block" />
                      ) : (
                        <X className="w-4 h-4 text-red-500 stroke-[2.5] inline-block" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {t.includeInSitemap ? (
                        <Check className="w-4 h-4 text-[#2489c5] stroke-[2.5] inline-block" />
                      ) : (
                        <X className="w-4 h-4 text-red-500 stroke-[2.5] inline-block" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-normal">{t.displayOrder}</td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/admin/content/topics/${t.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition cursor-pointer"
                      >
                        <Edit className="h-3 w-3 text-slate-600" />
                        <span>Edit</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION BAR (Matching media_1791184285548.png) ── */}
        <div className="px-4 py-3 border-t border-[#f4f4f4] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          {/* Previous [1] Next */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded border border-[#d2d6de] bg-white text-slate-600 hover:bg-slate-50 disabled:text-slate-300 disabled:hover:bg-white transition cursor-pointer disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-[#2489c5] text-white font-semibold rounded-xs shadow-2xs">
              {currentPage}
            </span>
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
              onClick={fetchTopics}
              className="p-1 rounded border border-[#d2d6de] hover:bg-slate-100 text-slate-600 transition cursor-pointer"
              title="Refresh"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── ADD / EDIT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-[#d2d6de] shadow-xl w-full max-w-xl overflow-hidden animate-fadeIn">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-[#d2d6de] flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                {editingTopic ? `Edit topic - ${editingTopic.name}` : 'Add a new topic'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-base font-bold leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span>Name</span>
                  <HelpTooltip text="System name of the topic page." />
                </label>
                <input
                  type="text"
                  value={modalForm.name}
                  onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                  placeholder="e.g. AboutUs, ConditionsOfUse"
                  className="w-full border border-[#d2d6de] rounded-xs px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={modalForm.published}
                    onChange={(e) => setModalForm({ ...modalForm, published: e.target.checked })}
                    className="w-4 h-4 text-[#2489c5] rounded border-[#d2d6de]"
                  />
                  <span className="font-semibold text-slate-700">Published</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={modalForm.passwordProtected}
                    onChange={(e) => setModalForm({ ...modalForm, passwordProtected: e.target.checked })}
                    className="w-4 h-4 text-[#2489c5] rounded border-[#d2d6de]"
                  />
                  <span className="font-semibold text-slate-700">Password protected</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={modalForm.includeInSitemap}
                    onChange={(e) => setModalForm({ ...modalForm, includeInSitemap: e.target.checked })}
                    className="w-4 h-4 text-[#2489c5] rounded border-[#d2d6de]"
                  />
                  <span className="font-semibold text-slate-700">Include in sitemap</span>
                </label>
              </div>

              <div className="space-y-1 pt-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span>Display order</span>
                  <HelpTooltip text="Order in which this topic is displayed." />
                </label>
                <input
                  type="number"
                  value={modalForm.displayOrder}
                  onChange={(e) => setModalForm({ ...modalForm, displayOrder: Number(e.target.value) })}
                  className="w-24 border border-[#d2d6de] rounded-xs px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc]"
                />
              </div>

              <div className="space-y-1 pt-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span>Body</span>
                  <HelpTooltip text="HTML or text content of the page." />
                </label>
                <textarea
                  rows={4}
                  value={modalForm.body}
                  onChange={(e) => setModalForm({ ...modalForm, body: e.target.value })}
                  placeholder="Page content..."
                  className="w-full border border-[#d2d6de] rounded-xs p-2 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc]"
                />
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-[#d2d6de] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3.5 py-1.5 rounded border border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                className="px-4 py-1.5 rounded bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
