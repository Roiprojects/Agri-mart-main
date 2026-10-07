import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'dev-database.json');

export interface VendorAttributeValue {
  id: string;
  name: string;
  isPreSelected?: boolean;
  displayOrder: number;
}

export interface VendorAttributeItem {
  id: string;
  name: string;
  isRequired: boolean;
  controlType: string;
  displayOrder: number;
  values?: VendorAttributeValue[];
  locales?: {
    en?: { name: string };
    rtl?: { name: string };
  };
}

export interface VendorSettingsData {
  // Common
  allowCustomersToApplyForVendorAccount: boolean;
  termsOfServiceEnabled: boolean;
  allowVendorsToEditInfo: boolean;
  notifyAboutVendorInformationChanges: boolean;
  maximumNumberOfProducts: number;
  allowVendorsToImportProducts: boolean;

  // Catalog
  allowCustomersToContactVendors: boolean;
  allowSearchByVendor: boolean;
  showVendorOnProductDetailsPage: boolean;
  showVendorNameOnOrderDetailsPage: boolean;
  numberOfVendorsToDisplay: number;

  // Vendor attributes
  vendorAttributes: VendorAttributeItem[];

  // Mode
  isAdvanced: boolean;
}

const DEFAULT_VENDOR_SETTINGS: VendorSettingsData = {
  allowCustomersToApplyForVendorAccount: true,
  termsOfServiceEnabled: false,
  allowVendorsToEditInfo: true,
  notifyAboutVendorInformationChanges: false,
  maximumNumberOfProducts: 3000,
  allowVendorsToImportProducts: false,

  allowCustomersToContactVendors: false,
  allowSearchByVendor: false,
  showVendorOnProductDetailsPage: false,
  showVendorNameOnOrderDetailsPage: false,
  numberOfVendorsToDisplay: 0,

  vendorAttributes: [],
  isAdvanced: true,
};

function readDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed reading DB file for vendor settings:', err);
  }
  return {};
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed writing DB file for vendor settings:', err);
    return false;
  }
}

export async function GET() {
  try {
    const db = readDb();
    const settings: VendorSettingsData = {
      ...DEFAULT_VENDOR_SETTINGS,
      ...(db.vendorSettings || {}),
      vendorAttributes: db.vendorSettings?.vendorAttributes || DEFAULT_VENDOR_SETTINGS.vendorAttributes,
    };
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch vendor settings' },
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

    const currentSettings = db.vendorSettings || DEFAULT_VENDOR_SETTINGS;
    const updatedSettings: VendorSettingsData = {
      ...DEFAULT_VENDOR_SETTINGS,
      ...currentSettings,
      ...body,
      vendorAttributes:
        body.vendorAttributes !== undefined
          ? body.vendorAttributes
          : currentSettings.vendorAttributes || [],
    };

    db.vendorSettings = updatedSettings;

    const ok = writeDb(db);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to write vendor settings to disk' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: 'The vendor settings have been updated successfully.',
    });
  } catch (error: any) {
    console.error('Error updating vendor settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update vendor settings' },
      { status: 500 }
    );
  }
}
