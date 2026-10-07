import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'dev-database.json');

export interface ShoppingCartSettingsData {
  // Common (Basic & Advanced)
  showDiscountBox: boolean;
  showGiftCardBox: boolean;
  vendorEnabled: boolean;
  vendorRequired: boolean;

  // Common (Advanced only)
  allowCartItemEditing: boolean;
  maximumShoppingCartItems: number;
  cartsSharedBetweenStores: boolean;
  showProductImagesOnShoppingCart: boolean;
  displayCartAfterAddingProduct: boolean;
  crossSellsNumber: number;
  groupTierPricesForDistinctShoppingCartItems: boolean;
  roundPricesDuringCalculation: boolean;

  // Mini-shopping cart
  miniShoppingCartEnabled: boolean;
  miniShoppingCartProductNumber: number;
  showProductImagesInMiniShoppingCart: boolean;

  // Wishlist (Advanced only)
  maximumWishlistItems: number;
  showProductImagesOnWishList: boolean;
  emailWishlistEnabled: boolean;
  allowAnonymousUsersToEmailWishlist: boolean;
  allowMultipleWishlist: boolean;
  maximumNumberOfCustomWishlist: number;
  allowOutOfStockItemsToBeAddedToWishlist: boolean;
  moveItemsFromWishlistToCart: boolean;
  displayWishlistAfterAddingProduct: boolean;

  // Mode state
  isAdvanced: boolean;
}

const DEFAULT_SHOPPING_CART_SETTINGS: ShoppingCartSettingsData = {
  // Common defaults
  showDiscountBox: true,
  showGiftCardBox: true,
  vendorEnabled: false,
  vendorRequired: false,

  // Common advanced defaults
  allowCartItemEditing: true,
  maximumShoppingCartItems: 1000,
  cartsSharedBetweenStores: false,
  showProductImagesOnShoppingCart: true,
  displayCartAfterAddingProduct: false,
  crossSellsNumber: 4,
  groupTierPricesForDistinctShoppingCartItems: false,
  roundPricesDuringCalculation: false,

  // Mini-shopping cart defaults
  miniShoppingCartEnabled: true,
  miniShoppingCartProductNumber: 5,
  showProductImagesInMiniShoppingCart: true,

  // Wishlist defaults
  maximumWishlistItems: 1000,
  showProductImagesOnWishList: true,
  emailWishlistEnabled: true,
  allowAnonymousUsersToEmailWishlist: false,
  allowMultipleWishlist: true,
  maximumNumberOfCustomWishlist: 10,
  allowOutOfStockItemsToBeAddedToWishlist: false,
  moveItemsFromWishlistToCart: true,
  displayWishlistAfterAddingProduct: false,

  // Mode
  isAdvanced: false,
};

function readDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed reading DB file for shopping cart settings:', err);
  }
  return {};
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed writing DB file for shopping cart settings:', err);
    return false;
  }
}

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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch shopping cart settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }
    const db = readDb();

    const currentSettings = db.shoppingCartSettings || DEFAULT_SHOPPING_CART_SETTINGS;
    const updatedSettings: ShoppingCartSettingsData = {
      ...DEFAULT_SHOPPING_CART_SETTINGS,
      ...currentSettings,
      ...body,
    };

    db.shoppingCartSettings = updatedSettings;

    const ok = writeDb(db);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to write shopping cart settings to disk' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: 'The shopping cart settings have been updated successfully.',
    });
  } catch (error: any) {
    console.error('Error updating shopping cart settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update shopping cart settings' },
      { status: 500 }
    );
  }
}
