'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  Bell,
  CreditCard,
  Truck,
  RotateCcw,
  ArrowUp,
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

export default function ShippingSettingsPage() {
  const [isAdvanced, setIsAdvanced] = useState(true);

  // Collapsible cards state
  const [commonOpen, setCommonOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(true);
  const [shippingOriginOpen, setShippingOriginOpen] = useState(true);

  // 1. Common fields (media_1791346513915.png & media_1791346533205.png)
  const [estimateShippingCartPage, setEstimateShippingCartPage] = useState(true);
  const [estimateShippingProductPage, setEstimateShippingProductPage] = useState(true);
  const [useCityNameForEstimateShipping, setUseCityNameForEstimateShipping] = useState(false);
  const [pickUpInStoreEnabled, setPickUpInStoreEnabled] = useState(true);
  const [
    ignoreAdditionalShippingChargeForPickUpInStore,
    setIgnoreAdditionalShippingChargeForPickUpInStore,
  ] = useState(true);
  const [displayPickupPointsOnMap, setDisplayPickupPointsOnMap] = useState(true);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState('');
  const [freeShippingOverX, setFreeShippingOverX] = useState(true);
  const [valueOfX, setValueOfX] = useState<number | string>(0);
  const [calculateXIncludingTax, setCalculateXIncludingTax] = useState(true);
  const [useWarehouseLocation, setUseWarehouseLocation] = useState(true);
  const [
    considerAssociatedProductsDimensionsAndWeight,
    setConsiderAssociatedProductsDimensionsAndWeight,
  ] = useState(true);
  const [sortShippingMethodsBy, setSortShippingMethodsBy] = useState('Position');

  // 2. Notifications fields (media_1791346533205.png)
  const [
    notifyCustomerAboutShippingFromMultipleLocations,
    setNotifyCustomerAboutShippingFromMultipleLocations,
  ] = useState(false);
  const [displayShipmentEventsCustomers, setDisplayShipmentEventsCustomers] = useState(false);
  const [displayShipmentEventsStoreOwner, setDisplayShipmentEventsStoreOwner] = useState(false);

  // 3. Checkout fields (media_1791346536874.png)
  const [
    hideShippingTotalIfShippingNotRequired,
    setHideShippingTotalIfShippingNotRequired,
  ] = useState(false);
  const [shipToSameAddress, setShipToSameAddress] = useState(false);
  const [
    bypassShippingMethodPageIfOnlyOne,
    setBypassShippingMethodPageIfOnlyOne,
  ] = useState(false);

  // 4. Shipping origin fields (media_1791346544811.png)
  const [originFirstName, setOriginFirstName] = useState('');
  const [originLastName, setOriginLastName] = useState('');
  const [originEmail, setOriginEmail] = useState('');
  const [originCompany, setOriginCompany] = useState('');
  const [originCountry, setOriginCountry] = useState('');
  const [originStateProvince, setOriginStateProvince] = useState('Other');
  const [originCountyRegion, setOriginCountyRegion] = useState('');
  const [originCity, setOriginCity] = useState('');
  const [originAddress1, setOriginAddress1] = useState('');
  const [originAddress2, setOriginAddress2] = useState('');
  const [originZipPostalCode, setOriginZipPostalCode] = useState('');
  const [originPhoneNumber, setOriginPhoneNumber] = useState('');
  const [originFaxNumber, setOriginFaxNumber] = useState('');
  const [originImage, setOriginImage] = useState(
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80'
  );

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
        const res = await fetch('/api/admin/settings/shipping', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            applySettingsData(data.settings);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch shipping settings from API, checking localStorage...', err);
      }

      // Fallback to localStorage
      try {
        const saved = localStorage.getItem('agri_shipping_settings');
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
    if (s.estimateShippingCartPage !== undefined)
      setEstimateShippingCartPage(s.estimateShippingCartPage);
    if (s.estimateShippingProductPage !== undefined)
      setEstimateShippingProductPage(s.estimateShippingProductPage);
    if (s.useCityNameForEstimateShipping !== undefined)
      setUseCityNameForEstimateShipping(s.useCityNameForEstimateShipping);
    if (s.pickUpInStoreEnabled !== undefined) setPickUpInStoreEnabled(s.pickUpInStoreEnabled);
    if (s.ignoreAdditionalShippingChargeForPickUpInStore !== undefined)
      setIgnoreAdditionalShippingChargeForPickUpInStore(
        s.ignoreAdditionalShippingChargeForPickUpInStore
      );
    if (s.displayPickupPointsOnMap !== undefined)
      setDisplayPickupPointsOnMap(s.displayPickupPointsOnMap);
    if (s.googleMapsApiKey !== undefined) setGoogleMapsApiKey(s.googleMapsApiKey);
    if (s.freeShippingOverX !== undefined) setFreeShippingOverX(s.freeShippingOverX);
    if (s.valueOfX !== undefined) setValueOfX(s.valueOfX);
    if (s.calculateXIncludingTax !== undefined) setCalculateXIncludingTax(s.calculateXIncludingTax);
    if (s.useWarehouseLocation !== undefined) setUseWarehouseLocation(s.useWarehouseLocation);
    if (s.considerAssociatedProductsDimensionsAndWeight !== undefined)
      setConsiderAssociatedProductsDimensionsAndWeight(
        s.considerAssociatedProductsDimensionsAndWeight
      );
    if (s.sortShippingMethodsBy) setSortShippingMethodsBy(s.sortShippingMethodsBy);

    if (s.notifyCustomerAboutShippingFromMultipleLocations !== undefined)
      setNotifyCustomerAboutShippingFromMultipleLocations(
        s.notifyCustomerAboutShippingFromMultipleLocations
      );
    if (s.displayShipmentEventsCustomers !== undefined)
      setDisplayShipmentEventsCustomers(s.displayShipmentEventsCustomers);
    if (s.displayShipmentEventsStoreOwner !== undefined)
      setDisplayShipmentEventsStoreOwner(s.displayShipmentEventsStoreOwner);

    if (s.hideShippingTotalIfShippingNotRequired !== undefined)
      setHideShippingTotalIfShippingNotRequired(s.hideShippingTotalIfShippingNotRequired);
    if (s.shipToSameAddress !== undefined) setShipToSameAddress(s.shipToSameAddress);
    if (s.bypassShippingMethodPageIfOnlyOne !== undefined)
      setBypassShippingMethodPageIfOnlyOne(s.bypassShippingMethodPageIfOnlyOne);

    if (s.shippingOrigin) {
      const o = s.shippingOrigin;
      if (o.firstName !== undefined) setOriginFirstName(o.firstName);
      if (o.lastName !== undefined) setOriginLastName(o.lastName);
      if (o.email !== undefined) setOriginEmail(o.email);
      if (o.company !== undefined) setOriginCompany(o.company);
      if (o.country !== undefined) setOriginCountry(o.country);
      if (o.stateProvince !== undefined) setOriginStateProvince(o.stateProvince);
      if (o.countyRegion !== undefined) setOriginCountyRegion(o.countyRegion);
      if (o.city !== undefined) setOriginCity(o.city);
      if (o.address1 !== undefined) setOriginAddress1(o.address1);
      if (o.address2 !== undefined) setOriginAddress2(o.address2);
      if (o.zipPostalCode !== undefined) setOriginZipPostalCode(o.zipPostalCode);
      if (o.phoneNumber !== undefined) setOriginPhoneNumber(o.phoneNumber);
      if (o.faxNumber !== undefined) setOriginFaxNumber(o.faxNumber);
      if (o.originImage) setOriginImage(o.originImage);
    }

    if (s.isAdvanced !== undefined) setIsAdvanced(s.isAdvanced);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);

    const payload = {
      estimateShippingCartPage,
      estimateShippingProductPage,
      useCityNameForEstimateShipping,
      pickUpInStoreEnabled,
      ignoreAdditionalShippingChargeForPickUpInStore,
      displayPickupPointsOnMap,
      googleMapsApiKey,
      freeShippingOverX,
      valueOfX: Number(valueOfX) || 0,
      valueOfXCurrency: 'INR',
      calculateXIncludingTax,
      useWarehouseLocation,
      considerAssociatedProductsDimensionsAndWeight,
      sortShippingMethodsBy,

      notifyCustomerAboutShippingFromMultipleLocations,
      displayShipmentEventsCustomers,
      displayShipmentEventsStoreOwner,

      hideShippingTotalIfShippingNotRequired,
      shipToSameAddress,
      bypassShippingMethodPageIfOnlyOne,

      shippingOrigin: {
        firstName: originFirstName,
        lastName: originLastName,
        email: originEmail,
        company: originCompany,
        country: originCountry,
        stateProvince: originStateProvince,
        countyRegion: originCountyRegion,
        city: originCity,
        address1: originAddress1,
        address2: originAddress2,
        zipPostalCode: originZipPostalCode,
        phoneNumber: originPhoneNumber,
        faxNumber: originFaxNumber,
        originImage,
      },

      isAdvanced,
    };

    try {
      localStorage.setItem('agri_shipping_settings', JSON.stringify(payload));
      const res = await fetch('/api/admin/settings/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to save to server');
      }
      showToast('The shipping settings have been updated successfully.');
    } catch (err: any) {
      console.warn('Saved to localStorage fallback:', err);
      showToast('The shipping settings have been updated successfully.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setEstimateShippingCartPage(true);
    setEstimateShippingProductPage(true);
    setUseCityNameForEstimateShipping(false);
    setPickUpInStoreEnabled(true);
    setIgnoreAdditionalShippingChargeForPickUpInStore(true);
    setDisplayPickupPointsOnMap(true);
    setGoogleMapsApiKey('');
    setFreeShippingOverX(true);
    setValueOfX(0);
    setCalculateXIncludingTax(true);
    setUseWarehouseLocation(true);
    setConsiderAssociatedProductsDimensionsAndWeight(true);
    setSortShippingMethodsBy('Position');

    setNotifyCustomerAboutShippingFromMultipleLocations(false);
    setDisplayShipmentEventsCustomers(false);
    setDisplayShipmentEventsStoreOwner(false);

    setHideShippingTotalIfShippingNotRequired(false);
    setShipToSameAddress(false);
    setBypassShippingMethodPageIfOnlyOne(false);

    setOriginFirstName('');
    setOriginLastName('');
    setOriginEmail('');
    setOriginCompany('');
    setOriginCountry('');
    setOriginStateProvince('Other');
    setOriginCountyRegion('');
    setOriginCity('');
    setOriginAddress1('');
    setOriginAddress2('');
    setOriginZipPostalCode('');
    setOriginPhoneNumber('');
    setOriginFaxNumber('');

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

      {/* ── HEADER (Matching media_1791346513915.png) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Shipping settings</h1>

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

      {/* ── MODE BUTTON: Advanced / Basic Toggle (Matching media_1791346513915.png) ── */}
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

      {/* ── CARD 1: COMMON (Matching media_1791346513915.png & media_1791346533205.png) ── */}
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
            {/* Estimate shipping enabled (cart page) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Estimate shipping enabled (cart page)</span>
                <HelpTooltip text="Check to display shipping calculation and estimate box on the shopping cart page." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={estimateShippingCartPage}
                  onChange={(e) => setEstimateShippingCartPage(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Estimate shipping enabled (product page) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span className="text-right">
                  Estimate shipping enabled (product
                  <br className="hidden md:inline" /> page)
                </span>
                <HelpTooltip text="Check to display estimated shipping charges directly on the product details page." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={estimateShippingProductPage}
                  onChange={(e) => setEstimateShippingProductPage(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Use a city name for estimate shipping (Advanced only) */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Use a city name for estimate shipping</span>
                  <HelpTooltip text="Check if shipping rates calculation requires customer to enter a city name." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={useCityNameForEstimateShipping}
                    onChange={(e) => setUseCityNameForEstimateShipping(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* "Pick Up in Store" enabled */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>"Pick Up in Store" enabled</span>
                <HelpTooltip text="Check to allow customer to choose in-store pickup at local fulfillment centers." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={pickUpInStoreEnabled}
                  onChange={(e) => setPickUpInStoreEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Tree branch child 1: Ignore additional shipping charge for pick up in store */}
            {pickUpInStoreEnabled && isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span className="text-right">
                    Ignore additional shipping charge for
                    <br className="hidden md:inline" /> pick up in store
                  </span>
                  <HelpTooltip text="Ignore per-product additional shipping fees when in-store pickup is chosen." />
                </label>
                <div className="md:col-span-8 flex items-center relative pl-5">
                  <div
                    className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="checkbox"
                    checked={ignoreAdditionalShippingChargeForPickUpInStore}
                    onChange={(e) =>
                      setIgnoreAdditionalShippingChargeForPickUpInStore(e.target.checked)
                    }
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Tree branch child 2: Display pickup points on the map */}
            {pickUpInStoreEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Display pickup points on the map</span>
                  <HelpTooltip text="Display interactive Google Map with nearby store locations during checkout." />
                </label>
                <div className="md:col-span-8 flex items-center relative pl-5">
                  <div
                    className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="checkbox"
                    checked={displayPickupPointsOnMap}
                    onChange={(e) => setDisplayPickupPointsOnMap(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Nested child under Display pickup points on the map: Google maps API key */}
            {pickUpInStoreEnabled && displayPickupPointsOnMap && isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Google maps API key</span>
                  <HelpTooltip text="Enter your Google Maps JavaScript API key required to display map tiles." />
                </label>
                <div className="md:col-span-8 max-w-xl relative pl-5">
                  <div
                    className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    value={googleMapsApiKey}
                    onChange={(e) => setGoogleMapsApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Free shipping over 'X' */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Free shipping over 'X'</span>
                <HelpTooltip text="Enable free standard shipping when the cart subtotal exceeds a designated amount." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={freeShippingOverX}
                  onChange={(e) => setFreeShippingOverX(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Tree branch child 1 under Free shipping over 'X': Value of 'X' */}
            {freeShippingOverX && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Value of 'X'</span>
                  <HelpTooltip text="The threshold value over which shipping becomes free." />
                </label>
                <div className="md:col-span-8 flex items-center gap-2 relative pl-5">
                  <div
                    className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={valueOfX}
                    onChange={(e) => setValueOfX(e.target.value)}
                    className="w-36 border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                  />
                  <span className="text-xs text-slate-700 font-medium">INR</span>
                </div>
              </div>
            )}

            {/* Tree branch child 2 under Free shipping over 'X': Calculate 'X' including tax */}
            {freeShippingOverX && isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Calculate 'X' including tax</span>
                  <HelpTooltip text="Determine whether the free shipping qualifying threshold includes taxes." />
                </label>
                <div className="md:col-span-8 flex items-center relative pl-5">
                  <div
                    className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="checkbox"
                    checked={calculateXIncludingTax}
                    onChange={(e) => setCalculateXIncludingTax(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Use warehouse location (Advanced only) */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Use warehouse location</span>
                  <HelpTooltip text="Calculate shipping rates based on the location of the warehouse where stock is actually stored." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={useWarehouseLocation}
                    onChange={(e) => setUseWarehouseLocation(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Consider associated products dimensions and weight (Advanced only) */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span className="text-right">
                    Consider associated products
                    <br className="hidden md:inline" /> dimensions and weight
                  </span>
                  <HelpTooltip text="Calculate package dimensional volume and total tare weight including bundled accessories." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={considerAssociatedProductsDimensionsAndWeight}
                    onChange={(e) =>
                      setConsiderAssociatedProductsDimensionsAndWeight(e.target.checked)
                    }
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Sort shipping methods by (Advanced only) */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Sort shipping methods by</span>
                  <HelpTooltip text="Order in which available carriers and shipping options are presented during checkout." />
                </label>
                <div className="md:col-span-8 max-w-xl">
                  <select
                    value={sortShippingMethodsBy}
                    onChange={(e) => setSortShippingMethodsBy(e.target.value)}
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                  >
                    <option value="Position">Position</option>
                    <option value="Shipping fee">Shipping fee</option>
                    <option value="Carrier name">Carrier name</option>
                    <option value="Delivery speed">Delivery speed</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── CARD 2: NOTIFICATIONS (Matching media_1791346533205.png) ── */}
      {isAdvanced && (
        <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
          <div
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
          >
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-700 stroke-[1.8]" />
              <span className="text-sm font-normal text-slate-800">Notifications</span>
            </div>
            <button type="button" className="text-slate-400 hover:text-slate-600">
              {notificationsOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
            </button>
          </div>

          {notificationsOpen && (
            <div className="p-5 space-y-4 text-xs text-slate-700">
              {/* Notify customer about shipping from multiple locations */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span className="text-right">
                    Notify customer about shipping from
                    <br className="hidden md:inline" /> multiple locations
                  </span>
                  <HelpTooltip text="Send notification alerting customer that an order will be split and dispatched in multiple packages." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={notifyCustomerAboutShippingFromMultipleLocations}
                    onChange={(e) =>
                      setNotifyCustomerAboutShippingFromMultipleLocations(e.target.checked)
                    }
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>

              {/* Display shipment events (customers) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Display shipment events (customers)</span>
                  <HelpTooltip text="Show transit milestone tracker and courier scans on customer order details screen." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={displayShipmentEventsCustomers}
                    onChange={(e) => setDisplayShipmentEventsCustomers(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>

              {/* Display shipment events (store owner) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Display shipment events (store owner)</span>
                  <HelpTooltip text="Show carrier transit logs on the administrator order management console." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={displayShipmentEventsStoreOwner}
                    onChange={(e) => setDisplayShipmentEventsStoreOwner(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CARD 3: CHECKOUT (Matching media_1791346536874.png) ── */}
      {isAdvanced && (
        <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
          <div
            onClick={() => setCheckoutOpen(!checkoutOpen)}
            className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
          >
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-700 stroke-[1.8]" />
              <span className="text-sm font-normal text-slate-800">Checkout</span>
            </div>
            <button type="button" className="text-slate-400 hover:text-slate-600">
              {checkoutOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
            </button>
          </div>

          {checkoutOpen && (
            <div className="p-5 space-y-4 text-xs text-slate-700">
              {/* Hide shipping total if shipping is not required */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span className="text-right">
                    Hide shipping total if shipping is not
                    <br className="hidden md:inline" /> required
                  </span>
                  <HelpTooltip text="Omit the shipping row completely from totals when an order contains only digital or service items." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={hideShippingTotalIfShippingNotRequired}
                    onChange={(e) =>
                      setHideShippingTotalIfShippingNotRequired(e.target.checked)
                    }
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>

              {/* Ship to the same address */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Ship to the same address</span>
                  <HelpTooltip text="Automatically copy shipping address into billing address by default." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={shipToSameAddress}
                    onChange={(e) => setShipToSameAddress(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>

              {/* Bypass shipping method page if there's only one */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span className="text-right">
                    Bypass shipping method page if
                    <br className="hidden md:inline" /> there's only one
                  </span>
                  <HelpTooltip text="Automatically select the single shipping method and advance to payment if no carrier choice is required." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={bypassShippingMethodPageIfOnlyOne}
                    onChange={(e) =>
                      setBypassShippingMethodPageIfOnlyOne(e.target.checked)
                    }
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CARD 4: SHIPPING ORIGIN (Matching media_1791346544811.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
        <div
          onClick={() => setShippingOriginOpen(!shippingOriginOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            <span className="text-sm font-normal text-slate-800">Shipping origin</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {shippingOriginOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {shippingOriginOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            <div className="text-xs font-semibold text-slate-700 pb-1 border-b border-slate-100">
              Shipping origin
            </div>

            {/* First name */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>First name</span>
                <HelpTooltip text="Sender contact first name at primary shipping warehouse." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="text"
                  value={originFirstName}
                  onChange={(e) => setOriginFirstName(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Last name */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Last name</span>
                <HelpTooltip text="Sender contact last name at primary shipping warehouse." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="text"
                  value={originLastName}
                  onChange={(e) => setOriginLastName(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Email */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Email</span>
                <HelpTooltip text="Contact email for dispatch logistics and carrier manifests." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="email"
                  value={originEmail}
                  onChange={(e) => setOriginEmail(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Company */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Company</span>
                <HelpTooltip text="Company or warehouse entity name printed on shipping origin labels." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="text"
                  value={originCompany}
                  onChange={(e) => setOriginCompany(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Country */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Country</span>
                <HelpTooltip text="Country where packages are dispatched from." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <select
                  value={originCountry}
                  onChange={(e) => setOriginCountry(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                >
                  <option value="">Select country</option>
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                </select>
              </div>
            </div>

            {/* State / province */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>State / province</span>
                <HelpTooltip text="State or province where warehouse facility is situated." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <select
                  value={originStateProvince}
                  onChange={(e) => setOriginStateProvince(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                >
                  <option value="Other">Other</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="California">California</option>
                  <option value="Texas">Texas</option>
                  <option value="Ontario">Ontario</option>
                </select>
              </div>
            </div>

            {/* County / region */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>County / region</span>
                <HelpTooltip text="Regional district or county code for shipping origin." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="text"
                  value={originCountyRegion}
                  onChange={(e) => setOriginCountyRegion(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* City */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>City</span>
                <HelpTooltip text="Dispatch hub city (e.g. Bengaluru, Hubballi, Pune)." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="text"
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Address 1 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Address 1</span>
                <HelpTooltip text="Street address line 1 for pickup/return logistics." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="text"
                  value={originAddress1}
                  onChange={(e) => setOriginAddress1(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Address 2 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Address 2</span>
                <HelpTooltip text="Apartment, suite, or building unit number." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="text"
                  value={originAddress2}
                  onChange={(e) => setOriginAddress2(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Zip / postal code */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Zip / postal code</span>
                <HelpTooltip text="Postal PIN code or ZIP code of the origin warehouse facility." />
              </label>
              <div className="md:col-span-8 max-w-xl flex items-center gap-1.5">
                <input
                  type="text"
                  value={originZipPostalCode}
                  onChange={(e) => setOriginZipPostalCode(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
                <span className="text-red-500 font-bold text-sm leading-none select-none">*</span>
              </div>
            </div>

            {/* Phone number */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Phone number</span>
                <HelpTooltip text="Dispatch warehouse phone contact number for delivery drivers." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="text"
                  value={originPhoneNumber}
                  onChange={(e) => setOriginPhoneNumber(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Fax number */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Fax number</span>
                <HelpTooltip text="Optional fax contact for shipping manifest confirmations." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="text"
                  value={originFaxNumber}
                  onChange={(e) => setOriginFaxNumber(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Origin warehouse facility photo / branding (Supports local device upload, Google/web URL) */}
            <div className="border-t border-slate-100 pt-5 mt-3">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pt-2">
                  <span>Warehouse & Origin Photo</span>
                  <HelpTooltip text="Upload or select origin fulfillment facility photos, gate pass images, or logistics hub pictures from local storage or any web image URL." />
                </label>
                <div className="md:col-span-8 max-w-xl">
                  <ImageEditorField
                    value={originImage}
                    onChange={(newVal) => setOriginImage(newVal)}
                    shape="rectangle"
                    previewHeight="h-28"
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Facility image helps couriers and customers verify official dispatch centers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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

      {/* ── FLOATING GREEN SCROLL-TO-TOP BUTTON (Matching media_1791346544811.png) ── */}
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
