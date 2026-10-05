'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  RotateCw,
  ChevronUp,
  ChevronDown,
  Calendar,
  X,
  Check,
  Edit,
} from 'lucide-react';

interface DiscountRecord {
  id: string;
  name: string;
  discountType: string;
  discount: string;
  startDate: string;
  endDate: string;
  couponCode?: string;
  isActive: boolean;
}

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

export default function DiscountsPage() {
  // Search Form State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [discountType, setDiscountType] = useState('All');
  const [couponCode, setCouponCode] = useState('');
  const [discountName, setDiscountName] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState('All');

  // Search Panel Collapse Toggle
  const [searchOpen, setSearchOpen] = useState(true);

  // Pagination & Display
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);

  // Add New Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    name: '',
    discountType: 'Assigned to products',
    discount: '',
    couponCode: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });

  // Discounts state - default empty matching screenshot, with ability to add or test
  const [discounts, setDiscounts] = useState<DiscountRecord[]>([]);

  // Filter logic
  const filteredDiscounts = discounts.filter((d) => {
    if (discountName && !d.name.toLowerCase().includes(discountName.toLowerCase())) {
      return false;
    }
    if (couponCode && (!d.couponCode || !d.couponCode.toLowerCase().includes(couponCode.toLowerCase()))) {
      return false;
    }
    if (discountType !== 'All' && d.discountType !== discountType) {
      return false;
    }
    if (isActiveFilter === 'Active only' && !d.isActive) {
      return false;
    }
    if (isActiveFilter === 'Inactive only' && d.isActive) {
      return false;
    }
    if (startDate && d.startDate && d.startDate < startDate) {
      return false;
    }
    if (endDate && d.endDate && d.endDate > endDate) {
      return false;
    }
    return true;
  });

  const totalRecords = filteredDiscounts.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginatedData = filteredDiscounts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCurrentPage(1);
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setDiscountType('All');
    setCouponCode('');
    setDiscountName('');
    setIsActiveFilter('All');
    setCurrentPage(1);
  };

  const handleCreateDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name.trim()) return;

    const newDiscount: DiscountRecord = {
      id: `disc-${Date.now()}`,
      name: newForm.name.trim(),
      discountType: newForm.discountType,
      discount: newForm.discount.trim() || '10%',
      startDate: newForm.startDate || '—',
      endDate: newForm.endDate || '—',
      couponCode: newForm.couponCode.trim() || undefined,
      isActive: newForm.isActive,
    };

    setDiscounts((prev) => [newDiscount, ...prev]);
    setIsAddModalOpen(false);
    setNewForm({
      name: '',
      discountType: 'Assigned to products',
      discount: '',
      couponCode: '',
      startDate: '',
      endDate: '',
      isActive: true,
    });
  };

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-16 font-sans">
      {/* ── TOP HEADER: Discounts + Add new button (Matching media_1791173765894.png) ── */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Discounts</h1>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add new</span>
        </button>
      </div>

      {/* ── SEARCH CARD (Matching media_1791173765894.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-[#f4f4f4] bg-white">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <Search className="w-4 h-4 text-slate-600 stroke-[2.2]" />
            <span>Search</span>
          </div>
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-slate-500 hover:text-slate-800 transition p-1"
          >
            {searchOpen ? (
              <ChevronUp className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <ChevronDown className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        </div>

        {/* Search Body */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="p-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5">
              {/* Left Column */}
              <div className="space-y-3">
                {/* Start date */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-4 flex items-center justify-end gap-1.5 text-right">
                    <label className="text-xs font-semibold text-slate-700">Start date</label>
                    <HelpTooltip text="The start of the discount period in Coordinated Universal Time (UTC)." />
                  </div>
                  <div className="sm:col-span-8">
                    <div className="relative">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="mm/dd/yyyy"
                        className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#3c8dbc] shadow-2xs font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* End date */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-4 flex items-center justify-end gap-1.5 text-right">
                    <label className="text-xs font-semibold text-slate-700">End date</label>
                    <HelpTooltip text="The end of the discount period in Coordinated Universal Time (UTC)." />
                  </div>
                  <div className="sm:col-span-8">
                    <div className="relative">
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="mm/dd/yyyy"
                        className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#3c8dbc] shadow-2xs font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* Discount type */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-4 flex items-center justify-end gap-1.5 text-right">
                    <label className="text-xs font-semibold text-slate-700">Discount type</label>
                    <HelpTooltip text="The type of the discount." />
                  </div>
                  <div className="sm:col-span-8">
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value)}
                      className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs cursor-pointer"
                    >
                      <option value="All">All</option>
                      <option value="Assigned to order total">Assigned to order total</option>
                      <option value="Assigned to products">Assigned to products</option>
                      <option value="Assigned to categories">Assigned to categories</option>
                      <option value="Assigned to manufacturers">Assigned to manufacturers</option>
                      <option value="Assigned to shipping">Assigned to shipping</option>
                      <option value="Assigned to order subtotal">Assigned to order subtotal</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                {/* Coupon code */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-4 flex items-center justify-end gap-1.5 text-right">
                    <label className="text-xs font-semibold text-slate-700">Coupon code</label>
                    <HelpTooltip text="A coupon code that should be entered by customers." />
                  </div>
                  <div className="sm:col-span-8">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs font-mono"
                    />
                  </div>
                </div>

                {/* Discount name */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-4 flex items-center justify-end gap-1.5 text-right">
                    <label className="text-xs font-semibold text-slate-700">Discount name</label>
                    <HelpTooltip text="The discount name." />
                  </div>
                  <div className="sm:col-span-8">
                    <input
                      type="text"
                      value={discountName}
                      onChange={(e) => setDiscountName(e.target.value)}
                      className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs"
                    />
                  </div>
                </div>

                {/* Is Active */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-4 flex items-center justify-end gap-1.5 text-right">
                    <label className="text-xs font-semibold text-slate-700">Is Active</label>
                    <HelpTooltip text="Search by discount active status." />
                  </div>
                  <div className="sm:col-span-8">
                    <select
                      value={isActiveFilter}
                      onChange={(e) => setIsActiveFilter(e.target.value)}
                      className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs cursor-pointer"
                    >
                      <option value="All">All</option>
                      <option value="Active only">Active only</option>
                      <option value="Inactive only">Inactive only</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Centered Search Button matching media_1791173765894.png */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-7 py-2 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Search</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── TABLE CARD (Matching media_1791173765894.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Top Info link */}
        <div className="px-4 py-3 text-xs text-slate-600 border-b border-[#f4f4f4]">
          Learn more about{' '}
          <a
            href="https://docs.nopcommerce.com/en/running-your-store/promotions/discounts.html"
            target="_blank"
            rel="noreferrer"
            className="text-[#3c8dbc] hover:underline"
          >
            discounts
          </a>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-[#f9fafc] text-xs font-bold text-slate-700">
                <th className="px-4 py-2.5">Name</th>
                <th className="px-4 py-2.5">Discount type</th>
                <th className="px-4 py-2.5">Discount</th>
                <th className="px-4 py-2.5">Start date</th>
                <th className="px-4 py-2.5">End date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f4f4] text-xs text-slate-700">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 text-center text-slate-600 text-xs bg-white"
                  >
                    No data available in table
                  </td>
                </tr>
              ) : (
                paginatedData.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">{d.name}</td>
                    <td className="px-4 py-3 text-slate-600">{d.discountType}</td>
                    <td className="px-4 py-3 font-bold text-emerald-700 font-mono">{d.discount}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono">{d.startDate}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono">{d.endDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination matching media_1791173765894.png */}
        <div className="px-4 py-3 border-t border-[#f4f4f4] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          {/* Previous / Next */}
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
              onClick={() => handleReset()}
              title="Refresh"
              className="p-1 rounded border border-[#d2d6de] bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── ADD NEW MODAL ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-lg border border-[#d2d6de] shadow-xl w-full max-w-lg overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-[#f4f4f4] flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-semibold text-slate-800">Add New Discount</h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateDiscount} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Discount Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newForm.name}
                  onChange={(e) => setNewForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Kharif Monsoon Offer"
                  className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={newForm.discountType}
                    onChange={(e) => setNewForm((f) => ({ ...f, discountType: e.target.value }))}
                    className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc]"
                  >
                    <option value="Assigned to products">Assigned to products</option>
                    <option value="Assigned to order total">Assigned to order total</option>
                    <option value="Assigned to categories">Assigned to categories</option>
                    <option value="Assigned to manufacturers">Assigned to manufacturers</option>
                    <option value="Assigned to shipping">Assigned to shipping</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount Amount / %</label>
                  <input
                    type="text"
                    value={newForm.discount}
                    onChange={(e) => setNewForm((f) => ({ ...f, discount: e.target.value }))}
                    placeholder="e.g. 15% or ₹200"
                    className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coupon Code (Optional)</label>
                <input
                  type="text"
                  value={newForm.couponCode}
                  onChange={(e) => setNewForm((f) => ({ ...f, couponCode: e.target.value }))}
                  placeholder="e.g. KHARIF15"
                  className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newForm.startDate}
                    onChange={(e) => setNewForm((f) => ({ ...f, startDate: e.target.value }))}
                    className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={newForm.endDate}
                    onChange={(e) => setNewForm((f) => ({ ...f, endDate: e.target.value }))}
                    className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveNew"
                  checked={newForm.isActive}
                  onChange={(e) => setNewForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="rounded border-[#d2d6de] text-[#2489c5] focus:ring-[#3c8dbc]"
                />
                <label htmlFor="isActiveNew" className="font-semibold text-slate-700 cursor-pointer">
                  Is Active
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f4f4f4]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 border border-[#d2d6de] rounded bg-white hover:bg-slate-50 text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#2489c5] hover:bg-[#1f72a3] text-white font-semibold shadow-xs transition"
                >
                  Save Discount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
