'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  Truck,
  CreditCard,
  Percent,
  RotateCcw,
  ArrowUp,
  UserCheck,
  ChevronUp,
  X,
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
  const [taxId, setTaxId] = useState('');
  const [certificateImage, setCertificateImage] = useState(
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80'
  );

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

  // Tax categories list (synced with /api/admin/tax-categories)
  const [taxCategories, setTaxCategories] = useState<{ id: string; name: string; displayOrder: number; taxSettings?: any }[]>([]);
  const [showAddTaxModal, setShowAddTaxModal] = useState(false);
  const [creatingTax, setCreatingTax] = useState(false);
  const [addTaxForm, setAddTaxForm] = useState<any>(null);

  const loadTaxCategories = async () => {
    try {
      const res = await fetch('/api/admin/tax-categories', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setTaxCategories(json.data);
        }
      }
    } catch {
      // ignore
    }
  };

  const openAddTaxModal = () => {
    setAddTaxForm({
      name: '',
      displayOrder: 0,
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
        taxId,
        certificateImage,
      },
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
    });
    setShowAddTaxModal(true);
  };

  const handleCreateAndApplyTax = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addTaxForm?.name?.trim()) {
      showToast('Please enter a Tax Name.', 'error');
      return;
    }

    setCreatingTax(true);
    try {
      const taxName = addTaxForm.name.trim();
      const { name: _n, displayOrder, ...taxSettingsPayload } = addTaxForm;
      const finalTaxSettings = {
        ...taxSettingsPayload,
        defaultTaxCategory: taxName,
        isAdvanced,
      };

      // 1. Create the tax in Tax Categories with all collected settings
      const catRes = await fetch('/api/admin/tax-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: taxName,
          displayOrder: parseInt(String(displayOrder), 10) || 0,
          taxSettings: finalTaxSettings,
        }),
      });
      const catJson = await catRes.json();
      if (!catRes.ok || !catJson.success) {
        showToast(catJson.message || 'Failed to create tax category.', 'error');
        setCreatingTax(false);
        return;
      }

      // 2. Apply and select the created tax in Tax Settings
      applySettingsData(finalTaxSettings);
      await fetch('/api/admin/settings/tax', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalTaxSettings),
      });
      localStorage.setItem('agri_tax_settings', JSON.stringify(finalTaxSettings));

      await loadTaxCategories();
      setShowAddTaxModal(false);
      showToast(`Tax "${taxName}" created in Tax Categories and applied to Tax Settings.`);
    } catch {
      showToast('Error creating and applying tax.', 'error');
    } finally {
      setCreatingTax(false);
    }
  };

  // Load initial settings from API or localStorage
  useEffect(() => {
    loadTaxCategories();
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
      if (a.taxId !== undefined) setTaxId(a.taxId);
      if (a.certificateImage) setCertificateImage(a.certificateImage);
    }

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
        taxId,
        certificateImage,
      },

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
    setTaxId('');

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
            onClick={openAddTaxModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Tax</span>
          </button>
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
                  {taxCategories
                    .filter(
                      (c) =>
                        ![
                          '[None]',
                          'Standard GST 18%',
                          'Reduced GST 5%',
                          'Exempt Agri Inputs 0%',
                          'Seeds & Bio Fertilizers',
                        ].includes(c.name)
                    )
                    .map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
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

            {/* Tax ID */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Tax ID</span>
                <HelpTooltip text="Tax identification number (e.g., GSTIN / PAN / TIN) associated with the default tax address." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="e.g. 29AABCU9603R1ZM"
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

      {/* ── ADD TAX MODAL (Full Tax Settings fields -> creates & applies in Tax Categories) ── */}
      {showAddTaxModal && addTaxForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
              <div>
                <h2 className="text-base font-semibold text-slate-800">Add New Tax</h2>
                <p className="text-[11px] text-slate-500">
                  Fill all tax settings details below. Submitting will create the tax in Tax Categories and apply it to Tax Settings.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddTaxModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAndApplyTax} className="overflow-y-auto p-5 space-y-5 text-xs text-slate-700">
              {/* Tax Name & Display Order */}
              <div className="rounded border border-emerald-200 bg-emerald-50/40 p-4 space-y-3">
                <h3 className="text-xs font-semibold text-emerald-900">Tax Identity (Appears in Tax Categories)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Tax Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={addTaxForm.name}
                      onChange={(e) => setAddTaxForm({ ...addTaxForm, name: e.target.value })}
                      placeholder="e.g. Agri GST 12%"
                      className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs bg-white focus:border-[#3c8dbc] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Display order</label>
                    <input
                      type="number"
                      value={addTaxForm.displayOrder}
                      onChange={(e) => setAddTaxForm({ ...addTaxForm, displayOrder: e.target.value })}
                      className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs bg-white focus:border-[#3c8dbc] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 1: Common */}
              <div className="rounded border border-slate-200 p-4 space-y-3">
                <h3 className="text-xs font-semibold text-slate-800 border-b border-slate-100 pb-1.5">1. Common</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Tax based on</label>
                    <select
                      value={addTaxForm.taxBasedOn}
                      onChange={(e) => setAddTaxForm({ ...addTaxForm, taxBasedOn: e.target.value })}
                      className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs bg-white"
                    >
                      <option value="Billing address">Billing address</option>
                      <option value="Shipping address">Shipping address</option>
                      <option value="Default tax address">Default tax address</option>
                    </select>
                  </div>
                  <div className="flex flex-col justify-end gap-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addTaxForm.automaticallyDetectCountryByIpAddress}
                        onChange={(e) =>
                          setAddTaxForm({ ...addTaxForm, automaticallyDetectCountryByIpAddress: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc]"
                      />
                      <span>Automatically detect country by IP address</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addTaxForm.taxBasedOnPickupPointAddress}
                        onChange={(e) =>
                          setAddTaxForm({ ...addTaxForm, taxBasedOnPickupPointAddress: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc]"
                      />
                      <span>Tax based on pickup point address</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addTaxForm.pricesIncludeTax}
                        onChange={(e) => setAddTaxForm({ ...addTaxForm, pricesIncludeTax: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc]"
                      />
                      <span>Prices include tax</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 2: Default tax address (used for tax calculation) */}
              <div className="rounded border border-slate-200 p-4 space-y-3">
                <h3 className="text-xs font-semibold text-slate-800 border-b border-slate-100 pb-1.5">
                  2. Default tax address (used for tax calculation)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">First name</label>
                    <input
                      type="text"
                      value={addTaxForm.defaultTaxAddress.firstName}
                      onChange={(e) =>
                        setAddTaxForm({
                          ...addTaxForm,
                          defaultTaxAddress: { ...addTaxForm.defaultTaxAddress, firstName: e.target.value },
                        })
                      }
                      className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Last name</label>
                    <input
                      type="text"
                      value={addTaxForm.defaultTaxAddress.lastName}
                      onChange={(e) =>
                        setAddTaxForm({
                          ...addTaxForm,
                          defaultTaxAddress: { ...addTaxForm.defaultTaxAddress, lastName: e.target.value },
                        })
                      }
                      className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={addTaxForm.defaultTaxAddress.email}
                      onChange={(e) =>
                        setAddTaxForm({
                          ...addTaxForm,
                          defaultTaxAddress: { ...addTaxForm.defaultTaxAddress, email: e.target.value },
                        })
                      }
                      className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={addTaxForm.defaultTaxAddress.company}
                      onChange={(e) =>
                        setAddTaxForm({
                          ...addTaxForm,
                          defaultTaxAddress: { ...addTaxForm.defaultTaxAddress, company: e.target.value },
                        })
                      }
                      className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Country</label>
                    <select
                      value={addTaxForm.defaultTaxAddress.country}
                      onChange={(e) =>
                        setAddTaxForm({
                          ...addTaxForm,
                          defaultTaxAddress: { ...addTaxForm.defaultTaxAddress, country: e.target.value },
                        })
                      }
                      className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs bg-white"
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
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">State / province</label>
                    <select
                      value={addTaxForm.defaultTaxAddress.stateProvince}
                      onChange={(e) =>
                        setAddTaxForm({
                          ...addTaxForm,
                          defaultTaxAddress: { ...addTaxForm.defaultTaxAddress, stateProvince: e.target.value },
                        })
                      }
                      className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs bg-white"
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
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">County / region</label>
                    <input
                      type="text"
                      value={addTaxForm.defaultTaxAddress.countyRegion}
                      onChange={(e) =>
                        setAddTaxForm({
                          ...addTaxForm,
                          defaultTaxAddress: { ...addTaxForm.defaultTaxAddress, countyRegion: e.target.value },
                        })
                      }
                      className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={addTaxForm.defaultTaxAddress.city}
                      onChange={(e) =>
                        setAddTaxForm({
                          ...addTaxForm,
                          defaultTaxAddress: { ...addTaxForm.defaultTaxAddress, city: e.target.value },
                        })
                      }
                      className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Address 1</label>
                    <input
                      type="text"
                      value={addTaxForm.defaultTaxAddress.address1}
                      onChange={(e) =>
                        setAddTaxForm({
                          ...addTaxForm,
                          defaultTaxAddress: { ...addTaxForm.defaultTaxAddress, address1: e.target.value },
                        })
                      }
                      className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Address 2</label>
                    <input
                      type="text"
                      value={addTaxForm.defaultTaxAddress.address2}
                      onChange={(e) =>
                        setAddTaxForm({
                          ...addTaxForm,
                          defaultTaxAddress: { ...addTaxForm.defaultTaxAddress, address2: e.target.value },
                        })
                      }
                      className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Zip / postal code</label>
                    <input
                      type="text"
                      value={addTaxForm.defaultTaxAddress.zipPostalCode}
                      onChange={(e) =>
                        setAddTaxForm({
                          ...addTaxForm,
                          defaultTaxAddress: { ...addTaxForm.defaultTaxAddress, zipPostalCode: e.target.value },
                        })
                      }
                      className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Phone number</label>
                    <input
                      type="text"
                      value={addTaxForm.defaultTaxAddress.phoneNumber}
                      onChange={(e) =>
                        setAddTaxForm({
                          ...addTaxForm,
                          defaultTaxAddress: { ...addTaxForm.defaultTaxAddress, phoneNumber: e.target.value },
                        })
                      }
                      className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Fax number</label>
                    <input
                      type="text"
                      value={addTaxForm.defaultTaxAddress.faxNumber}
                      onChange={(e) =>
                        setAddTaxForm({
                          ...addTaxForm,
                          defaultTaxAddress: { ...addTaxForm.defaultTaxAddress, faxNumber: e.target.value },
                        })
                      }
                      className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Tax ID</label>
                    <input
                      type="text"
                      value={addTaxForm.defaultTaxAddress.taxId || ''}
                      onChange={(e) =>
                        setAddTaxForm({
                          ...addTaxForm,
                          defaultTaxAddress: { ...addTaxForm.defaultTaxAddress, taxId: e.target.value },
                        })
                      }
                      placeholder="e.g. 29AABCU9603R1ZM"
                      className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-medium text-slate-700 mb-1">GST / Tax Certificate</label>
                    <ImageEditorField
                      value={addTaxForm.defaultTaxAddress.certificateImage}
                      onChange={(newVal) =>
                        setAddTaxForm({
                          ...addTaxForm,
                          defaultTaxAddress: { ...addTaxForm.defaultTaxAddress, certificateImage: newVal },
                        })
                      }
                      shape="rectangle"
                      previewHeight="h-24"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Shipping */}
              <div className="rounded border border-slate-200 p-4 space-y-3">
                <h3 className="text-xs font-semibold text-slate-800 border-b border-slate-100 pb-1.5">3. Shipping</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addTaxForm.shippingIsTaxable}
                        onChange={(e) => setAddTaxForm({ ...addTaxForm, shippingIsTaxable: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc]"
                      />
                      <span>Shipping is taxable</span>
                    </label>
                    {addTaxForm.shippingIsTaxable && (
                      <label className="flex items-center gap-2 cursor-pointer pl-5">
                        <input
                          type="checkbox"
                          checked={addTaxForm.shippingPriceIncludesTax}
                          onChange={(e) => setAddTaxForm({ ...addTaxForm, shippingPriceIncludesTax: e.target.checked })}
                          className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc]"
                        />
                        <span>Shipping price includes tax</span>
                      </label>
                    )}
                  </div>
                  {addTaxForm.shippingIsTaxable && (
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Shipping tax category</label>
                      <select
                        value={addTaxForm.shippingTaxCategory}
                        onChange={(e) => setAddTaxForm({ ...addTaxForm, shippingTaxCategory: e.target.value })}
                        className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs bg-white"
                      >
                        <option value="[None]">[None]</option>
                        <option value="Freight Services 18%">Freight Services (18%)</option>
                        <option value="Logistics Standard">Logistics Standard</option>
                        <option value="Reduced Transport 5%">Reduced Transport (5%)</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Payment */}
              <div className="rounded border border-slate-200 p-4 space-y-3">
                <h3 className="text-xs font-semibold text-slate-800 border-b border-slate-100 pb-1.5">4. Payment</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addTaxForm.paymentMethodAdditionalFeeIsTaxable}
                        onChange={(e) =>
                          setAddTaxForm({ ...addTaxForm, paymentMethodAdditionalFeeIsTaxable: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc]"
                      />
                      <span>Payment method additional fee is taxable</span>
                    </label>
                    {addTaxForm.paymentMethodAdditionalFeeIsTaxable && (
                      <label className="flex items-center gap-2 cursor-pointer pl-5">
                        <input
                          type="checkbox"
                          checked={addTaxForm.paymentMethodAdditionalFeeIncludesTax}
                          onChange={(e) =>
                            setAddTaxForm({ ...addTaxForm, paymentMethodAdditionalFeeIncludesTax: e.target.checked })
                          }
                          className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc]"
                        />
                        <span>Payment method additional fee includes tax</span>
                      </label>
                    )}
                  </div>
                  {addTaxForm.paymentMethodAdditionalFeeIsTaxable && (
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Payment method additional fee tax category
                      </label>
                      <select
                        value={addTaxForm.paymentMethodAdditionalFeeTaxCategory}
                        onChange={(e) =>
                          setAddTaxForm({ ...addTaxForm, paymentMethodAdditionalFeeTaxCategory: e.target.value })
                        }
                        className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs bg-white"
                      >
                        <option value="[None]">[None]</option>
                        <option value="Financial Services 18%">Financial Services (18%)</option>
                        <option value="Standard Taxable">Standard Taxable</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 5: VAT */}
              <div className="rounded border border-slate-200 p-4 space-y-3">
                <h3 className="text-xs font-semibold text-slate-800 border-b border-slate-100 pb-1.5">5. VAT</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addTaxForm.euVatEnabled}
                    onChange={(e) => setAddTaxForm({ ...addTaxForm, euVatEnabled: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc]"
                  />
                  <span>EU VAT enabled</span>
                </label>
                {addTaxForm.euVatEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-5 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addTaxForm.euVatEnabledForGuests}
                        onChange={(e) => setAddTaxForm({ ...addTaxForm, euVatEnabledForGuests: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc]"
                      />
                      <span>EU VAT enabled for guests</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addTaxForm.vatNumberRequired}
                        onChange={(e) => setAddTaxForm({ ...addTaxForm, vatNumberRequired: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc]"
                      />
                      <span>VAT number required</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addTaxForm.allowVatExemption}
                        onChange={(e) => setAddTaxForm({ ...addTaxForm, allowVatExemption: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc]"
                      />
                      <span>Allow VAT exemption</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addTaxForm.assumeVatAlwaysValid}
                        onChange={(e) => setAddTaxForm({ ...addTaxForm, assumeVatAlwaysValid: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc]"
                      />
                      <span>Assume VAT always valid</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addTaxForm.notifyAdminWhenNewVatNumberSubmitted}
                        onChange={(e) =>
                          setAddTaxForm({
                            ...addTaxForm,
                            notifyAdminWhenNewVatNumberSubmitted: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc]"
                      />
                      <span>Notify admin when a new VAT number is submitted</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addTaxForm.useWebService}
                        onChange={(e) => setAddTaxForm({ ...addTaxForm, useWebService: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc]"
                      />
                      <span>Use web service</span>
                    </label>
                    <div className="sm:col-span-2">
                      <label className="block font-medium text-slate-700 mb-1">Your shop country</label>
                      <select
                        value={addTaxForm.yourShopCountry}
                        onChange={(e) => setAddTaxForm({ ...addTaxForm, yourShopCountry: e.target.value })}
                        className="w-full border border-[#d2d6de] rounded px-3 py-1.5 text-xs bg-white"
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
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddTaxModal(false)}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingTax}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{creatingTax ? 'Creating & Applying...' : 'Create & Apply Tax'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
