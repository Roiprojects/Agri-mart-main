import { NextResponse } from 'next/server';
import { readDb } from '@/lib/dev-db';

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
    const db = readDb();
    const settings = {
      ...DEFAULT_SHOPPING_CART_SETTINGS,
      ...(db.shoppingCartSettings || {}),
    };
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (err) {
    return NextResponse.json({
      success: true,
      data: DEFAULT_SHOPPING_CART_SETTINGS,
    });
  }
}
