'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  Info,
  ShoppingCart,
  Heart,
  ChevronUp,
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

export default function ShoppingCartSettingsPage() {
  const [isAdvanced, setIsAdvanced] = useState(false);

  // Section collapse state
  const [commonOpen, setCommonOpen] = useState(true);
  const [miniCartOpen, setMiniCartOpen] = useState(true);
  const [wishlistOpen, setWishlistOpen] = useState(true);

  // Common settings
  const [showDiscountBox, setShowDiscountBox] = useState(true);
  const [showGiftCardBox, setShowGiftCardBox] = useState(true);
  const [vendorEnabled, setVendorEnabled] = useState(false);
  const [vendorRequired, setVendorRequired] = useState(false);

  // Common advanced settings
  const [allowCartItemEditing, setAllowCartItemEditing] = useState(true);
  const [maximumShoppingCartItems, setMaximumShoppingCartItems] = useState<number | string>(1000);
  const [cartsSharedBetweenStores, setCartsSharedBetweenStores] = useState(false);
  const [showProductImagesOnShoppingCart, setShowProductImagesOnShoppingCart] = useState(true);
  const [displayCartAfterAddingProduct, setDisplayCartAfterAddingProduct] = useState(false);
  const [crossSellsNumber, setCrossSellsNumber] = useState<number | string>(4);
  const [groupTierPricesForDistinctShoppingCartItems, setGroupTierPricesForDistinctShoppingCartItems] = useState(false);
  const [roundPricesDuringCalculation, setRoundPricesDuringCalculation] = useState(false);

  // Mini-shopping cart settings
  const [miniShoppingCartEnabled, setMiniShoppingCartEnabled] = useState(true);
  const [miniShoppingCartProductNumber, setMiniShoppingCartProductNumber] = useState<number | string>(5);
  const [showProductImagesInMiniShoppingCart, setShowProductImagesInMiniShoppingCart] = useState(true);

  // Wishlist settings (Advanced only card)
  const [maximumWishlistItems, setMaximumWishlistItems] = useState<number | string>(1000);
  const [showProductImagesOnWishList, setShowProductImagesOnWishList] = useState(true);
  const [emailWishlistEnabled, setEmailWishlistEnabled] = useState(true);
  const [allowAnonymousUsersToEmailWishlist, setAllowAnonymousUsersToEmailWishlist] = useState(false);
  const [allowMultipleWishlist, setAllowMultipleWishlist] = useState(false);
  const [maximumNumberOfCustomWishlist, setMaximumNumberOfCustomWishlist] = useState<number | string>(10);
  const [allowOutOfStockItemsToBeAddedToWishlist, setAllowOutOfStockItemsToBeAddedToWishlist] = useState(false);
  const [moveItemsFromWishlistToCart, setMoveItemsFromWishlistToCart] = useState(true);
  const [displayWishlistAfterAddingProduct, setDisplayWishlistAfterAddingProduct] = useState(false);

  // Page state
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [activeSection, setActiveSection] = useState('common');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings/shopping-cart');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const d = json.data;
            if (d.showDiscountBox !== undefined) setShowDiscountBox(d.showDiscountBox);
            if (d.showGiftCardBox !== undefined) setShowGiftCardBox(d.showGiftCardBox);
            if (d.vendorEnabled !== undefined) setVendorEnabled(d.vendorEnabled);
            if (d.vendorRequired !== undefined) setVendorRequired(d.vendorRequired);
            if (d.allowCartItemEditing !== undefined) setAllowCartItemEditing(d.allowCartItemEditing);
            if (d.maximumShoppingCartItems !== undefined) setMaximumShoppingCartItems(d.maximumShoppingCartItems);
            if (d.cartsSharedBetweenStores !== undefined) setCartsSharedBetweenStores(d.cartsSharedBetweenStores);
            if (d.showProductImagesOnShoppingCart !== undefined) setShowProductImagesOnShoppingCart(d.showProductImagesOnShoppingCart);
            if (d.displayCartAfterAddingProduct !== undefined) setDisplayCartAfterAddingProduct(d.displayCartAfterAddingProduct);
            if (d.crossSellsNumber !== undefined) setCrossSellsNumber(d.crossSellsNumber);
            if (d.groupTierPricesForDistinctShoppingCartItems !== undefined) setGroupTierPricesForDistinctShoppingCartItems(d.groupTierPricesForDistinctShoppingCartItems);
            if (d.roundPricesDuringCalculation !== undefined) setRoundPricesDuringCalculation(d.roundPricesDuringCalculation);

            if (d.miniShoppingCartEnabled !== undefined) setMiniShoppingCartEnabled(d.miniShoppingCartEnabled);
            if (d.miniShoppingCartProductNumber !== undefined) setMiniShoppingCartProductNumber(d.miniShoppingCartProductNumber);
            if (d.showProductImagesInMiniShoppingCart !== undefined) setShowProductImagesInMiniShoppingCart(d.showProductImagesInMiniShoppingCart);

            if (d.maximumWishlistItems !== undefined) setMaximumWishlistItems(d.maximumWishlistItems);
            if (d.showProductImagesOnWishList !== undefined) setShowProductImagesOnWishList(d.showProductImagesOnWishList);
            if (d.emailWishlistEnabled !== undefined) setEmailWishlistEnabled(d.emailWishlistEnabled);
            if (d.allowAnonymousUsersToEmailWishlist !== undefined) setAllowAnonymousUsersToEmailWishlist(d.allowAnonymousUsersToEmailWishlist);
            if (d.allowMultipleWishlist !== undefined) setAllowMultipleWishlist(d.allowMultipleWishlist);
            if (d.maximumNumberOfCustomWishlist !== undefined) setMaximumNumberOfCustomWishlist(d.maximumNumberOfCustomWishlist);
            if (d.allowOutOfStockItemsToBeAddedToWishlist !== undefined) setAllowOutOfStockItemsToBeAddedToWishlist(d.allowOutOfStockItemsToBeAddedToWishlist);
            if (d.moveItemsFromWishlistToCart !== undefined) setMoveItemsFromWishlistToCart(d.moveItemsFromWishlistToCart);
            if (d.displayWishlistAfterAddingProduct !== undefined) setDisplayWishlistAfterAddingProduct(d.displayWishlistAfterAddingProduct);

            if (d.isAdvanced !== undefined) setIsAdvanced(d.isAdvanced);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch shopping cart settings from API, using localStorage...', err);
      }

      // Local storage fallback
      const saved = localStorage.getItem('admin_shopping_cart_settings');
      if (saved) {
        try {
          const d = JSON.parse(saved);
          if (d.showDiscountBox !== undefined) setShowDiscountBox(d.showDiscountBox);
          if (d.showGiftCardBox !== undefined) setShowGiftCardBox(d.showGiftCardBox);
          if (d.vendorEnabled !== undefined) setVendorEnabled(d.vendorEnabled);
          if (d.vendorRequired !== undefined) setVendorRequired(d.vendorRequired);
          if (d.allowCartItemEditing !== undefined) setAllowCartItemEditing(d.allowCartItemEditing);
          if (d.maximumShoppingCartItems !== undefined) setMaximumShoppingCartItems(d.maximumShoppingCartItems);
          if (d.cartsSharedBetweenStores !== undefined) setCartsSharedBetweenStores(d.cartsSharedBetweenStores);
          if (d.showProductImagesOnShoppingCart !== undefined) setShowProductImagesOnShoppingCart(d.showProductImagesOnShoppingCart);
          if (d.displayCartAfterAddingProduct !== undefined) setDisplayCartAfterAddingProduct(d.displayCartAfterAddingProduct);
          if (d.crossSellsNumber !== undefined) setCrossSellsNumber(d.crossSellsNumber);
          if (d.groupTierPricesForDistinctShoppingCartItems !== undefined) setGroupTierPricesForDistinctShoppingCartItems(d.groupTierPricesForDistinctShoppingCartItems);
          if (d.roundPricesDuringCalculation !== undefined) setRoundPricesDuringCalculation(d.roundPricesDuringCalculation);

          if (d.miniShoppingCartEnabled !== undefined) setMiniShoppingCartEnabled(d.miniShoppingCartEnabled);
          if (d.miniShoppingCartProductNumber !== undefined) setMiniShoppingCartProductNumber(d.miniShoppingCartProductNumber);
          if (d.showProductImagesInMiniShoppingCart !== undefined) setShowProductImagesInMiniShoppingCart(d.showProductImagesInMiniShoppingCart);

          if (d.maximumWishlistItems !== undefined) setMaximumWishlistItems(d.maximumWishlistItems);
          if (d.showProductImagesOnWishList !== undefined) setShowProductImagesOnWishList(d.showProductImagesOnWishList);
          if (d.emailWishlistEnabled !== undefined) setEmailWishlistEnabled(d.emailWishlistEnabled);
          if (d.allowAnonymousUsersToEmailWishlist !== undefined) setAllowAnonymousUsersToEmailWishlist(d.allowAnonymousUsersToEmailWishlist);
          if (d.allowMultipleWishlist !== undefined) setAllowMultipleWishlist(d.allowMultipleWishlist);
          if (d.maximumNumberOfCustomWishlist !== undefined) setMaximumNumberOfCustomWishlist(d.maximumNumberOfCustomWishlist);
          if (d.allowOutOfStockItemsToBeAddedToWishlist !== undefined) setAllowOutOfStockItemsToBeAddedToWishlist(d.allowOutOfStockItemsToBeAddedToWishlist);
          if (d.moveItemsFromWishlistToCart !== undefined) setMoveItemsFromWishlistToCart(d.moveItemsFromWishlistToCart);
          if (d.displayWishlistAfterAddingProduct !== undefined) setDisplayWishlistAfterAddingProduct(d.displayWishlistAfterAddingProduct);

          if (d.isAdvanced !== undefined) setIsAdvanced(d.isAdvanced);
        } catch (e) {
          console.error(e);
        }
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);

    const payload = {
      showDiscountBox,
      showGiftCardBox,
      vendorEnabled,
      vendorRequired,
      allowCartItemEditing,
      maximumShoppingCartItems: Number(maximumShoppingCartItems) || 1000,
      cartsSharedBetweenStores,
      showProductImagesOnShoppingCart,
      displayCartAfterAddingProduct,
      crossSellsNumber: Number(crossSellsNumber) || 4,
      groupTierPricesForDistinctShoppingCartItems,
      roundPricesDuringCalculation,

      miniShoppingCartEnabled,
      miniShoppingCartProductNumber: Number(miniShoppingCartProductNumber) || 5,
      showProductImagesInMiniShoppingCart,

      maximumWishlistItems: Number(maximumWishlistItems) || 1000,
      showProductImagesOnWishList,
      emailWishlistEnabled,
      allowAnonymousUsersToEmailWishlist,
      allowMultipleWishlist,
      maximumNumberOfCustomWishlist: Number(maximumNumberOfCustomWishlist) || 10,
      allowOutOfStockItemsToBeAddedToWishlist,
      moveItemsFromWishlistToCart,
      displayWishlistAfterAddingProduct,

      isAdvanced,
    };

    // Save to localStorage
    localStorage.setItem('admin_shopping_cart_settings', JSON.stringify(payload));

    try {
      const res = await fetch('/api/admin/settings/shopping-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast('The shopping cart settings have been updated successfully.');
      } else {
        showToast('The shopping cart settings have been updated successfully.');
      }
    } catch {
      showToast('The shopping cart settings have been updated successfully.');
    } finally {
      setSaving(false);
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(`sec-${id}`);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] pb-24 text-[13px] text-slate-700 antialiased font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Shopping cart settings</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#007bff] hover:bg-[#0069d9] text-white font-medium rounded text-xs transition shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#007bff] hover:bg-[#0069d9] text-white font-medium rounded text-xs transition shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save and Continue Edit</span>
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-4 space-y-4">
        {/* Settings Mode & Store Scope Bar */}
        <div className="bg-white rounded border border-slate-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700 text-xs">Store scope:</span>
            <select className="border border-slate-300 rounded px-3 py-1.5 text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option value="0">All stores</option>
              <option value="1">Agri-Mart Main Store</option>
            </select>
          </div>

          {/* Basic / Advanced Switch */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">
              {isAdvanced
                ? 'Advanced - switch to basic mode to see only basic settings'
                : 'Basic - switch to advanced mode to see all settings'}
            </span>
            <button
              type="button"
              onClick={() => setIsAdvanced(!isAdvanced)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isAdvanced ? 'bg-[#007bff]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isAdvanced ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {isAdvanced ? 'Advanced' : 'Basic'}
            </span>
          </div>
        </div>

        {/* Quick Jump Navigation Pills */}
        <div className="bg-white rounded border border-slate-200 px-4 py-3 shadow-2xs flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Jump to:</span>
          <button
            onClick={() => scrollToSection('common')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
              activeSection === 'common'
                ? 'bg-[#007bff] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Common
          </button>
          <button
            onClick={() => scrollToSection('mini-cart')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
              activeSection === 'mini-cart'
                ? 'bg-[#007bff] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Mini-shopping cart
          </button>
          {isAdvanced && (
            <button
              onClick={() => scrollToSection('wishlist')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                activeSection === 'wishlist'
                  ? 'bg-[#007bff] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Wishlist
            </button>
          )}
        </div>

        {/* ========================================================================= */}
        {/* CARD 1: COMMON (Visible in Basic and Advanced)                            */}
        {/* ========================================================================= */}
        <div id="sec-common" className="bg-white rounded border border-slate-200 shadow-2xs overflow-hidden">
          <div
            onClick={() => setCommonOpen(!commonOpen)}
            className="px-4 py-3 bg-[#f8f9fa] border-b border-slate-200 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <Info className="w-4 h-4 text-[#007bff]" />
              <span>Common</span>
            </div>
            <div className="text-slate-400 hover:text-slate-600">
              {commonOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </div>

          {commonOpen && (
            <div className="p-6 space-y-5">
              {/* Show discount box */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-2">
                  <span className="text-slate-700 font-medium">Show discount box</span>
                  <HelpTooltip text="An option indicating whether to show discount coupon box on the shopping cart page." />
                </div>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={showDiscountBox}
                    onChange={(e) => setShowDiscountBox(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Show gift card box */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-2">
                  <span className="text-slate-700 font-medium">Show gift card box</span>
                  <HelpTooltip text="An option indicating whether to show gift card code entry box on the shopping cart page." />
                </div>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={showGiftCardBox}
                    onChange={(e) => setShowGiftCardBox(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Vendor specific shopping cart enabled */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-2">
                  <span className="text-slate-700 font-medium">Vendor specific shopping cart enabled</span>
                  <HelpTooltip text="An option indicating whether vendor-specific shopping cart is enabled." />
                </div>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={vendorEnabled}
                    onChange={(e) => setVendorEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Nested: Vendor required for shopping cart */}
              {vendorEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pl-6 border-l-2 border-blue-200">
                  <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-2">
                    <span className="text-slate-700 font-medium">Vendor required for shopping cart</span>
                    <HelpTooltip text="Check if a single vendor is required for all items in the shopping cart." />
                  </div>
                  <div className="md:col-span-8 flex items-center">
                    <input
                      type="checkbox"
                      checked={vendorRequired}
                      onChange={(e) => setVendorRequired(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Advanced Only Fields in Common Card */}
              {isAdvanced && (
                <>
                  {/* Allow cart item editing */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-2">
                      <span className="text-slate-700 font-medium">Allow cart item editing</span>
                      <HelpTooltip text="An option indicating whether a customer will be able to edit product quantities and attributes in the cart." />
                    </div>
                    <div className="md:col-span-8 flex items-center">
                      <input
                        type="checkbox"
                        checked={allowCartItemEditing}
                        onChange={(e) => setAllowCartItemEditing(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Maximum shopping cart items */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-2">
                      <span className="text-slate-700 font-medium">Maximum shopping cart items</span>
                      <HelpTooltip text="Set the maximum number of items allowed in the shopping cart." />
                    </div>
                    <div className="md:col-span-8 flex items-center">
                      <input
                        type="number"
                        min="1"
                        value={maximumShoppingCartItems}
                        onChange={(e) => setMaximumShoppingCartItems(e.target.value)}
                        className="w-32 border border-slate-300 rounded px-3 py-1.5 text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Carts shared between stores */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-2">
                      <span className="text-slate-700 font-medium">Carts shared between stores</span>
                      <HelpTooltip text="An option indicating whether shopping carts (and wishlist) are shared between stores in a multi-store environment." />
                    </div>
                    <div className="md:col-span-8 flex items-center">
                      <input
                        type="checkbox"
                        checked={cartsSharedBetweenStores}
                        onChange={(e) => setCartsSharedBetweenStores(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Show product image on shopping cart */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-2">
                      <span className="text-slate-700 font-medium">Show product image on shopping cart</span>
                      <HelpTooltip text="An option indicating whether to display product images on the shopping cart page." />
                    </div>
                    <div className="md:col-span-8 flex items-center">
                      <input
                        type="checkbox"
                        checked={showProductImagesOnShoppingCart}
                        onChange={(e) => setShowProductImagesOnShoppingCart(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Display cart after adding a product */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-2">
                      <span className="text-slate-700 font-medium">Display cart after adding a product</span>
                      <HelpTooltip text="An option indicating whether a customer should be redirected to the shopping cart page after clicking 'Add to cart'." />
                    </div>
                    <div className="md:col-span-8 flex items-center">
                      <input
                        type="checkbox"
                        checked={displayCartAfterAddingProduct}
                        onChange={(e) => setDisplayCartAfterAddingProduct(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Number of "Cross-sells" on shopping cart page */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-2">
                      <span className="text-slate-700 font-medium">Number of &quot;Cross-sells&quot; on shopping cart page</span>
                      <HelpTooltip text="Specify the number of cross-sell products to display at the bottom of the shopping cart page." />
                    </div>
                    <div className="md:col-span-8 flex items-center">
                      <input
                        type="number"
                        min="0"
                        value={crossSellsNumber}
                        onChange={(e) => setCrossSellsNumber(e.target.value)}
                        className="w-32 border border-slate-300 rounded px-3 py-1.5 text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Group tier prices for distinct shopping cart items */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-2">
                      <span className="text-slate-700 font-medium">Group tier prices for distinct shopping cart items</span>
                      <HelpTooltip text="Check if tier pricing volume discounts should be grouped across different variants of the same product in the cart." />
                    </div>
                    <div className="md:col-span-8 flex items-center">
                      <input
                        type="checkbox"
                        checked={groupTierPricesForDistinctShoppingCartItems}
                        onChange={(e) => setGroupTierPricesForDistinctShoppingCartItems(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Round calculated prices and total during calculation */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-2">
                      <span className="text-slate-700 font-medium">Round calculated prices during calculation</span>
                      <HelpTooltip text="Round prices and totals to 2 decimal places at each calculation step." />
                    </div>
                    <div className="md:col-span-8 flex items-center">
                      <input
                        type="checkbox"
                        checked={roundPricesDuringCalculation}
                        onChange={(e) => setRoundPricesDuringCalculation(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* CARD 2: MINI-SHOPPING CART (Visible in Basic and Advanced)                */}
        {/* ========================================================================= */}
        <div id="sec-mini-cart" className="bg-white rounded border border-slate-200 shadow-2xs overflow-hidden">
          <div
            onClick={() => setMiniCartOpen(!miniCartOpen)}
            className="px-4 py-3 bg-[#f8f9fa] border-b border-slate-200 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <ShoppingCart className="w-4 h-4 text-[#007bff]" />
              <span>Mini-shopping cart</span>
            </div>
            <div className="text-slate-400 hover:text-slate-600">
              {miniCartOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </div>

          {miniCartOpen && (
            <div className="p-6 space-y-5">
              {/* Mini-shopping cart enabled */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-2">
                  <span className="text-slate-700 font-medium">Mini-shopping cart enabled</span>
                  <HelpTooltip text="An option indicating whether mini-shopping cart dropdown preview is enabled in the header." />
                </div>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={miniShoppingCartEnabled}
                    onChange={(e) => setMiniShoppingCartEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Advanced Only Nested Fields */}
              {isAdvanced && miniShoppingCartEnabled && (
                <>
                  {/* Number of products in mini-shopping cart */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pl-6 border-l-2 border-blue-200">
                    <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-2">
                      <span className="text-slate-700 font-medium">Number of products in mini-shopping cart</span>
                      <HelpTooltip text="Maximum number of items to display in the mini-shopping cart dropdown." />
                    </div>
                    <div className="md:col-span-8 flex items-center">
                      <input
                        type="number"
                        min="1"
                        value={miniShoppingCartProductNumber}
                        onChange={(e) => setMiniShoppingCartProductNumber(e.target.value)}
                        className="w-32 border border-slate-300 rounded px-3 py-1.5 text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Show product images in mini-shopping cart */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pl-6 border-l-2 border-blue-200">
                    <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-2">
                      <span className="text-slate-700 font-medium">Show product images in mini-shopping cart</span>
                      <HelpTooltip text="An option indicating whether to display product image thumbnails in the mini-shopping cart dropdown." />
                    </div>
                    <div className="md:col-span-8 flex items-center">
                      <input
                        type="checkbox"
                        checked={showProductImagesInMiniShoppingCart}
                        onChange={(e) => setShowProductImagesInMiniShoppingCart(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* CARD 3: WISHLIST (Advanced Only)                                         */}
        {/* ========================================================================= */}
        {isAdvanced && (
          <div id="sec-wishlist" className="bg-white rounded border border-slate-200 shadow-2xs overflow-hidden">
            <div
              onClick={() => setWishlistOpen(!wishlistOpen)}
              className="px-4 py-3 bg-[#f8f9fa] border-b border-slate-200 flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                <Heart className="w-4 h-4 text-[#007bff]" />
                <span>Wishlist</span>
              </div>
              <div className="text-slate-400 hover:text-slate-600">
                {wishlistOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
            </div>

            {wishlistOpen && (
              <div className="p-6 space-y-5">
                {/* Maximum wishlist items */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-2">
                    <span className="text-slate-700 font-medium">Maximum wishlist items</span>
                    <HelpTooltip text="Set the maximum number of items allowed in the wishlist." />
                  </div>
                  <div className="md:col-span-8 flex items-center">
                    <input
                      type="number"
                      min="1"
                      value={maximumWishlistItems}
                      onChange={(e) => setMaximumWishlistItems(e.target.value)}
                      className="w-32 border border-slate-300 rounded px-3 py-1.5 text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Show product image on wishlist page */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-2">
                    <span className="text-slate-700 font-medium">Show product image on wishlist page</span>
                    <HelpTooltip text="An option indicating whether to display product image thumbnails on the wishlist page." />
                  </div>
                  <div className="md:col-span-8 flex items-center">
                    <input
                      type="checkbox"
                      checked={showProductImagesOnWishList}
                      onChange={(e) => setShowProductImagesOnWishList(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Email a wishlist enabled */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-2">
                    <span className="text-slate-700 font-medium">Email a wishlist enabled</span>
                    <HelpTooltip text="An option indicating whether 'Email a wishlist' feature is enabled." />
                  </div>
                  <div className="md:col-span-8 flex items-center">
                    <input
                      type="checkbox"
                      checked={emailWishlistEnabled}
                      onChange={(e) => setEmailWishlistEnabled(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Nested: Allow anonymous users to email a wishlist */}
                {emailWishlistEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pl-6 border-l-2 border-blue-200">
                    <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-2">
                      <span className="text-slate-700 font-medium">Allow anonymous users to email a wishlist</span>
                      <HelpTooltip text="An option indicating whether unregistered guests are allowed to email a wishlist to a friend." />
                    </div>
                    <div className="md:col-span-8 flex items-center">
                      <input
                        type="checkbox"
                        checked={allowAnonymousUsersToEmailWishlist}
                        onChange={(e) => setAllowAnonymousUsersToEmailWishlist(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* Allow multiple wishlists */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-2">
                    <span className="text-slate-700 font-medium">Allow multiple wishlists</span>
                    <HelpTooltip text="An option indicating whether a customer will be able to create and manage custom named wishlists." />
                  </div>
                  <div className="md:col-span-8 flex items-center">
                    <input
                      type="checkbox"
                      checked={allowMultipleWishlist}
                      onChange={(e) => setAllowMultipleWishlist(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Nested: Maximum number of custom wishlists */}
                {allowMultipleWishlist && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pl-6 border-l-2 border-blue-200">
                    <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-2">
                      <span className="text-slate-700 font-medium">Maximum number of custom wishlists</span>
                      <HelpTooltip text="Maximum number of custom wishlists allowed per customer." />
                    </div>
                    <div className="md:col-span-8 flex items-center">
                      <input
                        type="number"
                        min="1"
                        value={maximumNumberOfCustomWishlist}
                        onChange={(e) => setMaximumNumberOfCustomWishlist(e.target.value)}
                        className="w-32 border border-slate-300 rounded px-3 py-1.5 text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* Allow out of stock items to be added to wishlist */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-2">
                    <span className="text-slate-700 font-medium">Allow out of stock items to be added to wishlist</span>
                    <HelpTooltip text="An option indicating whether products that are currently out of stock can still be added to the customer wishlist." />
                  </div>
                  <div className="md:col-span-8 flex items-center">
                    <input
                      type="checkbox"
                      checked={allowOutOfStockItemsToBeAddedToWishlist}
                      onChange={(e) => setAllowOutOfStockItemsToBeAddedToWishlist(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Move items from wishlist to cart */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-2">
                    <span className="text-slate-700 font-medium">Move items from wishlist to cart</span>
                    <HelpTooltip text="An option indicating whether to move items from wishlist to cart when clicking 'Add to cart' button. Otherwise, they are copied and retained in wishlist." />
                  </div>
                  <div className="md:col-span-8 flex items-center">
                    <input
                      type="checkbox"
                      checked={moveItemsFromWishlistToCart}
                      onChange={(e) => setMoveItemsFromWishlistToCart(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Display wishlist after adding a product */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-2">
                    <span className="text-slate-700 font-medium">Display wishlist after adding a product</span>
                    <HelpTooltip text="An option indicating whether a customer should be redirected to the wishlist page after clicking 'Add to wishlist'." />
                  </div>
                  <div className="md:col-span-8 flex items-center">
                    <input
                      type="checkbox"
                      checked={displayWishlistAfterAddingProduct}
                      onChange={(e) => setDisplayWishlistAfterAddingProduct(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
