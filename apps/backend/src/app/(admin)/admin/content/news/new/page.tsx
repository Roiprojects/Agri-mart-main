'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Save,
  ArrowLeft,
  Calendar,
  Search,
  Minus,
  Plus,
  Info,
  CheckCircle2,
  AlertCircle,
  Undo,
  Redo,
  Wand2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  Table as TableIcon,
  Link2,
  Image as ImageIcon,
  Video,
  Maximize2,
  Code,
  HelpCircle,
  ChevronDown,
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

export default function AddNewNewsItemPage() {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Section collapse state
  const [infoOpen, setInfoOpen] = useState(true);
  const [seoOpen, setSeoOpen] = useState(true);

  // Form Fields - Info
  const [language, setLanguage] = useState('EN');
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [fontSize, setFontSize] = useState('16');
  const [allowComments, setAllowComments] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [limitedToStores, setLimitedToStores] = useState('');
  const [published, setPublished] = useState(true);

  // Form Fields - SEO
  const [seName, setSeName] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // States
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Editor formatting helper
  const insertFormatting = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = fullDescription.substring(start, end);
    const replacement = `${before}${selected || 'text'}${after}`;
    const newText =
      fullDescription.substring(0, start) + replacement + fullDescription.substring(end);
    setFullDescription(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + (selected.length || 4));
    }, 50);
  };

  const handleSave = async (continueEditing: boolean = false) => {
    if (!title.trim()) {
      showToast('Title is required', 'error');
      return;
    }
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSaving(false);
    showToast('The new news item has been added successfully.');
    if (!continueEditing) {
      setTimeout(() => {
        router.push('/admin/content/news');
      }, 1200);
    }
  };

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-20 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded shadow-lg text-xs font-semibold transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
            toast.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-emerald-600 text-white'
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

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-normal text-slate-800 tracking-tight">
            Add a new news item
          </h1>
          <Link
            href="/admin/content/news"
            className="text-xs text-[#2489c5] hover:text-[#196b9c] hover:underline flex items-center gap-1 font-normal transition"
          >
            <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#2489c5] text-white text-[9px] font-bold">
              ←
            </span>
            <span>back to news item list</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(false)}
            className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(true)}
            className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save and Continue Edit</span>
          </button>
        </div>
      </div>

      {/* ── INFO CARD ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        <div
          onClick={() => setInfoOpen(!infoOpen)}
          className="px-4 py-2.5 bg-slate-50/90 border-b border-[#d2d6de] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-100/70 transition"
        >
          <div className="flex items-center gap-2">
            <span className="font-serif italic font-bold text-slate-600 text-sm">i</span>
            <span className="text-sm font-normal text-slate-800">Info</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {infoOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {infoOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Language */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Language</span>
                <HelpTooltip text="The language of the news item." />
              </label>
              <div className="md:col-span-9 max-w-2xl">
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white appearance-none pr-8 cursor-pointer"
                  >
                    <option value="EN">EN</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Kannada">Kannada</option>
                    <option value="Marathi">Marathi</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Title</span>
                <HelpTooltip text="The title of the news item." />
              </label>
              <div className="md:col-span-9 max-w-2xl flex items-center gap-1.5">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
                <span className="text-red-500 font-bold text-sm select-none">*</span>
              </div>
            </div>

            {/* Short description */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
              <label className="md:col-span-3 pt-2 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Short description</span>
                <HelpTooltip text="The short description of the news item. It's displayed on some category pages or news lists." />
              </label>
              <div className="md:col-span-9 max-w-2xl flex items-start gap-1.5">
                <textarea
                  rows={4}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded p-3 text-xs text-slate-800 bg-white"
                />
                <span className="text-red-500 font-bold text-sm select-none pt-1">*</span>
              </div>
            </div>

            {/* Full description */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
              <label className="md:col-span-3 pt-2 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Full description</span>
                <HelpTooltip text="The full description and content of the news item." />
              </label>
              <div className="md:col-span-9 max-w-2xl flex items-start gap-1.5">
                <div className="w-full border border-[#d2d6de] rounded overflow-hidden shadow-2xs">
                  {/* WYSIWYG Toolbar */}
                  <div className="bg-[#fcfcfc] border-b border-[#e5e7eb] p-1.5 flex flex-wrap items-center gap-1 text-slate-600 select-none">
                    <button
                      type="button"
                      onClick={() => insertFormatting('', '')}
                      title="Undo"
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <Undo className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('', '')}
                      title="Redo"
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <Redo className="w-3.5 h-3.5" />
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-0.5" />
                    <button
                      type="button"
                      onClick={() => insertFormatting('<p>', '</p>')}
                      title="Format"
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('<strong>', '</strong>')}
                      title="Bold"
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('<em>', '</em>')}
                      title="Italic"
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('<u>', '</u>')}
                      title="Underline"
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <Underline className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('<s>', '</s>')}
                      title="Strikethrough"
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <Strikethrough className="w-3.5 h-3.5" />
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-0.5" />
                    {/* Font size */}
                    <div className="flex items-center border border-slate-300 rounded px-1.5 py-0.5 bg-white text-[11px]">
                      <span>{fontSize}</span>
                      <ChevronDown className="w-3 h-3 ml-1 text-slate-500" />
                    </div>
                    {/* Color icon */}
                    <button
                      type="button"
                      onClick={() => insertFormatting('<span style="color:#2489c5;">', '</span>')}
                      title="Text color"
                      className="p-1 hover:bg-slate-200 rounded text-slate-800 font-bold flex items-center"
                    >
                      <span>A</span>
                      <ChevronDown className="w-2.5 h-2.5 ml-0.5 text-slate-500" />
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-0.5" />
                    <button
                      type="button"
                      onClick={() => insertFormatting('<ul>\n  <li>', '</li>\n</ul>')}
                      title="Bullet list"
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('<ol>\n  <li>', '</li>\n</ol>')}
                      title="Numbered list"
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('<div style="text-align:left;">', '</div>')}
                      title="Alignment"
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-0.5" />
                    <button
                      type="button"
                      onClick={() => insertFormatting('<table><tr><td>', '</td></tr></table>')}
                      title="Insert Table"
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <TableIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('<a href="#">', '</a>')}
                      title="Link"
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('<img src="', '" alt="" />')}
                      title="Image"
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('<video src="', '"></video>')}
                      title="Video"
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <Video className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('<hr />\n', '')}
                      title="Horizontal line"
                      className="px-1 hover:bg-slate-200 rounded text-slate-600 font-bold"
                    >
                      —
                    </button>
                    <button
                      type="button"
                      title="Fullscreen"
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Code view"
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <Code className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Help"
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Editor Content Area */}
                  <textarea
                    ref={textareaRef}
                    rows={8}
                    value={fullDescription}
                    onChange={(e) => setFullDescription(e.target.value)}
                    placeholder="Enter the full description of this news item..."
                    className="w-full p-3.5 text-xs text-slate-800 bg-white outline-none resize-y min-h-[160px]"
                  />
                  <div className="bg-[#fcfcfc] border-t border-[#f0f0f0] px-3 py-1 flex justify-center text-slate-300 cursor-ns-resize">
                    <span className="w-8 h-1 bg-slate-300 rounded-full" />
                  </div>
                </div>
                <span className="text-red-500 font-bold text-sm select-none pt-1">*</span>
              </div>
            </div>

            {/* Allow comments */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Allow comments</span>
                <HelpTooltip text="Check if you want to allow comments on this news item." />
              </label>
              <div className="md:col-span-9 max-w-2xl flex items-center">
                <input
                  type="checkbox"
                  checked={allowComments}
                  onChange={(e) => setAllowComments(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Start date */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Start date</span>
                <HelpTooltip text="The start date of the news item availability." />
              </label>
              <div className="md:col-span-9 max-w-xs">
                <div className="relative flex items-center">
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* End date */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>End date</span>
                <HelpTooltip text="The end date of the news item availability." />
              </label>
              <div className="md:col-span-9 max-w-xs">
                <div className="relative flex items-center">
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Limited to stores */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
              <label className="md:col-span-3 pt-2 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Limited to stores</span>
                <HelpTooltip text="Determines whether the news item is available in certain stores only." />
              </label>
              <div className="md:col-span-9 flex flex-col sm:flex-row items-start gap-4 max-w-4xl">
                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    value={limitedToStores}
                    onChange={(e) => setLimitedToStores(e.target.value)}
                    placeholder=""
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                  />
                </div>
                <div className="flex-1 bg-[#f9fafb] border border-[#e5e7eb] rounded p-3 text-xs text-slate-600 leading-relaxed shadow-2xs">
                  In order to use this functionality, you have to disable the following setting:{' '}
                  <span className="font-semibold text-slate-700">
                    Catalog settings &gt; Ignore &quot;limit per store&quot; rules.
                  </span>
                </div>
              </div>
            </div>

            {/* Published */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Published</span>
                <HelpTooltip text="Check if this news item is published and visible on the website." />
              </label>
              <div className="md:col-span-9 max-w-2xl flex items-center">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── SEO CARD ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        <div
          onClick={() => setSeoOpen(!seoOpen)}
          className="px-4 py-2.5 bg-slate-50/90 border-b border-[#d2d6de] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-100/70 transition"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-normal text-slate-800">SEO</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {seoOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {seoOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Search engine friendly page name */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Search engine friendly page name</span>
                <HelpTooltip text="Set a search engine friendly page name such as 'latest-harvest-updates' to make your page URL more search engine friendly." />
              </label>
              <div className="md:col-span-9 max-w-2xl">
                <input
                  type="text"
                  value={seName}
                  onChange={(e) => setSeName(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Meta title */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Meta title</span>
                <HelpTooltip text="The meta title of the page." />
              </label>
              <div className="md:col-span-9 max-w-2xl">
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Meta keywords */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Meta keywords</span>
                <HelpTooltip text="The meta keywords of the page, separated by commas." />
              </label>
              <div className="md:col-span-9 max-w-2xl">
                <input
                  type="text"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Meta description */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
              <label className="md:col-span-3 pt-2 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Meta description</span>
                <HelpTooltip text="The meta description of the page." />
              </label>
              <div className="md:col-span-9 max-w-2xl">
                <textarea
                  rows={4}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded p-3 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
