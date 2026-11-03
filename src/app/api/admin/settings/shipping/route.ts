import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/dev-db';


export interface ShippingOriginData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  country: string;
  stateProvince: string;
  countyRegion: string;
  city: string;
  address1: string;
  address2: string;
  zipPostalCode: string;
  phoneNumber: string;
  faxNumber: string;
  originImage?: string;
}

export interface ShippingSettingsData {
  // Common (media_1791346513915.png & media_1791346533205.png)
  estimateShippingCartPage: boolean;
  estimateShippingProductPage: boolean;
  useCityNameForEstimateShipping: boolean;
  pickUpInStoreEnabled: boolean;
  ignoreAdditionalShippingChargeForPickUpInStore: boolean;
  displayPickupPointsOnMap: boolean;
  googleMapsApiKey: string;
  freeShippingOverX: boolean;
  valueOfX: number;
  valueOfXCurrency: string;
  calculateXIncludingTax: boolean;
  useWarehouseLocation: boolean;
  considerAssociatedProductsDimensionsAndWeight: boolean;
  sortShippingMethodsBy: string;

  // Notifications (media_1791346533205.png)
  notifyCustomerAboutShippingFromMultipleLocations: boolean;
  displayShipmentEventsCustomers: boolean;
  displayShipmentEventsStoreOwner: boolean;

  // Checkout (media_1791346536874.png)
  hideShippingTotalIfShippingNotRequired: boolean;
  shipToSameAddress: boolean;
  bypassShippingMethodPageIfOnlyOne: boolean;

  // Shipping origin (media_1791346544811.png)
  shippingOrigin: ShippingOriginData;

  // Mode
  isAdvanced: boolean;
}

const DEFAULT_SHIPPING_SETTINGS: ShippingSettingsData = {
  // Common
  estimateShippingCartPage: true,
  estimateShippingProductPage: true,
  useCityNameForEstimateShipping: false,
  pickUpInStoreEnabled: true,
  ignoreAdditionalShippingChargeForPickUpInStore: true,
  displayPickupPointsOnMap: true,
  googleMapsApiKey: '',
  freeShippingOverX: true,
  valueOfX: 0,
  valueOfXCurrency: 'INR',
  calculateXIncludingTax: true,
  useWarehouseLocation: true,
  considerAssociatedProductsDimensionsAndWeight: true,
  sortShippingMethodsBy: 'Position',

  // Notifications
  notifyCustomerAboutShippingFromMultipleLocations: false,
  displayShipmentEventsCustomers: false,
  displayShipmentEventsStoreOwner: false,

  // Checkout
  hideShippingTotalIfShippingNotRequired: false,
  shipToSameAddress: false,
  bypassShippingMethodPageIfOnlyOne: false,

  // Shipping origin
  shippingOrigin: {
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    country: '',
    stateProvince: 'Other',
    countyRegion: '',
    city: '',
    address1: '',
    address2: '',
    zipPostalCode: '',
    phoneNumber: '',
    faxNumber: '',
    originImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
  },

  isAdvanced: true,
};

export async function GET() {
  try {
    const db = readDb();
    const settings = db.shippingSettings
      ? { ...DEFAULT_SHIPPING_SETTINGS, ...db.shippingSettings }
      : DEFAULT_SHIPPING_SETTINGS;

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch shipping settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = readDb();

    const currentSettings = db.shippingSettings || DEFAULT_SHIPPING_SETTINGS;
    const updatedSettings = {
      ...currentSettings,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    db.shippingSettings = updatedSettings;
    const written = writeDb(db);

    if (!written) {
      return NextResponse.json(
        { success: false, error: 'Failed to write shipping settings to disk' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
      message: 'The shipping settings have been updated successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update shipping settings' },
      { status: 500 }
    );
  }
}
