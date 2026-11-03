'use client';

import { useState, useEffect } from 'react';

export interface ShoppingCartSettingsData {
  showDiscountBox: boolean;
  showGiftCardBox: boolean;
  vendorEnabled: boolean;
  vendorRequired: boolean;
  allowCartItemEditing: boolean;
  maximumShoppingCartItems: number;
  cartsSharedBetweenStores: boolean;
  showProductImagesOnShoppingCart: boolean;
  displayCartAfterAddingProduct: boolean;
  crossSellsNumber: number;
  groupTierPricesForDistinctShoppingCartItems: boolean;
  roundPricesDuringCalculation: boolean;
  miniShoppingCartEnabled: boolean;
  miniShoppingCartProductNumber: number;
  showProductImagesInMiniShoppingCart: boolean;
  maximumWishlistItems: number;
  showProductImagesOnWishList: boolean;
  emailWishlistEnabled: boolean;
  allowAnonymousUsersToEmailWishlist: boolean;
  allowMultipleWishlist: boolean;
  maximumNumberOfCustomWishlist: number;
  allowOutOfStockItemsToBeAddedToWishlist: boolean;
  moveItemsFromWishlistToCart: boolean;
  displayWishlistAfterAddingProduct: boolean;
  isAdvanced: boolean;
}

export const DEFAULT_SHOPPING_CART_SETTINGS: ShoppingCartSettingsData = {
  showDiscountBox: true,
  showGiftCardBox: true,
  vendorEnabled: false,
  vendorRequired: false,
  allowCartItemEditing: true,
  maximumShoppingCartItems: 1000,
  cartsSharedBetweenStores: false,
  showProductImagesOnShoppingCart: true,
  displayCartAfterAddingProduct: false,
  crossSellsNumber: 4,
  groupTierPricesForDistinctShoppingCartItems: false,
  roundPricesDuringCalculation: false,
  miniShoppingCartEnabled: true,
  miniShoppingCartProductNumber: 5,
  showProductImagesInMiniShoppingCart: true,
  maximumWishlistItems: 1000,
  showProductImagesOnWishList: true,
  emailWishlistEnabled: true,
  allowAnonymousUsersToEmailWishlist: false,
  allowMultipleWishlist: false,
  maximumNumberOfCustomWishlist: 10,
  allowOutOfStockItemsToBeAddedToWishlist: false,
  moveItemsFromWishlistToCart: true,
  displayWishlistAfterAddingProduct: false,
  isAdvanced: false,
};

export function useShoppingCartSettings() {
  const [settings, setSettings] = useState<ShoppingCartSettingsData>(DEFAULT_SHOPPING_CART_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      // 1. Check local storage first for instant response
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('admin_shopping_cart_settings');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (isMounted) {
              setSettings((prev) => ({ ...prev, ...parsed }));
            }
          } catch {
            // ignore
          }
        }
      }

      // 2. Fetch live settings from API
      try {
        const res = await fetch('/api/settings/shopping-cart');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && isMounted) {
            setSettings(json.data);
          }
        }
      } catch (e) {
        console.warn('Could not fetch shopping cart settings:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    // Listen for cross-tab or local updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_shopping_cart_settings' && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          setSettings((prev) => ({ ...prev, ...updated }));
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { settings, loading };
}
