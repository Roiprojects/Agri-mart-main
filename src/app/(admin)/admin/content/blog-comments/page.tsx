'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  RotateCw,
  Trash2,
  Check,
  X,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Edit,
  CheckSquare,
  MinusSquare,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface BlogCommentItem {
  id: string;
  blogPostTitle: string;
  customerName: string;
  customerEmail?: string;
  comment: string;
  createdOn: string;
  createdDateOnly: string; // YYYY-MM-DD
  approved: boolean;
}

const initialBlogComments: BlogCommentItem[] = [
  {
    id: '1',
    blogPostTitle: 'Top 5 Organic Fertilizers for Cotton Yield Maximization',
    customerName: 'Ramesh Patel',
    customerEmail: 'ramesh.patel@agri.in',
    comment: 'Tried vermicompost with neem cake formulation and saw 15% better boll retention!',
    createdOn: '09/14/2026 8:45 AM',
    createdDateOnly: '2026-09-14',
    approved: true,
  },
  {
    id: '2',
    blogPostTitle: 'Drip vs Sprinkler: Which irrigation saves more groundwater?',
    customerName: 'Sunita Devi',
    customerEmail: 'sunita.devi@farmer.org',
    comment: 'Can we install automated solenoids with solar timers on drip pipes?',
    createdOn: '09/22/2026 4:10 PM',
    createdDateOnly: '2026-09-22',
    approved: true,
  },
  {
    id: '3',
    blogPostTitle: 'How Drone Spraying Cuts Chemical Costs by 30%',
    customerName: 'Mahesh Patil',
    customerEmail: 'mahesh.drone@krishi.com',
    comment: 'Booked 10 acres of aerial spray last week, droplet coverage was very uniform.',
    createdOn: '10/02/2026 1:05 PM',
    createdDateOnly: '2026-10-02',
    approved: false,
  },
];

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

