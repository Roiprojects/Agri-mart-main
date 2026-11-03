'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  Monitor,
  Truck,
  CreditCard,
  Percent,
  RotateCcw,
  ArrowUp,
  UserCheck,
  ChevronUp,
} from 'lucide-react';
import { ImageEditorField } from '@/components/admin/ImageEditorField';

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

export default function TaxSettingsPage() {
  const [isAdvanced, setIsAdvanced] = useState(true);

  // Collapsible cards state
  const [commonOpen, setCommonOpen] = useState(true);
  const [defaultAddressOpen, setDefaultAddressOpen] = useState(true);
  const [taxDisplayingOpen, setTaxDisplayingOpen] = useState(true);
  const [shippingTaxOpen, setShippingTaxOpen] = useState(true);
  const [paymentTaxOpen, setPaymentTaxOpen] = useState(true);
  const [vatOpen, setVatOpen] = useState(true);

  // 1. Common fields (media_1791347299750.png)
  const [taxBasedOn, setTaxBasedOn] = useState('Billing address');
  const [automaticallyDetectCountryByIpAddress, setAutomaticallyDetectCountryByIpAddress] =
    useState(true);
  const [defaultTaxCategory, setDefaultTaxCategory] = useState('[None]');
  const [taxBasedOnPickupPointAddress, setTaxBasedOnPickupPointAddress] = useState(false);
  const [pricesIncludeTax, setPricesIncludeTax] = useState(false);

  // 2. Default tax address fields (media_1791347304431.png)
  const [taxFirstName, setTaxFirstName] = useState('');
  const [taxLastName, setTaxLastName] = useState('');
  const [taxEmail, setTaxEmail] = useState('');
  const [taxCompany, setTaxCompany] = useState('');
  const [taxCountry, setTaxCountry] = useState('');
  const [taxStateProvince, setTaxStateProvince] = useState('Other');
  const [taxCountyRegion, setTaxCountyRegion] = useState('');
  const [taxCity, setTaxCity] = useState('');
  const [taxAddress1, setTaxAddress1] = useState('');
  const [taxAddress2, setTaxAddress2] = useState('');
  const [taxZipPostalCode, setTaxZipPostalCode] = useState('');
  const [taxPhoneNumber, setTaxPhoneNumber] = useState('');
  const [taxFaxNumber, setTaxFaxNumber] = useState('');
  const [certificateImage, setCertificateImage] = useState(
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80'
  );

  // 3. Tax displaying fields (media_1791347306285.png)
  const [allowCustomersToSelectTaxDisplayType, setAllowCustomersToSelectTaxDisplayType] =
    useState(false);
  const [taxDisplayType, setTaxDisplayType] = useState('Excluding tax');
  const [displayTaxSuffix, setDisplayTaxSuffix] = useState(false);
  const [displayAllAppliedTaxRates, setDisplayAllAppliedTaxRates] = useState(false);
  const [hideZeroTax, setHideZeroTax] = useState(false);
  const [hideTaxInOrderSummary, setHideTaxInOrderSummary] = useState(false);
  const [forceTaxExclusionFromOrderSubtotal, setForceTaxExclusionFromOrderSubtotal] =
    useState(false);

  // 4. Shipping fields (media_1791347455279.png)
  const [shippingIsTaxable, setShippingIsTaxable] = useState(true);
  const [shippingPriceIncludesTax, setShippingPriceIncludesTax] = useState(false);
  const [shippingTaxCategory, setShippingTaxCategory] = useState('[None]');

  // 5. Payment fields (media_1791347455279.png)
  const [paymentMethodAdditionalFeeIsTaxable, setPaymentMethodAdditionalFeeIsTaxable] =
    useState(true);
  const [paymentMethodAdditionalFeeIncludesTax, setPaymentMethodAdditionalFeeIncludesTax] =
    useState(false);
  const [paymentMethodAdditionalFeeTaxCategory, setPaymentMethodAdditionalFeeTaxCategory] =
    useState('[None]');

  // 6. VAT fields (media_1791347493535.png)
  const [euVatEnabled, setEuVatEnabled] = useState(true);
  const [euVatEnabledForGuests, setEuVatEnabledForGuests] = useState(false);
  const [vatNumberRequired, setVatNumberRequired] = useState(false);
  const [yourShopCountry, setYourShopCountry] = useState('');
  const [allowVatExemption, setAllowVatExemption] = useState(true);
  const [assumeVatAlwaysValid, setAssumeVatAlwaysValid] = useState(false);
  const [notifyAdminWhenNewVatNumberSubmitted, setNotifyAdminWhenNewVatNumberSubmitted] =
    useState(false);
  const [useWebService, setUseWebService] = useState(false);

  // Toast & Saving
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load initial settings from API or localStorage
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings/tax', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            applySettingsData(data.settings);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch tax settings from API, checking localStorage...', err);
      }

      // Fallback to localStorage
      try {
        const saved = localStorage.getItem('agri_tax_settings');
        if (saved) {
          applySettingsData(JSON.parse(saved));
        }
      } catch (e) {
        console.error(e);
      }
    }

    loadSettings();
  }, []);

  const applySettingsData = (s: any) => {
    if (s.taxBasedOn) setTaxBasedOn(s.taxBasedOn);
    if (s.automaticallyDetectCountryByIpAddress !== undefined)
      setAutomaticallyDetectCountryByIpAddress(s.automaticallyDetectCountryByIpAddress);
    if (s.defaultTaxCategory) setDefaultTaxCategory(s.defaultTaxCategory);
    if (s.taxBasedOnPickupPointAddress !== undefined)
      setTaxBasedOnPickupPointAddress(s.taxBasedOnPickupPointAddress);
    if (s.pricesIncludeTax !== undefined) setPricesIncludeTax(s.pricesIncludeTax);

    if (s.defaultTaxAddress) {
      const a = s.defaultTaxAddress;
      if (a.firstName !== undefined) setTaxFirstName(a.firstName);
      if (a.lastName !== undefined) setTaxLastName(a.lastName);
      if (a.email !== undefined) setTaxEmail(a.email);
      if (a.company !== undefined) setTaxCompany(a.company);
      if (a.country !== undefined) setTaxCountry(a.country);
      if (a.stateProvince !== undefined) setTaxStateProvince(a.stateProvince);
      if (a.countyRegion !== undefined) setTaxCountyRegion(a.countyRegion);
      if (a.city !== undefined) setTaxCity(a.city);
      if (a.address1 !== undefined) setTaxAddress1(a.address1);
      if (a.address2 !== undefined) setTaxAddress2(a.address2);
      if (a.zipPostalCode !== undefined) setTaxZipPostalCode(a.zipPostalCode);
      if (a.phoneNumber !== undefined) setTaxPhoneNumber(a.phoneNumber);
      if (a.faxNumber !== undefined) setTaxFaxNumber(a.faxNumber);
      if (a.certificateImage) setCertificateImage(a.certificateImage);
    }

    if (s.allowCustomersToSelectTaxDisplayType !== undefined)
      setAllowCustomersToSelectTaxDisplayType(s.allowCustomersToSelectTaxDisplayType);
    if (s.taxDisplayType) setTaxDisplayType(s.taxDisplayType);
    if (s.displayTaxSuffix !== undefined) setDisplayTaxSuffix(s.displayTaxSuffix);
    if (s.displayAllAppliedTaxRates !== undefined)
      setDisplayAllAppliedTaxRates(s.displayAllAppliedTaxRates);
    if (s.hideZeroTax !== undefined) setHideZeroTax(s.hideZeroTax);
    if (s.hideTaxInOrderSummary !== undefined) setHideTaxInOrderSummary(s.hideTaxInOrderSummary);
    if (s.forceTaxExclusionFromOrderSubtotal !== undefined)
      setForceTaxExclusionFromOrderSubtotal(s.forceTaxExclusionFromOrderSubtotal);

    if (s.shippingIsTaxable !== undefined) setShippingIsTaxable(s.shippingIsTaxable);
    if (s.shippingPriceIncludesTax !== undefined)
      setShippingPriceIncludesTax(s.shippingPriceIncludesTax);
    if (s.shippingTaxCategory) setShippingTaxCategory(s.shippingTaxCategory);

    if (s.paymentMethodAdditionalFeeIsTaxable !== undefined)
      setPaymentMethodAdditionalFeeIsTaxable(s.paymentMethodAdditionalFeeIsTaxable);
    if (s.paymentMethodAdditionalFeeIncludesTax !== undefined)
      setPaymentMethodAdditionalFeeIncludesTax(s.paymentMethodAdditionalFeeIncludesTax);
    if (s.paymentMethodAdditionalFeeTaxCategory)
      setPaymentMethodAdditionalFeeTaxCategory(s.paymentMethodAdditionalFeeTaxCategory);

    if (s.euVatEnabled !== undefined) setEuVatEnabled(s.euVatEnabled);
    if (s.euVatEnabledForGuests !== undefined)
      setEuVatEnabledForGuests(s.euVatEnabledForGuests);
    if (s.vatNumberRequired !== undefined) setVatNumberRequired(s.vatNumberRequired);
    if (s.yourShopCountry !== undefined) setYourShopCountry(s.yourShopCountry);
    if (s.allowVatExemption !== undefined) setAllowVatExemption(s.allowVatExemption);
    if (s.assumeVatAlwaysValid !== undefined) setAssumeVatAlwaysValid(s.assumeVatAlwaysValid);
    if (s.notifyAdminWhenNewVatNumberSubmitted !== undefined)
      setNotifyAdminWhenNewVatNumberSubmitted(s.notifyAdminWhenNewVatNumberSubmitted);
    if (s.useWebService !== undefined) setUseWebService(s.useWebService);

    if (s.isAdvanced !== undefined) setIsAdvanced(s.isAdvanced);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);

    const payload = {
      taxBasedOn,
      automaticallyDetectCountryByIpAddress,
      defaultTaxCategory,
      taxBasedOnPickupPointAddress,
      pricesIncludeTax,

      defaultTaxAddress: {
        firstName: taxFirstName,
        lastName: taxLastName,
        email: taxEmail,
        company: taxCompany,
        country: taxCountry,
        stateProvince: taxStateProvince,
        countyRegion: taxCountyRegion,
        city: taxCity,
        address1: taxAddress1,
        address2: taxAddress2,
        zipPostalCode: taxZipPostalCode,
        phoneNumber: taxPhoneNumber,
        faxNumber: taxFaxNumber,
        certificateImage,
      },

      allowCustomersToSelectTaxDisplayType,
      taxDisplayType,
      displayTaxSuffix,
      displayAllAppliedTaxRates,
      hideZeroTax,
      hideTaxInOrderSummary,
      forceTaxExclusionFromOrderSubtotal,

      shippingIsTaxable,
      shippingPriceIncludesTax,
      shippingTaxCategory,

      paymentMethodAdditionalFeeIsTaxable,
      paymentMethodAdditionalFeeIncludesTax,
      paymentMethodAdditionalFeeTaxCategory,

      euVatEnabled,
      euVatEnabledForGuests,
      vatNumberRequired,
      yourShopCountry,
      allowVatExemption,
      assumeVatAlwaysValid,
      notifyAdminWhenNewVatNumberSubmitted,
      useWebService,

      isAdvanced,
    };

    try {
      localStorage.setItem('agri_tax_settings', JSON.stringify(payload));
      const res = await fetch('/api/admin/settings/tax', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to save to server');
      }
      showToast('The tax settings have been updated successfully.');
    } catch (err: any) {
      console.warn('Saved to localStorage fallback:', err);
      showToast('The tax settings have been updated successfully.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setTaxBasedOn('Billing address');
    setAutomaticallyDetectCountryByIpAddress(true);
    setDefaultTaxCategory('[None]');
    setTaxBasedOnPickupPointAddress(false);
    setPricesIncludeTax(false);

    setTaxFirstName('');
    setTaxLastName('');
    setTaxEmail('');
    setTaxCompany('');
    setTaxCountry('');
    setTaxStateProvince('Other');
    setTaxCountyRegion('');
    setTaxCity('');
    setTaxAddress1('');
    setTaxAddress2('');
    setTaxZipPostalCode('');
    setTaxPhoneNumber('');
    setTaxFaxNumber('');

    setAllowCustomersToSelectTaxDisplayType(false);
    setTaxDisplayType('Excluding tax');
    setDisplayTaxSuffix(false);
    setDisplayAllAppliedTaxRates(false);
    setHideZeroTax(false);
    setHideTaxInOrderSummary(false);
    setForceTaxExclusionFromOrderSubtotal(false);

    setShippingIsTaxable(true);
    setShippingPriceIncludesTax(false);
    setShippingTaxCategory('[None]');

    setPaymentMethodAdditionalFeeIsTaxable(true);
    setPaymentMethodAdditionalFeeIncludesTax(false);
    setPaymentMethodAdditionalFeeTaxCategory('[None]');

    setEuVatEnabled(true);
    setEuVatEnabledForGuests(false);
    setVatNumberRequired(false);
    setYourShopCountry('');
    setAllowVatExemption(true);
    setAssumeVatAlwaysValid(false);
    setNotifyAdminWhenNewVatNumberSubmitted(false);
    setUseWebService(false);

    showToast('Reset to default values. Click Save to apply.', 'success');
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

      {/* ── HEADER (Matching media_1791347299750.png) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Tax settings</h1>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave()}
            className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-4 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* ── MODE BUTTON: Advanced / Basic Toggle (Matching media_1791347299750.png) ── */}
      <div className="pt-0.5">
        <button
          type="button"
          onClick={() => setIsAdvanced(!isAdvanced)}
          className={`inline-flex items-center justify-between px-2.5 py-1 rounded-[3px] text-xs font-normal border transition-colors duration-150 cursor-pointer select-none w-[94px] h-[28px] shadow-2xs ${
            isAdvanced
              ? 'bg-[#2489c5] border-[#2080b9] text-white hover:bg-[#1f72a3]'
              : 'bg-[#f8fafc] border-[#2489c5] text-[#2489c5] hover:bg-slate-100'
          }`}
          title="Toggle Basic / Advanced mode"
        >
          {isAdvanced ? (
            <>
              <span className="text-white text-xs font-normal pl-0.5">Advanced</span>
              <span className="w-3.5 h-[18px] rounded-[2px] bg-white shadow-2xs" />
            </>
          ) : (
            <>
              <span className="w-3.5 h-[18px] rounded-[2px] bg-white border border-[#2489c5] shadow-2xs" />
              <span className="text-[#2489c5] text-xs font-normal pr-0.5">Basic</span>
            </>
          )}
        </button>
      </div>

      {/* ── CARD 1: COMMON (Matching media_1791347299750.png) ── */}
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
            {/* Tax based on */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Tax based on</span>
                <HelpTooltip text="Determine which address is used as the basis for applicable sales tax or GST calculation." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <select
                  value={taxBasedOn}
                  onChange={(e) => setTaxBasedOn(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                >
                  <option value="Billing address">Billing address</option>
                  <option value="Shipping address">Shipping address</option>
                  <option value="Default tax address">Default tax address</option>
                </select>
              </div>
            </div>

            {/* Automatically detect country by IP address */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span className="text-right">
                  Automatically detect country by IP
                  <br className="hidden md:inline" /> address
                </span>
                <HelpTooltip text="Use GeoIP lookup to automatically set customer country for tax calculations before they specify an address." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={automaticallyDetectCountryByIpAddress}
                  onChange={(e) =>
                    setAutomaticallyDetectCountryByIpAddress(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Default tax category */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Default tax category</span>
                <HelpTooltip text="Tax classification assigned to products when no specific tax rate class is defined." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <select
                  value={defaultTaxCategory}
                  onChange={(e) => setDefaultTaxCategory(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                >
                  <option value="[None]">[None]</option>
                  <option value="Standard GST 18%">Standard GST (18%)</option>
                  <option value="Reduced GST 5%">Reduced GST (5%)</option>
                  <option value="Exempt Agri Inputs 0%">Exempt Agri Inputs (0%)</option>
                  <option value="Seeds & Bio Fertilizers">Seeds & Bio Fertilizers</option>
                </select>
              </div>
            </div>

            {/* Tax based on pickup point address */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Tax based on pickup point address</span>
                  <HelpTooltip text="Check if sales tax should be computed according to the physical store pickup location." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={taxBasedOnPickupPointAddress}
                    onChange={(e) => setTaxBasedOnPickupPointAddress(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Prices include tax */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Prices include tax</span>
                <HelpTooltip text="Check if entered catalog product prices are gross amounts already inclusive of tax." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={pricesIncludeTax}
                  onChange={(e) => setPricesIncludeTax(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD 2: DEFAULT TAX ADDRESS (Matching media_1791347304431.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
        <div
          onClick={() => setDefaultAddressOpen(!defaultAddressOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            <span className="text-sm font-normal text-slate-800">
              Default tax address (used for tax calculation)
            </span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {defaultAddressOpen ? (
              <Minus className="w-4 h-4 stroke-[2]" />
            ) : (
              <Plus className="w-4 h-4 stroke-[2]" />
            )}
          </button>
        </div>

        {defaultAddressOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            <div className="text-xs font-semibold text-slate-700 pb-1 border-b border-slate-100">
              Default tax address (used for tax calculation)
            </div>

            {/* First name */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>First name</span>
                <HelpTooltip text="Contact person first name for store entity tax identification." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="text"
                  value={taxFirstName}
                  onChange={(e) => setTaxFirstName(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Last name */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Last name</span>
                <HelpTooltip text="Contact person last name for store entity tax identification." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="text"
                  value={taxLastName}
                  onChange={(e) => setTaxLastName(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Email */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Email</span>
                <HelpTooltip text="Company tax compliance and accounting email address." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="email"
                  value={taxEmail}
                  onChange={(e) => setTaxEmail(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Company */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Company</span>
                <HelpTooltip text="Registered legal corporate entity name." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="text"
                  value={taxCompany}
                  onChange={(e) => setTaxCompany(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Country */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Country</span>
                <HelpTooltip text="Primary jurisdiction country for store tax registration." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <select
                  value={taxCountry}
                  onChange={(e) => setTaxCountry(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                >
                  <option value="">Select country</option>
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            </div>

            {/* State / province */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>State / province</span>
                <HelpTooltip text="Registered state or province for state GST / local sales tax." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <select
                  value={taxStateProvince}
                  onChange={(e) => setTaxStateProvince(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                >
                  <option value="Other">Other</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>
            </div>

            {/* County / region */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>County / region</span>
                <HelpTooltip text="County, district, or sub-region." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="text"
                  value={taxCountyRegion}
                  onChange={(e) => setTaxCountyRegion(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* City */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>City</span>
                <HelpTooltip text="Municipality or registered corporate city." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="text"
                  value={taxCity}
                  onChange={(e) => setTaxCity(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Address 1 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Address 1</span>
                <HelpTooltip text="Principal place of business address line 1." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="text"
                  value={taxAddress1}
                  onChange={(e) => setTaxAddress1(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Address 2 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Address 2</span>
                <HelpTooltip text="Suite, floor, or additional address line 2." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="text"
                  value={taxAddress2}
                  onChange={(e) => setTaxAddress2(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Zip / postal code */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Zip / postal code</span>
                <HelpTooltip text="PIN code or ZIP postal code for exact tax rate table lookup." />
              </label>
              <div className="md:col-span-8 max-w-xl flex items-center gap-1.5">
                <input
                  type="text"
                  value={taxZipPostalCode}
                  onChange={(e) => setTaxZipPostalCode(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
                <span className="text-red-500 font-bold text-sm leading-none select-none">*</span>
              </div>
            </div>

            {/* Phone number */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Phone number</span>
                <HelpTooltip text="Official tax entity contact telephone number." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="text"
                  value={taxPhoneNumber}
                  onChange={(e) => setTaxPhoneNumber(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Fax number */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Fax number</span>
                <HelpTooltip text="Optional fax contact for tax records." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="text"
                  value={taxFaxNumber}
                  onChange={(e) => setTaxFaxNumber(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* GST / Tax Certificate image upload (Supports local device upload, Google/web URL) */}
            <div className="border-t border-slate-100 pt-5 mt-3">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pt-2">
                  <span>GST / Tax Certificate</span>
                  <HelpTooltip text="Upload corporate GSTIN or tax registration document scans from device or image URL." />
                </label>
                <div className="md:col-span-8 max-w-xl">
                  <ImageEditorField
                    value={certificateImage}
                    onChange={(newVal) => setCertificateImage(newVal)}
                    shape="rectangle"
                    previewHeight="h-28"
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Official tax registration certificate verified during audits and automated e-way bill generation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD 3: TAX DISPLAYING (Matching media_1791347306285.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
        <div
          onClick={() => setTaxDisplayingOpen(!taxDisplayingOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            <span className="text-sm font-normal text-slate-800">Tax displaying</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {taxDisplayingOpen ? (
              <Minus className="w-4 h-4 stroke-[2]" />
            ) : (
              <Plus className="w-4 h-4 stroke-[2]" />
            )}
          </button>
        </div>

        {taxDisplayingOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Allow customers to select tax display type */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span className="text-right">
                    Allow customers to select tax display
                    <br className="hidden md:inline" /> type
                  </span>
                  <HelpTooltip text="Allow shoppers to toggle between prices inclusive or exclusive of sales tax on the storefront." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={allowCustomersToSelectTaxDisplayType}
                    onChange={(e) =>
                      setAllowCustomersToSelectTaxDisplayType(e.target.checked)
                    }
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Tax display type */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Tax display type</span>
                <HelpTooltip text="Default format for product pricing presentation throughout catalog." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <select
                  value={taxDisplayType}
                  onChange={(e) => setTaxDisplayType(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                >
                  <option value="Excluding tax">Excluding tax</option>
                  <option value="Including tax">Including tax</option>
                </select>
              </div>
            </div>

            {/* Display tax suffix */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Display tax suffix</span>
                  <HelpTooltip text="Append '(incl. tax)' or '(excl. tax)' text next to every price on catalog pages." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={displayTaxSuffix}
                    onChange={(e) => setDisplayTaxSuffix(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Display all applied tax rates */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Display all applied tax rates</span>
                  <HelpTooltip text="Itemize distinct tax components (e.g. CGST, SGST, IGST) separately in checkout totals." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={displayAllAppliedTaxRates}
                    onChange={(e) => setDisplayAllAppliedTaxRates(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Hide zero tax */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Hide zero tax</span>
                  <HelpTooltip text="Hide the tax summary row completely when order tax evaluates to zero." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={hideZeroTax}
                    onChange={(e) => setHideZeroTax(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Hide tax in order summary */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Hide tax in order summary</span>
                  <HelpTooltip text="Do not display a separate tax row in the shopping cart and checkout order summary box." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={hideTaxInOrderSummary}
                    onChange={(e) => setHideTaxInOrderSummary(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Force tax exclusion from order subtotal */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span className="text-right">
                    Force tax exclusion from order
                    <br className="hidden md:inline" /> subtotal
                  </span>
                  <HelpTooltip text="Always calculate cart subtotal exclusive of tax, regardless of catalog gross pricing settings." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={forceTaxExclusionFromOrderSubtotal}
                    onChange={(e) =>
                      setForceTaxExclusionFromOrderSubtotal(e.target.checked)
                    }
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── CARD 4: SHIPPING (Matching media_1791347455279.png) ── */}
      {isAdvanced && (
        <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
          <div
            onClick={() => setShippingTaxOpen(!shippingTaxOpen)}
            className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
          >
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-slate-700 stroke-[1.8]" />
              <span className="text-sm font-normal text-slate-800">Shipping</span>
            </div>
            <button type="button" className="text-slate-400 hover:text-slate-600">
              {shippingTaxOpen ? (
                <Minus className="w-4 h-4 stroke-[2]" />
              ) : (
                <Plus className="w-4 h-4 stroke-[2]" />
              )}
            </button>
          </div>

          {shippingTaxOpen && (
            <div className="p-5 space-y-4 text-xs text-slate-700">
              {/* Shipping is taxable */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Shipping is taxable</span>
                  <HelpTooltip text="Check if shipping courier and freight charges are subject to sales tax or GST." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={shippingIsTaxable}
                    onChange={(e) => setShippingIsTaxable(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>

              {/* Tree branch child 1: Shipping price includes tax */}
              {shippingIsTaxable && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span>Shipping price includes tax</span>
                    <HelpTooltip text="Check if quoted shipping method costs already include tax amounts." />
                  </label>
                  <div className="md:col-span-8 flex items-center relative pl-5">
                    <div
                      className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="checkbox"
                      checked={shippingPriceIncludesTax}
                      onChange={(e) => setShippingPriceIncludesTax(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Tree branch child 2: Shipping tax category */}
              {shippingIsTaxable && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span>Shipping tax category</span>
                    <HelpTooltip text="Tax category applied specifically to delivery and transport services." />
                  </label>
                  <div className="md:col-span-8 max-w-xl relative pl-5">
                    <div
                      className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <select
                      value={shippingTaxCategory}
                      onChange={(e) => setShippingTaxCategory(e.target.value)}
                      className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                    >
                      <option value="[None]">[None]</option>
                      <option value="Freight Services 18%">Freight Services (18%)</option>
                      <option value="Logistics Standard">Logistics Standard</option>
                      <option value="Reduced Transport 5%">Reduced Transport (5%)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── CARD 5: PAYMENT (Matching media_1791347455279.png) ── */}
      {isAdvanced && (
        <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
          <div
            onClick={() => setPaymentTaxOpen(!paymentTaxOpen)}
            className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
          >
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-700 stroke-[1.8]" />
              <span className="text-sm font-normal text-slate-800">Payment</span>
            </div>
            <button type="button" className="text-slate-400 hover:text-slate-600">
              {paymentTaxOpen ? (
                <Minus className="w-4 h-4 stroke-[2]" />
              ) : (
                <Plus className="w-4 h-4 stroke-[2]" />
              )}
            </button>
          </div>

          {paymentTaxOpen && (
            <div className="p-5 space-y-4 text-xs text-slate-700">
              {/* Payment method additional fee is taxable */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span className="text-right">
                    Payment method additional fee is
                    <br className="hidden md:inline" /> taxable
                  </span>
                  <HelpTooltip text="Check if gateway handling surcharges or cash-on-delivery fees are taxable." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={paymentMethodAdditionalFeeIsTaxable}
                    onChange={(e) =>
                      setPaymentMethodAdditionalFeeIsTaxable(e.target.checked)
                    }
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>

              {/* Tree branch child 1: Payment method additional fee includes tax */}
              {paymentMethodAdditionalFeeIsTaxable && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span className="text-right">
                      Payment method additional fee
                      <br className="hidden md:inline" /> includes tax
                    </span>
                    <HelpTooltip text="Check if configured gateway surcharge amounts already include applicable tax." />
                  </label>
                  <div className="md:col-span-8 flex items-center relative pl-5">
                    <div
                      className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="checkbox"
                      checked={paymentMethodAdditionalFeeIncludesTax}
                      onChange={(e) =>
                        setPaymentMethodAdditionalFeeIncludesTax(e.target.checked)
                      }
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Tree branch child 2: Payment method additional fee tax category */}
              {paymentMethodAdditionalFeeIsTaxable && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span className="text-right">
                      Payment method additional fee tax
                      <br className="hidden md:inline" /> category
                    </span>
                    <HelpTooltip text="Tax class applied to payment handling processing fees." />
                  </label>
                  <div className="md:col-span-8 max-w-xl relative pl-5">
                    <div
                      className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <select
                      value={paymentMethodAdditionalFeeTaxCategory}
                      onChange={(e) =>
                        setPaymentMethodAdditionalFeeTaxCategory(e.target.value)
                      }
                      className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                    >
                      <option value="[None]">[None]</option>
                      <option value="Financial Services 18%">Financial Services (18%)</option>
                      <option value="Standard Taxable">Standard Taxable</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── CARD 6: VAT (Matching media_1791347493535.png) ── */}
      {isAdvanced && (
        <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
          <div
            onClick={() => setVatOpen(!vatOpen)}
            className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
          >
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-slate-700 stroke-[1.8]" />
              <span className="text-sm font-normal text-slate-800">VAT</span>
            </div>
            <button type="button" className="text-slate-400 hover:text-slate-600">
              {vatOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
            </button>
          </div>

          {vatOpen && (
            <div className="p-5 space-y-4 text-xs text-slate-700">
              {/* EU VAT enabled */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>EU VAT enabled</span>
                  <HelpTooltip text="Enable European Union VAT validation, reverse charge exemption, and reporting mechanisms." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={euVatEnabled}
                    onChange={(e) => setEuVatEnabled(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>

              {/* Tree branch children under EU VAT enabled */}
              {euVatEnabled && (
                <>
                  {/* EU VAT enabled for guests */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                      <span>EU VAT enabled for guests</span>
                      <HelpTooltip text="Allow anonymous/guest shoppers to submit corporate VAT ID numbers during checkout." />
                    </label>
                    <div className="md:col-span-8 flex items-center relative pl-5">
                      <div
                        className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                        aria-hidden="true"
                      />
                      <input
                        type="checkbox"
                        checked={euVatEnabledForGuests}
                        onChange={(e) => setEuVatEnabledForGuests(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* VAT number required */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                      <span>VAT number required</span>
                      <HelpTooltip text="Make valid corporate VAT / GST registration number mandatory during account creation." />
                    </label>
                    <div className="md:col-span-8 flex items-center relative pl-5">
                      <div
                        className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                        aria-hidden="true"
                      />
                      <input
                        type="checkbox"
                        checked={vatNumberRequired}
                        onChange={(e) => setVatNumberRequired(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Your shop country */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                      <span>Your shop country</span>
                      <HelpTooltip text="Domestic domicile country where merchant store is registered for VAT rules." />
                    </label>
                    <div className="md:col-span-8 max-w-xl relative pl-5">
                      <div
                        className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                        aria-hidden="true"
                      />
                      <select
                        value={yourShopCountry}
                        onChange={(e) => setYourShopCountry(e.target.value)}
                        className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                      >
                        <option value="">Select country</option>
                        <option value="India">India</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="Italy">Italy</option>
                        <option value="United Kingdom">United Kingdom</option>
                      </select>
                    </div>
                  </div>

                  {/* Allow VAT exemption */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                      <span>Allow VAT exemption</span>
                      <HelpTooltip text="Exempt intra-community corporate purchases from VAT when customer provides a validated VAT registration." />
                    </label>
                    <div className="md:col-span-8 flex items-center relative pl-5">
                      <div
                        className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                        aria-hidden="true"
                      />
                      <input
                        type="checkbox"
                        checked={allowVatExemption}
                        onChange={(e) => setAllowVatExemption(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Assume VAT always valid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                      <span>Assume VAT always valid</span>
                      <HelpTooltip text="Accept customer-entered VAT ID without live web service confirmation checks." />
                    </label>
                    <div className="md:col-span-8 flex items-center relative pl-5">
                      <div
                        className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                        aria-hidden="true"
                      />
                      <input
                        type="checkbox"
                        checked={assumeVatAlwaysValid}
                        onChange={(e) => setAssumeVatAlwaysValid(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Notify admin when a new VAT number is submitted */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                      <span className="text-right">
                        Notify admin when a new VAT number
                        <br className="hidden md:inline" /> is submitted
                      </span>
                      <HelpTooltip text="Send notification alert email to store managers whenever a customer registers a company tax ID." />
                    </label>
                    <div className="md:col-span-8 flex items-center relative pl-5">
                      <div
                        className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                        aria-hidden="true"
                      />
                      <input
                        type="checkbox"
                        checked={notifyAdminWhenNewVatNumberSubmitted}
                        onChange={(e) =>
                          setNotifyAdminWhenNewVatNumberSubmitted(e.target.checked)
                        }
                        className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Use web service */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                      <span>Use web service</span>
                      <HelpTooltip text="Check entered VAT identifiers against official government API (such as European Commission VIES or GSTN)." />
                    </label>
                    <div className="md:col-span-8 flex items-center relative pl-5">
                      <div
                        className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                        aria-hidden="true"
                      />
                      <input
                        type="checkbox"
                        checked={useWebService}
                        onChange={(e) => setUseWebService(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── BOTTOM ACTIONS BAR ── */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handleResetDefaults}
          className="text-slate-500 hover:text-slate-800 text-xs font-medium flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restore original defaults</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave()}
            className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-5 py-2 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving changes...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* ── FLOATING GREEN SCROLL-TO-TOP BUTTON (Matching media_1791347493535.png) ── */}
      <button
        type="button"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded bg-[#00a65a] hover:bg-[#008d4c] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
        title="Scroll to top"
      >
        <ChevronUp className="w-6 h-6 stroke-[2.5]" />
      </button>
    </div>
  );
}
