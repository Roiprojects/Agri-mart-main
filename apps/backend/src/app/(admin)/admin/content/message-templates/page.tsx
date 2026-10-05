'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
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

interface MessageTemplateItem {
  id: string;
  name: string;
  subject: string;
  isActive: boolean;
  limitedToStores: string;
  body?: string;
}

// Exactly matches media_1791194400347.png
const defaultTemplates: MessageTemplateItem[] = [
  {
    id: '1',
    name: 'Blog.BlogComment',
    subject: '%Store.Name%. New blog comment.',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Hello Administrator,\n\nA new blog comment has been posted by %BlogComment.CustomerName% on blog post "%BlogPost.Title%".\n\nComment: %BlogComment.CommentText%',
  },
  {
    id: '2',
    name: 'Customer.BackInStock',
    subject: '%Store.Name%. Back in stock notification',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Dear %Customer.FullName%,\n\nThe product "%Product.Name%" is now back in stock and ready to order on %Store.Name%.\n\nProduct link: %Product.ProductURL%',
  },
  {
    id: '3',
    name: 'Customer.EmailRevalidationMessage',
    subject: '%Store.Name%. Email validation',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Dear %Customer.FullName%,\n\nPlease revalidate your email address by clicking on the link below:\n%Customer.EmailRevalidationURL%',
  },
  {
    id: '4',
    name: 'Customer.EmailValidationMessage',
    subject: '%Store.Name%. Email validation',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Dear %Customer.FullName%,\n\nWelcome to %Store.Name%! To activate your farmer account, please verify your email address:\n%Customer.EmailValidationURL%',
  },
  {
    id: '5',
    name: 'Customer.NewCustomer',
    subject: '%Store.Name%. New customer registration.',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'A new farmer or vendor %Customer.FullName% (%Customer.Email%) has registered on %Store.Name%.',
  },
  {
    id: '6',
    name: 'Customer.PasswordRecovery',
    subject: '%Store.Name%. Password recovery token',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Dear %Customer.FullName%,\n\nTo reset your password, visit the following URL:\n%Customer.PasswordRecoveryURL%',
  },
  {
    id: '7',
    name: 'Customer.WelcomeMessage',
    subject: 'Welcome to %Store.Name% Agri Network',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Welcome to %Store.Name%! Explore certified seeds, farming machinery rentals, and expert agronomy advisory.',
  },
  {
    id: '8',
    name: 'News.NewsComment',
    subject: '%Store.Name%. New news comment.',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Hello Administrator,\n\nA new comment has been posted on news article "%NewsItem.Title%":\n%NewsComment.CommentText%',
  },
  {
    id: '9',
    name: 'OrderCompleted.CustomerNotification',
    subject: '%Store.Name%. Your order #%Order.OrderNumber% has been completed',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Dear %Order.CustomerFullName%,\n\nYour order #%Order.OrderNumber% for agri inputs has been fulfilled and delivered successfully.',
  },
  {
    id: '10',
    name: 'OrderPaid.CustomerNotification',
    subject: '%Store.Name%. Payment received for order #%Order.OrderNumber%',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Payment of %Order.OrderTotal% received successfully for order #%Order.OrderNumber%.',
  },
  {
    id: '11',
    name: 'OrderPlaced.CustomerNotification',
    subject: '%Store.Name%. Order #%Order.OrderNumber% details',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Thank you for your order #%Order.OrderNumber%! Total: %Order.OrderTotal%. Our district logistics team will dispatch your consignment shortly.',
  },
  {
    id: '12',
    name: 'OrderPlaced.VendorNotification',
    subject: '%Store.Name%. New agricultural order #%Order.OrderNumber% placed',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Vendor Notice: New order #%Order.OrderNumber% placed containing your vendor catalog items.',
  },
  {
    id: '13',
    name: 'OrderShipped.CustomerNotification',
    subject: '%Store.Name%. Your order #%Order.OrderNumber% has shipped',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Your seeds, agrochemicals, or equipment consignment has been dispatched. Tracking: %Order.TrackingNumber%.',
  },
  {
    id: '14',
    name: 'Rental.BookingConfirmed',
    subject: '%Store.Name%. Farm machinery booking confirmed for %Rental.StartDate%',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Dear %Customer.FullName%,\n\nYour machinery rental for %Rental.MachineryName% from %Rental.StartDate% to %Rental.EndDate% has been confirmed.',
  },
  {
    id: '15',
    name: 'Service.AssignedTechnician',
    subject: '%Store.Name%. Drone spray technician assigned for field spraying',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Dear %Customer.FullName%,\n\nCertified drone pilot %Service.TechnicianName% has been assigned for your field spraying request on %Service.ScheduledDate%.',
  },
];

