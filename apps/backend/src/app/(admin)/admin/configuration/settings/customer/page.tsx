'use client';

import React, { useState } from 'react';
import {
  Save,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Shield,
  User,
  UserCircle,
  AlignJustify,
  ArrowUp,
  MapPin,
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
  const [passwordSecurityOpen, setPasswordSecurityOpen] = useState(true);
  const [accountOpen, setAccountOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(true);
  const [formFieldsOpen, setFormFieldsOpen] = useState(true);

  // 1. Common Fields (media_1791260472478.png)
  const [registrationMethod, setRegistrationMethod] = useState('Standard account creation');
  const [notifyNewCustomerRegistration, setNotifyNewCustomerRegistration] = useState(false);
  const [requireRegistrationForDownloadable, setRequireRegistrationForDownloadable] = useState(false);
  const [allowCheckGiftCardBalance, setAllowCheckGiftCardBalance] = useState(false);
  const [allowSelectTimeZone, setAllowSelectTimeZone] = useState(false);
  const [defaultStoreTimeZone, setDefaultStoreTimeZone] = useState(
    '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna'
  );
  const [allowRemoveAssociations, setAllowRemoveAssociations] = useState(true);

  // 2. Password and security Fields (media_1791261732784.png & media_1791261747223.png)
  const [passwordMinLength, setPasswordMinLength] = useState(6);
  const [passwordMaxLength, setPasswordMaxLength] = useState(64);
  const [passwordRequireLowercase, setPasswordRequireLowercase] = useState(true);
  const [passwordRequireUppercase, setPasswordRequireUppercase] = useState(true);
  const [passwordRequireNonAlphanumeric, setPasswordRequireNonAlphanumeric] = useState(true);
  const [passwordRequireDigit, setPasswordRequireDigit] = useState(true);
  const [unduplicatedPasswordsNumber, setUnduplicatedPasswordsNumber] = useState(4);
  const [defaultPasswordFormat, setDefaultPasswordFormat] = useState('Hashed');
  const [passwordLifetime, setPasswordLifetime] = useState(90);
  const [passwordRecoveryLinkDaysValid, setPasswordRecoveryLinkDaysValid] = useState(7);
  const [maxLoginFailures, setMaxLoginFailures] = useState(0);
  const [lockoutTimeLoginFailures, setLockoutTimeLoginFailures] = useState(30);
  const [notifyCustomersFailedLogin, setNotifyCustomersFailedLogin] = useState(true);
  const [forceEnteringEmailTwice, setForceEnteringEmailTwice] = useState(true);
  const [forceMultiFactorAuth, setForceMultiFactorAuth] = useState(true);

  // 3. Account Fields (media_1791261747223.png & media_1791261774154.png)
  const [usernamesEnabled, setUsernamesEnabled] = useState(false);
  const [customerNameFormat, setCustomerNameFormat] = useState('Show first name');
  const [phoneNumberValidationEnabled, setPhoneNumberValidationEnabled] = useState(false);
  const [allowCustomersUploadAvatars, setAllowCustomersUploadAvatars] = useState(false);
  const [hideDownloadableProductsTab, setHideDownloadableProductsTab] = useState(false);
  const [hideBackInStockSubscriptionsTab, setHideBackInStockSubscriptionsTab] = useState(false);
  const [hideNewsletterBox, setHideNewsletterBox] = useState(false);
  const [newsletterBoxAllowUnsubscribe, setNewsletterBoxAllowUnsubscribe] = useState(false);
  const [storeLastVisitedPage, setStoreLastVisitedPage] = useState(false);
  const [storeIpAddresses, setStoreIpAddresses] = useState(true);

  // 4. Profile Fields (media_1791261774154.png)
  const [allowViewingCustomerProfiles, setAllowViewingCustomerProfiles] = useState(false);
  const [showCustomerLocation, setShowCustomerLocation] = useState(false);
  const [showCustomersJoinDate, setShowCustomersJoinDate] = useState(false);

  // 5. Customer form fields (media_1791261809473.png & media_1791261822749.png)
  const [genderEnabled, setGenderEnabled] = useState(true);
  const [neutralOptionEnabled, setNeutralOptionEnabled] = useState(true);
  const [firstNameEnabled, setFirstNameEnabled] = useState(true);
  const [firstNameRequired, setFirstNameRequired] = useState(true);
  const [lastNameEnabled, setLastNameEnabled] = useState(true);
  const [lastNameRequired, setLastNameRequired] = useState(true);
  const [dobEnabled, setDobEnabled] = useState(true);
  const [dobRequired, setDobRequired] = useState(true);
  const [customerMinimumAge, setCustomerMinimumAge] = useState('');
  const [companyEnabled, setCompanyEnabled] = useState(true);
  const [companyRequired, setCompanyRequired] = useState(true);
  const [streetAddressEnabled, setStreetAddressEnabled] = useState(true);
  const [streetAddressRequired, setStreetAddressRequired] = useState(true);
  const [streetAddress2Enabled, setStreetAddress2Enabled] = useState(true);
  const [streetAddress2Required, setStreetAddress2Required] = useState(true);
  const [zipCodeEnabled, setZipCodeEnabled] = useState(true);
  const [zipCodeRequired, setZipCodeRequired] = useState(true);
  const [cityEnabled, setCityEnabled] = useState(true);
  const [cityRequired, setCityRequired] = useState(true);
  const [countyRegionEnabled, setCountyRegionEnabled] = useState(true);
  const [countyRegionRequired, setCountyRegionRequired] = useState(true);
  const [countryEnabled, setCountryEnabled] = useState(true);
  const [countryRequired, setCountryRequired] = useState(true);
  const [defaultCountry, setDefaultCountry] = useState('');
  const [stateProvinceEnabled, setStateProvinceEnabled] = useState(true);
  const [phoneNumberEnabled, setPhoneNumberEnabled] = useState(true);
  const [phoneNumberRequired, setPhoneNumberRequired] = useState(true);
  const [faxNumberEnabled, setFaxNumberEnabled] = useState(true);
  const [faxNumberRequired, setFaxNumberRequired] = useState(false);
  const [addressAttributesOpen, setAddressAttributesOpen] = useState(true);
  const [customAddressAttributes, setCustomAddressAttributes] = useState([
    { id: '1', name: 'Landmark / Alternate Contact', controlType: 'TextBox', isRequired: false, displayOrder: 1 },
  ]);

  // Toast & Saving
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-20 font-sans relative">
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

      {/* ── MODE BUTTON: Advanced / Basic Toggle ── */}
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

      {/* ── CARD 1: COMMON (media_1791260472478.png) ── */}
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
            {/* Registration method */}
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

            {/* Notify about new customer registration */}
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

            {/* Require registration for downloadable products */}
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

            {/* Allow customers to check gift card balance */}
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

            {/* Allow customers to select time zone */}
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

            {/* Default store time zone */}
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

            {/* Allow customers to remove associations */}
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

      {/* ── CARD 2: PASSWORD AND SECURITY (media_1791261732784.png & media_1791261747223.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
        <div
          onClick={() => setPasswordSecurityOpen(!passwordSecurityOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-normal text-slate-800">Password and security</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {passwordSecurityOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {passwordSecurityOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Password minimum length */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Password minimum length</span>
                <HelpTooltip text="The minimum allowed password length." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="number"
                  value={passwordMinLength}
                  onChange={(e) => setPasswordMinLength(Number(e.target.value) || 6)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Password maximum length */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Password maximum length</span>
                <HelpTooltip text="The maximum allowed password length." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="number"
                  value={passwordMaxLength}
                  onChange={(e) => setPasswordMaxLength(Number(e.target.value) || 64)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Password must have at least one lowercase */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span className="text-right">Password must have at least one lowercase</span>
                <HelpTooltip text="Determines whether password must contain at least one lowercase letter." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={passwordRequireLowercase}
                  onChange={(e) => setPasswordRequireLowercase(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Password must have at least one uppercase */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span className="text-right">Password must have at least one uppercase</span>
                <HelpTooltip text="Determines whether password must contain at least one uppercase letter." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={passwordRequireUppercase}
                  onChange={(e) => setPasswordRequireUppercase(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Password must have at least one non alphanumeric character */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span className="text-right">Password must have at least one non alphanumeric character</span>
                <HelpTooltip text="Determines whether password must contain at least one special character." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={passwordRequireNonAlphanumeric}
                  onChange={(e) => setPasswordRequireNonAlphanumeric(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Password must have at least one digit */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span className="text-right">Password must have at least one digit</span>
                <HelpTooltip text="Determines whether password must contain at least one digit (0-9)." />
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

            {/* Unduplicated passwords number */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Unduplicated passwords number</span>
                <HelpTooltip text="Number of previous passwords that cannot be reused." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="number"
                  value={unduplicatedPasswordsNumber}
                  onChange={(e) => setUnduplicatedPasswordsNumber(Number(e.target.value) || 0)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Default password format */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Default password format</span>
                <HelpTooltip text="Password storage encryption format: Hashed, Encrypted, or Clear text." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <div className="relative">
                  <select
                    value={defaultPasswordFormat}
                    onChange={(e) => setDefaultPasswordFormat(e.target.value)}
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white appearance-none pr-8 cursor-pointer"
                  >
                    <option value="Hashed">Hashed</option>
                    <option value="Encrypted">Encrypted</option>
                    <option value="Clear">Clear</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Password lifetime */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Password lifetime</span>
                <HelpTooltip text="Password expiration lifetime in days." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="number"
                  value={passwordLifetime}
                  onChange={(e) => setPasswordLifetime(Number(e.target.value) || 0)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Password recovery link. Days valid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Password recovery link. Days valid</span>
                <HelpTooltip text="Number of days the password reset token remains valid." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="number"
                  value={passwordRecoveryLinkDaysValid}
                  onChange={(e) => setPasswordRecoveryLinkDaysValid(Number(e.target.value) || 0)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Maximum login failures */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Maximum login failures</span>
                <HelpTooltip text="Maximum failed login attempts allowed before locking account. 0 to disable." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="number"
                  value={maxLoginFailures}
                  onChange={(e) => setMaxLoginFailures(Number(e.target.value) || 0)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Lockout time (login failures) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Lockout time (login failures)</span>
                <HelpTooltip text="Account lockout duration in minutes after exceeding max failed login attempts." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="number"
                  value={lockoutTimeLoginFailures}
                  onChange={(e) => setLockoutTimeLoginFailures(Number(e.target.value) || 0)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Notify customers about failed login attempts */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span className="text-right">Notify customers about failed login attempts</span>
                <HelpTooltip text="Sends email alerts to customers whenever suspicious or failed login attempts are logged." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={notifyCustomersFailedLogin}
                  onChange={(e) => setNotifyCustomersFailedLogin(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Force entering email twice */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Force entering email twice</span>
                <HelpTooltip text="Requires confirmation of email during registration." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={forceEnteringEmailTwice}
                  onChange={(e) => setForceEnteringEmailTwice(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Force multi-factor authentication */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Force multi-factor authentication</span>
                <HelpTooltip text="Forces multi-factor verification for all customer accounts." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={forceMultiFactorAuth}
                  onChange={(e) => setForceMultiFactorAuth(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD 3: ACCOUNT (media_1791261747223.png & media_1791261774154.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
        <div
          onClick={() => setAccountOpen(!accountOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-normal text-slate-800">Account</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {accountOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {accountOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* 'Usernames' enabled */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>&apos;Usernames&apos; enabled</span>
                <HelpTooltip text="Determines whether customers can use usernames instead of email addresses." />
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

            {/* Customer name format */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Customer name format</span>
                <HelpTooltip text="How customer names are displayed across the store: Show first name, full name, or email." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <div className="relative">
                  <select
                    value={customerNameFormat}
                    onChange={(e) => setCustomerNameFormat(e.target.value)}
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white appearance-none pr-8 cursor-pointer"
                  >
                    <option value="Show first name">Show first name</option>
                    <option value="Show full name">Show full name</option>
                    <option value="Show emails">Show emails</option>
                    <option value="Show usernames">Show usernames</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Phone number validation is enabled */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Phone number validation is enabled</span>
                <HelpTooltip text="Determines whether phone numbers are validated using regular expressions." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={phoneNumberValidationEnabled}
                  onChange={(e) => setPhoneNumberValidationEnabled(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Allow customers to upload avatars */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Allow customers to upload avatars</span>
                <HelpTooltip text="Determines whether customers are allowed to upload their custom avatars." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={allowCustomersUploadAvatars}
                  onChange={(e) => setAllowCustomersUploadAvatars(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Hide 'Downloadable products' tab */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Hide &apos;Downloadable products&apos; tab</span>
                <HelpTooltip text="Hides downloadable files tab from the customer account profile." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={hideDownloadableProductsTab}
                  onChange={(e) => setHideDownloadableProductsTab(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Hide 'Back in stock subscriptions' tab */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Hide &apos;Back in stock subscriptions&apos; tab</span>
                <HelpTooltip text="Hides back in stock alerts tab from customer account profile." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={hideBackInStockSubscriptionsTab}
                  onChange={(e) => setHideBackInStockSubscriptionsTab(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Hide newsletter box */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Hide newsletter box</span>
                <HelpTooltip text="Hides the newsletter subscription box." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={hideNewsletterBox}
                  onChange={(e) => setHideNewsletterBox(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Newsletter box. Allow to unsubscribe */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Newsletter box. Allow to unsubscribe</span>
                <HelpTooltip text="Allows users to unsubscribe directly from the newsletter block." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={newsletterBoxAllowUnsubscribe}
                  onChange={(e) => setNewsletterBoxAllowUnsubscribe(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Store last visited page */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Store last visited page</span>
                <HelpTooltip text="Stores customer's last visited page URL in database." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={storeLastVisitedPage}
                  onChange={(e) => setStoreLastVisitedPage(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Store IP addresses */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Store IP addresses</span>
                <HelpTooltip text="Determines whether IP addresses of visitors are saved." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={storeIpAddresses}
                  onChange={(e) => setStoreIpAddresses(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD 4: PROFILE (media_1791261774154.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
        <div
          onClick={() => setProfileOpen(!profileOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <UserCircle className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-normal text-slate-800">Profile</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {profileOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {profileOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Allow viewing of customer profiles */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Allow viewing of customer profiles</span>
                <HelpTooltip text="Determines whether public profiles can be viewed by other visitors." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={allowViewingCustomerProfiles}
                  onChange={(e) => setAllowViewingCustomerProfiles(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Show customer's location */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Show customer&apos;s location</span>
                <HelpTooltip text="Displays customer country and city in public forum posts and profiles." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={showCustomerLocation}
                  onChange={(e) => setShowCustomerLocation(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Show customers join date */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Show customers join date</span>
                <HelpTooltip text="Displays registration date in public customer profile." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={showCustomersJoinDate}
                  onChange={(e) => setShowCustomersJoinDate(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD 5: CUSTOMER FORM FIELDS (media_1791261809473.png & media_1791261822749.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
        <div
          onClick={() => setFormFieldsOpen(!formFieldsOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <AlignJustify className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-normal text-slate-800">Customer form fields</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {formFieldsOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {formFieldsOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Note */}
            <p className="text-xs text-slate-500 italic pb-1">
              You can create and manage the customer form fields available during registration below.
            </p>

            {/* 'Gender' enabled */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>&apos;Gender&apos; enabled</span>
                <HelpTooltip text="Enable gender radio button on registration page." />
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

            {/* 'Neutral' option enabled */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>&apos;Neutral&apos; option enabled</span>
                <HelpTooltip text="Adds a third gender neutral choice." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={neutralOptionEnabled}
                  onChange={(e) => setNeutralOptionEnabled(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* 'First name' enabled */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>&apos;First name&apos; enabled</span>
                <HelpTooltip text="Enable first name input during registration." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={firstNameEnabled}
                  onChange={(e) => setFirstNameEnabled(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* 'First name' required */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>&apos;First name&apos; required</span>
                <HelpTooltip text="Makes first name a mandatory field." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={firstNameRequired}
                  onChange={(e) => setFirstNameRequired(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* 'Last name' enabled */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>&apos;Last name&apos; enabled</span>
                <HelpTooltip text="Enable last name input." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={lastNameEnabled}
                  onChange={(e) => setLastNameEnabled(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* 'Last name' required */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>&apos;Last name&apos; required</span>
                <HelpTooltip text="Makes last name mandatory." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={lastNameRequired}
                  onChange={(e) => setLastNameRequired(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* 'Date of Birth' enabled */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>&apos;Date of Birth&apos; enabled</span>
                <HelpTooltip text="Enable date of birth date picker." />
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

            {/* 'Date of Birth' required */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>&apos;Date of Birth&apos; required</span>
                <HelpTooltip text="Requires customer to provide date of birth." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={dobRequired}
                  onChange={(e) => setDobRequired(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Customer minimum age */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Customer minimum age</span>
                <HelpTooltip text="Minimum required age to complete registration. Leave blank if not required." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="number"
                  value={customerMinimumAge}
                  onChange={(e) => setCustomerMinimumAge(e.target.value)}
                  placeholder=""
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* 'Company' enabled */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>&apos;Company&apos; enabled</span>
                <HelpTooltip text="Enable company name field." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={companyEnabled}
                  onChange={(e) => setCompanyEnabled(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* 'Company' required */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>&apos;Company&apos; required</span>
                <HelpTooltip text="Require company name." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={companyRequired}
                  onChange={(e) => setCompanyRequired(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* 'Street address' enabled */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>&apos;Street address&apos; enabled</span>
                <HelpTooltip text="Enable street address line 1." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={streetAddressEnabled}
                  onChange={(e) => setStreetAddressEnabled(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* 'Street address' required */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>&apos;Street address&apos; required</span>
                <HelpTooltip text="Require street address line 1." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={streetAddressRequired}
                  onChange={(e) => setStreetAddressRequired(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* 'Street address 2' enabled */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>&apos;Street address 2&apos; enabled</span>
                <HelpTooltip text="Enable street address line 2." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={streetAddress2Enabled}
                  onChange={(e) => setStreetAddress2Enabled(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* 'Street address 2' required */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>&apos;Street address 2&apos; required</span>
                <HelpTooltip text="Require street address line 2." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={streetAddress2Required}
                  onChange={(e) => setStreetAddress2Required(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* 'Zip / postal code' enabled */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>&apos;Zip / postal code&apos; enabled</span>
                <HelpTooltip text="Enable zip/postal code." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={zipCodeEnabled}
                  onChange={(e) => setZipCodeEnabled(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* 'Zip / postal code' required */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>&apos;Zip / postal code&apos; required</span>
                <HelpTooltip text="Require zip/postal code." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={zipCodeRequired}
                  onChange={(e) => setZipCodeRequired(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* 'City' enabled */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>&apos;City&apos; enabled</span>
                <HelpTooltip text="Enable city input." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={cityEnabled}
                  onChange={(e) => setCityEnabled(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* 'City' required */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>&apos;City&apos; required</span>
                <HelpTooltip text="Require city." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={cityRequired}
                  onChange={(e) => setCityRequired(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* 'County / region' enabled */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>&apos;County / region&apos; enabled</span>
                <HelpTooltip text="Enable county or region input." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={countyRegionEnabled}
                  onChange={(e) => setCountyRegionEnabled(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* 'County / region' required */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>&apos;County / region&apos; required</span>
                <HelpTooltip text="Require county/region." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={countyRegionRequired}
                  onChange={(e) => setCountyRegionRequired(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* 'Country' enabled */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>&apos;Country&apos; enabled</span>
                <HelpTooltip text="Enable country selection dropdown." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={countryEnabled}
                  onChange={(e) => setCountryEnabled(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* 'Country' required */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>&apos;Country&apos; required</span>
                <HelpTooltip text="Require country selection." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={countryRequired}
                  onChange={(e) => setCountryRequired(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Default country */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Default country</span>
                <HelpTooltip text="Default country selected during registration and checkout." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <div className="relative">
                  <select
                    value={defaultCountry}
                    onChange={(e) => setDefaultCountry(e.target.value)}
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white appearance-none pr-8 cursor-pointer"
                  >
                    <option value="">Select country</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 'State/province' enabled (media_1791263446972.png) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>&apos;State/province&apos; enabled</span>
                <HelpTooltip text="Enable state/province selection." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={stateProvinceEnabled}
                  onChange={(e) => setStateProvinceEnabled(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* 'Phone number' enabled & required (media_1791263446972.png) */}
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                  <span>&apos;Phone number&apos; enabled</span>
                  <HelpTooltip text="Enable customer phone number." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={phoneNumberEnabled}
                    onChange={(e) => setPhoneNumberEnabled(e.target.checked)}
                    className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                  />
                </div>
              </div>

              {/* 'Phone number' required branch */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center mt-3">
                <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                  <span>&apos;Phone number&apos; required</span>
                  <HelpTooltip text="Require customer phone number." />
                </label>
                <div className="md:col-span-8 flex items-center relative">
                  <div className="absolute -top-4 left-2 w-px h-4 bg-slate-300 pointer-events-none" />
                  <input
                    type="checkbox"
                    checked={phoneNumberRequired}
                    onChange={(e) => setPhoneNumberRequired(e.target.checked)}
                    className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                  />
                </div>
              </div>
            </div>

            {/* 'Fax number' enabled & required (media_1791263446972.png) */}
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                  <span>&apos;Fax number&apos; enabled</span>
                  <HelpTooltip text="Enable customer fax number." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={faxNumberEnabled}
                    onChange={(e) => setFaxNumberEnabled(e.target.checked)}
                    className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                  />
                </div>
              </div>

              {/* 'Fax number' required branch */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center mt-3">
                <label className="md:col-span-4 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                  <span>&apos;Fax number&apos; required</span>
                  <HelpTooltip text="Require customer fax number." />
                </label>
                <div className="md:col-span-8 flex items-center relative">
                  <div className="absolute -top-4 left-2 w-px h-4 bg-slate-300 pointer-events-none" />
                  <input
                    type="checkbox"
                    checked={faxNumberRequired}
                    onChange={(e) => setFaxNumberRequired(e.target.checked)}
                    className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD 6: CUSTOM ADDRESS ATTRIBUTES (Matching bottom of media_1791263446972.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
        <div
          onClick={() => setAddressAttributesOpen(!addressAttributesOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-normal text-slate-800">Custom address attributes</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {addressAttributesOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {addressAttributesOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const name = prompt('Enter custom address attribute name:');
                  if (name) {
                    setCustomAddressAttributes([
                      ...customAddressAttributes,
                      {
                        id: Date.now().toString(),
                        name,
                        controlType: 'TextBox',
                        isRequired: false,
                        displayOrder: customAddressAttributes.length + 1,
                      },
                    ]);
                    showToast('Attribute added successfully.');
                  }
                }}
                className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add new attribute</span>
              </button>
            </div>

            <div className="border border-[#e5e7eb] rounded overflow-hidden">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-[#f9fafb] text-[11px] uppercase tracking-wider text-slate-600 border-b border-[#e5e7eb] font-semibold">
                  <tr>
                    <th className="px-4 py-2.5 font-bold">Name</th>
                    <th className="px-4 py-2.5 font-bold">Control type</th>
                    <th className="px-4 py-2.5 font-bold text-center">Is required</th>
                    <th className="px-4 py-2.5 font-bold text-center">Display order</th>
                    <th className="px-4 py-2.5 font-bold text-center w-24">Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4f4f4]">
                  {customAddressAttributes.map((attr) => (
                    <tr key={attr.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-2.5 font-medium text-slate-800">{attr.name}</td>
                      <td className="px-4 py-2.5 text-slate-600">{attr.controlType}</td>
                      <td className="px-4 py-2.5 text-center">
                        {attr.isRequired ? (
                          <CheckCircle2 className="w-4 h-4 text-[#2489c5] inline-block" />
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-center font-mono">{attr.displayOrder}</td>
                      <td className="px-4 py-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => alert(`Edit attribute: ${attr.name}`)}
                          className="px-2.5 py-1 rounded border border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition cursor-pointer"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── FLOATING SCROLL TO TOP BUTTON (Matching media_1791261747223.png & media_1791261809473.png) ── */}
      <button
        type="button"
        onClick={scrollToTop}
        title="Scroll to top"
        className="fixed bottom-6 right-6 z-40 bg-[#00a65a] hover:bg-[#008d4c] text-white p-2.5 rounded shadow-lg transition cursor-pointer select-none"
      >
        <ArrowUp className="w-5 h-5 stroke-[2.5]" />
      </button>
    </div>
  );
}
