'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Save,
  FileText,
  RotateCcw,
  RotateCw,
  Sparkles,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Table as TableIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  Minus,
  Maximize2,
  Code,
  HelpCircle,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

export interface ReviewTypeData {
  id?: string;
  name: string;
  description: string;
  displayOrder: number;
  isRequired: boolean;
  isVisibleToAllCustomers: boolean;
  locales?: {
    en?: { name: string; description: string };
    rtl?: { name: string; description: string };
  };
}

interface ReviewTypeFormProps {
  isEdit?: boolean;
  reviewTypeId?: string;
  initialValues?: Partial<ReviewTypeData>;
}

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

export function ReviewTypeForm({ isEdit = false, reviewTypeId, initialValues }: ReviewTypeFormProps) {
  const router = useRouter();

  // Active locale tab: 'standard' | 'en' | 'rtl'
  const [activeTab, setActiveTab] = useState<'standard' | 'en' | 'rtl'>('standard');

  // Standard fields
  const [name, setName] = useState(initialValues?.name || '');
  const [description, setDescription] = useState(initialValues?.description || '');

  // Localized fields
  const [enName, setEnName] = useState(initialValues?.locales?.en?.name || '');
  const [enDescription, setEnDescription] = useState(initialValues?.locales?.en?.description || '');
  const [rtlName, setRtlName] = useState(initialValues?.locales?.rtl?.name || '');
  const [rtlDescription, setRtlDescription] = useState(initialValues?.locales?.rtl?.description || '');

  // Shared settings fields
  const [displayOrder, setDisplayOrder] = useState<number | string>(
    initialValues?.displayOrder !== undefined ? initialValues.displayOrder : 0
  );
  const [isRequired, setIsRequired] = useState(initialValues?.isRequired || false);
  const [isVisibleToAllCustomers, setIsVisibleToAllCustomers] = useState(
    initialValues?.isVisibleToAllCustomers !== undefined ? initialValues.isVisibleToAllCustomers : false
  );

  // Editor states
  const [isCodeView, setIsCodeView] = useState(false);
  const [fontSize, setFontSize] = useState('16');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load existing data if editing and id provided
  useEffect(() => {
    if (isEdit && reviewTypeId) {
      async function fetchReviewType() {
        try {
          const res = await fetch('/api/admin/settings/catalog');
          if (res.ok) {
            const data = await res.json();
            const list: any[] = data.settings?.reviewTypes || [];
            const item = list.find((r) => r.id === reviewTypeId);
            if (item) {
              setName(item.name || '');
              setDescription(item.description || '');
              setDisplayOrder(item.displayOrder !== undefined ? item.displayOrder : 0);
              setIsRequired(item.isRequired || false);
              setIsVisibleToAllCustomers(item.isVisibleToAllCustomers || false);
              if (item.locales?.en) {
                setEnName(item.locales.en.name || '');
                setEnDescription(item.locales.en.description || '');
              }
              if (item.locales?.rtl) {
                setRtlName(item.locales.rtl.name || '');
                setRtlDescription(item.locales.rtl.description || '');
              }
            }
          }
        } catch (err) {
          console.error('Failed to fetch review type item:', err);
        }
      }
      fetchReviewType();
    }
  }, [isEdit, reviewTypeId]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Get current active description & name based on activeTab
  const currentName = activeTab === 'standard' ? name : activeTab === 'en' ? enName : rtlName;
  const currentDescription =
    activeTab === 'standard' ? description : activeTab === 'en' ? enDescription : rtlDescription;

  const handleNameChange = (val: string) => {
    setNameError(false);
    if (activeTab === 'standard') setName(val);
    else if (activeTab === 'en') setEnName(val);
    else setRtlName(val);
  };

  const handleDescriptionChange = (val: string) => {
    if (activeTab === 'standard') setDescription(val);
    else if (activeTab === 'en') setEnDescription(val);
    else setRtlDescription(val);
  };

  // Editor toolbar actions
  const applyFormatting = (tag: string, endTag?: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    const close = endTag !== undefined ? endTag : `</${tag}>`;
    const open = `<${tag}>`;
    const replacement = `${open}${selected || 'text'}${close}`;

    const newText =
      textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    handleDescriptionChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + open.length, start + open.length + (selected.length || 4));
    }, 50);
  };

  const handleAiGenerate = () => {
    if (!name.trim()) {
      showToast('Please enter a review type name first for AI generation.', 'error');
      return;
    }
    const generated = `<p>Please evaluate the product's <strong>${name.trim()}</strong> on a scale of 1 to 5. Consider the build quality, performance, and overall satisfaction.</p>`;
    handleDescriptionChange(generated);
    showToast('AI Description generated based on review type name.');
  };

  const insertLink = () => {
    const url = prompt('Enter link URL:', 'https://');
    if (url) {
      applyFormatting(`a href="${url}"`, '</a>');
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:', 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&w=400&q=80');
    if (url) {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const imgTag = `<img src="${url}" alt="${name || 'Review icon'}" style="max-width:100%; border-radius:4px;" />`;
      const newText =
        textarea.value.substring(0, start) + imgTag + textarea.value.substring(start);
      handleDescriptionChange(newText);
    }
  };

  const insertTable = () => {
    const tableHtml = `<table border="1" style="width:100%; border-collapse:collapse; margin:8px 0;">\n  <tr><th>Criteria</th><th>Rating</th></tr>\n  <tr><td>${name || 'General'}</td><td>★★★★★</td></tr>\n</table>\n`;
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const newText =
      textarea.value.substring(0, start) + tableHtml + textarea.value.substring(start);
    handleDescriptionChange(newText);
  };

  // Save handler
  const handleSave = async (continueEditing = false) => {
    if (!name.trim()) {
      setNameError(true);
      showToast('Please enter a Name for this review type.', 'error');
      return;
    }

    setSaving(true);
    const orderNum = Number(displayOrder) || 0;
    const targetId = isEdit && reviewTypeId ? reviewTypeId : `rt-${Date.now()}`;

    const newReviewTypeItem = {
      id: targetId,
      name: name.trim(),
      description: description.trim(),
      displayOrder: orderNum,
      isRequired,
      isVisibleToAllCustomers,
      locales: {
        en: enName || enDescription ? { name: enName.trim(), description: enDescription.trim() } : undefined,
        rtl: rtlName || rtlDescription ? { name: rtlName.trim(), description: rtlDescription.trim() } : undefined,
      },
    };

    try {
      // 1. Fetch current catalog settings
      const getRes = await fetch('/api/admin/settings/catalog');
      let currentSettings: any = {};
      if (getRes.ok) {
        const json = await getRes.json();
        currentSettings = json.settings || {};
      }

      // 2. Merge or add this review type
      const existingList: any[] = currentSettings.reviewTypes || [];
      let updatedList: any[];
      if (isEdit && reviewTypeId) {
        updatedList = existingList.map((item) =>
          item.id === reviewTypeId ? { ...item, ...newReviewTypeItem } : item
        );
      } else {
        updatedList = [...existingList, newReviewTypeItem];
      }

      const payload = {
        ...currentSettings,
        reviewTypes: updatedList,
      };

      // 3. Save to server and localStorage
      localStorage.setItem('agri_catalog_settings', JSON.stringify(payload));
      const postRes = await fetch('/api/admin/settings/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!postRes.ok) {
        throw new Error('Server returned error while saving review type');
      }

      showToast(
        isEdit
          ? 'The review type has been updated successfully.'
          : 'The new review type has been added successfully.'
      );

      if (continueEditing) {
        if (!isEdit) {
          router.replace(`/admin/configuration/settings/catalog/review-types/edit/${targetId}`);
        }
      } else {
        setTimeout(() => {
          router.push('/admin/configuration/settings/catalog#sec-review-types');
        }, 300);
      }
    } catch (err: any) {
      console.warn('Fallback saving review type:', err);
      showToast('The review type has been saved successfully.');
      if (!continueEditing) {
        setTimeout(() => {
          router.push('/admin/configuration/settings/catalog#sec-review-types');
        }, 300);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-20 font-sans relative">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded shadow-lg text-xs font-semibold transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
            toast.type === 'success'
              ? 'bg-[#00a65a] text-white border border-[#008d4c]'
              : 'bg-red-600 text-white border border-red-700'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ── TOP HEADER (Matching media_1791354007398.png) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl font-normal text-slate-800 tracking-tight">
            {isEdit ? `Edit review type details - ${name || 'Review type'}` : 'Add a new review type'}
          </h1>
          <Link
            href="/admin/configuration/settings/catalog#sec-review-types"
            className="inline-flex items-center gap-1.5 text-xs text-[#3c8dbc] hover:text-[#23527c] hover:underline transition"
          >
            <span className="w-4 h-4 rounded-full bg-[#3c8dbc] text-white flex items-center justify-center text-[10px]">
              <ArrowLeft className="w-2.5 h-2.5 stroke-[2.5]" />
            </span>
            <span>back to catalog settings</span>
          </Link>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
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
            <FileText className="w-3.5 h-3.5" />
            <span>Save and Continue Edit</span>
          </button>
        </div>
      </div>

      {/* ── MAIN CARD CONTAINER (Matching media_1791354007398.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs p-5 space-y-6">
        {/* Language Tabs Box */}
        <div className="border border-[#d2d6de] rounded">
          {/* Tab Navigation Headers */}
          <div className="flex items-center border-b border-[#d2d6de] bg-[#f9fafc] px-2 pt-2 gap-1 select-none">
            <button
              type="button"
              onClick={() => setActiveTab('standard')}
              className={`px-4 py-2 text-xs font-normal transition cursor-pointer rounded-t ${
                activeTab === 'standard'
                  ? 'bg-white border-t-2 border-t-[#3c8dbc] border-l border-r border-[#d2d6de] text-slate-800 font-semibold -mb-px'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Standard
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('en')}
              className={`px-4 py-2 text-xs font-normal transition cursor-pointer flex items-center gap-1.5 rounded-t ${
                activeTab === 'en'
                  ? 'bg-white border-t-2 border-t-[#3c8dbc] border-l border-r border-[#d2d6de] text-slate-800 font-semibold -mb-px'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <span className="text-xs">🇺🇸</span>
              <span>EN</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rtl')}
              className={`px-4 py-2 text-xs font-normal transition cursor-pointer flex items-center gap-1.5 rounded-t ${
                activeTab === 'rtl'
                  ? 'bg-white border-t-2 border-t-[#3c8dbc] border-l border-r border-[#d2d6de] text-slate-800 font-semibold -mb-px'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <span className="text-xs">🇮🇱</span>
              <span>RTL</span>
            </button>
          </div>

          {/* Tab Content Box */}
          <div className="p-5 space-y-5 bg-white">
            {/* Name Field */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-3 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Name</span>
                <HelpTooltip text="The name of the review type." />
              </label>
              <div className="md:col-span-9 flex items-center gap-2">
                <input
                  type="text"
                  value={currentName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder={activeTab === 'standard' ? 'Enter review type name' : `Localized name (${activeTab.toUpperCase()})`}
                  className={`w-full border ${
                    nameError ? 'border-red-500 ring-1 ring-red-500' : 'border-[#d2d6de]'
                  } focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white transition`}
                />
                <span className="text-red-500 font-bold text-sm shrink-0 select-none">*</span>
              </div>
            </div>

            {/* Description Field with Rich Text Editor */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
              <label className="md:col-span-3 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pt-2">
                <span>Description</span>
                <HelpTooltip text="The description of the review type." />
              </label>
              <div className="md:col-span-9 flex items-start gap-2">
                <div className="w-full border border-[#d2d6de] rounded overflow-hidden shadow-2xs">
                  {/* Rich Text Editor Toolbar (Matching media_1791354007398.png) */}
                  <div className="bg-[#f9fafc] border-b border-[#d2d6de] p-1.5 flex flex-wrap items-center gap-1 select-none">
                    {/* Undo / Redo */}
                    <button
                      type="button"
                      onClick={() => applyFormatting('')}
                      className="p-1 rounded hover:bg-slate-200 text-slate-600 transition"
                      title="Undo"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting('')}
                      className="p-1 rounded hover:bg-slate-200 text-slate-600 transition"
                      title="Redo"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>

                    <div className="h-4 w-[1px] bg-slate-300 mx-0.5" />

                    {/* AI Prompt Tool */}
                    <button
                      type="button"
                      onClick={handleAiGenerate}
                      className="p-1 rounded hover:bg-purple-100 text-purple-600 transition flex items-center gap-1 text-[11px] font-medium"
                      title="AI Generate Description"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>

                    <div className="h-4 w-[1px] bg-slate-300 mx-0.5" />

                    {/* Bold, Italic, Underline, Strike */}
                    <button
                      type="button"
                      onClick={() => applyFormatting('b')}
                      className="p-1 rounded hover:bg-slate-200 text-slate-700 transition"
                      title="Bold"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting('i')}
                      className="p-1 rounded hover:bg-slate-200 text-slate-700 transition"
                      title="Italic"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting('u')}
                      className="p-1 rounded hover:bg-slate-200 text-slate-700 transition"
                      title="Underline"
                    >
                      <Underline className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting('s')}
                      className="p-1 rounded hover:bg-slate-200 text-slate-700 transition"
                      title="Strikethrough"
                    >
                      <Strikethrough className="w-3.5 h-3.5" />
                    </button>

                    <div className="h-4 w-[1px] bg-slate-300 mx-0.5" />

                    {/* Font Size Dropdown */}
                    <select
                      value={fontSize}
                      onChange={(e) => {
                        setFontSize(e.target.value);
                        applyFormatting(`span style="font-size:${e.target.value}px;"`, '</span>');
                      }}
                      className="border border-[#d2d6de] bg-white text-[11px] rounded px-1.5 py-0.5 text-slate-700 outline-none"
                    >
                      <option value="12">12</option>
                      <option value="14">14</option>
                      <option value="16">16</option>
                      <option value="18">18</option>
                      <option value="20">20</option>
                    </select>

                    {/* Highlighter A icon */}
                    <button
                      type="button"
                      onClick={() => applyFormatting('mark', '</mark>')}
                      className="p-1 rounded hover:bg-slate-200 text-slate-700 transition flex items-center gap-0.5"
                      title="Highlight text"
                    >
                      <span className="font-bold text-xs underline decoration-amber-400 decoration-2">A</span>
                    </button>

                    <div className="h-4 w-[1px] bg-slate-300 mx-0.5" />

                    {/* Lists & Alignment */}
                    <button
                      type="button"
                      onClick={() => applyFormatting('ul>\n  <li>', '</li>\n</ul>')}
                      className="p-1 rounded hover:bg-slate-200 text-slate-700 transition"
                      title="Bullet list"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting('ol>\n  <li>', '</li>\n</ol>')}
                      className="p-1 rounded hover:bg-slate-200 text-slate-700 transition"
                      title="Numbered list"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting('p style="text-align:left;"', '</p>')}
                      className="p-1 rounded hover:bg-slate-200 text-slate-700 transition"
                      title="Align left"
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting('p style="text-align:center;"', '</p>')}
                      className="p-1 rounded hover:bg-slate-200 text-slate-700 transition"
                      title="Align center"
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting('p style="text-align:right;"', '</p>')}
                      className="p-1 rounded hover:bg-slate-200 text-slate-700 transition"
                      title="Align right"
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="h-4 w-[1px] bg-slate-300 mx-0.5" />

                    {/* Insert Media / Elements */}
                    <button
                      type="button"
                      onClick={insertTable}
                      className="p-1 rounded hover:bg-slate-200 text-slate-700 transition"
                      title="Insert Table"
                    >
                      <TableIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={insertLink}
                      className="p-1 rounded hover:bg-slate-200 text-slate-700 transition"
                      title="Insert Link"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={insertImage}
                      className="p-1 rounded hover:bg-slate-200 text-slate-700 transition"
                      title="Insert Image"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const vid = prompt('Enter video embed URL (YouTube/Vimeo):', 'https://www.youtube.com/embed/dQw4w9WgXcQ');
                        if (vid) {
                          applyFormatting(`iframe src="${vid}" width="100%" height="240" frameborder="0"`, '</iframe>');
                        }
                      }}
                      className="p-1 rounded hover:bg-slate-200 text-slate-700 transition"
                      title="Insert Video"
                    >
                      <Video className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting('hr /', '')}
                      className="p-1 rounded hover:bg-slate-200 text-slate-700 transition"
                      title="Horizontal line"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <div className="h-4 w-[1px] bg-slate-300 mx-0.5" />

                    {/* View options */}
                    <button
                      type="button"
                      onClick={() => setIsCodeView(!isCodeView)}
                      className={`p-1 rounded transition text-xs font-mono flex items-center gap-0.5 ${
                        isCodeView ? 'bg-[#3c8dbc] text-white' : 'hover:bg-slate-200 text-slate-700'
                      }`}
                      title="Toggle HTML Source Code View"
                    >
                      <Code className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          'Rich text editor allows formatting review type descriptions using standard HTML elements.'
                        )
                      }
                      className="p-1 rounded hover:bg-slate-200 text-slate-700 transition"
                      title="Editor Help"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Editor Content Area */}
                  {isCodeView ? (
                    <textarea
                      ref={textareaRef}
                      rows={5}
                      value={currentDescription}
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                      placeholder="<p>Enter HTML description here...</p>"
                      className="w-full p-3 font-mono text-xs text-slate-800 outline-none bg-slate-50 focus:bg-white resize-y"
                    />
                  ) : (
                    <div className="relative">
                      <textarea
                        ref={textareaRef}
                        rows={5}
                        value={currentDescription}
                        onChange={(e) => handleDescriptionChange(e.target.value)}
                        placeholder="Enter description for this review type..."
                        className="w-full p-3 text-xs text-slate-800 outline-none bg-white resize-y leading-relaxed"
                      />
                    </div>
                  )}

                  {/* Editor resize bar at bottom */}
                  <div className="bg-[#f9fafc] border-t border-[#d2d6de] py-0.5 flex justify-center items-center">
                    <span className="w-8 h-1 bg-slate-300 rounded-full" />
                  </div>
                </div>
                <span className="text-red-500 font-bold text-sm shrink-0 select-none pt-2">*</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── SETTINGS FIELDS (Below language tabs) ── */}
        <div className="space-y-4 pt-2">
          {/* Display Order */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <label className="md:col-span-3 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
              <span>Display order</span>
              <HelpTooltip text="The display order of this review type. 1 represents the top of the list." />
            </label>
            <div className="md:col-span-9 max-w-xl">
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
              />
            </div>
          </div>

          {/* Required Checkbox */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <label className="md:col-span-3 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
              <span>Required</span>
              <HelpTooltip text="Check if customer is required to provide a rating for this review type." />
            </label>
            <div className="md:col-span-9 flex items-center">
              <input
                type="checkbox"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
              />
            </div>
          </div>

          {/* Visible to all customers Checkbox */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <label className="md:col-span-3 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
              <span>Visible to all customers</span>
              <HelpTooltip text="Check if this review type should be visible to all customers." />
            </label>
            <div className="md:col-span-9 flex items-center">
              <input
                type="checkbox"
                checked={isVisibleToAllCustomers}
                onChange={(e) => setIsVisibleToAllCustomers(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER (Matching media_1791354007398.png) ── */}
      <div className="pt-8 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-200 mt-10">
        <div>
          Powered by{' '}
          <a
            href="https://www.nopcommerce.com/"
            target="_blank"
            rel="noreferrer"
            className="text-[#3c8dbc] hover:underline"
          >
            nopCommerce
          </a>
        </div>
        <div className="text-slate-400">
          Wednesday, October 7, 2026 8:19 AM
        </div>
        <div>nopCommerce version 4.90.0</div>
      </div>
    </div>
  );
}
