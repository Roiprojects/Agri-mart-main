import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/dev-db';


export interface BlogSettingsData {
  // Common
  blogEnabled: boolean;
  postsPageSize: number;
  numberOfTagsCloud: number;
  displayBlogRssFeedLink: boolean;

  // Blog comments
  allowGuestsToLeaveComments: boolean;
  blogCommentsMustBeApproved: boolean;
  notifyAboutNewBlogComments: boolean;
  blogCommentsPerStore: boolean;

  // Mode
  isAdvanced: boolean;
}

const DEFAULT_BLOG_SETTINGS: BlogSettingsData = {
  blogEnabled: true,
  postsPageSize: 10,
  numberOfTagsCloud: 15,
  displayBlogRssFeedLink: false,

  allowGuestsToLeaveComments: true,
  blogCommentsMustBeApproved: false,
  notifyAboutNewBlogComments: false,
  blogCommentsPerStore: false,

  isAdvanced: true,
};

export async function GET() {
  try {
    const db = readDb();
    const settings: BlogSettingsData = {
      ...DEFAULT_BLOG_SETTINGS,
      ...(db.blogSettings || {}),
    };
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch blog settings' },
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

    const currentSettings = db.blogSettings || DEFAULT_BLOG_SETTINGS;
    const updatedSettings: BlogSettingsData = {
      ...DEFAULT_BLOG_SETTINGS,
      ...currentSettings,
      ...body,
    };

    db.blogSettings = updatedSettings;

    const ok = writeDb(db);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to write blog settings to disk' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: 'The blog settings have been updated successfully.',
    });
  } catch (error: any) {
    console.error('Error updating blog settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update blog settings' },
      { status: 500 }
    );
  }
}
