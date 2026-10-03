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
  RotateCw,
  CheckSquare,
  Layers,
  Check,
} from 'lucide-react';

export interface PredefinedValue {
  id: string;
  name: string;
  priceAdjustment: number;
  weightAdjustment: number;
  isPreSelected: boolean;
  displayOrder: number;
}

export interface UsedByProduct {
  id: string;
  name: string;
  published: boolean;
}

export interface ProductAttributeFormData {
  id?: string;
  name: string;
  description?: string;
  displayOrder?: number;
  predefinedValues?: PredefinedValue[];
  usedByProducts?: UsedByProduct[];
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
  const [predefinedValues, setPredefinedValues] = useState<PredefinedValue[]>(
    initialValues?.predefinedValues || []
  );
  const [usedByProducts, setUsedByProducts] = useState<UsedByProduct[]>(
    initialValues?.usedByProducts || []
  );

  // Localization tabs
  const [activeTab, setActiveTab] = useState<'standard' | 'en' | 'rtl'>('standard');

  // Multi-language state
  const [localized, setLocalized] = useState({
    en: { name: '', description: '' },
    rtl: { name: '', description: '' },
  });

  // Collapsible Cards
  const [infoOpen, setInfoOpen] = useState(true);
  const [predefinedOpen, setPredefinedOpen] = useState(true);
  const [usedByOpen, setUsedByOpen] = useState(true);

  // Pagination & Loading
  const [predefinedPageSize, setPredefinedPageSize] = useState<number>(15);
  const [usedPageSize, setUsedPageSize] = useState<number>(15);
  const [usedLoading, setUsedLoading] = useState<boolean>(false);

  // Modal State for Predefined Values
  const [modalOpen, setModalOpen] = useState(false);
  const [editingValueId, setEditingValueId] = useState<string | null>(null);
  const [valName, setValName] = useState('');
  const [valPriceAdjustment, setValPriceAdjustment] = useState<number | string>(0);
  const [valWeightAdjustment, setValWeightAdjustment] = useState<number | string>(0);
  const [valIsPreSelected, setValIsPreSelected] = useState<boolean>(false);
  const [valDisplayOrder, setValDisplayOrder] = useState<number>(1);
  const [valError, setValError] = useState<string | null>(null);

  // Synchronize when initialValues changes
  React.useEffect(() => {
    if (initialValues) {
      if (initialValues.name !== undefined) setName(initialValues.name);
      if (initialValues.description !== undefined) setDescription(initialValues.description);
      if (initialValues.displayOrder !== undefined) setDisplayOrder(initialValues.displayOrder);
      if (initialValues.predefinedValues) setPredefinedValues(initialValues.predefinedValues);
      if (initialValues.usedByProducts) setUsedByProducts(initialValues.usedByProducts);
    }
  }, [initialValues]);

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

  // Predefined Value Actions
  const handleOpenAddModal = () => {
    setEditingValueId(null);
    setValName('');
    setValPriceAdjustment(0);
    setValWeightAdjustment(0);
    setValIsPreSelected(false);
    setValDisplayOrder(predefinedValues.length + 1);
    setValError(null);
    setModalOpen(true);
  };

  const handleEditPredefinedValue = (item: PredefinedValue) => {
    setEditingValueId(item.id);
    setValName(item.name);
    setValPriceAdjustment(item.priceAdjustment);
    setValWeightAdjustment(item.weightAdjustment);
    setValIsPreSelected(item.isPreSelected);
    setValDisplayOrder(item.displayOrder);
    setValError(null);
    setModalOpen(true);
  };

  const handleDeletePredefinedValue = (id: string) => {
    if (confirm('Are you sure you want to delete this predefined value?')) {
      setPredefinedValues((prev) => prev.filter((p) => p.id !== id));
      showToast('Predefined value deleted', 'success');
    }
  };

