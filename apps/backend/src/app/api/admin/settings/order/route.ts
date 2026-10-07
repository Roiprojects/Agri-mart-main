import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'dev-database.json');

export interface ReturnRequestItem {
  id: string;
  name: string;
  displayOrder: number;
}

export interface OrderSettingsData {
  // Checkout settings (media_1791344861078.png)
  checkoutDisabled: boolean;
  anonymousCheckoutAllowed: boolean;
  useOnePageCheckout: boolean;
  orderTotalsOnPaymentInfoTab: boolean;
  termsOfServiceShoppingCartPage: boolean;
  termsOfServiceConfirmOrderPage: boolean;
  disableBillingAddressStep: boolean;
  disableOrderCompletedPage: boolean;
  displayPickupInStoreOnShippingMethodPage: boolean;

  // Order totals settings (media_1791344863715.png)
  minOrderSubtotalAmount: number;
  minOrderSubtotalAmountCurrency: string;
  calculateMinOrderSubtotalIncludingTax: boolean;
  minOrderTotalAmount: number;
  autoUpdateOrderTotals: boolean;

  // Common settings (media_1791344870970.png)
  orderId: number;
  orderNumberMask: string;
  isReOrderAllowed: boolean;
  completeOrderWhenDelivered: boolean;
  exportOrdersWithProducts: boolean;
  allowAdminsToBuyCallForPriceProducts: boolean;
  allowCustomersToCancelOrders: boolean;
  showProductThumbnailInOrderDetailsPage: boolean;

  // PDF invoice settings (media_1791344873749.png)
  attachPdfInvoiceOrderPlaced: boolean;
  attachPdfInvoiceOrderPaid: boolean;
  attachPdfInvoiceOrderProcessing: boolean;
  attachPdfInvoiceOrderCompleted: boolean;
  pdfInvoiceLogo: string;

  // Gift cards settings (media_1791345470954.png)
  activateGiftCardsAfterCompletingOrder: boolean;
  deactivateGiftCardsAfterCancellingOrder: boolean;
  deactivateGiftCardsAfterDeletingOrder: boolean;
  deleteGiftCardUsageHistoryAfterOrderCancellation: boolean;

  // Return request settings (media_1791345474131.png & media_1791345475932.png)
  enableReturnsSystem: boolean;
  returnRequestNumberMask: string;
  numberOfDaysReturnRequestAvailable: number;
  allowFileUploads: boolean;
  returnRequestReasons: ReturnRequestItem[];
  returnRequestActions: ReturnRequestItem[];

  // Advanced mode state
  isAdvanced: boolean;
}

export const DEFAULT_ORDER_SETTINGS: OrderSettingsData = {
  // Checkout defaults
  checkoutDisabled: false,
  anonymousCheckoutAllowed: true,
  useOnePageCheckout: true,
  orderTotalsOnPaymentInfoTab: false,
  termsOfServiceShoppingCartPage: true,
  termsOfServiceConfirmOrderPage: false,
  disableBillingAddressStep: false,
  disableOrderCompletedPage: false,
  displayPickupInStoreOnShippingMethodPage: false,

  // Order totals defaults
  minOrderSubtotalAmount: 0,
  minOrderSubtotalAmountCurrency: 'USD',
  calculateMinOrderSubtotalIncludingTax: false,
  minOrderTotalAmount: 0,
  autoUpdateOrderTotals: false,

  // Common defaults
  orderId: 77,
  orderNumberMask: '{ID}',
  isReOrderAllowed: true,
  completeOrderWhenDelivered: true,
  exportOrdersWithProducts: true,
  allowAdminsToBuyCallForPriceProducts: true,
  allowCustomersToCancelOrders: true,
  showProductThumbnailInOrderDetailsPage: true,

  // PDF invoice defaults
  attachPdfInvoiceOrderPlaced: false,
  attachPdfInvoiceOrderPaid: false,
  attachPdfInvoiceOrderProcessing: false,
  attachPdfInvoiceOrderCompleted: false,
  pdfInvoiceLogo: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=400&q=80',

  // Gift cards defaults
  activateGiftCardsAfterCompletingOrder: false,
  deactivateGiftCardsAfterCancellingOrder: false,
  deactivateGiftCardsAfterDeletingOrder: false,
  deleteGiftCardUsageHistoryAfterOrderCancellation: false,

  // Return request defaults
  enableReturnsSystem: true,
  returnRequestNumberMask: '{ID}',
  numberOfDaysReturnRequestAvailable: 365,
  allowFileUploads: false,
  returnRequestReasons: [
    { id: 'rrr-1', name: 'Received Wrong Product', displayOrder: 1 },
    { id: 'rrr-2', name: 'Wrong Product Ordered', displayOrder: 2 },
    { id: 'rrr-3', name: 'There Was A Problem With The Product', displayOrder: 3 },
  ],
  returnRequestActions: [
    { id: 'rra-1', name: 'Repair', displayOrder: 1 },
    { id: 'rra-2', name: 'Replacement', displayOrder: 2 },
    { id: 'rra-3', name: 'Store Credit', displayOrder: 3 },
  ],

  isAdvanced: true,
};

function readDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed reading DB file for order settings:', err);
  }
  return {};
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed writing DB file for order settings:', err);
    return false;
  }
}

export async function GET() {
  try {
    const db = readDb();
    const settings = db.orderSettings
      ? { ...DEFAULT_ORDER_SETTINGS, ...db.orderSettings }
      : DEFAULT_ORDER_SETTINGS;

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch order settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = readDb();

    const currentSettings = db.orderSettings || DEFAULT_ORDER_SETTINGS;
    const updatedSettings = {
      ...currentSettings,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    db.orderSettings = updatedSettings;
    const written = writeDb(db);

    if (!written) {
      return NextResponse.json(
        { success: false, error: 'Failed to write order settings to disk' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
      message: 'The order settings have been updated successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order settings' },
      { status: 500 }
    );
  }
}
