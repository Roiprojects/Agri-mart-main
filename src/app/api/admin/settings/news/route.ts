import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/dev-db';


export interface NewsSettingsData {
  // Common
  newsEnabled: boolean;
  showOnHomePage: boolean;
  numberOfItemsToDisplay: number;
  newsArchivePageSize: number;
  displayNewsRssFeedLink: boolean;

  // News comments
  allowGuestsToLeaveComments: boolean;
  newsCommentsMustBeApproved: boolean;
  notifyAboutNewNewsComments: boolean;
  newsCommentsPerStore: boolean;

  // Mode
  isAdvanced: boolean;
}

const DEFAULT_NEWS_SETTINGS: NewsSettingsData = {
  newsEnabled: true,
  showOnHomePage: false,
  numberOfItemsToDisplay: 3,
  newsArchivePageSize: 10,
  displayNewsRssFeedLink: false,

  allowGuestsToLeaveComments: true,
  newsCommentsMustBeApproved: false,
  notifyAboutNewNewsComments: false,
  newsCommentsPerStore: false,

  isAdvanced: true,
};

export async function GET() {
  try {
    const db = readDb();
    const settings: NewsSettingsData = {
      ...DEFAULT_NEWS_SETTINGS,
      ...(db.newsSettings || {}),
    };
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch news settings' },
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

    const currentSettings = db.newsSettings || DEFAULT_NEWS_SETTINGS;
    const updatedSettings: NewsSettingsData = {
      ...DEFAULT_NEWS_SETTINGS,
      ...currentSettings,
      ...body,
    };

    db.newsSettings = updatedSettings;

    const ok = writeDb(db);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to write news settings to disk' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: 'The news settings have been updated successfully.',
    });
  } catch (error: any) {
    console.error('Error updating news settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update news settings' },
      { status: 500 }
    );
  }
}
