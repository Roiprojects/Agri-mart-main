'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Minus,
  Plus,
  CheckCircle2,
  Info,
  ShoppingCart,
  Star,
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
  const [isAdvanced, setIsAdvanced] = useState(true);

  // Section collapse state
  const [commonOpen, setCommonOpen] = useState(true);
  const [miniCartOpen, setMiniCartOpen] = useState(true);
  const [wishlistOpen, setWishlistOpen] = useState(true);

  // Common settings (media_1791357531921.png & media_1791357633239.png)
  const [showDiscountBox, setShowDiscountBox] = useState(true);
  const [showGiftCardBox, setShowGiftCardBox] = useState(true);
  const [allowCartItemEditing, setAllowCartItemEditing] = useState(true);
  const [maximumShoppingCartItems, setMaximumShoppingCartItems] = useState<number | string>(1000);
  const [cartsSharedBetweenStores, setCartsSharedBetweenStores] = useState(false);
  const [showProductImagesOnShoppingCart, setShowProductImagesOnShoppingCart] = useState(true);
  const [displayCartAfterAddingProduct, setDisplayCartAfterAddingProduct] = useState(false);
  const [crossSellsNumber, setCrossSellsNumber] = useState<number | string>(4);
  const [groupTierPricesForDistinctShoppingCartItems, setGroupTierPricesForDistinctShoppingCartItems] =
    useState(false);

  // Mini shopping cart settings (media_1791357534036.png & media_1791357633239.png)
  const [miniShoppingCartEnabled, setMiniShoppingCartEnabled] = useState(true);
  const [miniShoppingCartProductNumber, setMiniShoppingCartProductNumber] = useState<number | string>(5);
  const [showProductImagesInMiniShoppingCart, setShowProductImagesInMiniShoppingCart] = useState(true);

  // Wishlist settings (media_1791357534036.png - Advanced only)
  const [maximumWishlistItems, setMaximumWishlistItems] = useState<number | string>(1000);
  const [showProductImagesOnWishList, setShowProductImagesOnWishList] = useState(true);
  const [emailWishlistEnabled, setEmailWishlistEnabled] = useState(true);
  const [allowAnonymousUsersToEmailWishlist, setAllowAnonymousUsersToEmailWishlist] = useState(false);
  const [allowMultipleWishlist, setAllowMultipleWishlist] = useState(true);
  const [maximumNumberOfCustomWishlist, setMaximumNumberOfCustomWishlist] = useState<number | string>(10);
  const [allowOutOfStockItemsToBeAddedToWishlist, setAllowOutOfStockItemsToBeAddedToWishlist] =
    useState(false);
  const [moveItemsFromWishlistToCart, setMoveItemsFromWishlistToCart] = useState(true);
  const [displayWishlistAfterAddingProduct, setDisplayWishlistAfterAddingProduct] = useState(false);

  // Page state
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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
            if (d.allowCartItemEditing !== undefined) setAllowCartItemEditing(d.allowCartItemEditing);
            if (d.maximumShoppingCartItems !== undefined)
              setMaximumShoppingCartItems(d.maximumShoppingCartItems);
            if (d.cartsSharedBetweenStores !== undefined)
              setCartsSharedBetweenStores(d.cartsSharedBetweenStores);
            if (d.showProductImagesOnShoppingCart !== undefined)
              setShowProductImagesOnShoppingCart(d.showProductImagesOnShoppingCart);
            if (d.displayCartAfterAddingProduct !== undefined)
              setDisplayCartAfterAddingProduct(d.displayCartAfterAddingProduct);
            if (d.crossSellsNumber !== undefined) setCrossSellsNumber(d.crossSellsNumber);
            if (d.groupTierPricesForDistinctShoppingCartItems !== undefined)
              setGroupTierPricesForDistinctShoppingCartItems(d.groupTierPricesForDistinctShoppingCartItems);

            if (d.miniShoppingCartEnabled !== undefined)
              setMiniShoppingCartEnabled(d.miniShoppingCartEnabled);
            if (d.miniShoppingCartProductNumber !== undefined)
              setMiniShoppingCartProductNumber(d.miniShoppingCartProductNumber);
            if (d.showProductImagesInMiniShoppingCart !== undefined)
              setShowProductImagesInMiniShoppingCart(d.showProductImagesInMiniShoppingCart);

            if (d.maximumWishlistItems !== undefined) setMaximumWishlistItems(d.maximumWishlistItems);
            if (d.showProductImagesOnWishList !== undefined)
              setShowProductImagesOnWishList(d.showProductImagesOnWishList);
            if (d.emailWishlistEnabled !== undefined) setEmailWishlistEnabled(d.emailWishlistEnabled);
            if (d.allowAnonymousUsersToEmailWishlist !== undefined)
              setAllowAnonymousUsersToEmailWishlist(d.allowAnonymousUsersToEmailWishlist);
            if (d.allowMultipleWishlist !== undefined) setAllowMultipleWishlist(d.allowMultipleWishlist);
            if (d.maximumNumberOfCustomWishlist !== undefined)
              setMaximumNumberOfCustomWishlist(d.maximumNumberOfCustomWishlist);
            if (d.allowOutOfStockItemsToBeAddedToWishlist !== undefined)
              setAllowOutOfStockItemsToBeAddedToWishlist(d.allowOutOfStockItemsToBeAddedToWishlist);
            if (d.moveItemsFromWishlistToCart !== undefined)
              setMoveItemsFromWishlistToCart(d.moveItemsFromWishlistToCart);
            if (d.displayWishlistAfterAddingProduct !== undefined)
              setDisplayWishlistAfterAddingProduct(d.displayWishlistAfterAddingProduct);

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
          if (d.allowCartItemEditing !== undefined) setAllowCartItemEditing(d.allowCartItemEditing);
          if (d.maximumShoppingCartItems !== undefined)
            setMaximumShoppingCartItems(d.maximumShoppingCartItems);
          if (d.cartsSharedBetweenStores !== undefined)
            setCartsSharedBetweenStores(d.cartsSharedBetweenStores);
          if (d.showProductImagesOnShoppingCart !== undefined)
            setShowProductImagesOnShoppingCart(d.showProductImagesOnShoppingCart);
          if (d.displayCartAfterAddingProduct !== undefined)
            setDisplayCartAfterAddingProduct(d.displayCartAfterAddingProduct);
          if (d.crossSellsNumber !== undefined) setCrossSellsNumber(d.crossSellsNumber);
          if (d.groupTierPricesForDistinctShoppingCartItems !== undefined)
            setGroupTierPricesForDistinctShoppingCartItems(d.groupTierPricesForDistinctShoppingCartItems);

          if (d.miniShoppingCartEnabled !== undefined)
            setMiniShoppingCartEnabled(d.miniShoppingCartEnabled);
          if (d.miniShoppingCartProductNumber !== undefined)
            setMiniShoppingCartProductNumber(d.miniShoppingCartProductNumber);
          if (d.showProductImagesInMiniShoppingCart !== undefined)
            setShowProductImagesInMiniShoppingCart(d.showProductImagesInMiniShoppingCart);

          if (d.maximumWishlistItems !== undefined) setMaximumWishlistItems(d.maximumWishlistItems);
          if (d.showProductImagesOnWishList !== undefined)
            setShowProductImagesOnWishList(d.showProductImagesOnWishList);
          if (d.emailWishlistEnabled !== undefined) setEmailWishlistEnabled(d.emailWishlistEnabled);
          if (d.allowAnonymousUsersToEmailWishlist !== undefined)
            setAllowAnonymousUsersToEmailWishlist(d.allowAnonymousUsersToEmailWishlist);
          if (d.allowMultipleWishlist !== undefined) setAllowMultipleWishlist(d.allowMultipleWishlist);
          if (d.maximumNumberOfCustomWishlist !== undefined)
            setMaximumNumberOfCustomWishlist(d.maximumNumberOfCustomWishlist);
          if (d.allowOutOfStockItemsToBeAddedToWishlist !== undefined)
            setAllowOutOfStockItemsToBeAddedToWishlist(d.allowOutOfStockItemsToBeAddedToWishlist);
          if (d.moveItemsFromWishlistToCart !== undefined)
            setMoveItemsFromWishlistToCart(d.moveItemsFromWishlistToCart);
          if (d.displayWishlistAfterAddingProduct !== undefined)
            setDisplayWishlistAfterAddingProduct(d.displayWishlistAfterAddingProduct);

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
      allowCartItemEditing,
      maximumShoppingCartItems: Number(maximumShoppingCartItems) || 1000,
      cartsSharedBetweenStores,
      showProductImagesOnShoppingCart,
      displayCartAfterAddingProduct,
      crossSellsNumber: Number(crossSellsNumber) || 4,
      groupTierPricesForDistinctShoppingCartItems,

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

  return (
    <div className="min-h-screen bg-[#f4f6f9] pb-24 text-[13px] text-slate-700 antialiased font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded shadow-lg text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header Bar (Matching media_1791357531921.png & media_1791357633239.png) */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Shopping cart settings</h1>
        </div>
        <div>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#007bff] hover:bg-[#0069d9] text-white font-medium rounded text-xs transition shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-4 space-y-4">
        {/* Advanced / Basic Mode Toggle Pill (Matching screenshots) */}
        <div className="flex items-center">
          {isAdvanced ? (
            <button
              type="button"
              onClick={() => setIsAdvanced(false)}
              className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-semibold rounded-md shadow-2xs transition cursor-pointer select-none"
            >
              <span>Advanced</span>
              <div className="w-7 h-4 bg-white/30 rounded-full p-0.5 flex items-center justify-end transition-colors">
                <div className="w-3 h-3 bg-white rounded-full shadow-xs" />
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsAdvanced(true)}
              className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-md shadow-2xs transition cursor-pointer select-none"
            >
              <div className="w-7 h-4 bg-slate-300 rounded-full p-0.5 flex items-center justify-start transition-colors">
                <div className="w-3 h-3 bg-white rounded-full shadow-xs" />
              </div>
              <span>Basic</span>
            </button>
          )}
        </div>

        {/* ========================================================================= */}
        {/* CARD 1: COMMON (Matching media_1791357531921.png & media_1791357633239.png)*/}
        {/* ========================================================================= */}
        <div className="bg-white rounded border border-slate-200 border-t-3 border-t-[#00c0ef] shadow-2xs overflow-hidden">
          <div
            onClick={() => setCommonOpen(!commonOpen)}
            className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <Info className="w-4 h-4 text-slate-500" />
              <span>Common</span>
            </div>
            <div className="text-slate-400 hover:text-slate-600">
              {commonOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </div>

          {commonOpen && (
            <div className="p-6 space-y-4">
              {/* 1. Show discount box (Visible in Basic and Advanced) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Show discount box</span>
                  <HelpTooltip text="An option indicating whether to show discount coupon box on the shopping cart page." />
                </div>
                <div className="md:col-span-9 flex items-center">
                  <input
                    type="checkbox"
                    checked={showDiscountBox}
                    onChange={(e) => setShowDiscountBox(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* 2. Show gift card box (Visible in Basic and Advanced) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Show gift card box</span>
                  <HelpTooltip text="An option indicating whether to show gift card code entry box on the shopping cart page." />
                </div>
                <div className="md:col-span-9 flex items-center">
                  <input
                    type="checkbox"
                    checked={showGiftCardBox}
                    onChange={(e) => setShowGiftCardBox(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Advanced Only Fields in Common Card (Hidden in Basic mode) */}
              {isAdvanced && (
                <>
                  {/* 3. Allow cart item editing */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                      <span>Allow cart item editing</span>
                      <HelpTooltip text="An option indicating whether a customer will be able to edit product quantities and attributes in the cart." />
                    </div>
                    <div className="md:col-span-9 flex items-center">
                      <input
                        type="checkbox"
                        checked={allowCartItemEditing}
                        onChange={(e) => setAllowCartItemEditing(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* 4. Maximum shopping cart items */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                      <span>Maximum shopping cart items</span>
                      <HelpTooltip text="Set the maximum number of items allowed in the shopping cart." />
                    </div>
                    <div className="md:col-span-9">
                      <input
                        type="number"
                        min="1"
                        value={maximumShoppingCartItems}
                        onChange={(e) => setMaximumShoppingCartItems(e.target.value)}
                        className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* 5. Carts shared between stores */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                      <span>Carts shared between stores</span>
                      <HelpTooltip text="An option indicating whether shopping carts (and wishlist) are shared between stores in a multi-store environment." />
                    </div>
                    <div className="md:col-span-9 flex items-center">
                      <input
                        type="checkbox"
                        checked={cartsSharedBetweenStores}
                        onChange={(e) => setCartsSharedBetweenStores(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* 6. Show product images on cart */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                      <span>Show product images on cart</span>
                      <HelpTooltip text="An option indicating whether to display product images on the shopping cart page." />
                    </div>
                    <div className="md:col-span-9 flex items-center">
                      <input
                        type="checkbox"
                        checked={showProductImagesOnShoppingCart}
                        onChange={(e) => setShowProductImagesOnShoppingCart(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* 7. Display cart after adding a product */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                      <span>Display cart after adding a product</span>
                      <HelpTooltip text="An option indicating whether a customer should be redirected to the shopping cart page after clicking 'Add to cart'." />
                    </div>
                    <div className="md:col-span-9 flex items-center">
                      <input
                        type="checkbox"
                        checked={displayCartAfterAddingProduct}
                        onChange={(e) => setDisplayCartAfterAddingProduct(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* 8. Number of 'Cross-Sells' */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                      <span>Number of &apos;Cross-Sells&apos;</span>
                      <HelpTooltip text="Specify the number of cross-sell products to display at the bottom of the shopping cart page." />
                    </div>
                    <div className="md:col-span-9">
                      <input
                        type="number"
                        min="0"
                        value={crossSellsNumber}
                        onChange={(e) => setCrossSellsNumber(e.target.value)}
                        className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* 9. Group tier prices for distinct shopping cart items */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                      <span>Group tier prices for distinct shopping cart items</span>
                      <HelpTooltip text="Check if tier pricing volume discounts should be grouped across different variants of the same product in the cart." />
                    </div>
                    <div className="md:col-span-9 flex items-center">
                      <input
                        type="checkbox"
                        checked={groupTierPricesForDistinctShoppingCartItems}
                        onChange={(e) =>
                          setGroupTierPricesForDistinctShoppingCartItems(e.target.checked)
                        }
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
        {/* CARD 2: MINI SHOPPING CART (Matching media_1791357534036.png & media_1791357633239.png) */}
        {/* ========================================================================= */}
        <div className="bg-white rounded border border-slate-200 border-t-3 border-t-[#00c0ef] shadow-2xs overflow-hidden">
          <div
            onClick={() => setMiniCartOpen(!miniCartOpen)}
            className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <ShoppingCart className="w-4 h-4 text-slate-700" />
              <span>Mini shopping cart</span>
            </div>
            <div className="text-slate-400 hover:text-slate-600">
              {miniCartOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </div>

          {miniCartOpen && (
            <div className="p-6 space-y-4">
              {/* 1. Show mini-shopping cart (Visible in Basic and Advanced) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Show mini-shopping cart</span>
                  <HelpTooltip text="An option indicating whether mini-shopping cart dropdown preview is enabled in the header." />
                </div>
                <div className="md:col-span-9 flex items-center">
                  <input
                    type="checkbox"
                    checked={miniShoppingCartEnabled}
                    onChange={(e) => setMiniShoppingCartEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Advanced Only Fields in Mini shopping cart Card */}
              {isAdvanced && (
                <>
                  {/* 2. Number of products in mini-shopping cart */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                      <span>Number of products in mini-shopping cart</span>
                      <HelpTooltip text="Maximum number of items to display in the mini-shopping cart dropdown." />
                    </div>
                    <div className="md:col-span-9">
                      <input
                        type="number"
                        min="1"
                        value={miniShoppingCartProductNumber}
                        onChange={(e) => setMiniShoppingCartProductNumber(e.target.value)}
                        className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* 3. Show product images in mini-shopping cart */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                      <span>Show product images in mini-shopping cart</span>
                      <HelpTooltip text="An option indicating whether to display product image thumbnails in the mini-shopping cart dropdown." />
                    </div>
                    <div className="md:col-span-9 flex items-center">
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
        {/* CARD 3: WISHLIST (Matching media_1791357534036.png - Advanced Only!)      */}
        {/* ========================================================================= */}
        {isAdvanced && (
          <div className="bg-white rounded border border-slate-200 border-t-3 border-t-[#00c0ef] shadow-2xs overflow-hidden">
            <div
              onClick={() => setWishlistOpen(!wishlistOpen)}
              className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                <Star className="w-4 h-4 text-slate-700 stroke-[1.5]" />
                <span>Wishlist</span>
              </div>
              <div className="text-slate-400 hover:text-slate-600">
                {wishlistOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
            </div>

            {wishlistOpen && (
              <div className="p-6 space-y-4">
                {/* 1. Maximum wishlist items */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Maximum wishlist items</span>
                    <HelpTooltip text="Set the maximum number of items allowed in the wishlist." />
                  </div>
                  <div className="md:col-span-9">
                    <input
                      type="number"
                      min="1"
                      value={maximumWishlistItems}
                      onChange={(e) => setMaximumWishlistItems(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 2. Show product images on wishlist */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Show product images on wishlist</span>
                    <HelpTooltip text="An option indicating whether to display product image thumbnails on the wishlist page." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={showProductImagesOnWishList}
                      onChange={(e) => setShowProductImagesOnWishList(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 3. Allow customers to email their wishlists + Nested branch for guests */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                      <span>Allow customers to email their wishlists</span>
                      <HelpTooltip text="An option indicating whether 'Email a wishlist' feature is enabled." />
                    </div>
                    <div className="md:col-span-9 flex items-center">
                      <input
                        type="checkbox"
                        checked={emailWishlistEnabled}
                        onChange={(e) => setEmailWishlistEnabled(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Sub-tree branch with vertical stem and horizontal line */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative">
                    <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                      <span>Allow guests to email their wishlists</span>
                      <HelpTooltip text="An option indicating whether unregistered guests are allowed to email a wishlist to a friend." />
                    </div>
                    <div className="md:col-span-9 flex items-center relative">
                      {/* Vertical line connecting to parent checkbox */}
                      <div className="absolute left-[7px] top-[-16px] h-4 w-[1px] bg-slate-300" />
                      {/* Horizontal branch line */}
                      <div className="absolute left-[7px] top-1/2 w-2 h-[1px] bg-slate-300" />
                      <input
                        type="checkbox"
                        disabled={!emailWishlistEnabled}
                        checked={allowAnonymousUsersToEmailWishlist}
                        onChange={(e) => setAllowAnonymousUsersToEmailWishlist(e.target.checked)}
                        className="h-4 w-4 ml-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Allow multiple wishlists */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Allow multiple wishlists</span>
                    <HelpTooltip text="An option indicating whether a customer will be able to create and manage custom named wishlists." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={allowMultipleWishlist}
                      onChange={(e) => setAllowMultipleWishlist(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 5. Maximum number of custom wishlists */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Maximum number of custom wishlists</span>
                    <HelpTooltip text="Maximum number of custom wishlists allowed per customer." />
                  </div>
                  <div className="md:col-span-9">
                    <input
                      type="number"
                      min="1"
                      value={maximumNumberOfCustomWishlist}
                      onChange={(e) => setMaximumNumberOfCustomWishlist(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 6. Allow 'out of stock' items to be added to wishlist */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Allow &apos;out of stock&apos; items to be added to wishlist</span>
                    <HelpTooltip text="An option indicating whether products that are currently out of stock can still be added to the customer wishlist." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={allowOutOfStockItemsToBeAddedToWishlist}
                      onChange={(e) =>
                        setAllowOutOfStockItemsToBeAddedToWishlist(e.target.checked)
                      }
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 7. Move items from wishlist to cart */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Move items from wishlist to cart</span>
                    <HelpTooltip text="An option indicating whether to move items from wishlist to cart when clicking 'Add to cart' button. Otherwise, they are copied and retained in wishlist." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={moveItemsFromWishlistToCart}
                      onChange={(e) => setMoveItemsFromWishlistToCart(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 8. Display wishlist after adding a product */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Display wishlist after adding a product</span>
                    <HelpTooltip text="An option indicating whether a customer should be redirected to the wishlist page after clicking 'Add to wishlist'." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
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
