'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Save,
  ArrowLeft,
  Info,
  Minus,
  Plus,
  Undo2,
  Redo2,
  Sparkles,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table as TableIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  Code,
  Maximize2,
  HelpCircle,
  X,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export interface ProductAttributeFormData {
  id?: string;
  name: string;
  description?: string;
  displayOrder?: number;
}

interface ProductAttributeFormProps {
  initialValues?: Partial<ProductAttributeFormData>;
  onSave: (data: ProductAttributeFormData, continueEditing?: boolean) => Promise<void>;
  saving: boolean;
  isEdit?: boolean;
}

export function ProductAttributeForm({
  initialValues,
  onSave,
  saving,
  isEdit = false,
}: ProductAttributeFormProps) {
  const router = useRouter();

  // Form State
  const [name, setName] = useState(initialValues?.name || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [displayOrder, setDisplayOrder] = useState<number>(initialValues?.displayOrder || 1);

  // Localization tabs
  const [activeTab, setActiveTab] = useState<'standard' | 'en' | 'rtl'>('standard');

  // Multi-language state
  const [localized, setLocalized] = useState({
    en: { name: '', description: '' },
    rtl: { name: '', description: '' },
  });

  // Collapsible Info Card
  const [infoOpen, setInfoOpen] = useState(true);

  // WYSIWYG Editor State
  const editorRef = useRef<HTMLDivElement>(null);
  const [codeView, setCodeView] = useState(false);
  const [fontSize, setFontSize] = useState('16');
  const [textColor, setTextColor] = useState('#000000');

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // WYSIWYG command executer
  const execCmd = (command: string, value: string | undefined = undefined) => {
    if (codeView) return;
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setDescription(editorRef.current.innerHTML);
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setDescription(editorRef.current.innerHTML);
    }
  };

  const handleSubmit = async (continueEditing: boolean) => {
    if (!name.trim()) {
      showToast('Name is required.', 'error');
      return;
    }
    await onSave(
      {
        id: initialValues?.id,
        name: name.trim(),
        description: description,
        displayOrder,
      },
      continueEditing
    );
  };

  // Tooltip Helper
  const Tooltip = ({ text }: { text: string }) => (
    <span
      title={text}
      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] cursor-help font-bold shrink-0 select-none ml-1"
    >
      ?
    </span>
  );

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-16 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded shadow-lg text-white text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
            toast.type === 'success' ? 'bg-[#00a65a]' : 'bg-[#dd4b39]'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* TOP HEADER: Title + back link + Action buttons (Matching media_1791008524169.png) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-normal text-slate-800 tracking-tight">
            {isEdit ? `Edit product attribute details - ${name || ''}` : 'Add a new product attribute'}
          </h1>
          <Link
            href="/admin/catalogue/attributes/product"
            className="text-xs text-[#3c8dbc] hover:underline flex items-center gap-1.5 font-normal ml-1"
          >
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#3c8dbc] text-white">
              <ArrowLeft className="w-2.5 h-2.5" />
            </span>
            <span>back to product attribute list</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Save button */}
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSubmit(false)}
            className="bg-[#2585be] hover:bg-[#1f72a3] disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>

          {/* Save and Continue Edit button */}
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSubmit(true)}
            className="bg-[#2585be] hover:bg-[#1f72a3] disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save and Continue Edit</span>
          </button>
        </div>
      </div>

      {/* INFO CARD (Matching media_1791008524169.png) */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Card Header: "i Info" with collapse toggle */}
        <div
          onClick={() => setInfoOpen(!infoOpen)}
          className="border-b border-[#f4f4f4] px-4 py-2.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm">
            <span className="italic font-serif font-bold text-sm text-slate-700">i</span>
            <span>Info</span>
          </div>
          <button
            type="button"
            className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none cursor-pointer"
          >
            {infoOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Card Body */}
        {infoOpen && (
          <div className="p-4 sm:p-6 space-y-5 text-xs text-slate-700">
            {/* Multi-language Tabs (Standard | EN | RTL) */}
            <div className="flex items-center gap-1 border-b border-[#d2d6de] -mt-1 mb-4 select-none">
              <button
                type="button"
                onClick={() => setActiveTab('standard')}
                className={`px-4 py-2 text-xs font-medium border-t-2 rounded-t transition-colors cursor-pointer ${
                  activeTab === 'standard'
                    ? 'border-t-[#3c8dbc] border-x border-[#d2d6de] bg-white text-slate-800 -mb-px font-semibold'
                    : 'border-t-transparent text-slate-600 hover:text-slate-900 bg-slate-50/60'
                }`}
              >
                Standard
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('en')}
                className={`px-3 py-2 text-xs font-medium border-t-2 rounded-t flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'en'
                    ? 'border-t-[#3c8dbc] border-x border-[#d2d6de] bg-white text-slate-800 -mb-px font-semibold'
                    : 'border-t-transparent text-slate-600 hover:text-slate-900 bg-slate-50/60'
                }`}
              >
                <span>🇺🇸</span>
                <span>EN</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('rtl')}
                className={`px-3 py-2 text-xs font-medium border-t-2 rounded-t flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'rtl'
                    ? 'border-t-[#3c8dbc] border-x border-[#d2d6de] bg-white text-slate-800 -mb-px font-semibold'
                    : 'border-t-transparent text-slate-600 hover:text-slate-900 bg-slate-50/60'
                }`}
              >
                <span>🇮🇱</span>
                <span>RTL</span>
              </button>
            </div>

            {/* FORM FIELDS */}
            <div className="space-y-4 max-w-4xl">
              {/* Field: Name */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <div className="sm:col-span-3 flex items-center justify-start sm:justify-end font-medium text-slate-700">
                  <span>Name</span>
                  <Tooltip text="The name of the product attribute." />
                </div>
                <div className="sm:col-span-9 flex items-center gap-1.5">
                  <input
                    type="text"
                    required
                    value={
                      activeTab === 'standard'
                        ? name
                        : activeTab === 'en'
                        ? localized.en.name
                        : localized.rtl.name
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (activeTab === 'standard') setName(val);
                      else if (activeTab === 'en')
                        setLocalized({ ...localized, en: { ...localized.en, name: val } });
                      else
                        setLocalized({ ...localized, rtl: { ...localized.rtl, name: val } });
                    }}
                    placeholder=""
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none text-slate-700"
                  />
                  <span className="text-red-500 font-bold text-sm">*</span>
                </div>
              </div>

              {/* Field: Description with Full WYSIWYG Toolbar (Matching media_1791008524169.png) */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-start gap-2">
                <div className="sm:col-span-3 flex items-center justify-start sm:justify-end font-medium text-slate-700 pt-1.5">
                  <span>Description</span>
                  <Tooltip text="The description of the product attribute." />
                </div>
                <div className="sm:col-span-9 space-y-1">
                  {/* WYSIWYG Toolbar Container */}
                  <div className="rounded border border-[#d2d6de] bg-white overflow-hidden shadow-2xs">
                    {/* Toolbar Header */}
                    <div className="p-1.5 bg-[#fcfcfc] border-b border-[#e9ecef] flex flex-wrap items-center gap-1 text-slate-700 text-xs select-none">
                      {/* Undo / Redo / Magic */}
                      <button
                        type="button"
                        onClick={() => execCmd('undo')}
                        className="p-1.5 rounded hover:bg-slate-200 transition"
                        title="Undo"
                      >
                        <Undo2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execCmd('redo')}
                        className="p-1.5 rounded hover:bg-slate-200 transition"
                        title="Redo"
                      >
                        <Redo2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execCmd('removeFormat')}
                        className="p-1.5 rounded hover:bg-slate-200 transition text-[#3c8dbc]"
                        title="Clear formatting"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>

                      <div className="w-px h-4 bg-slate-300 mx-0.5" />

                      {/* Bold / Italic / Underline / Strike */}
                      <button
                        type="button"
                        onClick={() => execCmd('bold')}
                        className="p-1.5 rounded hover:bg-slate-200 font-bold transition"
                        title="Bold"
                      >
                        <Bold className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execCmd('italic')}
                        className="p-1.5 rounded hover:bg-slate-200 italic transition"
                        title="Italic"
                      >
                        <Italic className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execCmd('underline')}
                        className="p-1.5 rounded hover:bg-slate-200 underline transition"
                        title="Underline"
                      >
                        <Underline className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execCmd('strikeThrough')}
                        className="p-1.5 rounded hover:bg-slate-200 line-through transition"
                        title="Strikethrough"
                      >
                        <Strikethrough className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>

                      <div className="w-px h-4 bg-slate-300 mx-0.5" />

                      {/* Font Size dropdown */}
                      <select
                        value={fontSize}
                        onChange={(e) => {
                          setFontSize(e.target.value);
                          execCmd('fontSize', e.target.value === '16' ? '3' : '4');
                        }}
                        className="text-xs px-1.5 py-0.5 rounded border border-[#d2d6de] bg-white outline-none"
                      >
                        <option value="12">12</option>
                        <option value="14">14</option>
                        <option value="16">16</option>
                        <option value="18">18</option>
                        <option value="24">24</option>
                      </select>

                      {/* Text Color Picker */}
                      <label className="flex items-center gap-0.5 px-1 py-0.5 rounded hover:bg-slate-200 cursor-pointer border border-[#d2d6de] bg-white" title="Text Color">
                        <span className="font-bold text-xs" style={{ color: textColor }}>
                          A
                        </span>
                        <ChevronDown className="w-2.5 h-2.5 text-slate-500" />
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => {
                            setTextColor(e.target.value);
                            execCmd('foreColor', e.target.value);
                          }}
                          className="w-0 h-0 opacity-0 absolute"
                        />
                      </label>

                      <div className="w-px h-4 bg-slate-300 mx-0.5" />

                      {/* Lists */}
                      <button
                        type="button"
                        onClick={() => execCmd('insertUnorderedList')}
                        className="p-1.5 rounded hover:bg-slate-200 transition"
                        title="Bullet List"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execCmd('insertOrderedList')}
                        className="p-1.5 rounded hover:bg-slate-200 transition"
                        title="Numbered List"
                      >
                        <ListOrdered className="w-3.5 h-3.5" />
                      </button>

                      <div className="w-px h-4 bg-slate-300 mx-0.5" />

                      {/* Insert Table / Link / Image / Video / HR */}
                      <button
                        type="button"
                        onClick={() => {
                          const tableHtml = '<table border="1" style="width:100%;border-collapse:collapse;"><tr><td>Col 1</td><td>Col 2</td></tr></table>';
                          execCmd('insertHTML', tableHtml);
                        }}
                        className="p-1.5 rounded hover:bg-slate-200 transition"
                        title="Insert Table"
                      >
                        <TableIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt('Enter URL:');
                          if (url) execCmd('createLink', url);
                        }}
                        className="p-1.5 rounded hover:bg-slate-200 transition"
                        title="Insert Link"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt('Enter Image URL:');
                          if (url) execCmd('insertImage', url);
                        }}
                        className="p-1.5 rounded hover:bg-slate-200 transition"
                        title="Insert Image"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt('Enter Video Embed URL:');
                          if (url) execCmd('insertHTML', `<iframe src="${url}" width="300" height="200"></iframe>`);
                        }}
                        className="p-1.5 rounded hover:bg-slate-200 transition"
                        title="Insert Video"
                      >
                        <Video className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execCmd('insertHorizontalRule')}
                        className="p-1.5 rounded hover:bg-slate-200 transition"
                        title="Horizontal Rule"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <div className="w-px h-4 bg-slate-300 mx-0.5" />

                      {/* Fullscreen, Code view, Help */}
                      <button
                        type="button"
                        onClick={() => setCodeView(!codeView)}
                        className={`p-1.5 rounded transition ${codeView ? 'bg-slate-300 text-slate-900 font-bold' : 'hover:bg-slate-200'}`}
                        title="Toggle Code View"
                      >
                        <Code className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => alert('Rich text editor supports formatting, tables, images, and links.')}
                        className="p-1.5 rounded hover:bg-slate-200 transition"
                        title="Help"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Editor Content Area */}
                    {codeView ? (
                      <textarea
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="The description of the product attribute."
                        className="w-full p-3 text-xs font-mono bg-slate-50 text-slate-800 outline-none resize-y min-h-[120px]"
                      />
                    ) : (
                      <div
                        ref={editorRef}
                        contentEditable
                        onInput={handleEditorInput}
                        dangerouslySetInnerHTML={{ __html: description }}
                        data-placeholder="The description of the product attribute."
                        className="w-full p-3 text-xs text-slate-700 outline-none min-h-[120px] focus:ring-0 empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 cursor-text"
                      />
                    )}

                    {/* Resize Bar */}
                    <div className="h-2 bg-slate-100 border-t border-slate-200 cursor-s-resize flex items-center justify-center">
                      <div className="w-8 h-0.5 bg-slate-300 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="mt-8 border-t border-[#d2d6de] pt-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          Powered by{' '}
          <a
            href="https://www.nopcommerce.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3c8dbc] hover:underline"
          >
            nopCommerce
          </a>
        </div>
        <div>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}{' '}
          {new Date().toLocaleTimeString()}
        </div>
        <div>nopCommerce version 4.90.0</div>
      </footer>
    </div>
  );
}
