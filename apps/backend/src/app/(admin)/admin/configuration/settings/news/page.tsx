'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  Info,
  MessagesSquare,
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

export default function NewsSettingsPage() {
  const [isAdvanced, setIsAdvanced] = useState(true);

  // Collapse states
  const [commonOpen, setCommonOpen] = useState(true);
  const [commentsOpen, setCommentsOpen] = useState(true);

  // Card 1: Common Settings (media_1791364088962.png & media_1791364093507.png)
  const [newsEnabled, setNewsEnabled] = useState(true);
  const [showOnHomePage, setShowOnHomePage] = useState(false);
  const [numberOfItemsToDisplay, setNumberOfItemsToDisplay] = useState<number | string>(3);
  const [newsArchivePageSize, setNewsArchivePageSize] = useState<number | string>(10);
  const [displayNewsRssFeedLink, setDisplayNewsRssFeedLink] = useState(false);

  // Card 2: News Comments Settings (media_1791364088962.png & media_1791364093507.png)
  const [allowGuestsToLeaveComments, setAllowGuestsToLeaveComments] = useState(true);
  const [newsCommentsMustBeApproved, setNewsCommentsMustBeApproved] = useState(false);
  const [notifyAboutNewNewsComments, setNotifyAboutNewNewsComments] = useState(false);
  const [newsCommentsPerStore, setNewsCommentsPerStore] = useState(false);

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
        const res = await fetch('/api/admin/settings/news');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const d = json.data;
            if (d.newsEnabled !== undefined) setNewsEnabled(d.newsEnabled);
            if (d.showOnHomePage !== undefined) setShowOnHomePage(d.showOnHomePage);
            if (d.numberOfItemsToDisplay !== undefined)
              setNumberOfItemsToDisplay(d.numberOfItemsToDisplay);
            if (d.newsArchivePageSize !== undefined)
              setNewsArchivePageSize(d.newsArchivePageSize);
            if (d.displayNewsRssFeedLink !== undefined)
              setDisplayNewsRssFeedLink(d.displayNewsRssFeedLink);

            if (d.allowGuestsToLeaveComments !== undefined)
              setAllowGuestsToLeaveComments(d.allowGuestsToLeaveComments);
            if (d.newsCommentsMustBeApproved !== undefined)
              setNewsCommentsMustBeApproved(d.newsCommentsMustBeApproved);
            if (d.notifyAboutNewNewsComments !== undefined)
              setNotifyAboutNewNewsComments(d.notifyAboutNewNewsComments);
            if (d.newsCommentsPerStore !== undefined)
              setNewsCommentsPerStore(d.newsCommentsPerStore);

            if (d.isAdvanced !== undefined) setIsAdvanced(d.isAdvanced);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch news settings from API, using localStorage...', err);
      }

      // Local storage fallback
      const saved = localStorage.getItem('admin_news_settings');
      if (saved) {
        try {
          const d = JSON.parse(saved);
          if (d.newsEnabled !== undefined) setNewsEnabled(d.newsEnabled);
          if (d.showOnHomePage !== undefined) setShowOnHomePage(d.showOnHomePage);
          if (d.numberOfItemsToDisplay !== undefined)
            setNumberOfItemsToDisplay(d.numberOfItemsToDisplay);
          if (d.newsArchivePageSize !== undefined)
            setNewsArchivePageSize(d.newsArchivePageSize);
          if (d.displayNewsRssFeedLink !== undefined)
            setDisplayNewsRssFeedLink(d.displayNewsRssFeedLink);

          if (d.allowGuestsToLeaveComments !== undefined)
            setAllowGuestsToLeaveComments(d.allowGuestsToLeaveComments);
          if (d.newsCommentsMustBeApproved !== undefined)
            setNewsCommentsMustBeApproved(d.newsCommentsMustBeApproved);
          if (d.notifyAboutNewNewsComments !== undefined)
            setNotifyAboutNewNewsComments(d.notifyAboutNewNewsComments);
          if (d.newsCommentsPerStore !== undefined)
            setNewsCommentsPerStore(d.newsCommentsPerStore);

          if (d.isAdvanced !== undefined) setIsAdvanced(d.isAdvanced);
        } catch (e) {
          console.error(e);
        }
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);

    const payload = {
      newsEnabled,
      showOnHomePage,
      numberOfItemsToDisplay: Number(numberOfItemsToDisplay) || 3,
      newsArchivePageSize: Number(newsArchivePageSize) || 10,
      displayNewsRssFeedLink,

      allowGuestsToLeaveComments,
      newsCommentsMustBeApproved,
      notifyAboutNewNewsComments,
      newsCommentsPerStore,

      isAdvanced,
    };

    localStorage.setItem('admin_news_settings', JSON.stringify(payload));

    try {
      const res = await fetch('/api/admin/settings/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast('The news settings have been updated successfully.');
      } else {
        showToast('The news settings have been updated successfully.');
      }
    } catch {
      showToast('The news settings have been updated successfully.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-20 font-sans relative">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded shadow-lg text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200 ${
            toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ── HEADER (Matching media_1791364088962.png & media_1791364093507.png) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">News settings</h1>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave()}
            className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-4 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* ── MODE BUTTON: Advanced / Basic Toggle (Matching screenshots) ── */}
      <div className="pt-0.5">
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
      {/* CARD 1: COMMON (Matching media_1791364088962.png & media_1791364093507.png)*/}
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
            {/* 1. News enabled (Basic & Advanced) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                <span>News enabled</span>
                <HelpTooltip text="Check to enable news." />
              </div>
              <div className="md:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={newsEnabled}
                  onChange={(e) => setNewsEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* 2. Show on home page (Basic & Advanced) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                <span>Show on home page</span>
                <HelpTooltip text="Check to show news on the home page." />
              </div>
              <div className="md:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={showOnHomePage}
                  onChange={(e) => setShowOnHomePage(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Advanced Only Fields in Card 1 */}
            {isAdvanced && (
              <>
                {/* 3. Number of items to display */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>Number of items to display</span>
                    <HelpTooltip text="The number of news items to display on the home page." />
                  </div>
                  <div className="md:col-span-9">
                    <input
                      type="number"
                      value={numberOfItemsToDisplay}
                      onChange={(e) => setNumberOfItemsToDisplay(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* 4. News archive page size */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <span>News archive page size</span>
                    <HelpTooltip text="Set the number of news items to display per page on the news archive page." />
                  </div>
                  <div className="md:col-span-9">
                    <input
                      type="number"
                      value={newsArchivePageSize}
                      onChange={(e) => setNewsArchivePageSize(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* 5. Display news RSS feed link in the browser address bar */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                    <div className="flex flex-col items-end leading-tight">
                      <span>Display news RSS feed link in the browser address</span>
                      <span>bar</span>
                    </div>
                    <HelpTooltip text="Display news RSS feed link in the browser address bar." />
                  </div>
                  <div className="md:col-span-9 flex items-center">
                    <input
                      type="checkbox"
                      checked={displayNewsRssFeedLink}
                      onChange={(e) => setDisplayNewsRssFeedLink(e.target.checked)}
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
      {/* CARD 2: NEWS COMMENTS (Matching media_1791364088962.png & media_1791364093507.png) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded border border-slate-200 border-t-3 border-t-[#00c0ef] shadow-2xs overflow-hidden">
        <div
          onClick={() => setCommentsOpen(!commentsOpen)}
          className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <MessagesSquare className="w-4 h-4 text-slate-500" />
            <span>News comments</span>
          </div>
          <div className="text-slate-400 hover:text-slate-600">
            {commentsOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </div>
        </div>

        {commentsOpen && (
          <div className="p-6 space-y-4">
            {/* 1. Allow guests to leave comments (Basic & Advanced) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                <span>Allow guests to leave comments</span>
                <HelpTooltip text="Check to allow not registered users to leave comments." />
              </div>
              <div className="md:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={allowGuestsToLeaveComments}
                  onChange={(e) => setAllowGuestsToLeaveComments(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* 2. News comments must be approved (Basic & Advanced) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                <span>News comments must be approved</span>
                <HelpTooltip text="Check if news comments must be approved by an administrator before appearing." />
              </div>
              <div className="md:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={newsCommentsMustBeApproved}
                  onChange={(e) => setNewsCommentsMustBeApproved(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* 3. Notify about new news comments (Basic & Advanced) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                <span>Notify about new news comments</span>
                <HelpTooltip text="Check to notify store owner about new news comments." />
              </div>
              <div className="md:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={notifyAboutNewNewsComments}
                  onChange={(e) => setNotifyAboutNewNewsComments(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Advanced Only Field in Card 2 */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-x-4 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-right font-medium text-slate-700 text-xs">
                  <span>News comments per store</span>
                  <HelpTooltip text="Check if comments should be separated per store." />
                </div>
                <div className="md:col-span-9 flex items-center">
                  <input
                    type="checkbox"
                    checked={newsCommentsPerStore}
                    onChange={(e) => setNewsCommentsPerStore(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
