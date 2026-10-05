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

export default function AddNewAffiliatePage() {
  const router = useRouter();

  // Card Collapse
  const [infoOpen, setInfoOpen] = useState(true);

  // Saving State
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form Fields matching media_1791177839437.png & media_1791177841834.png
  const [isActive, setIsActive] = useState(false);

  // Contact / Address Info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('Select country');
  const [stateProvince, setStateProvince] = useState('Other');
  const [countyRegion, setCountyRegion] = useState('');
  const [city, setCity] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [zipPostalCode, setZipPostalCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [faxNumber, setFaxNumber] = useState('');

  // Admin / URL Info
  const [adminComment, setAdminComment] = useState('');
  const [friendlyName, setFriendlyName] = useState('');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async (continueEditing: boolean = false) => {
    if (!firstName.trim()) {
      showToast('First name is required.', 'error');
      return;
    }
    if (!lastName.trim()) {
      showToast('Last name is required.', 'error');
      return;
    }
    if (!email.trim()) {
      showToast('Email is required.', 'error');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        isActive,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        company: company.trim(),
        country: country !== 'Select country' ? country : 'India',
        stateProvince,
        countyRegion: countyRegion.trim(),
        city: city.trim(),
        address1: address1.trim(),
        address2: address2.trim(),
        zipPostalCode: zipPostalCode.trim(),
        phoneNumber: phoneNumber.trim(),
        faxNumber: faxNumber.trim(),
        adminComment: adminComment.trim(),
        friendlyName: friendlyName.trim(),
      };

      const res = await fetch('/api/admin/promotions/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        showToast('The new affiliate has been added successfully.', 'success');
        if (!continueEditing) {
          router.push('/admin/promotions/affiliates');
        } else {
          showToast('Affiliate added. You can continue editing.', 'success');
        }
      } else {
        showToast(json.error || 'Failed to save affiliate.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error saving affiliate.', 'error');
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

      {/* ── TOP HEADER (Matching media_1791177841834.png) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-1">
        {/* Title + Back Link */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Add a new affiliate</h1>
          <Link
            href="/admin/promotions/affiliates"
            className="inline-flex items-center gap-1.5 text-xs text-[#2489c5] hover:underline"
          >
            <span className="w-4 h-4 rounded-full bg-[#2489c5] text-white flex items-center justify-center text-[10px] shrink-0">
              ←
            </span>
            <span>back to affiliate list</span>
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

      {/* ── CARD: Affiliate info (Matching media_1791177841834.png & media_1791177839437.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Card Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-[#f4f4f4] bg-white">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <span className="font-serif italic font-bold text-slate-600 text-base leading-none">i</span>
            <span>Affiliate info</span>
          </div>
          <button
            type="button"
            onClick={() => setInfoOpen(!infoOpen)}
            className="text-slate-500 hover:text-slate-800 transition p-1 cursor-pointer"
          >
            <Minus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Card Form Body */}
        {infoOpen && (
          <div className="p-5 space-y-4 max-w-5xl">
            {/* ── SUB-BOX 1: Active ── */}
            <div className="rounded border border-[#d2d6de] bg-white p-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                  <label htmlFor="activeAffiliate" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Active
                  </label>
                  <HelpTooltip text="Determines whether this affiliate account is active." />
                </div>
                <div className="sm:col-span-9 flex items-center">
                  <input
                    id="activeAffiliate"
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-[#d2d6de] text-[#2489c5] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* ── SUB-BOX 2: Contact / Address Details ── */}
            <div className="rounded border border-[#d2d6de] bg-white p-4 space-y-3.5">
              {/* First name */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                  <label htmlFor="firstName" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    First name
                  </label>
                  <HelpTooltip text="The affiliate's first name." />
                </div>
                <div className="sm:col-span-9 flex items-center gap-2">
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs"
                  />
                  <span className="text-red-500 font-bold text-sm shrink-0 select-none">*</span>
                </div>
              </div>

              {/* Last name */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                  <label htmlFor="lastName" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Last name
                  </label>
                  <HelpTooltip text="The affiliate's last name." />
                </div>
                <div className="sm:col-span-9 flex items-center gap-2">
                  <input
                    id="lastName"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs"
                  />
                  <span className="text-red-500 font-bold text-sm shrink-0 select-none">*</span>
                </div>
              </div>

              {/* Email */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                  <label htmlFor="email" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Email
                  </label>
                  <HelpTooltip text="The affiliate's email address." />
                </div>
                <div className="sm:col-span-9 flex items-center gap-2">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs"
                  />
                  <span className="text-red-500 font-bold text-sm shrink-0 select-none">*</span>
                </div>
              </div>

              {/* Company */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                  <label htmlFor="company" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Company
                  </label>
                  <HelpTooltip text="The company name." />
                </div>
                <div className="sm:col-span-9">
                  <input
                    id="company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs"
                  />
                </div>
              </div>

              {/* Country */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                  <label htmlFor="country" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Country
                  </label>
                  <HelpTooltip text="The country of the affiliate." />
                </div>
                <div className="sm:col-span-9 flex items-center gap-2">
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs cursor-pointer"
                  >
                    <option value="Select country">Select country</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                  <span className="text-red-500 font-bold text-sm shrink-0 select-none">*</span>
                </div>
              </div>

              {/* State / province */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                  <label htmlFor="stateProvince" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    State / province
                  </label>
                  <HelpTooltip text="The state or province." />
                </div>
                <div className="sm:col-span-9">
                  <select
                    id="stateProvince"
                    value={stateProvince}
                    onChange={(e) => setStateProvince(e.target.value)}
                    className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs cursor-pointer"
                  >
                    <option value="Other">Other</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Rajasthan">Rajasthan</option>
                  </select>
                </div>
              </div>

              {/* County / region */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                  <label htmlFor="countyRegion" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    County / region
                  </label>
                  <HelpTooltip text="The county or district." />
                </div>
                <div className="sm:col-span-9 flex items-center gap-2">
                  <input
                    id="countyRegion"
                    type="text"
                    value={countyRegion}
                    onChange={(e) => setCountyRegion(e.target.value)}
                    className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs"
                  />
                  <span className="text-red-500 font-bold text-sm shrink-0 select-none">*</span>
                </div>
              </div>

              {/* City */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                  <label htmlFor="city" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    City
                  </label>
                  <HelpTooltip text="The city." />
                </div>
                <div className="sm:col-span-9 flex items-center gap-2">
                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs"
                  />
                  <span className="text-red-500 font-bold text-sm shrink-0 select-none">*</span>
                </div>
              </div>

              {/* Address 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                  <label htmlFor="address1" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Address 1
                  </label>
                  <HelpTooltip text="The primary address line." />
                </div>
                <div className="sm:col-span-9 flex items-center gap-2">
                  <input
                    id="address1"
                    type="text"
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs"
                  />
                  <span className="text-red-500 font-bold text-sm shrink-0 select-none">*</span>
                </div>
              </div>

              {/* Address 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                  <label htmlFor="address2" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Address 2
                  </label>
                  <HelpTooltip text="The secondary address line." />
                </div>
                <div className="sm:col-span-9">
                  <input
                    id="address2"
                    type="text"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs"
                  />
                </div>
              </div>

              {/* Zip / postal code */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                  <label htmlFor="zipPostalCode" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Zip / postal code
                  </label>
                  <HelpTooltip text="The zip or postal code." />
                </div>
                <div className="sm:col-span-9 flex items-center gap-2">
                  <input
                    id="zipPostalCode"
                    type="text"
                    value={zipPostalCode}
                    onChange={(e) => setZipPostalCode(e.target.value)}
                    className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs font-mono"
                  />
                  <span className="text-red-500 font-bold text-sm shrink-0 select-none">*</span>
                </div>
              </div>

              {/* Phone number */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                  <label htmlFor="phoneNumber" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Phone number
                  </label>
                  <HelpTooltip text="The phone number." />
                </div>
                <div className="sm:col-span-9 flex items-center gap-2">
                  <input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs"
                  />
                  <span className="text-red-500 font-bold text-sm shrink-0 select-none">*</span>
                </div>
              </div>

              {/* Fax number */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                  <label htmlFor="faxNumber" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Fax number
                  </label>
                  <HelpTooltip text="The fax number." />
                </div>
                <div className="sm:col-span-9">
                  <input
                    id="faxNumber"
                    type="text"
                    value={faxNumber}
                    onChange={(e) => setFaxNumber(e.target.value)}
                    className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* ── SUB-BOX 3: Admin comment & Friendly URL name ── */}
            <div className="rounded border border-[#d2d6de] bg-white p-4 space-y-3.5">
              {/* Admin comment */}
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
                    rows={4}
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs resize-y"
                  />
                </div>
              </div>

              {/* Friendly URL name */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                <div className="sm:col-span-3 flex items-center sm:justify-end gap-1.5 text-right">
                  <label htmlFor="friendlyName" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Friendly URL name
                  </label>
                  <HelpTooltip text="The friendly URL name." />
                </div>
                <div className="sm:col-span-9">
                  <input
                    id="friendlyName"
                    type="text"
                    value={friendlyName}
                    onChange={(e) => setFriendlyName(e.target.value)}
                    placeholder="e.g. suresh-gowda"
                    className="w-full bg-white border border-[#d2d6de] rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] shadow-2xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
