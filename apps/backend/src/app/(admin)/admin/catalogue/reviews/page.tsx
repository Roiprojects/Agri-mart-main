'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  ChevronUp,
  ChevronDown,
  Check,
  Minus,
  Trash2,
  Edit,
  X,
  RotateCw,
  Star,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Filter,
} from 'lucide-react';

interface Review {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  customerName: string;
  customerEmail?: string;
  userMobile?: string;
  rating: number;
  title: string;
  comment: string;
  replyText?: string;
  verifiedPurchase: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isApproved: boolean;
  createdAt: string;
}

const STATUS_TABS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const;
type StatusTab = (typeof STATUS_TABS)[number];

export default function AdminReviewsPage() {
  // Data State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Search Collapsible State
  const [searchOpen, setSearchOpen] = useState(true);

  // Filter Form States
  const [filterCreatedFrom, setFilterCreatedFrom] = useState('');
  const [filterCreatedTo, setFilterCreatedTo] = useState('');
  const [filterMessage, setFilterMessage] = useState('');
  const [filterApproved, setFilterApproved] = useState<'All' | 'Approved only' | 'Disapproved only'>('All');
  const [filterProduct, setFilterProduct] = useState('');

  // Applied Search Filters
  const [appliedFilters, setAppliedFilters] = useState({
    createdFrom: '',
    createdTo: '',
    message: '',
    approved: 'All' as 'All' | 'Approved only' | 'Disapproved only',
    product: '',
  });

  // Status Tab Filter
  const [selectedStatusTab, setSelectedStatusTab] = useState<StatusTab>('ALL');

  // Pagination State
  const [pageSize, setPageSize] = useState<number>(15);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    comment: '',
    replyText: '',
    rating: 5,
    isApproved: true,
    status: 'APPROVED' as 'PENDING' | 'APPROVED' | 'REJECTED',
  });

  // Delete Confirm Modal State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Helper date formatter matching screenshot e.g. "01/06/2022 9:47:57 PM"
  const formatNopDate = (isoString: string): string => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const yyyy = d.getFullYear();
      let hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${mm}/${dd}/${yyyy} ${hours}:${minutes}:${seconds} ${ampm}`;
    } catch {
      return isoString;
    }
  };

  // Fetch reviews from API
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/catalogue/reviews');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setReviews(json.data);
      } else {
        showToast(json.error || 'Failed to load reviews', 'error');
      }
    } catch (err: any) {
      showToast('Error loading reviews: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Handle Search submit
  const handleSearch = () => {
    setAppliedFilters({
      createdFrom: filterCreatedFrom,
      createdTo: filterCreatedTo,
      message: filterMessage,
      approved: filterApproved,
      product: filterProduct,
    });
    setCurrentPage(1);
  };

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      // 1. Status Tab filter
      if (selectedStatusTab !== 'ALL') {
        if (r.status !== selectedStatusTab) return false;
      }

      // 2. Created from filter
      if (appliedFilters.createdFrom) {
        const fromDate = new Date(appliedFilters.createdFrom);
        const itemDate = new Date(r.createdAt);
        if (itemDate < fromDate) return false;
      }

      // 3. Created to filter
      if (appliedFilters.createdTo) {
        const toDate = new Date(appliedFilters.createdTo + 'T23:59:59Z');
        const itemDate = new Date(r.createdAt);
        if (itemDate > toDate) return false;
      }

      // 4. Message search
      if (appliedFilters.message.trim()) {
        const query = appliedFilters.message.toLowerCase().trim();
        const inTitle = r.title?.toLowerCase().includes(query);
        const inComment = r.comment?.toLowerCase().includes(query);
        const inReply = r.replyText?.toLowerCase().includes(query);
        if (!inTitle && !inComment && !inReply) return false;
      }

      // 5. Approved dropdown
      if (appliedFilters.approved === 'Approved only') {
        if (r.status !== 'APPROVED') return false;
      } else if (appliedFilters.approved === 'Disapproved only') {
        if (r.status === 'APPROVED') return false;
      }

      // 6. Product filter
      if (appliedFilters.product.trim()) {
        const pQuery = appliedFilters.product.toLowerCase().trim();
        if (!r.productName?.toLowerCase().includes(pQuery)) return false;
      }

      return true;
    });
  }, [reviews, selectedStatusTab, appliedFilters]);

  // Paginated reviews
  const totalItems = filteredReviews.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredReviews.slice(startIndex, startIndex + pageSize);
  }, [filteredReviews, currentPage, pageSize]);

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = paginatedReviews.map((r) => r.id);
      setSelectedIds(Array.from(new Set([...selectedIds, ...allIds])));
    } else {
      const currentIds = paginatedReviews.map((r) => r.id);
      setSelectedIds(selectedIds.filter((id) => !currentIds.includes(id)));
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const isAllSelected =
    paginatedReviews.length > 0 &&
    paginatedReviews.every((r) => selectedIds.includes(r.id));

  // Bulk Approve handler
  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) {
      showToast('No reviews selected.', 'error');
      return;
    }
    try {
      setSaving(true);
      const res = await fetch('/api/admin/catalogue/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, action: 'approve' }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Approved ${selectedIds.length} review(s) successfully!`);
        setSelectedIds([]);
        fetchReviews();
      } else {
        showToast(json.error || 'Failed to approve reviews', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Bulk Disapprove handler
  const handleBulkDisapprove = async () => {
    if (selectedIds.length === 0) {
      showToast('No reviews selected.', 'error');
      return;
    }
    try {
      setSaving(true);
      const res = await fetch('/api/admin/catalogue/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, action: 'disapprove' }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Disapproved ${selectedIds.length} review(s) successfully!`);
        setSelectedIds([]);
        fetchReviews();
      } else {
        showToast(json.error || 'Failed to disapprove reviews', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Bulk Delete handler
  const handleBulkDeleteConfirm = () => {
    if (selectedIds.length === 0) {
      showToast('No reviews selected for deletion.', 'error');
      return;
    }
    setDeleteTargetIds(selectedIds);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (deleteTargetIds.length === 0) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/catalogue/reviews?ids=${deleteTargetIds.join(',')}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Deleted ${deleteTargetIds.length} review(s) successfully!`);
        setSelectedIds((prev) => prev.filter((id) => !deleteTargetIds.includes(id)));
        setDeleteConfirmOpen(false);
        setDeleteTargetIds([]);
        fetchReviews();
      } else {
        showToast(json.error || 'Failed to delete reviews', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (review: Review) => {
    setEditingReview(review);
    setEditForm({
      title: review.title || '',
      comment: review.comment || '',
      replyText: review.replyText || '',
      rating: review.rating || 5,
      isApproved: review.status === 'APPROVED',
      status: review.status || 'APPROVED',
    });
    setEditModalOpen(true);
  };

  // Save Edit Review
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    try {
      setSaving(true);
      const res = await fetch('/api/admin/catalogue/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingReview.id,
          title: editForm.title,
          comment: editForm.comment,
          replyText: editForm.replyText,
          rating: editForm.rating,
          status: editForm.isApproved ? 'APPROVED' : (editForm.status === 'APPROVED' ? 'REJECTED' : editForm.status),
          isApproved: editForm.isApproved,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('Review updated successfully!');
        setEditModalOpen(false);
        setEditingReview(null);
        fetchReviews();
      } else {
        showToast(json.error || 'Failed to update review', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Tooltip Helper
  const Tooltip = ({ text }: { text: string }) => (
    <span
      title={text}
      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] cursor-help font-bold shrink-0 select-none ml-1"
    >
      ?
    </span>
  );

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

      {/* TOP HEADER: Title + Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Product reviews</h1>

        <div className="flex flex-wrap items-center gap-2">
          {/* Approve selected */}
          <button
            type="button"
            onClick={handleBulkApprove}
            disabled={saving || selectedIds.length === 0}
            className="bg-[#00a65a] hover:bg-[#008d4c] disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Approve selected</span>
          </button>

          {/* Disapprove selected */}
          <button
            type="button"
            onClick={handleBulkDisapprove}
            disabled={saving || selectedIds.length === 0}
            className="bg-[#6c757d] hover:bg-[#5a6268] disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Disapprove selected</span>
          </button>

          {/* Delete selected */}
          <button
            type="button"
            onClick={handleBulkDeleteConfirm}
            disabled={saving || selectedIds.length === 0}
            className="bg-[#dd4b39] hover:bg-[#c23321] disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete (selected)</span>
          </button>
        </div>
      </div>

      {/* SEARCH CARD (Collapsible) */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Card Header */}
        <div
          onClick={() => setSearchOpen(!searchOpen)}
          className="border-b border-[#f4f4f4] px-4 py-2.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm">
            <Search className="w-4 h-4 text-slate-800" />
            <span>Search</span>
          </div>
          <button
            type="button"
            className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none cursor-pointer"
          >
            {searchOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Card Body */}
        {searchOpen && (
          <div className="p-4 sm:p-6 space-y-4 text-xs text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {/* LEFT COLUMN */}
              <div className="space-y-3">
                {/* Created from */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-4 flex items-center justify-start sm:justify-end font-medium text-slate-700">
                    <span>Created from</span>
                    <Tooltip text="The creation from date for the search." />
                  </div>
                  <div className="sm:col-span-8">
                    <input
                      type="date"
                      value={filterCreatedFrom}
                      onChange={(e) => setFilterCreatedFrom(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700"
                    />
                  </div>
                </div>

                {/* Created to */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-4 flex items-center justify-start sm:justify-end font-medium text-slate-700">
                    <span>Created to</span>
                    <Tooltip text="The creation to date for the search." />
                  </div>
                  <div className="sm:col-span-8">
                    <input
                      type="date"
                      value={filterCreatedTo}
                      onChange={(e) => setFilterCreatedTo(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-4 flex items-center justify-start sm:justify-end font-medium text-slate-700">
                    <span>Message</span>
                    <Tooltip text="Search by message or review text." />
                  </div>
                  <div className="sm:col-span-8">
                    <input
                      type="text"
                      value={filterMessage}
                      onChange={(e) => setFilterMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder=""
                      className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-3">
                {/* Approved */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-4 flex items-center justify-start sm:justify-end font-medium text-slate-700">
                    <span>Approved</span>
                    <Tooltip text="Search by an approval status." />
                  </div>
                  <div className="sm:col-span-8">
                    <select
                      value={filterApproved}
                      onChange={(e) => setFilterApproved(e.target.value as any)}
                      className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700"
                    >
                      <option value="All">All</option>
                      <option value="Approved only">Approved only</option>
                      <option value="Disapproved only">Disapproved only</option>
                    </select>
                  </div>
                </div>

                {/* Product */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-4 flex items-center justify-start sm:justify-end font-medium text-slate-700">
                    <span>Product</span>
                    <Tooltip text="A product name." />
                  </div>
                  <div className="sm:col-span-8">
                    <input
                      type="text"
                      value={filterProduct}
                      onChange={(e) => setFilterProduct(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder=""
                      className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SEARCH BUTTON */}
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={handleSearch}
                className="bg-[#2585be] hover:bg-[#1f72a3] text-white text-xs font-semibold px-6 py-2 rounded flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* STATUS FILTER PILLS BAR (Matching media_1791000818771.png) */}
      <div className="bg-white rounded border border-[#d2d6de] px-4 py-2.5 flex items-center gap-3 overflow-x-auto shadow-2xs">
        <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs uppercase tracking-wider shrink-0 mr-1">
          <Filter className="w-4 h-4 text-slate-600 stroke-[2.5]" />
          <span>Filter</span>
        </div>

        <div className="flex items-center gap-2">
          {STATUS_TABS.map((tab) => {
            const isActive = selectedStatusTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setSelectedStatusTab(tab);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none whitespace-nowrap ${
                  isActive
                    ? 'bg-[#00a65a] text-white shadow-xs'
                    : 'text-[#2585be] hover:text-[#1f72a3] hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Helper Documentation Link */}
        <div className="px-4 py-2 border-b border-[#f4f4f4] bg-slate-50/50 flex items-center justify-between text-xs">
          <a
            href="https://docs.nopcommerce.com/en/running-your-store/catalog/products/product-reviews.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3c8dbc] hover:underline flex items-center gap-1 font-medium"
          >
            <span>Learn more about product reviews</span>
            <ExternalLink className="w-3 h-3 text-[#3c8dbc]" />
          </a>

          <button
            type="button"
            onClick={fetchReviews}
            title="Refresh reviews"
            className="text-slate-500 hover:text-slate-800 p-1 rounded transition"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f4f4f4] border-b border-[#d2d6de] text-slate-700 font-semibold select-none">
                <th className="p-2.5 w-10 text-center border-r border-[#d2d6de]">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="rounded border-[#d2d6de] text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </th>
                <th className="p-2.5 border-r border-[#d2d6de] min-w-[160px]">Product</th>
                <th className="p-2.5 border-r border-[#d2d6de] min-w-[160px]">Customer</th>
                <th className="p-2.5 border-r border-[#d2d6de] min-w-[100px]">Title</th>
                <th className="p-2.5 border-r border-[#d2d6de] min-w-[160px]">Review text</th>
                <th className="p-2.5 border-r border-[#d2d6de] min-w-[140px]">Reply text</th>
                <th className="p-2.5 border-r border-[#d2d6de] text-center w-16">Rating</th>
                <th className="p-2.5 border-r border-[#d2d6de] text-center w-24">Is approved</th>
                <th className="p-2.5 border-r border-[#d2d6de] text-center min-w-[170px]">Created on</th>
                <th className="p-2.5 text-center w-20">Edit</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-slate-500 bg-white">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RotateCw className="w-5 h-5 animate-spin text-[#3c8dbc]" />
                      <span>Loading product reviews...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedReviews.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-slate-400 bg-white">
                    No product reviews found.
                  </td>
                </tr>
              ) : (
                paginatedReviews.map((r, index) => {
                  const isSelected = selectedIds.includes(r.id);
                  const isEven = index % 2 === 1;
                  const rowBg = isSelected
                    ? 'bg-blue-50/70'
                    : isEven
                    ? 'bg-[#f9f9f9]'
                    : 'bg-white';

                  const isApproved = r.status === 'APPROVED';

                  return (
                    <tr
                      key={r.id}
                      className={`${rowBg} hover:bg-[#f1f1f1] border-b border-[#e9ecef] transition-colors`}
                    >
                      {/* Checkbox */}
                      <td className="p-2.5 text-center border-r border-[#e9ecef]">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(r.id)}
                          className="rounded border-[#d2d6de] text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                        />
                      </td>

                      {/* Product */}
                      <td className="p-2.5 border-r border-[#e9ecef]">
                        <Link
                          href={`/admin/catalogue/products?search=${encodeURIComponent(r.productName || '')}`}
                          className="text-[#3c8dbc] hover:underline font-normal"
                        >
                          {r.productName || 'Product'}
                        </Link>
                      </td>

                      {/* Customer */}
                      <td className="p-2.5 border-r border-[#e9ecef]">
                        <span className="text-[#3c8dbc] hover:underline cursor-pointer">
                          {r.customerName || r.userId}
                        </span>
                      </td>

                      {/* Title */}
                      <td className="p-2.5 border-r border-[#e9ecef] text-slate-700">
                        {r.title || '—'}
                      </td>

                      {/* Review text */}
                      <td className="p-2.5 border-r border-[#e9ecef] text-slate-700 max-w-xs break-words">
                        {r.comment || '—'}
                      </td>

                      {/* Reply text */}
                      <td className="p-2.5 border-r border-[#e9ecef] text-slate-600 max-w-xs break-words">
                        {r.replyText || '—'}
                      </td>

                      {/* Rating */}
                      <td className="p-2.5 border-r border-[#e9ecef] text-center font-medium text-slate-800">
                        {r.rating}
                      </td>

                      {/* Is approved */}
                      <td className="p-2.5 border-r border-[#e9ecef] text-center">
                        {isApproved ? (
                          <span className="text-[#00a65a] font-bold text-sm">✓</span>
                        ) : (
                          <span className="text-[#dd4b39] font-bold text-sm">✕</span>
                        )}
                      </td>

                      {/* Created on */}
                      <td className="p-2.5 border-r border-[#e9ecef] text-center text-slate-600 whitespace-nowrap">
                        {formatNopDate(r.createdAt)}
                      </td>

                      {/* Edit button */}
                      <td className="p-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => openEditModal(r)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded border border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-100 shadow-2xs transition cursor-pointer"
                        >
                          <Edit className="w-3 h-3 text-slate-600" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGING FOOTER (Matching nopCommerce Table Pagination) */}
        <div className="p-3 border-t border-[#d2d6de] bg-[#fcfcfc] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 select-none">
          {/* Previous / Page / Next */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded border border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`px-2.5 py-1 rounded border transition cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#3c8dbc] border-[#3c8dbc] text-white font-bold'
                    : 'border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded border border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
            >
              Next
            </button>
          </div>

          {/* Page size dropdown */}
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 rounded border border-[#d2d6de] bg-white text-slate-700 focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>items</span>
          </div>

          {/* Summary and Refresh */}
          <div className="flex items-center gap-3">
            <span>
              {totalItems === 0
                ? '0 items'
                : `${(currentPage - 1) * pageSize + 1}-${Math.min(
                    currentPage * pageSize,
                    totalItems
                  )} of ${totalItems} items`}
            </span>
            <button
              type="button"
              onClick={fetchReviews}
              className="p-1 text-slate-500 hover:text-slate-800 focus:outline-none cursor-pointer"
              title="Refresh"
            >
              <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* EDIT REVIEW MODAL */}
      {editModalOpen && editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded border border-[#d2d6de] shadow-xl w-full max-w-xl overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-slate-50 border-b border-[#d2d6de] px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-1.5">
                <Edit className="w-4 h-4 text-[#3c8dbc]" />
                <span>Edit product review</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveEdit} className="p-4 sm:p-6 space-y-4 text-xs text-slate-700">
              {/* Product (Read-only) */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <div className="sm:col-span-4 font-medium text-slate-700 sm:text-right">
                  Product
                </div>
                <div className="sm:col-span-8 font-semibold text-[#3c8dbc]">
                  {editingReview.productName}
                </div>
              </div>

              {/* Customer (Read-only) */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <div className="sm:col-span-4 font-medium text-slate-700 sm:text-right">
                  Customer
                </div>
                <div className="sm:col-span-8 text-slate-700">
                  {editingReview.customerName}
                </div>
              </div>

              {/* Title */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <div className="sm:col-span-4 font-medium text-slate-700 sm:text-right">
                  Title
                </div>
                <div className="sm:col-span-8">
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                  />
                </div>
              </div>

              {/* Review text */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-start gap-2">
                <div className="sm:col-span-4 font-medium text-slate-700 sm:text-right pt-1.5">
                  Review text
                </div>
                <div className="sm:col-span-8">
                  <textarea
                    rows={3}
                    required
                    value={editForm.comment}
                    onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                  />
                </div>
              </div>

              {/* Reply text */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-start gap-2">
                <div className="sm:col-span-4 font-medium text-slate-700 sm:text-right pt-1.5">
                  Reply text
                </div>
                <div className="sm:col-span-8">
                  <textarea
                    rows={2}
                    placeholder="Enter store reply to this review..."
                    value={editForm.replyText}
                    onChange={(e) => setEditForm({ ...editForm, replyText: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <div className="sm:col-span-4 font-medium text-slate-700 sm:text-right">
                  Rating
                </div>
                <div className="sm:col-span-8 flex items-center gap-2">
                  <select
                    value={editForm.rating}
                    onChange={(e) => setEditForm({ ...editForm, rating: Number(e.target.value) })}
                    className="text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                  >
                    <option value={1}>1 star</option>
                    <option value={2}>2 stars</option>
                    <option value={3}>3 stars</option>
                    <option value={4}>4 stars</option>
                    <option value={5}>5 stars</option>
                  </select>
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < editForm.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Is approved */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <div className="sm:col-span-4 font-medium text-slate-700 sm:text-right">
                  Is approved
                </div>
                <div className="sm:col-span-8 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editIsApproved"
                    checked={editForm.isApproved}
                    onChange={(e) => setEditForm({ ...editForm, isApproved: e.target.checked })}
                    className="rounded border-[#d2d6de] text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                  <label htmlFor="editIsApproved" className="cursor-pointer text-slate-700">
                    Approved
                  </label>
                </div>
              </div>

              {/* Status Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <div className="sm:col-span-4 font-medium text-slate-700 sm:text-right">
                  Status
                </div>
                <div className="sm:col-span-8">
                  <select
                    value={editForm.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as 'PENDING' | 'APPROVED' | 'REJECTED';
                      setEditForm({
                        ...editForm,
                        status: newStatus,
                        isApproved: newStatus === 'APPROVED',
                      });
                    }}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
                  >
                    <option value="APPROVED">APPROVED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-[#d2d6de] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-1.5 rounded border border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-1.5 rounded bg-[#2585be] hover:bg-[#1f72a3] text-white font-semibold transition cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded border border-[#d2d6de] shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="bg-slate-50 border-b border-[#d2d6de] px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-1.5 text-red-600">
                <Trash2 className="w-4 h-4" />
                <span>Confirm Deletion</span>
              </h3>
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 sm:p-5 text-xs text-slate-700 space-y-3">
              <p>
                Are you sure you want to delete{' '}
                <span className="font-bold text-slate-900">{deleteTargetIds.length}</span> selected
                product review(s)?
              </p>
              <p className="text-slate-500">This action cannot be undone.</p>
              <div className="pt-3 border-t border-[#d2d6de] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-3.5 py-1.5 rounded border border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={executeDelete}
                  className="px-4 py-1.5 rounded bg-[#dd4b39] hover:bg-[#c23321] text-white font-semibold transition cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-8 border-t border-[#d2d6de] pt-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <span>Powered by</span>
          <a
            href="https://www.nopcommerce.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3c8dbc] hover:underline"
          >
            nopCommerce
          </a>
        </div>
        <div>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}{' '}
          {new Date().toLocaleTimeString()}
        </div>
        <div>nopCommerce version 4.90.0</div>
      </footer>

      {/* Floating Scroll to Top button */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-2.5 rounded-full bg-[#00a65a] hover:bg-[#008d4c] text-white shadow-lg transition cursor-pointer z-40"
        title="Scroll to top"
      >
        <ChevronUp className="w-5 h-5 stroke-[2.5]" />
      </button>
    </div>
  );
}
