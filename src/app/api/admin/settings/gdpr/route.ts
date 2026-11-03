import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/dev-db';


export interface GdprConsentItem {
  id: string;
  message: string;
  isRequired: boolean;
  displayDuringRegistration: boolean;
  displayOnCustomerInfoPage: boolean;
  displayOrder: number;
  locales?: {
    en?: { message: string };
    rtl?: { message: string };
  };
}

export interface GdprSettingsData {
  // Common
  gdprEnabled: boolean;
  logAcceptPrivacyPolicyConsent: boolean;
  logNewsletterConsent: boolean;
  logUserProfileChanges: boolean;
  deleteInactiveCustomersAfterMonths: number;

  // Consents
  consents: GdprConsentItem[];

  // Mode
  isAdvanced: boolean;
}

const DEFAULT_GDPR_SETTINGS: GdprSettingsData = {
  gdprEnabled: true,
  logAcceptPrivacyPolicyConsent: true,
  logNewsletterConsent: true,
  logUserProfileChanges: true,
  deleteInactiveCustomersAfterMonths: 36,
  consents: [],
  isAdvanced: true,
};

export async function GET() {
  try {
    const db = readDb();
    const settings: GdprSettingsData = {
      ...DEFAULT_GDPR_SETTINGS,
      ...(db.gdprSettings || {}),
      consents: db.gdprSettings?.consents || DEFAULT_GDPR_SETTINGS.consents,
    };
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch GDPR settings' },
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

    const currentSettings = db.gdprSettings || DEFAULT_GDPR_SETTINGS;
    const updatedSettings: GdprSettingsData = {
      ...DEFAULT_GDPR_SETTINGS,
      ...currentSettings,
      ...body,
      consents: body.consents !== undefined ? body.consents : (currentSettings.consents || []),
    };

    db.gdprSettings = updatedSettings;

    const ok = writeDb(db);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to write GDPR settings to disk' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: 'The GDPR settings have been updated successfully.',
    });
  } catch (error: any) {
    console.error('Error updating GDPR settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update GDPR settings' },
      { status: 500 }
    );
  }
}
