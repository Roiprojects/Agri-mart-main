import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'dev-database.json');

export interface ForumSettingsData {
  // Common
  forumsEnabled: boolean;
  relativeDateTimeFormatting: boolean;
  signatureEnabled: boolean;
  showCustomersPostCount: boolean;
  forumEditor: string;

  // Permissions
  allowGuestsToCreatePosts: boolean;
  allowGuestsToCreateTopics: boolean;
  allowCustomersToEditPosts: boolean;
  allowCustomersToDeletePosts: boolean;
  allowCustomersToManageForumSubscriptions: boolean;
  allowUsersToVoteForPosts: boolean;
  maximumVotesPerDay: number;
  allowPrivateMessages: boolean;
  showAlertForPM: boolean;
  notifyAboutPrivateMessages: boolean;

  // Page sizes
  topicsPageSize: number;
  postsPageSize: number;
  searchResultsPageSize: number;
  activeDiscussionsPageSize: number;

  // Feeds
  forumFeedsEnabled: boolean;
  forumFeedCount: number;
  activeDiscussionsFeedEnabled: boolean;
  activeDiscussionsFeedCount: number;

  // Mode
  isAdvanced: boolean;
}

const DEFAULT_FORUM_SETTINGS: ForumSettingsData = {
  forumsEnabled: false,
  relativeDateTimeFormatting: true,
  signatureEnabled: true,
  showCustomersPostCount: true,
  forumEditor: 'BBCode editor',

  allowGuestsToCreatePosts: false,
  allowGuestsToCreateTopics: false,
  allowCustomersToEditPosts: false,
  allowCustomersToDeletePosts: false,
  allowCustomersToManageForumSubscriptions: false,
  allowUsersToVoteForPosts: true,
  maximumVotesPerDay: 30,
  allowPrivateMessages: true,
  showAlertForPM: false,
  notifyAboutPrivateMessages: false,

  topicsPageSize: 10,
  postsPageSize: 10,
  searchResultsPageSize: 10,
  activeDiscussionsPageSize: 50,

  forumFeedsEnabled: true,
  forumFeedCount: 10,
  activeDiscussionsFeedEnabled: true,
  activeDiscussionsFeedCount: 25,

  isAdvanced: true,
};

function readDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed reading DB file for forum settings:', err);
  }
  return {};
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed writing DB file for forum settings:', err);
    return false;
  }
}

export async function GET() {
  try {
    const db = readDb();
    const forumSettings = db.forumSettings || DEFAULT_FORUM_SETTINGS;
    return NextResponse.json({
      success: true,
      data: { ...DEFAULT_FORUM_SETTINGS, ...forumSettings },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch forum settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = readDb();
    const current = db.forumSettings || DEFAULT_FORUM_SETTINGS;
    const updated = {
      ...current,
      ...body,
    };
    db.forumSettings = updated;
    const success = writeDb(db);
    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Failed to write forum settings to database' },
        { status: 500 }
      );
    }
    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Forum settings saved successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to save forum settings' },
      { status: 500 }
    );
  }
}
