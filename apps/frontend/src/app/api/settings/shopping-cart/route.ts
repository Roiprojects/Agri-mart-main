import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const DEFAULT_SHOPPING_CART_SETTINGS = {
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

export async function GET() {
  try {
    const backendUrl =
      process.env.BACKEND_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      'http://localhost:3001';

    const res = await fetch(`${backendUrl}/api/admin/settings/shopping-cart`, {
      cache: 'no-store',
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return NextResponse.json({ success: true, data: json.data });
      }
    }
  } catch (err) {
    console.warn('Frontend proxy failed fetching shopping cart settings from backend:', err);
  }

  return NextResponse.json({
    success: true,
    data: DEFAULT_SHOPPING_CART_SETTINGS,
  });
}