  const handleSavePredefinedValue = () => {
    if (!valName.trim()) {
      setValError('Name is required');
      return;
    }

    if (editingValueId) {
      setPredefinedValues((prev) =>
        prev.map((item) =>
          item.id === editingValueId
            ? {
                ...item,
                name: valName.trim(),
                priceAdjustment: Number(valPriceAdjustment) || 0,
                weightAdjustment: Number(valWeightAdjustment) || 0,
                isPreSelected: valIsPreSelected,
                displayOrder: Number(valDisplayOrder) || 1,
              }
            : item
        )
      );
      showToast('Predefined value updated', 'success');
    } else {
      const newItem: PredefinedValue = {
        id: `pv-${Date.now()}`,
        name: valName.trim(),
        priceAdjustment: Number(valPriceAdjustment) || 0,
        weightAdjustment: Number(valWeightAdjustment) || 0,
        isPreSelected: valIsPreSelected,
        displayOrder: Number(valDisplayOrder) || (predefinedValues.length + 1),
      };
      setPredefinedValues((prev) => [...prev, newItem]);
      showToast('Predefined value added', 'success');
    }

    setModalOpen(false);
  };

  const handleRefreshUsedBy = () => {
    setUsedLoading(true);
    setTimeout(() => {
      setUsedLoading(false);
    }, 700);
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
        predefinedValues,
        usedByProducts,
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

      {/* PREDEFINED VALUES CARD (Matching media_1791009053176.png) */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        {/* Card Header: "☑ Predefined values" with collapse toggle */}
        <div
          onClick={() => setPredefinedOpen(!predefinedOpen)}
          className="border-b border-[#f4f4f4] px-4 py-2.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm">
            <CheckSquare className="w-4 h-4 text-slate-700" />
            <span>Predefined values</span>
          </div>
          <button
            type="button"
            className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none cursor-pointer"
          >
            {predefinedOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Card Body */}
        {predefinedOpen && (
          <div>
            <div className="p-4 sm:p-5 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Predefined (default) values are helpful for a store owner when creating new products. Then when you add the attribute to a product, you don't have to create the values again.
              </p>

              {/* Table Container */}
              <div className="border border-[#e5e7eb] rounded overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f9fafb] text-slate-700 font-semibold border-b border-[#e5e7eb]">
                        <th className="px-3.5 py-2.5 border-r border-[#e5e7eb]">Name</th>
                        <th className="px-3.5 py-2.5 border-r border-[#e5e7eb]">Price adjustment</th>
                        <th className="px-3.5 py-2.5 border-r border-[#e5e7eb]">Weight adjustment</th>
                        <th className="px-3.5 py-2.5 border-r border-[#e5e7eb] text-center">Is pre-selected</th>
                        <th className="px-3.5 py-2.5 border-r border-[#e5e7eb] text-center">Display order</th>
                        <th className="px-3.5 py-2.5 border-r border-[#e5e7eb] text-center">Edit</th>
                        <th className="px-3.5 py-2.5 text-center">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predefinedValues.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-slate-500 font-normal">
                            No data available in table
                          </td>
                        </tr>
                      ) : (
                        predefinedValues.map((val) => (
                          <tr key={val.id} className="border-b border-[#f0f0f0] hover:bg-slate-50/70 transition">
                            <td className="px-3.5 py-2.5 border-r border-[#f0f0f0] font-medium text-slate-800">
                              {val.name}
                            </td>
                            <td className="px-3.5 py-2.5 border-r border-[#f0f0f0] text-slate-700">
                              {val.priceAdjustment !== undefined ? `$${Number(val.priceAdjustment).toFixed(2)}` : '$0.00'}
                            </td>
                            <td className="px-3.5 py-2.5 border-r border-[#f0f0f0] text-slate-700">
                              {val.weightAdjustment !== undefined ? Number(val.weightAdjustment).toFixed(2) : '0.00'}
                            </td>
                            <td className="px-3.5 py-2.5 border-r border-[#f0f0f0] text-center">
                              {val.isPreSelected ? (
                                <span className="text-[#00a65a] font-bold text-sm">✓</span>
                              ) : (
                                <span className="text-slate-400 font-semibold">—</span>
                              )}
                            </td>
                            <td className="px-3.5 py-2.5 border-r border-[#f0f0f0] text-center text-slate-700">
                              {val.displayOrder}
                            </td>
                            <td className="px-3.5 py-2.5 border-r border-[#f0f0f0] text-center">
                              <button
                                type="button"
                                onClick={() => handleEditPredefinedValue(val)}
                                className="text-[#2585be] hover:underline font-medium cursor-pointer"
                              >
                                Edit
                              </button>
                            </td>
                            <td className="px-3.5 py-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleDeletePredefinedValue(val.id)}
                                className="text-red-500 hover:underline font-medium cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer / Paging Bar (Matching screenshot) */}
                <div className="bg-[#fcfcfc] border-t border-[#e5e7eb] px-3 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                  {/* Previous / Next buttons */}
                  <div className="flex items-center">
                    <button
                      type="button"
                      disabled
                      className="px-2.5 py-1 border border-[#d2d6de] bg-white text-slate-400 rounded-l cursor-not-allowed hover:bg-slate-50 transition"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled
                      className="px-2.5 py-1 border-t border-b border-r border-[#d2d6de] bg-white text-slate-400 rounded-r cursor-not-allowed hover:bg-slate-50 transition"
                    >
                      Next
                    </button>
                  </div>

                  {/* Show [ 15 ] items */}
                  <div className="flex items-center gap-1.5">
                    <span>Show</span>
                    <select
                      value={predefinedPageSize}
                      onChange={(e) => setPredefinedPageSize(Number(e.target.value))}
                      className="border border-[#d2d6de] bg-white rounded px-2 py-0.5 text-xs text-slate-700 outline-none cursor-pointer"
                    >
                      <option value={15}>15</option>
                      <option value={30}>30</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span>items</span>
                  </div>

                  {/* Records count & Refresh button */}
                  <div className="flex items-center gap-3">
                    <span>
                      {predefinedValues.length === 0 ? 'No records' : `1-${predefinedValues.length} of ${predefinedValues.length} items`}
                    </span>
                    <button
                      type="button"
                      onClick={() => showToast('Predefined values reloaded', 'success')}
                      className="p-1 border border-[#d2d6de] bg-white text-slate-600 hover:text-slate-900 rounded hover:bg-slate-50 transition cursor-pointer"
                      title="Refresh"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Section: Add a new value button */}
            <div className="bg-[#f4f6f9] border-t border-[#e5e7eb] px-4 sm:px-5 py-3">
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="bg-[#2585be] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3 py-1.5 rounded shadow-xs transition cursor-pointer"
              >
                Add a new value
              </button>
            </div>
          </div>
        )}
      </div>

      {/* USED BY PRODUCTS CARD (Matching media_1791009053176.png) */}
      <div className="bg-white rounded border border-[#d2d6de] border-t-2 border-t-[#3c8dbc] shadow-2xs overflow-hidden">
        {/* Card Header: "🖼 Used by products" with collapse toggle */}
        <div
          onClick={() => setUsedByOpen(!usedByOpen)}
          className="border-b border-[#f4f4f4] px-4 py-2.5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition"
        >
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm">
            {/* Custom Icon matching screenshot's layout frame */}
            <svg
              className="w-4 h-4 text-slate-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>Used by products</span>
          </div>
          <button
            type="button"
            className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none cursor-pointer"
          >
            {usedByOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Card Body */}
        {usedByOpen && (
          <div className="p-4 sm:p-5 space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Here you can see a list of products which use this attribute.
            </p>

            {/* Table Container */}
            <div className="border border-[#e5e7eb] rounded overflow-hidden">
              <div className="overflow-x-auto min-h-[160px] relative flex flex-col justify-center">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f9fafb] text-slate-700 font-semibold border-b border-[#e5e7eb]">
                      <th className="px-3.5 py-2.5 border-r border-[#e5e7eb] w-3/5">Product</th>
                      <th className="px-3.5 py-2.5 border-r border-[#e5e7eb] text-center w-1/5">Published</th>
                      <th className="px-3.5 py-2.5 text-center w-1/5">View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usedLoading ? (
                      <tr>
                        <td colSpan={3} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center gap-2 text-slate-600">
                            <RotateCw className="w-7 h-7 animate-spin text-slate-700 stroke-[2.5]" />
                            <span className="text-xs font-normal text-slate-600">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : usedByProducts.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-slate-500 font-normal">
                          No data available in table
                        </td>
                      </tr>
                    ) : (
                      usedByProducts.map((p) => (
                        <tr key={p.id} className="border-b border-[#f0f0f0] hover:bg-slate-50/70 transition">
                          <td className="px-3.5 py-2.5 border-r border-[#f0f0f0]">
                            <Link
                              href={`/admin/catalogue/products/${p.id}/edit`}
                              className="text-[#2585be] hover:underline font-normal"
                            >
                              {p.name}
                            </Link>
                          </td>
                          <td className="px-3.5 py-2.5 border-r border-[#f0f0f0] text-center">
                            {p.published ? (
                              <span className="text-[#00a65a] font-bold text-sm">✓</span>
                            ) : (
                              <span className="text-red-500 font-bold text-sm">✕</span>
                            )}
                          </td>
                          <td className="px-3.5 py-2.5 text-center">
                            <Link
                              href={`/admin/catalogue/products/${p.id}/edit`}
                              className="inline-flex items-center justify-center bg-[#2585be] hover:bg-[#1f72a3] text-white px-2.5 py-1 rounded text-xs transition"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer / Paging Bar (Matching screenshot) */}
              <div className="bg-[#fcfcfc] border-t border-[#e5e7eb] px-3 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span>Show</span>
                  <select
                    value={usedPageSize}
                    onChange={(e) => setUsedPageSize(Number(e.target.value))}
                    className="border border-[#d2d6de] bg-white rounded px-2 py-0.5 text-xs text-slate-700 outline-none cursor-pointer"
                  >
                    <option value={15}>15</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span>items</span>
                </div>

                <button
                  type="button"
                  onClick={handleRefreshUsedBy}
                  className="p-1 border border-[#d2d6de] bg-white text-slate-600 hover:text-slate-900 rounded hover:bg-slate-50 transition cursor-pointer"
                  title="Refresh"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Add / Edit Predefined Value */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded border border-[#d2d6de] shadow-xl w-full max-w-lg overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-[#f4f6f9] border-b border-[#e5e7eb] px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-800">
                {editingValueId ? 'Edit value' : 'Add a new value'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 space-y-4 text-xs">
              {valError && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-2.5 rounded text-xs">
                  {valError}
                </div>
              )}

              {/* Name */}
              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-right font-medium text-slate-700">
                  Name <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="col-span-8">
                  <input
                    type="text"
                    required
                    value={valName}
                    onChange={(e) => setValName(e.target.value)}
                    placeholder="e.g. Blue, Red, 5kg"
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none"
                  />
                </div>
              </div>

              {/* Price adjustment */}
              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-right font-medium text-slate-700">
                  Price adjustment
                </label>
                <div className="col-span-8">
                  <input
                    type="number"
                    step="0.01"
                    value={valPriceAdjustment}
                    onChange={(e) => setValPriceAdjustment(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none"
                  />
                </div>
              </div>

              {/* Weight adjustment */}
              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-right font-medium text-slate-700">
                  Weight adjustment
                </label>
                <div className="col-span-8">
                  <input
                    type="number"
                    step="0.01"
                    value={valWeightAdjustment}
                    onChange={(e) => setValWeightAdjustment(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none"
                  />
                </div>
              </div>

              {/* Is pre-selected */}
              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-right font-medium text-slate-700">
                  Is pre-selected
                </label>
                <div className="col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={valIsPreSelected}
                    onChange={(e) => setValIsPreSelected(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>

              {/* Display order */}
              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-right font-medium text-slate-700">
                  Display order
                </label>
                <div className="col-span-8">
                  <input
                    type="number"
                    value={valDisplayOrder}
                    onChange={(e) => setValDisplayOrder(parseInt(e.target.value, 10) || 1)}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-[#d2d6de] bg-white focus:border-[#3c8dbc] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#f4f6f9] border-t border-[#e5e7eb] px-4 py-2.5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="bg-white border border-[#d2d6de] hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePredefinedValue}
                className="bg-[#2585be] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3 py-1.5 rounded transition cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

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
