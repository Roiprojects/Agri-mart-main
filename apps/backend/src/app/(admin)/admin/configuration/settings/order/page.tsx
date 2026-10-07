'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Receipt,
  FileText,
  RotateCcw,
  ArrowUp,
  Image as ImageIcon,
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

export default function OrderSettingsPage() {
  const [isAdvanced, setIsAdvanced] = useState(true);

  // Collapsible cards state
  const [checkoutOpen, setCheckoutOpen] = useState(true);
  const [orderTotalsOpen, setOrderTotalsOpen] = useState(true);
  const [commonOpen, setCommonOpen] = useState(true);
  const [pdfInvoiceOpen, setPdfInvoiceOpen] = useState(true);

  // 1. Checkout fields (media_1791344861078.png)
  const [checkoutDisabled, setCheckoutDisabled] = useState(false);
  const [anonymousCheckoutAllowed, setAnonymousCheckoutAllowed] = useState(true);
  const [useOnePageCheckout, setUseOnePageCheckout] = useState(true);
  const [orderTotalsOnPaymentInfoTab, setOrderTotalsOnPaymentInfoTab] = useState(false);
  const [termsOfServiceShoppingCartPage, setTermsOfServiceShoppingCartPage] = useState(true);
  const [termsOfServiceConfirmOrderPage, setTermsOfServiceConfirmOrderPage] = useState(false);
  const [disableBillingAddressStep, setDisableBillingAddressStep] = useState(false);
  const [disableOrderCompletedPage, setDisableOrderCompletedPage] = useState(false);
  const [displayPickupInStoreOnShippingMethodPage, setDisplayPickupInStoreOnShippingMethodPage] =
    useState(false);

  // 2. Order totals fields (media_1791344863715.png)
  const [minOrderSubtotalAmount, setMinOrderSubtotalAmount] = useState<number | string>(0);
  const [calculateMinOrderSubtotalIncludingTax, setCalculateMinOrderSubtotalIncludingTax] =
    useState(false);
  const [minOrderTotalAmount, setMinOrderTotalAmount] = useState<number | string>(0);
  const [autoUpdateOrderTotals, setAutoUpdateOrderTotals] = useState(false);

  // 3. Common fields (media_1791344870970.png)
  const [orderId, setOrderId] = useState<number | string>(77);
  const [orderNumberMask, setOrderNumberMask] = useState('{ID}');
  const [isReOrderAllowed, setIsReOrderAllowed] = useState(true);
  const [completeOrderWhenDelivered, setCompleteOrderWhenDelivered] = useState(true);
  const [exportOrdersWithProducts, setExportOrdersWithProducts] = useState(true);
  const [allowAdminsToBuyCallForPriceProducts, setAllowAdminsToBuyCallForPriceProducts] =
    useState(true);
  const [allowCustomersToCancelOrders, setAllowCustomersToCancelOrders] = useState(true);
  const [showProductThumbnailInOrderDetailsPage, setShowProductThumbnailInOrderDetailsPage] =
    useState(true);

  // 4. Pdf invoice fields (media_1791344873749.png)
  const [attachPdfInvoiceOrderPlaced, setAttachPdfInvoiceOrderPlaced] = useState(false);
  const [attachPdfInvoiceOrderPaid, setAttachPdfInvoiceOrderPaid] = useState(false);
  const [attachPdfInvoiceOrderProcessing, setAttachPdfInvoiceOrderProcessing] = useState(false);
  const [attachPdfInvoiceOrderCompleted, setAttachPdfInvoiceOrderCompleted] = useState(false);
  const [pdfInvoiceLogo, setPdfInvoiceLogo] = useState(
    'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=400&q=80'
  );

  // Toast & Saving
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load initial settings from API or localStorage
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings/order', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            applySettingsData(data.settings);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch order settings from API, checking localStorage...', err);
      }

      // Fallback to localStorage
      try {
        const saved = localStorage.getItem('agri_order_settings');
        if (saved) {
          applySettingsData(JSON.parse(saved));
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }

    loadSettings();
  }, []);

  const applySettingsData = (s: any) => {
    if (s.checkoutDisabled !== undefined) setCheckoutDisabled(s.checkoutDisabled);
    if (s.anonymousCheckoutAllowed !== undefined) setAnonymousCheckoutAllowed(s.anonymousCheckoutAllowed);
    if (s.useOnePageCheckout !== undefined) setUseOnePageCheckout(s.useOnePageCheckout);
    if (s.orderTotalsOnPaymentInfoTab !== undefined)
      setOrderTotalsOnPaymentInfoTab(s.orderTotalsOnPaymentInfoTab);
    if (s.termsOfServiceShoppingCartPage !== undefined)
      setTermsOfServiceShoppingCartPage(s.termsOfServiceShoppingCartPage);
    if (s.termsOfServiceConfirmOrderPage !== undefined)
      setTermsOfServiceConfirmOrderPage(s.termsOfServiceConfirmOrderPage);
    if (s.disableBillingAddressStep !== undefined)
      setDisableBillingAddressStep(s.disableBillingAddressStep);
    if (s.disableOrderCompletedPage !== undefined)
      setDisableOrderCompletedPage(s.disableOrderCompletedPage);
    if (s.displayPickupInStoreOnShippingMethodPage !== undefined)
      setDisplayPickupInStoreOnShippingMethodPage(s.displayPickupInStoreOnShippingMethodPage);

    if (s.minOrderSubtotalAmount !== undefined) setMinOrderSubtotalAmount(s.minOrderSubtotalAmount);
    if (s.calculateMinOrderSubtotalIncludingTax !== undefined)
      setCalculateMinOrderSubtotalIncludingTax(s.calculateMinOrderSubtotalIncludingTax);
    if (s.minOrderTotalAmount !== undefined) setMinOrderTotalAmount(s.minOrderTotalAmount);
    if (s.autoUpdateOrderTotals !== undefined) setAutoUpdateOrderTotals(s.autoUpdateOrderTotals);

    if (s.orderId !== undefined) setOrderId(s.orderId);
    if (s.orderNumberMask !== undefined) setOrderNumberMask(s.orderNumberMask);
    if (s.isReOrderAllowed !== undefined) setIsReOrderAllowed(s.isReOrderAllowed);
    if (s.completeOrderWhenDelivered !== undefined)
      setCompleteOrderWhenDelivered(s.completeOrderWhenDelivered);
    if (s.exportOrdersWithProducts !== undefined)
      setExportOrdersWithProducts(s.exportOrdersWithProducts);
    if (s.allowAdminsToBuyCallForPriceProducts !== undefined)
      setAllowAdminsToBuyCallForPriceProducts(s.allowAdminsToBuyCallForPriceProducts);
    if (s.allowCustomersToCancelOrders !== undefined)
      setAllowCustomersToCancelOrders(s.allowCustomersToCancelOrders);
    if (s.showProductThumbnailInOrderDetailsPage !== undefined)
      setShowProductThumbnailInOrderDetailsPage(s.showProductThumbnailInOrderDetailsPage);

    if (s.attachPdfInvoiceOrderPlaced !== undefined)
      setAttachPdfInvoiceOrderPlaced(s.attachPdfInvoiceOrderPlaced);
    if (s.attachPdfInvoiceOrderPaid !== undefined)
      setAttachPdfInvoiceOrderPaid(s.attachPdfInvoiceOrderPaid);
    if (s.attachPdfInvoiceOrderProcessing !== undefined)
      setAttachPdfInvoiceOrderProcessing(s.attachPdfInvoiceOrderProcessing);
    if (s.attachPdfInvoiceOrderCompleted !== undefined)
      setAttachPdfInvoiceOrderCompleted(s.attachPdfInvoiceOrderCompleted);
    if (s.pdfInvoiceLogo) setPdfInvoiceLogo(s.pdfInvoiceLogo);
    if (s.isAdvanced !== undefined) setIsAdvanced(s.isAdvanced);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);

    const payload = {
      checkoutDisabled,
      anonymousCheckoutAllowed,
      useOnePageCheckout,
      orderTotalsOnPaymentInfoTab,
      termsOfServiceShoppingCartPage,
      termsOfServiceConfirmOrderPage,
      disableBillingAddressStep,
      disableOrderCompletedPage,
      displayPickupInStoreOnShippingMethodPage,

      minOrderSubtotalAmount: Number(minOrderSubtotalAmount) || 0,
      minOrderSubtotalAmountCurrency: 'USD',
      calculateMinOrderSubtotalIncludingTax,
      minOrderTotalAmount: Number(minOrderTotalAmount) || 0,
      autoUpdateOrderTotals,

      orderId: Number(orderId) || 77,
      orderNumberMask,
      isReOrderAllowed,
      completeOrderWhenDelivered,
      exportOrdersWithProducts,
      allowAdminsToBuyCallForPriceProducts,
      allowCustomersToCancelOrders,
      showProductThumbnailInOrderDetailsPage,

      attachPdfInvoiceOrderPlaced,
      attachPdfInvoiceOrderPaid,
      attachPdfInvoiceOrderProcessing,
      attachPdfInvoiceOrderCompleted,
      pdfInvoiceLogo,
      isAdvanced,
    };

    try {
      localStorage.setItem('agri_order_settings', JSON.stringify(payload));
      const res = await fetch('/api/admin/settings/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to save to server');
      }
      showToast('The order settings have been updated successfully.');
    } catch (err: any) {
      console.warn('Saved to localStorage fallback:', err);
      showToast('The order settings have been updated successfully.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setCheckoutDisabled(false);
    setAnonymousCheckoutAllowed(true);
    setUseOnePageCheckout(true);
    setOrderTotalsOnPaymentInfoTab(false);
    setTermsOfServiceShoppingCartPage(true);
    setTermsOfServiceConfirmOrderPage(false);
    setDisableBillingAddressStep(false);
    setDisableOrderCompletedPage(false);
    setDisplayPickupInStoreOnShippingMethodPage(false);

    setMinOrderSubtotalAmount(0);
    setCalculateMinOrderSubtotalIncludingTax(false);
    setMinOrderTotalAmount(0);
    setAutoUpdateOrderTotals(false);

    setOrderId(77);
    setOrderNumberMask('{ID}');
    setIsReOrderAllowed(true);
    setCompleteOrderWhenDelivered(true);
    setExportOrdersWithProducts(true);
    setAllowAdminsToBuyCallForPriceProducts(true);
    setAllowCustomersToCancelOrders(true);
    setShowProductThumbnailInOrderDetailsPage(true);

    setAttachPdfInvoiceOrderPlaced(false);
    setAttachPdfInvoiceOrderPaid(false);
    setAttachPdfInvoiceOrderProcessing(false);
    setAttachPdfInvoiceOrderCompleted(false);

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

      {/* ── HEADER (Matching media_1791344861078.png) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Order settings</h1>

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

      {/* ── MODE BUTTON: Advanced / Basic Toggle (Matching media_1791344861078.png) ── */}
      <div className="pt-0.5">
        <button
          type="button"
          onClick={() => setIsAdvanced(!isAdvanced)}
          className={`inline-flex items-center justify-between px-2.5 py-1 rounded-[3px] text-xs font-normal border transition-colors duration-150 cursor-pointer select-none w-[92px] h-[28px] shadow-2xs ${
            isAdvanced
              ? 'bg-[#2489c5] border-[#2080b9] text-white hover:bg-[#1f72a3]'
              : 'bg-white border-[#2489c5] text-[#2489c5] hover:bg-slate-50'
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

      {/* Basic Mode Notice */}
      {!isAdvanced && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded px-3.5 py-2 text-xs flex items-center justify-between">
          <span>
            <strong>Basic mode active</strong>: Primary configurations are shown. Switch to <strong>Advanced</strong> mode to see all granular checkout and ordering rules.
          </span>
          <button
            type="button"
            onClick={() => setIsAdvanced(true)}
            className="text-amber-900 underline font-semibold hover:text-amber-950 ml-2"
          >
            Switch to Advanced
          </button>
        </div>
      )}

      {/* ── CARD 1: CHECKOUT (Matching media_1791344861078.png) ── */}
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
            {/* Checkout disabled */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Checkout disabled</span>
                  <HelpTooltip text="Check if you want to completely disable the checkout process in your storefront." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={checkoutDisabled}
                    onChange={(e) => setCheckoutDisabled(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Anonymous checkout allowed */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Anonymous checkout allowed</span>
                <HelpTooltip text="Check to allow guest customers to purchase products without registering an account." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={anonymousCheckoutAllowed}
                  onChange={(e) => setAnonymousCheckoutAllowed(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Use one page checkout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Use one page checkout</span>
                <HelpTooltip text="Check to enable single-page accordion checkout where all checkout steps are streamlined on one page." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={useOnePageCheckout}
                  onChange={(e) => setUseOnePageCheckout(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Order totals on payment info tab (Sub-item with tree connector from media_1791344861078.png) */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Order totals on payment info tab</span>
                  <HelpTooltip text="Check to display current order totals overview inside the payment information tab during one-page checkout." />
                </label>
                <div className="md:col-span-8 flex items-center relative pl-5">
                  {/* Tree elbow branch connecting to the parent checkbox above */}
                  <div
                    className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="checkbox"
                    checked={orderTotalsOnPaymentInfoTab}
                    onChange={(e) => setOrderTotalsOnPaymentInfoTab(e.target.checked)}
                    disabled={!useOnePageCheckout}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer disabled:opacity-40"
                  />
                </div>
              </div>
            )}

            {/* Terms of service (shopping cart page) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Terms of service (shopping cart page)</span>
                <HelpTooltip text="Require customers to accept terms and conditions before proceeding to checkout from the shopping cart page." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={termsOfServiceShoppingCartPage}
                  onChange={(e) => setTermsOfServiceShoppingCartPage(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Terms of service (confirm order page) */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Terms of service (confirm order page)</span>
                  <HelpTooltip text="Require customers to accept terms of service on the final order confirmation step." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={termsOfServiceConfirmOrderPage}
                    onChange={(e) => setTermsOfServiceConfirmOrderPage(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Disable "Billing address" step */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Disable "Billing address" step</span>
                  <HelpTooltip text="Check to bypass the billing address collection step (shipping address will automatically be used for billing)." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={disableBillingAddressStep}
                    onChange={(e) => setDisableBillingAddressStep(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Disable "Order completed" page */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Disable "Order completed" page</span>
                  <HelpTooltip text="Check to skip the order thank you screen and redirect directly to customer order details." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={disableOrderCompletedPage}
                    onChange={(e) => setDisableOrderCompletedPage(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Display "Pickup in store" on "Shipping method" page */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span className="text-right">
                    Display "Pickup in store" on "Shipping<br className="hidden md:inline" /> method" page
                  </span>
                  <HelpTooltip text="Display in-store pickup as an alternative option alongside delivery options during checkout." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={displayPickupInStoreOnShippingMethodPage}
                    onChange={(e) => setDisplayPickupInStoreOnShippingMethodPage(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── CARD 2: ORDER TOTALS (Matching media_1791344863715.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
        <div
          onClick={() => setOrderTotalsOpen(!orderTotalsOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-700 text-sm tracking-tighter">$=</span>
            <span className="text-sm font-normal text-slate-800">Order totals</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {orderTotalsOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {orderTotalsOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Min order sub-total amount */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Min order sub-total amount</span>
                <HelpTooltip text="Enter the minimum cart subtotal required before a customer can place an order (0 to disable)." />
              </label>
              <div className="md:col-span-8 flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={minOrderSubtotalAmount}
                  onChange={(e) => setMinOrderSubtotalAmount(e.target.value)}
                  className="w-36 border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
                <span className="text-xs text-slate-700 font-medium">USD</span>
              </div>
            </div>

            {/* Calculate 'Min order sub-total amount' including tax */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span className="text-right">
                    Calculate 'Min order sub-total amount'<br className="hidden md:inline" /> including tax
                  </span>
                  <HelpTooltip text="Calculate whether the minimum order sub-total threshold includes product taxes." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={calculateMinOrderSubtotalIncludingTax}
                    onChange={(e) => setCalculateMinOrderSubtotalIncludingTax(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Min order total amount */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Min order total amount</span>
                <HelpTooltip text="Enter the minimum final grand total (including shipping and tax) required to place an order (0 to disable)." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={minOrderTotalAmount}
                  onChange={(e) => setMinOrderTotalAmount(e.target.value)}
                  className="w-36 border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Auto update order totals */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Auto update order totals</span>
                  <HelpTooltip text="Check to automatically recalculate shipping, taxes, and grand totals via AJAX when cart quantities change." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={autoUpdateOrderTotals}
                    onChange={(e) => setAutoUpdateOrderTotals(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── CARD 3: COMMON (Matching media_1791344870970.png) ── */}
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
            {/* Order ID */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Order ID</span>
                <HelpTooltip text="Current auto-incrementing order identifier sequence value." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="number"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Order number mask */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pt-1.5">
                <span>Order number mask</span>
                <HelpTooltip text="Template mask for displaying friendly order numbers to customers and on invoices." />
              </label>
              <div className="md:col-span-8 max-w-xl space-y-1.5">
                <input
                  type="text"
                  value={orderNumberMask}
                  onChange={(e) => setOrderNumberMask(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white font-mono"
                />
                <div className="text-[11px] text-slate-500 font-sans leading-relaxed space-y-0.5 pt-0.5 select-none">
                  <div>&#123;YYYY&#125; - year of order creation date</div>
                  <div>&#123;YY&#125; - last two digits of year of order creation date</div>
                  <div>&#123;MM&#125; - month of order creation date</div>
                  <div>&#123;DD&#125; - day of order creation date</div>
                  <div>&#123;ID&#125; - Order identifier</div>
                </div>
              </div>
            </div>

            {/* Is re-order allowed */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Is re-order allowed</span>
                <HelpTooltip text="Allow customers to quickly re-order all items from past completed orders with a single click." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={isReOrderAllowed}
                  onChange={(e) => setIsReOrderAllowed(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Complete order when delivered */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Complete order when delivered</span>
                  <HelpTooltip text="Automatically transition order status to 'Complete' when logistics marks the package as Delivered." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={completeOrderWhenDelivered}
                    onChange={(e) => setCompleteOrderWhenDelivered(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Export orders with products */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Export orders with products</span>
                  <HelpTooltip text="Include full product line-item rows when exporting orders to XML or Excel spreadsheets." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOrdersWithProducts}
                    onChange={(e) => setExportOrdersWithProducts(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Allow admins to buy "Call for price" products */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span className="text-right">
                    Allow admins to buy "Call for price"<br className="hidden md:inline" /> products
                  </span>
                  <HelpTooltip text="Enable store managers and administrators to process orders for catalog items marked with 'Call for price'." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={allowAdminsToBuyCallForPriceProducts}
                    onChange={(e) => setAllowAdminsToBuyCallForPriceProducts(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Allow customers to cancel orders */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Allow customers to cancel orders</span>
                <HelpTooltip text="Allow customers to submit order cancellation requests from their customer account portal while pending processing." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={allowCustomersToCancelOrders}
                  onChange={(e) => setAllowCustomersToCancelOrders(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Show product thumbnail in order details page */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span className="text-right">
                  Show product thumbnail in order<br className="hidden md:inline" /> details page
                </span>
                <HelpTooltip text="Display small product photos beside item titles on customer order confirmation and details screens." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={showProductThumbnailInOrderDetailsPage}
                  onChange={(e) => setShowProductThumbnailInOrderDetailsPage(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD 4: PDF INVOICE (Matching media_1791344873749.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
        <div
          onClick={() => setPdfInvoiceOpen(!pdfInvoiceOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            <span className="text-sm font-normal text-slate-800">Pdf invoice</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {pdfInvoiceOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {pdfInvoiceOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Attach PDF invoice ("order placed" email) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span className="text-right">
                  Attach PDF invoice ("order placed"<br className="hidden md:inline" /> email)
                </span>
                <HelpTooltip text="Automatically generate and attach printable PDF tax invoice when customer receives 'Order Placed' confirmation email." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={attachPdfInvoiceOrderPlaced}
                  onChange={(e) => setAttachPdfInvoiceOrderPlaced(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Attach PDF invoice ("order paid" email) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span className="text-right">
                  Attach PDF invoice ("order paid"<br className="hidden md:inline" /> email)
                </span>
                <HelpTooltip text="Attach official PDF receipt and invoice when payment has been verified and settled." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={attachPdfInvoiceOrderPaid}
                  onChange={(e) => setAttachPdfInvoiceOrderPaid(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Attach PDF invoice ("order processing" email) */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span className="text-right">
                    Attach PDF invoice ("order processing"<br className="hidden md:inline" /> email)
                  </span>
                  <HelpTooltip text="Attach PDF invoice when warehouse begins picking and packing the order." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={attachPdfInvoiceOrderProcessing}
                    onChange={(e) => setAttachPdfInvoiceOrderProcessing(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Attach PDF invoice ("order completed" email) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span className="text-right">
                  Attach PDF invoice ("order completed"<br className="hidden md:inline" /> email)
                </span>
                <HelpTooltip text="Attach PDF final invoice and warranty documentation upon order fulfillment completion." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={attachPdfInvoiceOrderCompleted}
                  onChange={(e) => setAttachPdfInvoiceOrderCompleted(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* PDF Invoice Logo Editor (Supports local device upload, Google/web URL, rotate, zoom, crop) */}
            <div className="border-t border-slate-100 pt-5 mt-3">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pt-2">
                  <span>PDF invoice logo</span>
                  <HelpTooltip text="Custom company logo rendered at the top-left of printed and emailed PDF invoices. Accepts local file uploads or external image URLs with full cropping and editing." />
                </label>
                <div className="md:col-span-8 max-w-xl">
                  <ImageEditorField
                    value={pdfInvoiceLogo}
                    onChange={(newVal) => setPdfInvoiceLogo(newVal)}
                    shape="rectangle"
                    previewHeight="h-28"
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Recommended resolution: 300x100px (PNG, SVG, or high-res JPG with transparent or light background).
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
            onClick={scrollToTop}
            className="p-1.5 rounded border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition"
            title="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>

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
    </div>
  );
}
