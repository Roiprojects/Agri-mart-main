'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Plus,
  Search,
  Check,
  X,
  Edit,
  ExternalLink,
  Share2,
} from 'lucide-react';

interface AffiliateItem {
  id: string;
  firstName: string;
  lastName: string;
  friendlyName: string;
  email: string;
  address: string;
  ordersCount: number;
  commissionEarned: string;
  isActive: boolean;
}

const initialAffiliates: AffiliateItem[] = [
  {
    id: 'aff-1',
    firstName: 'Suresh',
    lastName: 'Gowda',
    friendlyName: 'mandya-krishi-mitra',
    email: 'suresh.gowda@gmail.com',
    address: 'Mandya, Karnataka',
    ordersCount: 38,
    commissionEarned: '₹14,500',
    isActive: true,
  },
  {
    id: 'aff-2',
    firstName: 'Vijay',
    lastName: 'Kumar',
    friendlyName: 'rythu-seva-kendra',
    email: 'vijay.rythu@yahoo.com',
    address: 'Guntur, Andhra Pradesh',
    ordersCount: 65,
    commissionEarned: '₹28,900',
    isActive: true,
  },
  {
    id: 'aff-3',
    firstName: 'Anand',
    lastName: 'Patil',
    friendlyName: 'maharashtra-agro-connect',
    email: 'anand.patil@rediffmail.com',
    address: 'Kolhapur, Maharashtra',
    ordersCount: 21,
    commissionEarned: '₹8,400',
    isActive: true,
  },
  {
    id: 'aff-4',
    firstName: 'Pooja',
    lastName: 'Sharma',
    friendlyName: 'kisan-digital-hub',
    email: 'pooja.kisan@gmail.com',
    address: 'Indore, Madhya Pradesh',
    ordersCount: 12,
    commissionEarned: '₹4,200',
    isActive: false,
  },
];

export default function AffiliatesPage() {
  const [affiliates, setAffiliates] = useState<AffiliateItem[]>(initialAffiliates);
  const [searchName, setSearchName] = useState('');
  const [searchFriendlyName, setSearchFriendlyName] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredAffiliates = affiliates.filter((a) => {
    const fullName = `${a.firstName} ${a.lastName}`.toLowerCase();
    const matchesName = fullName.includes(searchName.toLowerCase());
    const matchesFriendly = a.friendlyName.toLowerCase().includes(searchFriendlyName.toLowerCase());
    const matchesActive =
      activeFilter === 'All' ||
      (activeFilter === 'Active' && a.isActive) ||
      (activeFilter === 'Inactive' && !a.isActive);

    return matchesName && matchesFriendly && matchesActive;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Users className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Affiliates</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage partner affiliate referral accounts, tracked orders, and commission payouts.
          </p>
        </div>
        <button
          type="button"
          onClick={() => alert('Add affiliate modal / form will be configured with your custom fields.')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add new
        </button>
      </div>

      {/* Search Filter Panel */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Affiliate Name / Email
            </label>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search by first name or last name…"
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Friendly Name / Code
            </label>
            <input
              type="text"
              value={searchFriendlyName}
              onChange={(e) => setSearchFriendlyName(e.target.value)}
              placeholder="e.g. mandya-krishi-mitra…"
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Status
            </label>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
            >
              <option value="All">All Affiliates</option>
              <option value="Active">Active only</option>
              <option value="Inactive">Inactive only</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              setSearchName('');
              setSearchFriendlyName('');
              setActiveFilter('All');
            }}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
          >
            Reset
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-xs"
          >
            <Search className="h-3.5 w-3.5" />
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="px-4 py-3">Affiliate Name</th>
                <th className="px-4 py-3">Friendly Name / Referral ID</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3 text-center">Orders Count</th>
                <th className="px-4 py-3 text-right">Commission</th>
                <th className="px-4 py-3 text-center">Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredAffiliates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No affiliates found.
                  </td>
                </tr>
              ) : (
                filteredAffiliates.map((affiliate) => (
                  <tr key={affiliate.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      <div>
                        {affiliate.firstName} {affiliate.lastName}
                        <p className="text-[11px] font-normal text-slate-500">{affiliate.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-emerald-800">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">
                        <Share2 className="h-2.5 w-2.5" />
                        {affiliate.friendlyName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {affiliate.address}
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-semibold text-slate-800">
                      {affiliate.ordersCount}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900 font-mono">
                      {affiliate.commissionEarned}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {affiliate.isActive ? (
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-100 text-emerald-700">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-100 text-red-600">
                          <X className="h-3 w-3 stroke-[3]" />
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`Edit affiliate ${affiliate.firstName} ${affiliate.lastName}`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 font-semibold transition text-xs"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
