'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  RotateCw,
  ChevronUp,
  ChevronDown,
  Check,
  X,
  Edit,
} from 'lucide-react';

interface AffiliateItem {
  id: string;
  firstName: string;
  lastName: string;
  friendlyName: string;
  email?: string;
  ordersCount: number;
  isActive: boolean;
}

const initialAffiliates: AffiliateItem[] = [
  {
    id: 'aff-1',
    firstName: 'Suresh',
    lastName: 'Gowda',
    friendlyName: 'mandya-krishi-mitra',
    email: 'suresh.gowda@gmail.com',
    ordersCount: 38,
    isActive: true,
  },
  {
    id: 'aff-2',
    firstName: 'Vijay',
    lastName: 'Kumar',
    friendlyName: 'rythu-seva-kendra',
    email: 'vijay.rythu@yahoo.com',
    ordersCount: 65,
    isActive: true,
  },
  {
    id: 'aff-3',
    firstName: 'Anand',
    lastName: 'Patil',
    friendlyName: 'maharashtra-agro-connect',
    email: 'anand.patil@rediffmail.com',
    ordersCount: 21,
    isActive: true,
  },
  {
    id: 'aff-4',
    firstName: 'Pooja',
    lastName: 'Sharma',
    friendlyName: 'kisan-digital-hub',
    email: 'pooja.kisan@gmail.com',
    ordersCount: 0,
    isActive: false,
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

export default function AffiliatesPage() {
  // Search Form State
  const [searchFirstName, setSearchFirstName] = useState('');
  const [searchLastName, setSearchLastName] = useState('');
  const [searchFriendlyUrl, setSearchFriendlyUrl] = useState('');
  const [loadOnlyWithOrders, setLoadOnlyWithOrders] = useState(false);

  // Search Panel Collapse Toggle
  const [searchOpen, setSearchOpen] = useState(true);

  // Pagination & Display
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);

  // Affiliates Data State (Keeping the example customer data as requested)
  const [affiliates, setAffiliates] = useState<AffiliateItem[]>(initialAffiliates);

  const fetchAffiliates = async () => {
    try {
      const res = await fetch('/api/admin/promotions/affiliates');
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setAffiliates(json.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAffiliates();
  }, []);

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<AffiliateItem | null>(null);
  const [modalForm, setModalForm] = useState({
    firstName: '',
    lastName: '',
    friendlyName: '',
    email: '',
    isActive: true,
  });

  // Filter Logic
  const filteredAffiliates = affiliates.filter((a) => {
    if (searchFirstName && !a.firstName.toLowerCase().includes(searchFirstName.toLowerCase())) {
      return false;
    }
    if (searchLastName && !a.lastName.toLowerCase().includes(searchLastName.toLowerCase())) {
      return false;
    }
    if (
      searchFriendlyUrl &&
      !a.friendlyName.toLowerCase().includes(searchFriendlyUrl.toLowerCase())
    ) {
      return false;
    }
    if (loadOnlyWithOrders && a.ordersCount <= 0) {
      return false;
    }
    return true;
  });

  const totalRecords = filteredAffiliates.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginatedData = filteredAffiliates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchFirstName('');
    setSearchLastName('');
    setSearchFriendlyUrl('');
    setLoadOnlyWithOrders(false);
    setCurrentPage(1);
  };

  const handleOpenAdd = () => {
    setEditingAffiliate(null);
    setModalForm({
      firstName: '',
      lastName: '',
      friendlyName: '',
      email: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (aff: AffiliateItem) => {
    setEditingAffiliate(aff);
    setModalForm({
      firstName: aff.firstName,
      lastName: aff.lastName,
      friendlyName: aff.friendlyName,
      email: aff.email || '',
      isActive: aff.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.firstName.trim() || !modalForm.lastName.trim()) return;

    if (editingAffiliate) {
      // Edit
      setAffiliates((prev) =>
        prev.map((item) =>
          item.id === editingAffiliate.id
            ? {
                ...item,
                firstName: modalForm.firstName.trim(),
                lastName: modalForm.lastName.trim(),
                friendlyName: modalForm.friendlyName.trim() || item.friendlyName,
                email: modalForm.email.trim() || item.email,
                isActive: modalForm.isActive,
              }
            : item
        )
      );
    } else {
      // Add
      const newAff: AffiliateItem = {
        id: `aff-${Date.now()}`,
        firstName: modalForm.firstName.trim(),
        lastName: modalForm.lastName.trim(),
        friendlyName:
          modalForm.friendlyName.trim() ||
          `${modalForm.firstName.toLowerCase()}-${modalForm.lastName.toLowerCase()}`,
        email: modalForm.email.trim(),
        ordersCount: 0,
        isActive: modalForm.isActive,
      };
      setAffiliates((prev) => [newAff, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-16 font-sans">
      {/* ── TOP HEADER: Affiliates + Add new button (Matching media_1791177044711.png) ── */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Affiliates</h1>
        <Link
          href="/admin/promotions/affiliates/new"
          className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add new</span>
        </Link>
      </div>

      {/* ── SEARCH CARD (Matching media_1791177044711.png) ── */}
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
            className="text-slate-500 hover:text-slate-800 transition p-1 cursor-pointer"
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
                {/* First name */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-4 flex items-center justify-end gap-1.5 text-right">
                    <label className="text-xs font-semibold text-slate-700">First name</label>
                    <HelpTooltip text="An affiliate first name." />
                  </div>
                  <div className="sm:col-span-8">
                    <input
                      type="text"
                      value={searchFirstName}
                      onChange={(e) => setSearchFirstName(e.target.value)}
                      className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs"
                    />
                  </div>
                </div>

                {/* Last name */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-4 flex items-center justify-end gap-1.5 text-right">
                    <label className="text-xs font-semibold text-slate-700">Last name</label>
                    <HelpTooltip text="An affiliate last name." />
                  </div>
                  <div className="sm:col-span-8">
                    <input
                      type="text"
                      value={searchLastName}
                      onChange={(e) => setSearchLastName(e.target.value)}
                      className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                {/* Friendly URL name */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-4 flex items-center justify-end gap-1.5 text-right">
                    <label className="text-xs font-semibold text-slate-700">Friendly URL name</label>
                    <HelpTooltip text="An affiliate friendly name." />
                  </div>
                  <div className="sm:col-span-8">
                    <input
                      type="text"
                      value={searchFriendlyUrl}
                      onChange={(e) => setSearchFriendlyUrl(e.target.value)}
                      className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs"
                    />
                  </div>
                </div>

                {/* Load only with orders */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                  <div className="sm:col-span-4 flex items-center justify-end gap-1.5 text-right">
                    <label className="text-xs font-semibold text-slate-700 cursor-pointer" htmlFor="loadOrders">
                      Load only with orders
                    </label>
                    <HelpTooltip text="Load only affiliates with affiliated orders." />
                  </div>
                  <div className="sm:col-span-8 flex items-center">
                    <input
                      id="loadOrders"
                      type="checkbox"
                      checked={loadOnlyWithOrders}
                      onChange={(e) => setLoadOnlyWithOrders(e.target.checked)}
                      className="w-4 h-4 rounded border-[#d2d6de] text-[#2489c5] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Centered Search Button matching media_1791177044711.png */}
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

      {/* ── TABLE CARD (Matching media_1791177044711.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Top Info paragraph matching screenshot */}
        <div className="px-4 py-3.5 text-xs text-slate-600 border-b border-[#f4f4f4] leading-relaxed">
          Affiliate is an Internet-based marketing practice in which a business rewards one or more affiliates for each visitor or customer. It is a web-based pay-for-performance program designed to compensate affiliate partner for driving qualified leads or sales to a merchant web site. Learn more about{' '}
          <a
            href="https://docs.nopcommerce.com/en/running-your-store/promotions/affiliates.html"
            target="_blank"
            rel="noreferrer"
            className="text-[#3c8dbc] hover:underline"
          >
            affiliates
          </a>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-[#f9fafc] text-xs font-bold text-slate-700">
                <th className="px-4 py-2.5">First name</th>
                <th className="px-4 py-2.5">Last name</th>
                <th className="px-4 py-2.5 text-center">Active</th>
                <th className="px-4 py-2.5 text-center">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f4f4] text-xs text-slate-700">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-6 text-center text-slate-600 text-xs bg-white"
                  >
                    No data available in table
                  </td>
                </tr>
              ) : (
                paginatedData.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">{a.firstName}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{a.lastName}</td>
                    <td className="px-4 py-3 text-center">
                      {a.isActive ? (
                        <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-emerald-100 text-emerald-700">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-100 text-red-600">
                          <X className="h-2.5 w-2.5 stroke-[3]" />
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(a)}
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

        {/* Table Footer / Pagination matching media_1791177044711.png */}
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
              onClick={handleReset}
              title="Refresh"
              className="p-1 rounded border border-[#d2d6de] bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── ADD / EDIT AFFILIATE MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-lg border border-[#d2d6de] shadow-xl w-full max-w-lg overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-[#f4f4f4] flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-semibold text-slate-800">
                {editingAffiliate ? 'Edit Affiliate' : 'Add New Affiliate'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveModal} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={modalForm.firstName}
                    onChange={(e) => setModalForm((f) => ({ ...f, firstName: e.target.value }))}
                    placeholder="e.g. Suresh"
                    className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={modalForm.lastName}
                    onChange={(e) => setModalForm((f) => ({ ...f, lastName: e.target.value }))}
                    placeholder="e.g. Gowda"
                    className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={modalForm.email}
                  onChange={(e) => setModalForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="e.g. suresh.gowda@gmail.com"
                  className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Friendly URL Name</label>
                <input
                  type="text"
                  value={modalForm.friendlyName}
                  onChange={(e) => setModalForm((f) => ({ ...f, friendlyName: e.target.value }))}
                  placeholder="e.g. mandya-krishi-mitra"
                  className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="modalIsActive"
                  checked={modalForm.isActive}
                  onChange={(e) => setModalForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="rounded border-[#d2d6de] text-[#2489c5] focus:ring-[#3c8dbc] cursor-pointer"
                />
                <label htmlFor="modalIsActive" className="font-semibold text-slate-700 cursor-pointer">
                  Active
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f4f4f4]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 border border-[#d2d6de] rounded bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#2489c5] hover:bg-[#1f72a3] text-white font-semibold shadow-xs transition cursor-pointer"
                >
                  {editingAffiliate ? 'Update Affiliate' : 'Save Affiliate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── FOOTER: Powered by nopCommerce (Matching media_1791177044711.png) ── */}
      <div className="pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 border-t border-slate-200">
        <div>
          Powered by{' '}
          <a
            href="https://www.nopcommerce.com"
            target="_blank"
            rel="noreferrer"
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
          {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </div>
        <div>nopCommerce version 4.90.0</div>
      </div>
    </div>
  );
}
