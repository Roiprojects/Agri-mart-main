'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Save,
  ArrowLeft,
  Minus,
  CheckCircle2,
  AlertCircle,
  Calendar,
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

export default function AddNewDiscountPage() {
  const router = useRouter();

  // Mode Switch (Default to Advanced matching media_1791174145536.png)
  const [isAdvanced, setIsAdvanced] = useState(true);

  // Card Collapse
  const [infoOpen, setInfoOpen] = useState(true);

  // Saving State
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form Fields matching media_1791174145536.png
  const [isActive, setIsActive] = useState(false);
  const [name, setName] = useState('');
  const [discountType, setDiscountType] = useState('Assigned to order total');
  const [vendor, setVendor] = useState('No vendor');
  const [usePercentage, setUsePercentage] = useState(false);
  const [discountAmount, setDiscountAmount] = useState<number | string>(0);
  const [discountPercentage, setDiscountPercentage] = useState<number | string>(0);
  const [currency, setCurrency] = useState('INR');
  const [requiresCouponCode, setRequiresCouponCode] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cumulativeWithOtherDiscounts, setCumulativeWithOtherDiscounts] = useState(false);
  const [discountLimitation, setDiscountLimitation] = useState('Unlimited');
  const [limitationTimes, setLimitationTimes] = useState<number | string>(1);
  const [adminComment, setAdminComment] = useState('');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async (continueEditing: boolean = false) => {
    if (!name.trim()) {
      showToast('Name is required.', 'error');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: name.trim(),
        isActive,
        discountType,
        vendor,
        usePercentage,
        discountAmount: usePercentage ? 0 : Number(discountAmount || 0),
        discountPercentage: usePercentage ? Number(discountPercentage || 0) : 0,
        currency,
        requiresCouponCode,
        couponCode: requiresCouponCode ? couponCode.trim() : '',
        startDate,
        endDate,
        cumulativeWithOtherDiscounts,
        discountLimitation,
        limitationTimes: Number(limitationTimes || 1),
        adminComment: adminComment.trim(),
      };

      const res = await fetch('/api/admin/promotions/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        showToast('Discount has been added successfully.', 'success');
        if (!continueEditing) {
          router.push('/admin/promotions/discounts');
        } else {
          showToast('Discount added. You can continue editing.', 'success');
        }
      } else {
        showToast(json.error || 'Failed to save discount.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error saving discount.', 'error');
    } finally {
      setSaving(false);
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

      {/* ── TOP HEADER (Matching media_1791174145536.png) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-1">
        {/* Title + Back Link */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Add a new discount</h1>
          <Link
            href="/admin/promotions/discounts"
            className="inline-flex items-center gap-1.5 text-xs text-[#2489c5] hover:underline"
          >
            <span className="w-4 h-4 rounded-full bg-[#2489c5] text-white flex items-center justify-center text-[10px] shrink-0">
              ←
            </span>
            <span>back to discount list</span>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save and Continue Edit</span>
          </button>
        </div>
      </div>

      {/* ── ADVANCED / BASIC TOGGLE PILL SWITCH (Matching media_1791174145536.png) ── */}
      <div className="flex items-center pt-1 pb-1">
        <button
          type="button"
          onClick={() => setIsAdvanced(!isAdvanced)}
          className="inline-flex items-center gap-2.5 px-3 py-1 rounded bg-[#2489c5] text-white text-xs font-semibold transition cursor-pointer shadow-2xs"
        >
          <span>{isAdvanced ? 'Advanced' : 'Basic'}</span>
          <div className="w-7 h-3.5 rounded-full bg-[#1b6d9e] p-0.5 flex items-center">
            <div
              className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${
                isAdvanced ? 'translate-x-3.5' : 'translate-x-0'
              }`}
            />
          </div>
        </button>
      </div>

      {/* ── CARD: Discount info (Matching media_1791174145536.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Card Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-[#f4f4f4] bg-white">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <span className="font-serif italic font-bold text-slate-600 text-base leading-none">i</span>
            <span>Discount info</span>
          </div>
          <button
            type="button"
            onClick={() => setInfoOpen(!infoOpen)}
            className="text-slate-400 hover:text-slate-700 transition p-1"
          >
            <Minus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Card Form Body */}
        {infoOpen && (
          <div className="p-6 space-y-4 max-w-4xl">
            {/* 1. Is active [?] */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
              <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                <label htmlFor="isActive" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Is active
                </label>
                <HelpTooltip text="Determines whether the discount is active." />
              </div>
              <div className="sm:col-span-9 flex items-center">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-[#d2d6de] text-[#2489c5] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* 2. Name [?] */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
              <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                <label htmlFor="name" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Name
                </label>
                <HelpTooltip text="The discount name." />
              </div>
              <div className="sm:col-span-9 flex items-center gap-2">
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs"
                />
                <span className="text-red-500 font-bold text-sm shrink-0 select-none">*</span>
              </div>
            </div>

            {/* 3. Discount type [?] */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
              <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                <label htmlFor="discountType" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Discount type
                </label>
                <HelpTooltip text="The type of the discount." />
              </div>
              <div className="sm:col-span-9">
                <select
                  id="discountType"
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs cursor-pointer"
                >
                  <option value="Assigned to order total">Assigned to order total</option>
                  <option value="Assigned to products">Assigned to products</option>
                  <option value="Assigned to categories">Assigned to categories</option>
                  <option value="Assigned to manufacturers">Assigned to manufacturers</option>
                  <option value="Assigned to shipping">Assigned to shipping</option>
                  <option value="Assigned to order subtotal">Assigned to order subtotal</option>
                </select>
              </div>
            </div>

            {/* 4. Vendor [?] (Advanced mode only) */}
            {isAdvanced && (
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                  <label htmlFor="vendor" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Vendor
                  </label>
                  <HelpTooltip text="Choose a vendor if this discount applies only to products of a specific vendor." />
                </div>
                <div className="sm:col-span-9">
                  <select
                    id="vendor"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs cursor-pointer"
                  >
                    <option value="No vendor">No vendor</option>
                    <option value="Kisan Agro Tech">Kisan Agro Tech</option>
                    <option value="Mahindra Agri">Mahindra Agri</option>
                    <option value="Godrej Agrovet">Godrej Agrovet</option>
                  </select>
                </div>
              </div>
            )}

            {/* 5. Use percentage [?] (Advanced mode only) */}
            {isAdvanced && (
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                  <label htmlFor="usePercentage" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Use percentage
                  </label>
                  <HelpTooltip text="Determines whether to apply a percentage discount. If not selected, a fixed discount amount is used." />
                </div>
                <div className="sm:col-span-9 flex items-center">
                  <input
                    id="usePercentage"
                    type="checkbox"
                    checked={usePercentage}
                    onChange={(e) => setUsePercentage(e.target.checked)}
                    className="w-4 h-4 rounded border-[#d2d6de] text-[#2489c5] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* 6. Discount amount / percentage [?] */}
            {!usePercentage ? (
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                  <label htmlFor="discountAmount" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Discount amount
                  </label>
                  <HelpTooltip text="The discount amount." />
                </div>
                <div className="sm:col-span-9">
                  <div className="flex items-center gap-2 max-w-xs">
                    <input
                      id="discountAmount"
                      type="number"
                      step="any"
                      min="0"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(e.target.value)}
                      className="w-32 bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs font-mono"
                    />
                    <span className="text-xs text-slate-600 font-semibold uppercase">{currency}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                  <label htmlFor="discountPercentage" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Discount percentage
                  </label>
                  <HelpTooltip text="The discount percentage." />
                </div>
                <div className="sm:col-span-9">
                  <div className="flex items-center gap-2 max-w-xs">
                    <input
                      id="discountPercentage"
                      type="number"
                      step="any"
                      min="0"
                      max="100"
                      value={discountPercentage}
                      onChange={(e) => setDiscountPercentage(e.target.value)}
                      className="w-32 bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs font-mono"
                    />
                    <span className="text-xs text-slate-600 font-semibold">%</span>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Requires coupon code [?] (Advanced mode only) */}
            {isAdvanced && (
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                  <label htmlFor="requiresCouponCode" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Requires coupon code
                  </label>
                  <HelpTooltip text="Determines whether this discount requires a coupon code to be entered." />
                </div>
                <div className="sm:col-span-9 flex items-center">
                  <input
                    id="requiresCouponCode"
                    type="checkbox"
                    checked={requiresCouponCode}
                    onChange={(e) => setRequiresCouponCode(e.target.checked)}
                    className="w-4 h-4 rounded border-[#d2d6de] text-[#2489c5] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Extra: Coupon code field if Requires coupon code is checked */}
            {isAdvanced && requiresCouponCode && (
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                  <label htmlFor="couponCode" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Coupon code
                  </label>
                  <HelpTooltip text="The coupon code that should be entered by customers." />
                </div>
                <div className="sm:col-span-9">
                  <input
                    id="couponCode"
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. KHARIF2026"
                    className="w-full max-w-sm bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs font-mono"
                  />
                </div>
              </div>
            )}

            {/* 8. Start date [?] */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
              <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                <label htmlFor="startDate" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Start date
                </label>
                <HelpTooltip text="The start of the discount period in Coordinated Universal Time (UTC)." />
              </div>
              <div className="sm:col-span-9">
                <div className="relative max-w-xs">
                  <input
                    id="startDate"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs font-sans"
                  />
                </div>
              </div>
            </div>

            {/* 9. End date [?] */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
              <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                <label htmlFor="endDate" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  End date
                </label>
                <HelpTooltip text="The end of the discount period in Coordinated Universal Time (UTC)." />
              </div>
              <div className="sm:col-span-9">
                <div className="relative max-w-xs">
                  <input
                    id="endDate"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs font-sans"
                  />
                </div>
              </div>
            </div>

            {/* 10. Cumulative with other discounts [?] (Advanced mode only) */}
            {isAdvanced && (
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                  <label htmlFor="cumulative" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Cumulative with other discounts
                  </label>
                  <HelpTooltip text="Determines whether this discount can be used concurrently with other discounts." />
                </div>
                <div className="sm:col-span-9 flex items-center">
                  <input
                    id="cumulative"
                    type="checkbox"
                    checked={cumulativeWithOtherDiscounts}
                    onChange={(e) => setCumulativeWithOtherDiscounts(e.target.checked)}
                    className="w-4 h-4 rounded border-[#d2d6de] text-[#2489c5] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* 11. Discount limitation [?] (Advanced mode only) */}
            {isAdvanced && (
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                  <label htmlFor="limitation" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Discount limitation
                  </label>
                  <HelpTooltip text="Select discount limitation type: Unlimited, N times only, or N times per customer." />
                </div>
                <div className="sm:col-span-9 space-y-2">
                  <select
                    id="limitation"
                    value={discountLimitation}
                    onChange={(e) => setDiscountLimitation(e.target.value)}
                    className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs cursor-pointer"
                  >
                    <option value="Unlimited">Unlimited</option>
                    <option value="N times only">N times only</option>
                    <option value="N times per customer">N times per customer</option>
                  </select>

                  {/* N times input if limited */}
                  {discountLimitation !== 'Unlimited' && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs text-slate-600 font-semibold">N times:</span>
                      <input
                        type="number"
                        min="1"
                        value={limitationTimes}
                        onChange={(e) => setLimitationTimes(e.target.value)}
                        className="w-24 bg-white border border-[#d2d6de] rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 12. Admin comment [?] (Advanced mode only) */}
            {isAdvanced && (
              <div className="grid grid-cols-1 sm:grid-cols-12 items-start gap-3">
                <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right pt-1.5">
                  <label htmlFor="adminComment" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Admin comment
                  </label>
                  <HelpTooltip text="An internal comment for administrator notes." />
                </div>
                <div className="sm:col-span-9">
                  <textarea
                    id="adminComment"
                    rows={3}
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs resize-y"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