export default function MessageTemplatesPage() {
  const [templates, setTemplates] = useState<MessageTemplateItem[]>(defaultTemplates);

  // Search filter states
  const [searchKeywords, setSearchKeywords] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState('All');
  const [appliedKeywords, setAppliedKeywords] = useState('');
  const [appliedActiveFilter, setAppliedActiveFilter] = useState('All');
  const [searchOpen, setSearchOpen] = useState(true);

  // Pagination states
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);

  // Edit Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplateItem | null>(null);
  const [modalForm, setModalForm] = useState({
    name: '',
    subject: '',
    isActive: true,
    limitedToStores: 'All stores',
    body: '',
  });

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/admin/content/message-templates');
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setTemplates(json.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedKeywords(searchKeywords.trim());
    setAppliedActiveFilter(isActiveFilter);
    setCurrentPage(1);
  };

  const filteredTemplates = templates.filter((t) => {
    const matchesKeyword =
      !appliedKeywords ||
      t.name.toLowerCase().includes(appliedKeywords.toLowerCase()) ||
      t.subject.toLowerCase().includes(appliedKeywords.toLowerCase());

    const matchesActive =
      appliedActiveFilter === 'All' ||
      (appliedActiveFilter === 'Active only' && t.isActive) ||
      (appliedActiveFilter === 'Inactive only' && !t.isActive);

    return matchesKeyword && matchesActive;
  });

  const totalRecords = filteredTemplates.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginatedData = filteredTemplates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleOpenEdit = (t: MessageTemplateItem) => {
    setEditingTemplate(t);
    setModalForm({
      name: t.name,
      subject: t.subject,
      isActive: t.isActive,
      limitedToStores: t.limitedToStores || 'All stores',
      body: t.body || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = async () => {
    if (!editingTemplate) return;
    try {
      const res = await fetch(`/api/admin/content/message-templates/${editingTemplate.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modalForm),
      });
      const json = await res.json();
      if (json.success) {
        showToast('The message template has been updated successfully.', 'success');
        setTemplates((prev) =>
          prev.map((item) => (item.id === editingTemplate.id ? { ...item, ...modalForm } : item))
        );
      } else {
        showToast(json.error || 'Failed to update message template', 'error');
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

      {/* ── TOP HEADER (Matching media_1791194400347.png) ── */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Message templates</h1>
      </div>

      {/* ── SEARCH CARD (Matching media_1791194400347.png) ── */}
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
          <form onSubmit={handleSearchSubmit} className="p-4 space-y-3">
            {/* Search keywords */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
                <span>Search keywords</span>
                <HelpTooltip text="Search by message template name or subject." />
              </div>
              <div className="md:col-span-9 max-w-md">
                <input
                  type="text"
                  value={searchKeywords}
                  onChange={(e) => setSearchKeywords(e.target.value)}
                  placeholder=""
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs px-2.5 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Is active */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
                <span>Is active</span>
                <HelpTooltip text="Search by active status." />
              </div>
              <div className="md:col-span-9 max-w-md">
                <select
                  value={isActiveFilter}
                  onChange={(e) => setIsActiveFilter(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs px-2.5 py-1.5 text-xs text-slate-800 bg-white cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Active only">Active only</option>
                  <option value="Inactive only">Inactive only</option>
                </select>
              </div>
            </div>

            {/* Centered Search Button */}
            <div className="text-center pt-2">
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

      {/* ── TABLE CARD (Matching media_1791194400347.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Help Link matching screenshot */}
        <div className="px-4 py-3 text-xs text-slate-600 border-b border-[#f4f4f4]">
          Learn more about{' '}
          <span className="text-[#2489c5] hover:underline cursor-pointer">message templates</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#f9fafb] text-xs text-slate-800 border-b border-[#e5e7eb] font-semibold select-none">
              <tr>
                <th className="px-4 py-3.5 font-bold">Name</th>
                <th className="px-4 py-3.5 font-bold">Subject</th>
                <th className="px-4 py-3.5 text-center font-bold w-28">Is active</th>
                <th className="px-4 py-3.5 font-bold">Limited to stores</th>
                <th className="px-4 py-3.5 text-center font-bold w-28">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f4f4]">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400 italic">
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
                    <td className="px-4 py-3 text-slate-600 font-normal">{t.subject}</td>
                    <td className="px-4 py-3 text-center">
                      {t.isActive ? (
                        <Check className="w-4 h-4 text-[#2489c5] stroke-[2.5] inline-block" />
                      ) : (
                        <X className="w-4 h-4 text-red-500 stroke-[2.5] inline-block" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-normal">{t.limitedToStores}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(t)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition cursor-pointer"
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

        {/* ── PAGINATION BAR ── */}
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
              onClick={fetchTemplates}
              className="p-1 rounded border border-[#d2d6de] hover:bg-slate-100 text-slate-600 transition cursor-pointer"
              title="Refresh"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── EDIT MODAL ── */}
      {isModalOpen && editingTemplate && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-[#d2d6de] shadow-xl w-full max-w-2xl overflow-hidden animate-fadeIn">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-[#d2d6de] flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                Edit template details - <span className="font-mono text-[#2489c5]">{editingTemplate.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-base font-bold leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span>Subject</span>
                  <HelpTooltip text="The email subject line." />
                </label>
                <input
                  type="text"
                  value={modalForm.subject}
                  onChange={(e) => setModalForm({ ...modalForm, subject: e.target.value })}
                  className="w-full border border-[#d2d6de] rounded-xs px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={modalForm.isActive}
                    onChange={(e) => setModalForm({ ...modalForm, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#2489c5] rounded border-[#d2d6de]"
                  />
                  <span className="font-semibold text-slate-700">Is active</span>
                </label>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span>Limited to stores</span>
                    <HelpTooltip text="Send emails only in selected stores." />
                  </label>
                  <select
                    value={modalForm.limitedToStores}
                    onChange={(e) => setModalForm({ ...modalForm, limitedToStores: e.target.value })}
                    className="w-full border border-[#d2d6de] rounded-xs px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc]"
                  >
                    <option value="All stores">All stores</option>
                    <option value="Agri-Mart Main Store">Agri-Mart Main Store</option>
                    <option value="Agri-Mart Regional Hub">Agri-Mart Regional Hub</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span>Body</span>
                  <HelpTooltip text="The message template body." />
                </label>
                <textarea
                  rows={6}
                  value={modalForm.body}
                  onChange={(e) => setModalForm({ ...modalForm, body: e.target.value })}
                  className="w-full border border-[#d2d6de] rounded-xs p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] font-sans resize-y"
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
