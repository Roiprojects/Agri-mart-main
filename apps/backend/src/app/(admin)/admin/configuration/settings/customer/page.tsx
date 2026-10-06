'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Save,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Info,
  User,
  MapPin,
  Lock,
} from 'lucide-react';

function HelpTooltip({ text }: { text: string }) {
  return (
    <span
      title={text}
      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] font-bold cursor-help shrink-0 select-none shadow-2xs"
    >
      ?
    </span>
  );
}

export default function CustomerSettingsPage() {
  const [isAdvanced, setIsAdvanced] = useState(true);

  // Collapsible cards state
  const [commonOpen, setCommonOpen] = useState(true);
  const [accountFieldsOpen, setAccountFieldsOpen] = useState(true);
  const [addressFieldsOpen, setAddressFieldsOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);

  // Common Fields (Matching media_1791260472478.png)
  const [registrationMethod, setRegistrationMethod] = useState('Standard account creation');
  const [notifyNewCustomerRegistration, setNotifyNewCustomerRegistration] = useState(false);
  const [requireRegistrationForDownloadable, setRequireRegistrationForDownloadable] = useState(false);
  const [allowCheckGiftCardBalance, setAllowCheckGiftCardBalance] = useState(false);
  const [allowSelectTimeZone, setAllowSelectTimeZone] = useState(false);
  const [defaultStoreTimeZone, setDefaultStoreTimeZone] = useState(
    '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna'
  );
  const [allowRemoveAssociations, setAllowRemoveAssociations] = useState(true);

  // Account Fields (Advanced)
  const [usernamesEnabled, setUsernamesEnabled] = useState(false);
  const [allowUsersToChangeUsernames, setAllowUsersToChangeUsernames] = useState(false);
  const [checkUsernameAvailability, setCheckUsernameAvailability] = useState(false);
  const [genderEnabled, setGenderEnabled] = useState(true);
  const [dobEnabled, setDobEnabled] = useState(true);
  const [companyEnabled, setCompanyEnabled] = useState(true);
  const [companyRequired, setCompanyRequired] = useState(false);
  const [streetAddressEnabled, setStreetAddressEnabled] = useState(true);
  const [streetAddressRequired, setStreetAddressRequired] = useState(true);
  const [phoneEnabled, setPhoneEnabled] = useState(true);
  const [phoneRequired, setPhoneRequired] = useState(true);

  // Security / Password (Advanced)
  const [passwordMinLength, setPasswordMinLength] = useState(6);
  const [passwordRequireDigit, setPasswordRequireDigit] = useState(true);
  const [passwordRequireUppercase, setPasswordRequireUppercase] = useState(false);
  const [maxFailedLoginAttempts, setMaxFailedLoginAttempts] = useState(5);
  const [failedPasswordLockoutMinutes, setFailedPasswordLockoutMinutes] = useState(10);

  // Toast
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((res) => setTimeout(res, 600));
    setSaving(false);
    showToast('The customer settings have been updated successfully.');
  };

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-20 font-sans">
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

      {/* ── HEADER (Matching media_1791260472478.png) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Customer settings</h1>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-4 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* ── MODE BUTTON: Advanced / Basic Toggle (Matching media_1791260472478.png) ── */}
      <div className="pt-0.5">
        <button
          type="button"
          onClick={() => setIsAdvanced(!isAdvanced)}
          className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded text-xs font-medium transition cursor-pointer select-none shadow-2xs ${
            isAdvanced
              ? 'bg-[#2489c5] hover:bg-[#1f72a3] text-white'
              : 'bg-white hover:bg-slate-50 border border-[#d2d6de] text-slate-700'
          }`}
        >
          {!isAdvanced && (
            <span className="w-2.5 h-4.5 rounded-full border border-[#d2d6de] bg-white shadow-2xs inline-block shrink-0" />
          )}
          <span>{isAdvanced ? 'Advanced' : 'Basic'}</span>
          {isAdvanced && (
            <span className="w-2.5 h-4.5 rounded-full bg-white shadow-2xs inline-block shrink-0" />
          )}
        </button>
      </div>

      {/* ── CARD 1: COMMON (Matching media_1791260472478.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
        <div
          onClick={() => setCommonOpen(!commonOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <span className="font-serif italic font-bold text-slate-600 text-sm">i</span>
            <span className="text-sm font-normal text-slate-800">Common</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {commonOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {commonOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* 1. Registration method */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Registration method</span>
                <HelpTooltip text="Customer registration method: Standard account creation, Email validation, Admin approval, or Disabled." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <div className="relative">
                  <select
                    value={registrationMethod}
                    onChange={(e) => setRegistrationMethod(e.target.value)}
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white appearance-none pr-8 cursor-pointer"
                  >
                    <option value="Standard account creation">Standard account creation</option>
                    <option value="Email validation">Email validation</option>
                    <option value="Admin approval">Admin approval</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 2. Notify about new customer registration */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span className="text-right">Notify about new customer registration</span>
                <HelpTooltip text="Check if a store owner should be notified about new customer registrations." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={notifyNewCustomerRegistration}
                  onChange={(e) => setNotifyNewCustomerRegistration(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* 3. Require registration for downloadable products */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span className="text-right">Require registration for downloadable products</span>
                <HelpTooltip text="Check if customers must be registered and logged in before purchasing downloadable products." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={requireRegistrationForDownloadable}
                  onChange={(e) => setRequireRegistrationForDownloadable(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* 4. Allow customers to check gift card balance */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span className="text-right">Allow customers to check gift card balance</span>
                <HelpTooltip text="Determines whether customers can check their gift card balance." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={allowCheckGiftCardBalance}
                  onChange={(e) => setAllowCheckGiftCardBalance(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* 5. Allow customers to select time zone */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span className="text-right">Allow customers to select time zone</span>
                <HelpTooltip text="Determines whether customers can select their time zone in account settings." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={allowSelectTimeZone}
                  onChange={(e) => setAllowSelectTimeZone(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* 6. Default store time zone */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Default store time zone</span>
                <HelpTooltip text="Default store time zone for registered customers." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <div className="relative">
                  <select
                    value={defaultStoreTimeZone}
                    onChange={(e) => setDefaultStoreTimeZone(e.target.value)}
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white appearance-none pr-8 cursor-pointer"
                  >
                    <option value="(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna">
                      (UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna
                    </option>
                    <option value="(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi">
                      (UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi
                    </option>
                    <option value="(UTC+00:00) Dublin, Edinburgh, Lisbon, London">
                      (UTC+00:00) Dublin, Edinburgh, Lisbon, London
                    </option>
                    <option value="(UTC-05:00) Eastern Time (US & Canada)">
                      (UTC-05:00) Eastern Time (US & Canada)
                    </option>
                    <option value="(UTC-08:00) Pacific Time (US & Canada)">
                      (UTC-08:00) Pacific Time (US & Canada)
                    </option>
                    <option value="(UTC+08:00) Beijing, Chongqing, Hong Kong, Singapore">
                      (UTC+08:00) Beijing, Chongqing, Hong Kong, Singapore
                    </option>
                    <option value="(UTC+09:00) Osaka, Sapporo, Tokyo">
                      (UTC+09:00) Osaka, Sapporo, Tokyo
                    </option>
                    <option value="(UTC+04:00) Abu Dhabi, Muscat">
                      (UTC+04:00) Abu Dhabi, Muscat
                    </option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 7. Allow customers to remove associations */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span className="text-right">Allow customers to remove associations</span>
                <HelpTooltip text="Determines whether customers can remove external authentication records associated with their accounts." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={allowRemoveAssociations}
                  onChange={(e) => setAllowRemoveAssociations(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD 2: ACCOUNT FIELDS (Visible in Advanced mode) ── */}
      {isAdvanced && (
        <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
          <div
            onClick={() => setAccountFieldsOpen(!accountFieldsOpen)}
            className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-normal text-slate-800">Account fields</span>
            </div>
            <button type="button" className="text-slate-400 hover:text-slate-600">
              {accountFieldsOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
            </button>
          </div>

          {accountFieldsOpen && (
            <div className="p-5 space-y-4 text-xs text-slate-700">
              {/* Usernames enabled */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                  <span>Usernames enabled</span>
                  <HelpTooltip text="Determines whether customers sign in with usernames instead of emails." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={usernamesEnabled}
                    onChange={(e) => setUsernamesEnabled(e.target.checked)}
                    className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                  />
                </div>
              </div>

              {/* Gender enabled */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                  <span>Gender enabled</span>
                  <HelpTooltip text="Determines whether gender field is enabled on the registration page." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={genderEnabled}
                    onChange={(e) => setGenderEnabled(e.target.checked)}
                    className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                  />
                </div>
              </div>

              {/* Date of birth enabled */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                  <span>Date of birth enabled</span>
                  <HelpTooltip text="Determines whether date of birth is enabled during customer registration." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={dobEnabled}
                    onChange={(e) => setDobEnabled(e.target.checked)}
                    className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                  />
                </div>
              </div>

              {/* Company enabled */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                  <span>Company name enabled</span>
                  <HelpTooltip text="Determines whether company name field is visible." />
                </label>
                <div className="md:col-span-8 flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={companyEnabled}
                    onChange={(e) => setCompanyEnabled(e.target.checked)}
                    className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                  />
                  {companyEnabled && (
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={companyRequired}
                        onChange={(e) => setCompanyRequired(e.target.checked)}
                        className="w-3.5 h-3.5 text-[#3c8dbc] rounded focus:ring-0 accent-[#3c8dbc]"
                      />
                      <span className="text-slate-600">Required</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Phone enabled */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                  <span>Phone number enabled</span>
                  <HelpTooltip text="Determines whether phone number is collected during registration." />
                </label>
                <div className="md:col-span-8 flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={phoneEnabled}
                    onChange={(e) => setPhoneEnabled(e.target.checked)}
                    className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                  />
                  {phoneEnabled && (
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={phoneRequired}
                        onChange={(e) => setPhoneRequired(e.target.checked)}
                        className="w-3.5 h-3.5 text-[#3c8dbc] rounded focus:ring-0 accent-[#3c8dbc]"
                      />
                      <span className="text-slate-600">Required</span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CARD 3: SECURITY & PASSWORD (Visible in Advanced mode) ── */}
      {isAdvanced && (
        <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
          <div
            onClick={() => setSecurityOpen(!securityOpen)}
            className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-normal text-slate-800">Password & Security</span>
            </div>
            <button type="button" className="text-slate-400 hover:text-slate-600">
              {securityOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
            </button>
          </div>

          {securityOpen && (
            <div className="p-5 space-y-4 text-xs text-slate-700">
              {/* Password min length */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                  <span>Minimum password length</span>
                  <HelpTooltip text="The minimum allowed password length for customer accounts." />
                </label>
                <div className="md:col-span-8 max-w-xs">
                  <input
                    type="number"
                    value={passwordMinLength}
                    onChange={(e) => setPasswordMinLength(Number(e.target.value) || 6)}
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>

              {/* Password require digit */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                  <span>Require at least one digit</span>
                  <HelpTooltip text="Determines whether passwords must contain digits (0-9)." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={passwordRequireDigit}
                    onChange={(e) => setPasswordRequireDigit(e.target.checked)}
                    className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                  />
                </div>
              </div>

              {/* Max failed login attempts */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                  <span>Max failed login attempts</span>
                  <HelpTooltip text="Maximum consecutive failed login attempts before locking account." />
                </label>
                <div className="md:col-span-8 max-w-xs">
                  <input
                    type="number"
                    value={maxFailedLoginAttempts}
                    onChange={(e) => setMaxFailedLoginAttempts(Number(e.target.value) || 5)}
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
