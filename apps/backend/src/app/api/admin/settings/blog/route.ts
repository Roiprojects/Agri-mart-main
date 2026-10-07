import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'dev-database.json');

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

function readDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed reading DB file for blog settings:', err);
  }
  return {};
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed writing DB file for blog settings:', err);
    return false;
  }
}

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
