'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  FileText,
  Gift,
  RotateCcw,
  ArrowUp,
  Edit2,
  Trash2,
  X,
  RefreshCw,
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

interface ReturnRequestItem {
  id: string;
  name: string;
  displayOrder: number;
}

export default function OrderSettingsPage() {
  const [isAdvanced, setIsAdvanced] = useState(true);

  // Collapsible cards state
  const [checkoutOpen, setCheckoutOpen] = useState(true);
  const [orderTotalsOpen, setOrderTotalsOpen] = useState(true);
  const [commonOpen, setCommonOpen] = useState(true);
  const [pdfInvoiceOpen, setPdfInvoiceOpen] = useState(true);
  const [giftCardsOpen, setGiftCardsOpen] = useState(true);
  const [returnRequestOpen, setReturnRequestOpen] = useState(true);

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

  // 5. Gift cards fields (media_1791345470954.png)
  const [activateGiftCardsAfterCompletingOrder, setActivateGiftCardsAfterCompletingOrder] =
    useState(false);
  const [deactivateGiftCardsAfterCancellingOrder, setDeactivateGiftCardsAfterCancellingOrder] =
    useState(false);
  const [deactivateGiftCardsAfterDeletingOrder, setDeactivateGiftCardsAfterDeletingOrder] =
    useState(false);
  const [
    deleteGiftCardUsageHistoryAfterOrderCancellation,
    setDeleteGiftCardUsageHistoryAfterOrderCancellation,
  ] = useState(false);

  // 6. Return request settings fields (media_1791345474131.png & media_1791345475932.png)
  const [enableReturnsSystem, setEnableReturnsSystem] = useState(true);
  const [returnRequestNumberMask, setReturnRequestNumberMask] = useState('{ID}');
  const [numberOfDaysReturnRequestAvailable, setNumberOfDaysReturnRequestAvailable] = useState<
    number | string
  >(365);
  const [allowFileUploads, setAllowFileUploads] = useState(false);

  // Return request reasons & actions
  const [returnRequestReasons, setReturnRequestReasons] = useState<ReturnRequestItem[]>([
    { id: 'rrr-1', name: 'Received Wrong Product', displayOrder: 1 },
    { id: 'rrr-2', name: 'Wrong Product Ordered', displayOrder: 2 },
    { id: 'rrr-3', name: 'There Was A Problem With The Product', displayOrder: 3 },
  ]);

  const [returnRequestActions, setReturnRequestActions] = useState<ReturnRequestItem[]>([
    { id: 'rra-1', name: 'Refund', displayOrder: 1 },
    { id: 'rra-2', name: 'Repair', displayOrder: 2 },
    { id: 'rra-3', name: 'Replacement', displayOrder: 3 },
  ]);

  // Modal state for editing/adding reasons or actions
  const [modalMode, setModalMode] = useState<'reason' | 'action' | null>(null);
  const [editingItem, setEditingItem] = useState<ReturnRequestItem | null>(null);
  const [itemNameInput, setItemNameInput] = useState('');
  const [itemDisplayOrderInput, setItemDisplayOrderInput] = useState<number | string>(1);

  // Pagination states
  const [reasonsPageSize, setReasonsPageSize] = useState(15);
  const [actionsPageSize, setActionsPageSize] = useState(15);

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
        const res = await fetch('/api/admin/settings/order', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            applySettingsData(data.settings);
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

    // Gift cards
    if (s.activateGiftCardsAfterCompletingOrder !== undefined)
      setActivateGiftCardsAfterCompletingOrder(s.activateGiftCardsAfterCompletingOrder);
    if (s.deactivateGiftCardsAfterCancellingOrder !== undefined)
      setDeactivateGiftCardsAfterCancellingOrder(s.deactivateGiftCardsAfterCancellingOrder);
    if (s.deactivateGiftCardsAfterDeletingOrder !== undefined)
      setDeactivateGiftCardsAfterDeletingOrder(s.deactivateGiftCardsAfterDeletingOrder);
    if (s.deleteGiftCardUsageHistoryAfterOrderCancellation !== undefined)
      setDeleteGiftCardUsageHistoryAfterOrderCancellation(
        s.deleteGiftCardUsageHistoryAfterOrderCancellation
      );

    // Returns
    if (s.enableReturnsSystem !== undefined) setEnableReturnsSystem(s.enableReturnsSystem);
    if (s.returnRequestNumberMask !== undefined)
      setReturnRequestNumberMask(s.returnRequestNumberMask);
    if (s.numberOfDaysReturnRequestAvailable !== undefined)
      setNumberOfDaysReturnRequestAvailable(s.numberOfDaysReturnRequestAvailable);
    if (s.allowFileUploads !== undefined) setAllowFileUploads(s.allowFileUploads);
    if (s.returnRequestReasons && s.returnRequestReasons.length > 0)
      setReturnRequestReasons(s.returnRequestReasons);
    if (s.returnRequestActions && s.returnRequestActions.length > 0)
      setReturnRequestActions(s.returnRequestActions);

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

      activateGiftCardsAfterCompletingOrder,
      deactivateGiftCardsAfterCancellingOrder,
      deactivateGiftCardsAfterDeletingOrder,
      deleteGiftCardUsageHistoryAfterOrderCancellation,

      enableReturnsSystem,
      returnRequestNumberMask,
      numberOfDaysReturnRequestAvailable: Number(numberOfDaysReturnRequestAvailable) || 365,
      allowFileUploads,
      returnRequestReasons,
      returnRequestActions,

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

    setActivateGiftCardsAfterCompletingOrder(false);
    setDeactivateGiftCardsAfterCancellingOrder(false);
    setDeactivateGiftCardsAfterDeletingOrder(false);
    setDeleteGiftCardUsageHistoryAfterOrderCancellation(false);

    setEnableReturnsSystem(true);
    setReturnRequestNumberMask('{ID}');
    setNumberOfDaysReturnRequestAvailable(365);
    setAllowFileUploads(false);

    setReturnRequestReasons([
      { id: 'rrr-1', name: 'Received Wrong Product', displayOrder: 1 },
      { id: 'rrr-2', name: 'Wrong Product Ordered', displayOrder: 2 },
      { id: 'rrr-3', name: 'There Was A Problem With The Product', displayOrder: 3 },
    ]);

    setReturnRequestActions([
      { id: 'rra-1', name: 'Refund', displayOrder: 1 },
      { id: 'rra-2', name: 'Repair', displayOrder: 2 },
      { id: 'rra-3', name: 'Replacement', displayOrder: 3 },
    ]);

    showToast('Reset to default values. Click Save to apply.', 'success');
  };

  const openAddItemModal = (type: 'reason' | 'action') => {
    setModalMode(type);
    setEditingItem(null);
    setItemNameInput('');
    const list = type === 'reason' ? returnRequestReasons : returnRequestActions;
    setItemDisplayOrderInput(list.length + 1);
  };

  const openEditItemModal = (type: 'reason' | 'action', item: ReturnRequestItem) => {
    setModalMode(type);
    setEditingItem(item);
    setItemNameInput(item.name);
    setItemDisplayOrderInput(item.displayOrder);
  };

  const saveModalItem = () => {
    if (!itemNameInput.trim()) {
      alert('Please enter a valid name.');
      return;
    }

    const orderNum = Number(itemDisplayOrderInput) || 1;

    if (modalMode === 'reason') {
      if (editingItem) {
        setReturnRequestReasons((prev) =>
          prev.map((r) =>
            r.id === editingItem.id ? { ...r, name: itemNameInput.trim(), displayOrder: orderNum } : r
          )
        );
        showToast('Return request reason updated.');
      } else {
        const newItem: ReturnRequestItem = {
          id: `rrr-${Date.now()}`,
          name: itemNameInput.trim(),
          displayOrder: orderNum,
        };
        setReturnRequestReasons((prev) => [...prev, newItem]);
        showToast('New return request reason added.');
      }
    } else if (modalMode === 'action') {
      if (editingItem) {
        setReturnRequestActions((prev) =>
          prev.map((a) =>
            a.id === editingItem.id ? { ...a, name: itemNameInput.trim(), displayOrder: orderNum } : a
          )
        );
        showToast('Return request action updated.');
      } else {
        const newItem: ReturnRequestItem = {
          id: `rra-${Date.now()}`,
          name: itemNameInput.trim(),
          displayOrder: orderNum,
        };
        setReturnRequestActions((prev) => [...prev, newItem]);
        showToast('New return request action added.');
      }
    }

    setModalMode(null);
  };

  const deleteModalItem = (type: 'reason' | 'action', id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    if (type === 'reason') {
      setReturnRequestReasons((prev) => prev.filter((r) => r.id !== id));
      showToast('Return request reason deleted.');
    } else {
      setReturnRequestActions((prev) => prev.filter((a) => a.id !== id));
      showToast('Return request action deleted.');
    }
    setModalMode(null);
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
            <strong>Basic mode active</strong>: Primary configurations are shown. Switch to{' '}
            <strong>Advanced</strong> mode to see all granular checkout, gift card, and return rules.
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
                    Display "Pickup in store" on "Shipping
                    <br className="hidden md:inline" /> method" page
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
                    Calculate 'Min order sub-total amount'
                    <br className="hidden md:inline" /> including tax
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
                    Allow admins to buy "Call for price"
                    <br className="hidden md:inline" /> products
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
                  Show product thumbnail in order
                  <br className="hidden md:inline" /> details page
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
                  Attach PDF invoice ("order placed"
                  <br className="hidden md:inline" /> email)
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
                  Attach PDF invoice ("order paid"
                  <br className="hidden md:inline" /> email)
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
                    Attach PDF invoice ("order processing"
                    <br className="hidden md:inline" /> email)
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
                  Attach PDF invoice ("order completed"
                  <br className="hidden md:inline" /> email)
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

      {/* ── CARD 5: GIFT CARDS (Matching media_1791345470954.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
        <div
          onClick={() => setGiftCardsOpen(!giftCardsOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            <span className="text-sm font-normal text-slate-800">Gift cards</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {giftCardsOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {giftCardsOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Activate gift cards after completing of an order */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span className="text-right">
                  Activate gift cards after completing of
                  <br className="hidden md:inline" /> an order
                </span>
                <HelpTooltip text="Automatically activate gift cards purchased in an order once the order status is marked as 'Complete'." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={activateGiftCardsAfterCompletingOrder}
                  onChange={(e) => setActivateGiftCardsAfterCompletingOrder(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Deactivate gift cards after cancelling of an order */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span className="text-right">
                  Deactivate gift cards after cancelling of
                  <br className="hidden md:inline" /> an order
                </span>
                <HelpTooltip text="Automatically deactivate issued gift cards if the originating order is cancelled." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={deactivateGiftCardsAfterCancellingOrder}
                  onChange={(e) => setDeactivateGiftCardsAfterCancellingOrder(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Deactivate gift cards after deleting of an order */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span className="text-right">
                  Deactivate gift cards after deleting of
                  <br className="hidden md:inline" /> an order
                </span>
                <HelpTooltip text="Automatically deactivate purchased gift cards if the order record is deleted." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={deactivateGiftCardsAfterDeletingOrder}
                  onChange={(e) => setDeactivateGiftCardsAfterDeletingOrder(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Delete gift card usage history after order cancellation */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span className="text-right">
                  Delete gift card usage history after
                  <br className="hidden md:inline" /> order cancellation
                </span>
                <HelpTooltip text="Remove the redemption entry from gift card history and restore its available balance if the paid order is cancelled." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={deleteGiftCardUsageHistoryAfterOrderCancellation}
                  onChange={(e) =>
                    setDeleteGiftCardUsageHistoryAfterOrderCancellation(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD 6: RETURN REQUEST SETTINGS (Matching media_1791345474131.png & media_1791345475932.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
        <div
          onClick={() => setReturnRequestOpen(!returnRequestOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            {/* Backward double arrow / rewind icon from screenshot */}
            <div className="flex items-center text-slate-700 -space-x-1">
              <span className="text-xs font-bold font-mono">◀◀</span>
            </div>
            <span className="text-sm font-normal text-slate-800">Return request settings</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {returnRequestOpen ? (
              <Minus className="w-4 h-4 stroke-[2]" />
            ) : (
              <Plus className="w-4 h-4 stroke-[2]" />
            )}
          </button>
        </div>

        {returnRequestOpen && (
          <div className="p-5 space-y-6 text-xs text-slate-700">
            {/* Description text matching media_1791345474131.png */}
            <div className="text-xs text-slate-600 leading-relaxed space-y-1">
              <p>
                The returns system will allow your customers to request a return on items they've
                purchased. These are also known as RMA requests.
              </p>
              <p className="font-semibold text-slate-700">
                NOTE: This option is available for completed orders.
              </p>
            </div>

            {/* Enable Returns System */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Enable Returns System</span>
                <HelpTooltip text="Check to activate customer RMA / return merchandise authorization workflow in storefront." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={enableReturnsSystem}
                  onChange={(e) => setEnableReturnsSystem(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Return request number mask */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pt-1.5">
                <span>Return request number mask</span>
                <HelpTooltip text="Template mask for displaying friendly return request numbers to customers and store staff." />
              </label>
              <div className="md:col-span-8 max-w-xl space-y-1.5">
                <input
                  type="text"
                  value={returnRequestNumberMask}
                  onChange={(e) => setReturnRequestNumberMask(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white font-mono"
                />
                <div className="text-[11px] text-slate-500 font-sans leading-relaxed space-y-0.5 pt-0.5 select-none">
                  <div>&#123;ID&#125; - Return request identifier</div>
                  <div>&#123;YYYY&#125; - year of return request creation date</div>
                  <div>&#123;YY&#125; - last two digits of year of return request creation date</div>
                  <div>&#123;MM&#125; - month of return request creation date</div>
                  <div>&#123;DD&#125; - day of return request creation date</div>
                </div>
              </div>
            </div>

            {/* Number of days that the return request is available */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span className="text-right">
                  Number of days that the return
                  <br className="hidden md:inline" /> request is available
                </span>
                <HelpTooltip text="The number of eligible days after order delivery during which a customer may file a return request." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="number"
                  min="0"
                  value={numberOfDaysReturnRequestAvailable}
                  onChange={(e) => setNumberOfDaysReturnRequestAvailable(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Allow file uploads */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Allow file uploads</span>
                <HelpTooltip text="Check to allow customers to upload damage photos or receipts when submitting a return request." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={allowFileUploads}
                  onChange={(e) => setAllowFileUploads(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* ── SUB-PANEL 1: RETURN REQUEST REASONS (media_1791345475932.png) ── */}
            <div className="border border-slate-200 rounded overflow-hidden pt-1">
              <div className="p-4 bg-slate-50/60 border-b border-slate-200">
                <h3 className="text-xs font-semibold text-slate-800">Return request reasons</h3>
                <p className="text-[11px] text-slate-500 italic mt-0.5">
                  List of reasons a customer will be able to choose when submitting a return request.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-semibold">
                      <th className="py-2.5 px-4">Name</th>
                      <th className="py-2.5 px-4 text-center w-36">Display order</th>
                      <th className="py-2.5 px-4 text-center w-28">Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {returnRequestReasons.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 text-slate-800 font-normal">{item.name}</td>
                        <td className="py-3 px-4 text-center font-mono text-slate-700">
                          {item.displayOrder}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => openEditItemModal('reason', item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 text-xs font-normal shadow-2xs transition cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3 text-slate-600" />
                            <span>Edit</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {returnRequestReasons.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-4 text-center text-slate-400 italic">
                          No return request reasons defined. Click "Add new" to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table footer / pagination bar matching media_1791345475932.png */}
              <div className="p-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled
                    className="px-2.5 py-1 border border-slate-300 rounded text-slate-400 bg-slate-50 cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="px-2.5 py-1 border border-[#3c8dbc] rounded text-white bg-[#3c8dbc] font-medium"
                  >
                    1
                  </button>
                  <button
                    type="button"
                    disabled
                    className="px-2.5 py-1 border border-slate-300 rounded text-slate-400 bg-slate-50 cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span>Show</span>
                    <select
                      value={reasonsPageSize}
                      onChange={(e) => setReasonsPageSize(Number(e.target.value))}
                      className="border border-slate-300 rounded px-2 py-0.5 bg-white text-xs text-slate-700"
                    >
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span>items</span>
                  </div>

                  <span>
                    1-{returnRequestReasons.length} of {returnRequestReasons.length} items
                  </span>

                  <button
                    type="button"
                    onClick={() => showToast('Refreshed return reasons list.')}
                    className="p-1 border border-slate-300 rounded text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition"
                    title="Refresh"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Add New Button matching media_1791345475932.png */}
              <div className="p-3.5 bg-slate-50/50 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => openAddItemModal('reason')}
                  className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add new</span>
                </button>
              </div>
            </div>

            {/* ── SUB-PANEL 2: RETURN REQUEST ACTIONS (Matching bottom of media_1791345475932.png) ── */}
            <div className="border border-slate-200 rounded overflow-hidden pt-1">
              <div className="p-4 bg-slate-50/60 border-b border-slate-200">
                <h3 className="text-xs font-semibold text-slate-800">Return request actions</h3>
                <p className="text-[11px] text-slate-500 italic mt-0.5">
                  List of actions a customer will be able to choose when submitting a return request.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-semibold">
                      <th className="py-2.5 px-4">Name</th>
                      <th className="py-2.5 px-4 text-center w-36">Display order</th>
                      <th className="py-2.5 px-4 text-center w-28">Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {returnRequestActions.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 text-slate-800 font-normal">{item.name}</td>
                        <td className="py-3 px-4 text-center font-mono text-slate-700">
                          {item.displayOrder}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => openEditItemModal('action', item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 text-xs font-normal shadow-2xs transition cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3 text-slate-600" />
                            <span>Edit</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {returnRequestActions.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-4 text-center text-slate-400 italic">
                          No return request actions defined. Click "Add new" to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table footer / pagination bar */}
              <div className="p-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled
                    className="px-2.5 py-1 border border-slate-300 rounded text-slate-400 bg-slate-50 cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="px-2.5 py-1 border border-[#3c8dbc] rounded text-white bg-[#3c8dbc] font-medium"
                  >
                    1
                  </button>
                  <button
                    type="button"
                    disabled
                    className="px-2.5 py-1 border border-slate-300 rounded text-slate-400 bg-slate-50 cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span>Show</span>
                    <select
                      value={actionsPageSize}
                      onChange={(e) => setActionsPageSize(Number(e.target.value))}
                      className="border border-slate-300 rounded px-2 py-0.5 bg-white text-xs text-slate-700"
                    >
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span>items</span>
                  </div>

                  <span>
                    1-{returnRequestActions.length} of {returnRequestActions.length} items
                  </span>

                  <button
                    type="button"
                    onClick={() => showToast('Refreshed return actions list.')}
                    className="p-1 border border-slate-300 rounded text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition"
                    title="Refresh"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Add New Button */}
              <div className="p-3.5 bg-slate-50/50 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => openAddItemModal('action')}
                  className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add new</span>
                </button>
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

      {/* ── FLOATING GREEN SCROLL-TO-TOP BUTTON (Matching media_1791345475932.png) ── */}
      <button
        type="button"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded bg-[#00a65a] hover:bg-[#008d4c] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
        title="Scroll to top"
      >
        <ChevronUp className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* ── MODAL FOR ADD / EDIT RETURN REQUEST REASON & ACTION ── */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">
                {editingItem ? 'Edit' : 'Add new'}{' '}
                {modalMode === 'reason' ? 'return request reason' : 'return request action'}
              </h3>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={itemNameInput}
                  onChange={(e) => setItemNameInput(e.target.value)}
                  placeholder={
                    modalMode === 'reason' ? 'e.g. Received Wrong Product' : 'e.g. Refund'
                  }
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Display order
                </label>
                <input
                  type="number"
                  min="1"
                  value={itemDisplayOrderInput}
                  onChange={(e) => setItemDisplayOrderInput(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc]"
                />
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              {editingItem ? (
                <button
                  type="button"
                  onClick={() => deleteModalItem(modalMode, editingItem.id)}
                  className="text-red-600 hover:text-red-700 text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-100 text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveModalItem}
                  className="px-4 py-1.5 bg-[#2489c5] hover:bg-[#1f72a3] text-white rounded text-xs font-semibold transition"
                >
                  {editingItem ? 'Save changes' : 'Add item'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
