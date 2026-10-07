'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  Info,
  Shield,
  FileText,
  Rss,
} from 'lucide-react';

function HelpTooltip({ text }: { text: string }) {
  return (
    <span
      title={text}
      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] font-bold cursor-help shrink-0 select-none shadow-2xs"
    >
      ?
    </span>
  );
}

export default function ForumSettingsPage() {
  const [isAdvanced, setIsAdvanced] = useState(true);

  // Collapse states
  const [commonOpen, setCommonOpen] = useState(true);
  const [permissionsOpen, setPermissionsOpen] = useState(true);
  const [pageSizesOpen, setPageSizesOpen] = useState(true);
  const [feedsOpen, setFeedsOpen] = useState(true);

  // Card 1: Common Settings (media_1791364921726.png & media_1791364927266.png)
  const [forumsEnabled, setForumsEnabled] = useState(false);
  const [relativeDateTimeFormatting, setRelativeDateTimeFormatting] = useState(true);
  const [signatureEnabled, setSignatureEnabled] = useState(true);
  const [showCustomersPostCount, setShowCustomersPostCount] = useState(true);
  const [forumEditor, setForumEditor] = useState('BBCode editor');

  // Card 2: Permissions (media_1791364921726.png & media_1791364927266.png)
  const [allowGuestsToCreatePosts, setAllowGuestsToCreatePosts] = useState(false);
  const [allowGuestsToCreateTopics, setAllowGuestsToCreateTopics] = useState(false);
  const [allowCustomersToEditPosts, setAllowCustomersToEditPosts] = useState(false);
  const [allowCustomersToDeletePosts, setAllowCustomersToDeletePosts] = useState(false);
  const [allowCustomersToManageForumSubscriptions, setAllowCustomersToManageForumSubscriptions] = useState(false);
  const [allowUsersToVoteForPosts, setAllowUsersToVoteForPosts] = useState(true);
  const [maximumVotesPerDay, setMaximumVotesPerDay] = useState<number | string>(30);
  const [allowPrivateMessages, setAllowPrivateMessages] = useState(true);
  const [showAlertForPM, setShowAlertForPM] = useState(false);
  const [notifyAboutPrivateMessages, setNotifyAboutPrivateMessages] = useState(false);

  // Card 3: Page sizes (media_1791364924910.png)
  const [topicsPageSize, setTopicsPageSize] = useState<number | string>(10);
  const [postsPageSize, setPostsPageSize] = useState<number | string>(10);
  const [searchResultsPageSize, setSearchResultsPageSize] = useState<number | string>(10);
  const [activeDiscussionsPageSize, setActiveDiscussionsPageSize] = useState<number | string>(50);

  // Card 4: Feeds (media_1791364924910.png)
  const [forumFeedsEnabled, setForumFeedsEnabled] = useState(true);
  const [forumFeedCount, setForumFeedCount] = useState<number | string>(10);
  const [activeDiscussionsFeedEnabled, setActiveDiscussionsFeedEnabled] = useState(true);
  const [activeDiscussionsFeedCount, setActiveDiscussionsFeedCount] = useState<number | string>(25);

  // Status & Notification
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings/forum');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const d = json.data;
            if (d.forumsEnabled !== undefined) setForumsEnabled(d.forumsEnabled);
            if (d.relativeDateTimeFormatting !== undefined) setRelativeDateTimeFormatting(d.relativeDateTimeFormatting);
            if (d.signatureEnabled !== undefined) setSignatureEnabled(d.signatureEnabled);
            if (d.showCustomersPostCount !== undefined) setShowCustomersPostCount(d.showCustomersPostCount);
            if (d.forumEditor !== undefined) setForumEditor(d.forumEditor);

            if (d.allowGuestsToCreatePosts !== undefined) setAllowGuestsToCreatePosts(d.allowGuestsToCreatePosts);
            if (d.allowGuestsToCreateTopics !== undefined) setAllowGuestsToCreateTopics(d.allowGuestsToCreateTopics);
            if (d.allowCustomersToEditPosts !== undefined) setAllowCustomersToEditPosts(d.allowCustomersToEditPosts);
            if (d.allowCustomersToDeletePosts !== undefined) setAllowCustomersToDeletePosts(d.allowCustomersToDeletePosts);
            if (d.allowCustomersToManageForumSubscriptions !== undefined) setAllowCustomersToManageForumSubscriptions(d.allowCustomersToManageForumSubscriptions);
            if (d.allowUsersToVoteForPosts !== undefined) setAllowUsersToVoteForPosts(d.allowUsersToVoteForPosts);
            if (d.maximumVotesPerDay !== undefined) setMaximumVotesPerDay(d.maximumVotesPerDay);
            if (d.allowPrivateMessages !== undefined) setAllowPrivateMessages(d.allowPrivateMessages);
            if (d.showAlertForPM !== undefined) setShowAlertForPM(d.showAlertForPM);
            if (d.notifyAboutPrivateMessages !== undefined) setNotifyAboutPrivateMessages(d.notifyAboutPrivateMessages);

            if (d.topicsPageSize !== undefined) setTopicsPageSize(d.topicsPageSize);
            if (d.postsPageSize !== undefined) setPostsPageSize(d.postsPageSize);
            if (d.searchResultsPageSize !== undefined) setSearchResultsPageSize(d.searchResultsPageSize);
            if (d.activeDiscussionsPageSize !== undefined) setActiveDiscussionsPageSize(d.activeDiscussionsPageSize);

            if (d.forumFeedsEnabled !== undefined) setForumFeedsEnabled(d.forumFeedsEnabled);
            if (d.forumFeedCount !== undefined) setForumFeedCount(d.forumFeedCount);
            if (d.activeDiscussionsFeedEnabled !== undefined) setActiveDiscussionsFeedEnabled(d.activeDiscussionsFeedEnabled);
            if (d.activeDiscussionsFeedCount !== undefined) setActiveDiscussionsFeedCount(d.activeDiscussionsFeedCount);

            if (d.isAdvanced !== undefined) setIsAdvanced(d.isAdvanced);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch forum settings from API, using localStorage...', err);
      }

      // Local storage fallback
      const saved = localStorage.getItem('admin_forum_settings');
      if (saved) {
        try {
          const d = JSON.parse(saved);
          if (d.forumsEnabled !== undefined) setForumsEnabled(d.forumsEnabled);
          if (d.relativeDateTimeFormatting !== undefined) setRelativeDateTimeFormatting(d.relativeDateTimeFormatting);
          if (d.signatureEnabled !== undefined) setSignatureEnabled(d.signatureEnabled);
          if (d.showCustomersPostCount !== undefined) setShowCustomersPostCount(d.showCustomersPostCount);
          if (d.forumEditor !== undefined) setForumEditor(d.forumEditor);

          if (d.allowGuestsToCreatePosts !== undefined) setAllowGuestsToCreatePosts(d.allowGuestsToCreatePosts);
          if (d.allowGuestsToCreateTopics !== undefined) setAllowGuestsToCreateTopics(d.allowGuestsToCreateTopics);
          if (d.allowCustomersToEditPosts !== undefined) setAllowCustomersToEditPosts(d.allowCustomersToEditPosts);
          if (d.allowCustomersToDeletePosts !== undefined) setAllowCustomersToDeletePosts(d.allowCustomersToDeletePosts);
          if (d.allowCustomersToManageForumSubscriptions !== undefined) setAllowCustomersToManageForumSubscriptions(d.allowCustomersToManageForumSubscriptions);
          if (d.allowUsersToVoteForPosts !== undefined) setAllowUsersToVoteForPosts(d.allowUsersToVoteForPosts);
          if (d.maximumVotesPerDay !== undefined) setMaximumVotesPerDay(d.maximumVotesPerDay);
          if (d.allowPrivateMessages !== undefined) setAllowPrivateMessages(d.allowPrivateMessages);
          if (d.showAlertForPM !== undefined) setShowAlertForPM(d.showAlertForPM);
          if (d.notifyAboutPrivateMessages !== undefined) setNotifyAboutPrivateMessages(d.notifyAboutPrivateMessages);

          if (d.topicsPageSize !== undefined) setTopicsPageSize(d.topicsPageSize);
          if (d.postsPageSize !== undefined) setPostsPageSize(d.postsPageSize);
          if (d.searchResultsPageSize !== undefined) setSearchResultsPageSize(d.searchResultsPageSize);
          if (d.activeDiscussionsPageSize !== undefined) setActiveDiscussionsPageSize(d.activeDiscussionsPageSize);

          if (d.forumFeedsEnabled !== undefined) setForumFeedsEnabled(d.forumFeedsEnabled);
          if (d.forumFeedCount !== undefined) setForumFeedCount(d.forumFeedCount);
          if (d.activeDiscussionsFeedEnabled !== undefined) setActiveDiscussionsFeedEnabled(d.activeDiscussionsFeedEnabled);
          if (d.activeDiscussionsFeedCount !== undefined) setActiveDiscussionsFeedCount(d.activeDiscussionsFeedCount);

          if (d.isAdvanced !== undefined) setIsAdvanced(d.isAdvanced);
        } catch {
          // ignore error
        }
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      forumsEnabled,
      relativeDateTimeFormatting,
      signatureEnabled,
      showCustomersPostCount,
      forumEditor,

      allowGuestsToCreatePosts,
      allowGuestsToCreateTopics,
      allowCustomersToEditPosts,
      allowCustomersToDeletePosts,
      allowCustomersToManageForumSubscriptions,
      allowUsersToVoteForPosts,
      maximumVotesPerDay: Number(maximumVotesPerDay) || 0,
      allowPrivateMessages,
      showAlertForPM,
      notifyAboutPrivateMessages,

      topicsPageSize: Number(topicsPageSize) || 0,
      postsPageSize: Number(postsPageSize) || 0,
      searchResultsPageSize: Number(searchResultsPageSize) || 0,
      activeDiscussionsPageSize: Number(activeDiscussionsPageSize) || 0,

      forumFeedsEnabled,
      forumFeedCount: Number(forumFeedCount) || 0,
      activeDiscussionsFeedEnabled,
      activeDiscussionsFeedCount: Number(activeDiscussionsFeedCount) || 0,

      isAdvanced,
    };

    try {
      localStorage.setItem('admin_forum_settings', JSON.stringify(payload));

      const res = await fetch('/api/admin/settings/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast('Forum settings have been updated successfully.');
      } else {
        showToast('Settings saved locally, but server update failed.', 'error');
      }
    } catch {
      showToast('Settings saved locally (server unreachable).', 'success');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded shadow-lg text-sm text-white transition-all transform duration-300 ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Bar matching Reference: Title + Save Button + Basic/Advanced Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
        <h1 className="text-xl font-normal text-slate-800">Forum settings</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center px-3.5 py-1.5 bg-[#2489c5] hover:bg-[#207ba5] text-white text-xs font-medium rounded shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Mode Switcher Pill */}
      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={() => setIsAdvanced(!isAdvanced)}
          className={`inline-flex items-center justify-between px-2.5 py-1 rounded-[3px] text-xs font-normal border transition-colors duration-150 cursor-pointer select-none w-[94px] h-[28px] shadow-2xs ${
            isAdvanced
              ? 'bg-[#2489c5] border-[#2080b9] text-white hover:bg-[#1f72a3]'
              : 'bg-[#f8fafc] border-[#2489c5] text-[#2489c5] hover:bg-slate-100'
          }`}
          title="Toggle Basic / Advanced mode"
        >
          {isAdvanced ? (
            <>
              <span className="text-white text-xs font-normal pl-0.5">Advanced</span>
              <span className="w-3.5 h-[18px] rounded-[2px] bg-white shadow-2xs" />
            </>
          ) : (
            <>
              <span className="w-3.5 h-[18px] rounded-full border border-slate-400 bg-white shadow-2xs" />
              <span className="text-[#2489c5] text-xs font-normal pr-0.5">Basic</span>
            </>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* CARD 1: COMMON (Matching media_1791364921726.png & media_1791364927266.png)*/}
      {/* ========================================================================= */}
      <div className="bg-white rounded border border-slate-200 border-t-3 border-t-[#00c0ef] shadow-2xs overflow-hidden">
        <div
          onClick={() => setCommonOpen(!commonOpen)}
          className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <Info className="w-4 h-4 text-slate-500" />
            <span>Common</span>
          </div>
          <div className="text-slate-400 hover:text-slate-600">
            {commonOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </div>
        </div>

        {commonOpen && (
          <div className="p-6 space-y-4">
            {/* 1. Forums enabled (Basic & Advanced) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                <span>Forums enabled</span>
                <HelpTooltip text="Check to enable forums." />
              </div>
              <div className="md:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={forumsEnabled}
                  onChange={(e) => setForumsEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* 2. Relative date and time formatting (Advanced only) */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Relative date and time formatting</span>
                  <HelpTooltip text="Check to format dates/times relative to the current time (e.g. 2 hours ago)." />
                </div>
                <div className="md:col-span-9 flex items-center">
                  <input
                    type="checkbox"
                    checked={relativeDateTimeFormatting}
                    onChange={(e) => setRelativeDateTimeFormatting(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* 3. Signature enabled (Basic & Advanced) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                <span>Signature enabled</span>
                <HelpTooltip text="Check to enable signatures for customers." />
              </div>
              <div className="md:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={signatureEnabled}
                  onChange={(e) => setSignatureEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Advanced Only Fields in Card 1 */}
            {isAdvanced && (
              <>
                {/* 4. Show customers post count */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Show customers post count</span>
                    <HelpTooltip text="Check to show customers' forum post count." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={showCustomersPostCount}
                      onChange={(e) => setShowCustomersPostCount(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 5. Forum editor */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Forum editor</span>
                    <HelpTooltip text="Choose the editor type for creating and editing forum posts." />
                  </div>
                  <div className="md:col-span-9">
                    <select
                      value={forumEditor}
                      onChange={(e) => setForumEditor(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    >
                      <option value="BBCode editor">BBCode editor</option>
                      <option value="HTML editor">HTML editor</option>
                      <option value="Simple text box">Simple text box</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* CARD 2: PERMISSIONS (Matching media_1791364921726.png & media_1791364927266.png) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded border border-slate-200 border-t-3 border-t-[#00c0ef] shadow-2xs overflow-hidden">
        <div
          onClick={() => setPermissionsOpen(!permissionsOpen)}
          className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <Shield className="w-4 h-4 text-slate-500" />
            <span>Permissions</span>
          </div>
          <div className="text-slate-400 hover:text-slate-600">
            {permissionsOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </div>
        </div>

        {permissionsOpen && (
          <div className="p-6 space-y-4">
            {/* Advanced Only Permissions Fields 1 to 5 */}
            {isAdvanced && (
              <>
                {/* 1. Allow guests to create posts */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Allow guests to create posts</span>
                    <HelpTooltip text="Check to allow guests to create new posts." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={allowGuestsToCreatePosts}
                      onChange={(e) => setAllowGuestsToCreatePosts(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 2. Allow guests to create topics */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Allow guests to create topics</span>
                    <HelpTooltip text="Check to allow guests to create new topics." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={allowGuestsToCreateTopics}
                      onChange={(e) => setAllowGuestsToCreateTopics(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 3. Allow customers to edit posts */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Allow customers to edit posts</span>
                    <HelpTooltip text="Check to allow customers to edit their own posts." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={allowCustomersToEditPosts}
                      onChange={(e) => setAllowCustomersToEditPosts(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 4. Allow customers to delete posts */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Allow customers to delete posts</span>
                    <HelpTooltip text="Check to allow customers to delete their own posts." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={allowCustomersToDeletePosts}
                      onChange={(e) => setAllowCustomersToDeletePosts(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 5. Allow customers to manage forum subscriptions */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <div className="flex flex-col items-end leading-tight">
                      <span>Allow customers to manage forum</span>
                      <span>subscriptions</span>
                    </div>
                    <HelpTooltip text="Check to allow customers to manage forum and topic subscriptions." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={allowCustomersToManageForumSubscriptions}
                      onChange={(e) => setAllowCustomersToManageForumSubscriptions(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              </>
            )}

            {/* 6. Allow users to vote for posts (Basic & Advanced) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                <span>Allow users to vote for posts</span>
                <HelpTooltip text="Check to allow users to vote for posts (rate posts)." />
              </div>
              <div className="md:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={allowUsersToVoteForPosts}
                  onChange={(e) => setAllowUsersToVoteForPosts(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Subfield: Maximum votes per day (Advanced only with Branch Tree Connector) */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Maximum votes per day</span>
                  <HelpTooltip text="Set maximum number of votes allowed per customer per day." />
                </div>
                <div className="md:col-span-9 relative pl-5">
                  <div
                    className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="number"
                    value={maximumVotesPerDay}
                    onChange={(e) => setMaximumVotesPerDay(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>
            )}

            {/* 7. Allow private messages (Basic & Advanced) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                <span>Allow private messages</span>
                <HelpTooltip text="Check to allow customers to send private messages to each other." />
              </div>
              <div className="md:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={allowPrivateMessages}
                  onChange={(e) => setAllowPrivateMessages(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Subfield 1: Show alert for PM (Advanced only with Branch Tree Connector) */}
            {isAdvanced && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Show alert for PM</span>
                    <HelpTooltip text="Check to show a pop-up alert when a customer receives a new private message." />
                  </div>
                  <div className="md:col-span-9 relative pl-5 flex items-center">
                    <div
                      className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="checkbox"
                      checked={showAlertForPM}
                      onChange={(e) => setShowAlertForPM(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Subfield 2: Notify about private messages (Advanced only with Branch Tree Connector) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Notify about private messages</span>
                    <HelpTooltip text="Check to send an email notification when a customer receives a new private message." />
                  </div>
                  <div className="md:col-span-9 relative pl-5 flex items-center">
                    <div
                      className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="checkbox"
                      checked={notifyAboutPrivateMessages}
                      onChange={(e) => setNotifyAboutPrivateMessages(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* CARD 3: PAGE SIZES (Advanced only, matching media_1791364924910.png) */}
      {/* ========================================================================= */}
      {isAdvanced && (
        <div className="bg-white rounded border border-slate-200 border-t-3 border-t-[#00c0ef] shadow-2xs overflow-hidden">
          <div
            onClick={() => setPageSizesOpen(!pageSizesOpen)}
            className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Page sizes</span>
            </div>
            <div className="text-slate-400 hover:text-slate-600">
              {pageSizesOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </div>

          {pageSizesOpen && (
            <div className="p-6 space-y-4">
              {/* 1. Topics page size */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Topics page size</span>
                  <HelpTooltip text="Set the number of topics to display per page in a forum." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="number"
                    value={topicsPageSize}
                    onChange={(e) => setTopicsPageSize(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* 2. Posts page size */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Posts page size</span>
                  <HelpTooltip text="Set the number of posts to display per page in a topic." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="number"
                    value={postsPageSize}
                    onChange={(e) => setPostsPageSize(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* 3. Search results page size */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Search results page size</span>
                  <HelpTooltip text="Set the number of results to display per page in forum search." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="number"
                    value={searchResultsPageSize}
                    onChange={(e) => setSearchResultsPageSize(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* 4. Active discussions page size */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Active discussions page size</span>
                  <HelpTooltip text="Set the number of topics to display per page in the active discussions page." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="number"
                    value={activeDiscussionsPageSize}
                    onChange={(e) => setActiveDiscussionsPageSize(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* CARD 4: FEEDS (Advanced only, matching media_1791364924910.png) */}
      {/* ========================================================================= */}
      {isAdvanced && (
        <div className="bg-white rounded border border-slate-200 border-t-3 border-t-[#00c0ef] shadow-2xs overflow-hidden">
          <div
            onClick={() => setFeedsOpen(!feedsOpen)}
            className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <Rss className="w-4 h-4 text-slate-500" />
              <span>Feeds</span>
            </div>
            <div className="text-slate-400 hover:text-slate-600">
              {feedsOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </div>

          {feedsOpen && (
            <div className="p-6 space-y-4">
              {/* 1. Forum feeds enabled */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Forum feeds enabled</span>
                  <HelpTooltip text="Check to enable RSS feeds for forums." />
                </div>
                <div className="md:col-span-9 flex items-center">
                  <input
                    type="checkbox"
                    checked={forumFeedsEnabled}
                    onChange={(e) => setForumFeedsEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Subfield: Forum feed count with Branch Tree Connector */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Forum feed count</span>
                  <HelpTooltip text="Set the number of items to include in the forum RSS feed." />
                </div>
                <div className="md:col-span-9 relative pl-5">
                  <div
                    className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="number"
                    value={forumFeedCount}
                    onChange={(e) => setForumFeedCount(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* 2. Active discussions feed enabled */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Active discussions feed enabled</span>
                  <HelpTooltip text="Check to enable RSS feeds for active discussions." />
                </div>
                <div className="md:col-span-9 flex items-center">
                  <input
                    type="checkbox"
                    checked={activeDiscussionsFeedEnabled}
                    onChange={(e) => setActiveDiscussionsFeedEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Subfield: Active discussions feed count with Branch Tree Connector */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>Active discussions feed count</span>
                  <HelpTooltip text="Set the number of items to include in the active discussions RSS feed." />
                </div>
                <div className="md:col-span-9 relative pl-5">
                  <div
                    className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="number"
                    value={activeDiscussionsFeedCount}
                    onChange={(e) => setActiveDiscussionsFeedCount(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
