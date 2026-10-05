'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Percent,
  Plus,
  Search,
  Check,
  X,
  Edit,
  Tag,
  Sparkles,
  Calendar,
} from 'lucide-react';

interface DiscountItem {
  id: string;
  name: string;
  discountType: string;
  discountAmount: string;
  startDate: string;
  endDate: string;
  timesUsed: number;
  isActive: boolean;
}

const initialDiscounts: DiscountItem[] = [
  {
    id: 'disc-1',
    name: 'Kharif Sowing Season Launch',
    discountType: 'Assigned to products',
    discountAmount: '25%',
    startDate: '2026-06-01',
    endDate: '2026-10-31',
    timesUsed: 142,
    isActive: true,
  },
  {
    id: 'disc-2',
    name: 'Bio-Care Micro-Nutrient Bundle',
    discountType: 'Assigned to order total',
    discountAmount: '₹150',
    startDate: '2026-08-01',
    endDate: '2026-12-31',
    timesUsed: 89,
    isActive: true,
  },
  {
    id: 'disc-3',
    name: 'Drip & Micro-Irrigation Foundation Subsidy',
    discountType: 'Assigned to categories',
    discountAmount: '15%',
    startDate: '2026-07-15',
    endDate: '2026-11-30',
    timesUsed: 54,
    isActive: true,
  },
  {
    id: 'disc-4',
    name: 'First Time Farmer Welcome Rebate',
    discountType: 'Assigned to order total',
    discountAmount: '₹200',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    timesUsed: 310,
    isActive: true,
  },
];

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<DiscountItem[]>(initialDiscounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountTypeFilter, setDiscountTypeFilter] = useState('All');

  const filteredDiscounts = discounts.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = discountTypeFilter === 'All' || d.discountType === discountTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Percent className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Discounts</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage product price markdowns, coupon codes, and promotional volume discounts.
          </p>
        </div>
        <button
          type="button"
          onClick={() => alert('Add discount modal / form will be configured with your custom fields.')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add new
        </button>
      </div>

      {/* Search Panel */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Discount Name
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by discount name…"
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Coupon Code
            </label>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="e.g. KHARIF25…"
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Discount Type
            </label>
            <select
              value={discountTypeFilter}
              onChange={(e) => setDiscountTypeFilter(e.target.value)}
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
            >
              <option value="All">All Discount Types</option>
              <option value="Assigned to order total">Assigned to order total</option>
              <option value="Assigned to products">Assigned to products</option>
              <option value="Assigned to categories">Assigned to categories</option>
              <option value="Assigned to shipping">Assigned to shipping</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setCouponCode('');
              setDiscountTypeFilter('All');
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
                <th className="px-4 py-3">Discount Name</th>
                <th className="px-4 py-3">Discount Type</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Start Date</th>
                <th className="px-4 py-3">End Date</th>
                <th className="px-4 py-3 text-center">Times Used</th>
                <th className="px-4 py-3 text-center">Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredDiscounts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No discounts found.
                  </td>
                </tr>
              ) : (
                filteredDiscounts.map((discount) => (
                  <tr key={discount.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {discount.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {discount.discountType}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-700 font-mono">
                      {discount.discountAmount}
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                      {discount.startDate}
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                      {discount.endDate}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold font-mono text-slate-800">
                      {discount.timesUsed}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {discount.isActive ? (
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
                        onClick={() => alert(`Edit ${discount.name}`)}
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
