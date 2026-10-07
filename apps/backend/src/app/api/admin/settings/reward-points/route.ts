import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'dev-database.json');

export interface RewardPointsSettingsData {
  // Common (Basic & Advanced)
  enabled: boolean;
  exchangeRate: number;

  // Common (Advanced only)
  minimumRewardPointsToUse: number;
  maximumRewardPointsToUsePerOrder: number;
  maximumRedeemedRate: number;

  // Earning Reward Points (Basic & Advanced)
  pointsForPurchasesAmount: number;
  pointsForPurchasesPoints: number;

  // Earning Reward Points (Advanced only)
  purchasesPointsValidity: number;
  minimumOrderTotal: number;
  pointsForRegistration: number;
  registrationPointsValidity: number;
  activatePointsImmediately: boolean;
  displayHowMuchWillBeEarned: boolean;
  pointsAccumulatedForAllStores: boolean;
  pageSize: number;

  // UI state
  isAdvanced: boolean;
}

const DEFAULT_REWARD_POINTS_SETTINGS: RewardPointsSettingsData = {
  // Common defaults (Matching media_1791358943397.png)
  enabled: true,
  exchangeRate: 1,
  minimumRewardPointsToUse: 0,
  maximumRewardPointsToUsePerOrder: 0,
  maximumRedeemedRate: 0,

  // Earning defaults (Matching media_1791358945223.png)
  pointsForPurchasesAmount: 10,
  pointsForPurchasesPoints: 1,
  purchasesPointsValidity: 45,
  minimumOrderTotal: 0,
  pointsForRegistration: 0,
  registrationPointsValidity: 30,
  activatePointsImmediately: true,
  displayHowMuchWillBeEarned: true,
  pointsAccumulatedForAllStores: true,
  pageSize: 10,

  // UI state default
  isAdvanced: true,
};

function readDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed reading DB file for reward points settings:', err);
  }
  return {};
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed writing DB file for reward points settings:', err);
    return false;
  }
}

export async function GET() {
  try {
    const db = readDb();
    const settings: RewardPointsSettingsData = {
      ...DEFAULT_REWARD_POINTS_SETTINGS,
      ...(db.rewardPointsSettings || {}),
    };
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch reward points settings' },
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

    const currentSettings = db.rewardPointsSettings || DEFAULT_REWARD_POINTS_SETTINGS;
    const updatedSettings: RewardPointsSettingsData = {
      ...DEFAULT_REWARD_POINTS_SETTINGS,
      ...currentSettings,
      ...body,
    };

    db.rewardPointsSettings = updatedSettings;

    const ok = writeDb(db);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to write reward points settings to disk' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: 'The reward points settings have been updated successfully.',
    });
  } catch (error: any) {
    console.error('Error updating reward points settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update reward points settings' },
      { status: 500 }
    );
  }
}
