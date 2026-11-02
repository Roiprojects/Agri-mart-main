import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/dev-db';


export interface DefaultTaxAddressData {
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
  certificateImage?: string;
}

export interface TaxSettingsData {
  // Common (media_1791347299750.png)
  taxBasedOn: string;
  automaticallyDetectCountryByIpAddress: boolean;
  defaultTaxCategory: string;
  taxBasedOnPickupPointAddress: boolean;
  pricesIncludeTax: boolean;

  // Default tax address (media_1791347304431.png)
  defaultTaxAddress: DefaultTaxAddressData;

  // Tax displaying (media_1791347306285.png)
  allowCustomersToSelectTaxDisplayType: boolean;
  taxDisplayType: string;
  displayTaxSuffix: boolean;
  displayAllAppliedTaxRates: boolean;
  hideZeroTax: boolean;
  hideTaxInOrderSummary: boolean;
  forceTaxExclusionFromOrderSubtotal: boolean;

  // Shipping (media_1791347455279.png)
  shippingIsTaxable: boolean;
  shippingPriceIncludesTax: boolean;
  shippingTaxCategory: string;

  // Payment (media_1791347455279.png)
  paymentMethodAdditionalFeeIsTaxable: boolean;
  paymentMethodAdditionalFeeIncludesTax: boolean;
  paymentMethodAdditionalFeeTaxCategory: string;

  // VAT (media_1791347493535.png)
  euVatEnabled: boolean;
  euVatEnabledForGuests: boolean;
  vatNumberRequired: boolean;
  yourShopCountry: string;
  allowVatExemption: boolean;
  assumeVatAlwaysValid: boolean;
  notifyAdminWhenNewVatNumberSubmitted: boolean;
  useWebService: boolean;

  isAdvanced: boolean;
}

const DEFAULT_TAX_SETTINGS: TaxSettingsData = {
  // Common defaults
  taxBasedOn: 'Billing address',
  automaticallyDetectCountryByIpAddress: true,
  defaultTaxCategory: '[None]',
  taxBasedOnPickupPointAddress: false,
  pricesIncludeTax: false,

  // Default tax address defaults
  defaultTaxAddress: {
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
    certificateImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80',
  },

  // Tax displaying defaults
  allowCustomersToSelectTaxDisplayType: false,
  taxDisplayType: 'Excluding tax',
  displayTaxSuffix: false,
  displayAllAppliedTaxRates: false,
  hideZeroTax: false,
  hideTaxInOrderSummary: false,
  forceTaxExclusionFromOrderSubtotal: false,

  // Shipping tax defaults
  shippingIsTaxable: true,
  shippingPriceIncludesTax: false,
  shippingTaxCategory: '[None]',

  // Payment tax defaults
  paymentMethodAdditionalFeeIsTaxable: true,
  paymentMethodAdditionalFeeIncludesTax: false,
  paymentMethodAdditionalFeeTaxCategory: '[None]',

  // VAT defaults
  euVatEnabled: true,
  euVatEnabledForGuests: false,
  vatNumberRequired: false,
  yourShopCountry: '',
  allowVatExemption: true,
  assumeVatAlwaysValid: false,
  notifyAdminWhenNewVatNumberSubmitted: false,
  useWebService: false,

  isAdvanced: true,
};

export async function GET() {
  try {
    const db = readDb();
    const settings = db.taxSettings
      ? { ...DEFAULT_TAX_SETTINGS, ...db.taxSettings }
      : DEFAULT_TAX_SETTINGS;

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch tax settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = readDb();

    const currentSettings = db.taxSettings || DEFAULT_TAX_SETTINGS;
    const updatedSettings = {
      ...currentSettings,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    db.taxSettings = updatedSettings;
    const written = writeDb(db);

    if (!written) {
      return NextResponse.json(
        { success: false, error: 'Failed to write tax settings to disk' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
      message: 'The tax settings have been updated successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update tax settings' },
      { status: 500 }
    );
  }
}