function BlogCommentsContent() {
  const searchParams = useSearchParams();
  const initialPostTitle = searchParams.get('postTitle') || '';

  const [comments, setComments] = useState<BlogCommentItem[]>(initialBlogComments);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Search Filters matching media_1791199270512.png
  const [createdFrom, setCreatedFrom] = useState('');
  const [createdTo, setCreatedTo] = useState('');
  const [approvedFilter, setApprovedFilter] = useState<'all' | 'approved' | 'disapproved'>('all');
  const [messageFilter, setMessageFilter] = useState(initialPostTitle);
  const [appliedFilters, setAppliedFilters] = useState({
    createdFrom: '',
    createdTo: '',
    approvedFilter: 'all',
    messageFilter: initialPostTitle,
  });

  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOpen, setSearchOpen] = useState(true);

  // Edit Modal State
  const [editingComment, setEditingComment] = useState<BlogCommentItem | null>(null);
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editCommentText, setEditCommentText] = useState('');
  const [editApproved, setEditApproved] = useState(true);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (initialPostTitle) {
      setMessageFilter(initialPostTitle);
      setAppliedFilters((prev) => ({ ...prev, messageFilter: initialPostTitle }));
    }
  }, [initialPostTitle]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAppliedFilters({
      createdFrom,
      createdTo,
      approvedFilter,
      messageFilter: messageFilter.trim(),
    });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setCreatedFrom('');
    setCreatedTo('');
    setApprovedFilter('all');
    setMessageFilter('');
    setAppliedFilters({
      createdFrom: '',
      createdTo: '',
      approvedFilter: 'all',
      messageFilter: '',
    });
    setCurrentPage(1);
  };

  // Filter logic
  const filteredComments = comments.filter((c) => {
    if (appliedFilters.createdFrom) {
      if (c.createdDateOnly < appliedFilters.createdFrom) return false;
    }
    if (appliedFilters.createdTo) {
      if (c.createdDateOnly > appliedFilters.createdTo) return false;
    }
    if (appliedFilters.approvedFilter === 'approved' && !c.approved) return false;
    if (appliedFilters.approvedFilter === 'disapproved' && c.approved) return false;
    if (appliedFilters.messageFilter) {
      const q = appliedFilters.messageFilter.toLowerCase();
      const match =
        c.blogPostTitle.toLowerCase().includes(q) ||
        c.comment.toLowerCase().includes(q) ||
        c.customerName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalRecords = filteredComments.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginatedData = filteredComments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Selection
  const isAllSelected =
    paginatedData.length > 0 && paginatedData.every((c) => selectedIds.includes(c.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      const pageIds = paginatedData.map((c) => c.id);
      setSelectedIds(selectedIds.filter((id) => !pageIds.includes(id)));
    } else {
      const pageIds = paginatedData.map((c) => c.id);
      setSelectedIds(Array.from(new Set([...selectedIds, ...pageIds])));
    }
  };

  const handleToggleRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Bulk actions
  const handleApproveSelected = () => {
    if (selectedIds.length === 0) {
      showToast('Please select at least one comment to approve.', 'error');
      return;
    }
    setComments((prev) =>
      prev.map((c) => (selectedIds.includes(c.id) ? { ...c, approved: true } : c))
    );
    showToast(`${selectedIds.length} comment(s) approved successfully.`);
  };

  const handleDisapproveSelected = () => {
    if (selectedIds.length === 0) {
      showToast('Please select at least one comment to disapprove.', 'error');
      return;
    }
    setComments((prev) =>
      prev.map((c) => (selectedIds.includes(c.id) ? { ...c, approved: false } : c))
    );
    showToast(`${selectedIds.length} comment(s) disapproved successfully.`);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      showToast('Please select at least one comment to delete.', 'error');
      return;
    }
    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected comment(s)?`)) {
      setComments((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
      setSelectedIds([]);
      showToast('Selected comment(s) have been deleted.');
    }
  };

  const handleDeleteSingle = (id: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      setComments((prev) => prev.filter((c) => c.id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      showToast('Comment deleted successfully.');
    }
  };

  // Edit single
  const openEditModal = (item: BlogCommentItem) => {
    setEditingComment(item);
    setEditCustomerName(item.customerName);
    setEditCommentText(item.comment);
    setEditApproved(item.approved);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComment) return;
    if (!editCommentText.trim()) {
      showToast('Comment text is required', 'error');
      return;
    }
    setComments((prev) =>
      prev.map((c) =>
        c.id === editingComment.id
          ? {
              ...c,
              customerName: editCustomerName,
              comment: editCommentText,
              approved: editApproved,
            }
          : c
      )
    );
    setEditingComment(null);
    showToast('The blog comment has been updated successfully.');
  };

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-16 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded shadow-lg text-xs font-semibold transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
            toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/content/blog-posts"
            className="p-1 rounded hover:bg-slate-200 text-slate-600 transition"
            title="Back to blog posts"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Blog comments</h1>
        </div>

        {/* Top 3 Action Buttons matching screenshot */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleApproveSelected}
            className="bg-[#28a745] hover:bg-[#218838] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Approve selected</span>
          </button>
          <button
            type="button"
            onClick={handleDisapproveSelected}
            className="bg-[#6c757d] hover:bg-[#5a6268] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <MinusSquare className="w-3.5 h-3.5" />
            <span>Disapprove selected</span>
          </button>
          <button
            type="button"
            onClick={handleDeleteSelected}
            className="bg-[#d73925] hover:bg-[#c9302c] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete selected</span>
          </button>
        </div>
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
          <form onSubmit={handleSearchSubmit} className="p-5 space-y-4 text-xs text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {/* Row 1 Left: Created from */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="sm:w-36 text-xs font-medium text-slate-700 sm:text-right flex items-center sm:justify-end gap-1 whitespace-nowrap">
                  <span>Created from</span>
                  <HelpTooltip text="The create from date." />
                </label>
                <div className="flex-1 max-w-xs">
                  <input
                    type="date"
                    value={createdFrom}
                    onChange={(e) => setCreatedFrom(e.target.value)}
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>

              {/* Row 1 Right: Approved */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="sm:w-36 text-xs font-medium text-slate-700 sm:text-right flex items-center sm:justify-end gap-1 whitespace-nowrap">
                  <span>Approved</span>
                  <HelpTooltip text="Filter by approved/disapproved status." />
                </label>
                <div className="flex-1 max-w-xs relative">
                  <select
                    value={approvedFilter}
                    onChange={(e) =>
                      setApprovedFilter(e.target.value as 'all' | 'approved' | 'disapproved')
                    }
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white appearance-none pr-8 cursor-pointer"
                  >
                    <option value="all">All</option>
                    <option value="approved">Approved only</option>
                    <option value="disapproved">Disapproved only</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Row 2 Left: Created to */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="sm:w-36 text-xs font-medium text-slate-700 sm:text-right flex items-center sm:justify-end gap-1 whitespace-nowrap">
                  <span>Created to</span>
                  <HelpTooltip text="The create to date." />
                </label>
                <div className="flex-1 max-w-xs">
                  <input
                    type="date"
                    value={createdTo}
                    onChange={(e) => setCreatedTo(e.target.value)}
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>

              {/* Row 2 Right: Message */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="sm:w-36 text-xs font-medium text-slate-700 sm:text-right flex items-center sm:justify-end gap-1 whitespace-nowrap">
                  <span>Message</span>
                  <HelpTooltip text="Search by comment text, blog post title, or customer name." />
                </label>
                <div className="flex-1 max-w-xs">
                  <input
                    type="text"
                    value={messageFilter}
                    onChange={(e) => setMessageFilter(e.target.value)}
                    placeholder=""
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Centered Search Button */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-medium px-6 py-2 rounded flex items-center justify-center gap-2 shadow-2xs transition cursor-pointer"
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
        {/* Info link matching screenshot */}
        <div className="px-4 pt-3.5 pb-2.5 text-xs text-slate-600">
          Learn more about{' '}
          <a
            href="https://docs.nopcommerce.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3c8dbc] hover:underline"
          >
            blog
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#f9fafb] text-xs font-bold text-slate-800 border-t border-b border-[#d2d6de]">
              <tr>
                <th className="w-9 px-3 py-3.5 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                  />
                </th>
                <th className="px-4 py-3.5 font-bold">Blog post</th>
                <th className="px-4 py-3.5 font-bold">Customer</th>
                <th className="px-4 py-3.5 font-bold">Comment</th>
                <th className="px-4 py-3.5 font-bold">Created on</th>
                <th className="px-4 py-3.5 font-bold text-center">Approved</th>
                <th className="px-4 py-3.5 font-bold text-center w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebebeb]">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400 italic">
                    No blog comments found
                  </td>
                </tr>
              ) : (
                paginatedData.map((c) => {
                  const isChecked = selectedIds.includes(c.id);
                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isChecked ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <td className="px-3 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleRow(c.id)}
                          className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                        />
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{c.blogPostTitle}</td>
                      <td className="px-4 py-3 text-[#2489c5] font-semibold hover:underline cursor-pointer">
                        {c.customerName}
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-sm">{c.comment}</td>
                      <td className="px-4 py-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {c.createdOn}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {c.approved ? (
                          <Check className="w-4 h-4 text-[#2489c5] inline-block stroke-[2.5]" />
                        ) : (
                          <X className="w-4 h-4 text-red-500 inline-block stroke-[2.5]" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="inline-flex items-center justify-center gap-1.5">
                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => openEditModal(c)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition cursor-pointer"
                          >
                            <Edit className="h-3 w-3 text-slate-600" />
                            <span>Edit</span>
                          </button>
                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteSingle(c.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-red-200 bg-white text-red-600 hover:bg-red-50 text-xs font-semibold shadow-2xs transition cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
              onClick={handleResetFilters}
              className="p-1 border border-[#d2d6de] rounded bg-white hover:bg-slate-100 text-slate-600 transition shadow-2xs cursor-pointer"
              title="Refresh / Reset"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── EDIT COMMENT MODAL ── */}
      {editingComment && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#d2d6de] shadow-xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-[#d2d6de] flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Edit blog comment</h3>
              <button
                type="button"
                onClick={() => setEditingComment(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs text-slate-700">
              {/* Blog post (read-only) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right">
                  Blog post
                </label>
                <div className="md:col-span-9 font-medium text-slate-800 bg-slate-100 rounded px-3 py-1.5 border border-slate-200">
                  {editingComment.blogPostTitle}
                </div>
              </div>

              {/* Customer */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right">
                  Customer
                </label>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={editCustomerName}
                    onChange={(e) => setEditCustomerName(e.target.value)}
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>

              {/* Comment text */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                <label className="md:col-span-3 pt-2 text-xs font-semibold text-slate-700 md:text-right">
                  Comment
                </label>
                <div className="md:col-span-9">
                  <textarea
                    rows={4}
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                    required
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded p-3 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>

              {/* Approved */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right">
                  Approved
                </label>
                <div className="md:col-span-9 flex items-center">
                  <input
                    type="checkbox"
                    checked={editApproved}
                    onChange={(e) => setEditApproved(e.target.checked)}
                    className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingComment(null)}
                  className="px-4 py-1.5 rounded border border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-4 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BlogCommentsPage() {
  return (
    <Suspense fallback={<div className="p-4 text-xs text-slate-500">Loading comments...</div>}>
      <BlogCommentsContent />
    </Suspense>
  );
}
