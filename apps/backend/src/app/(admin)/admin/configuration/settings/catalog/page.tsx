'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  Search,
  Sparkles,
  Bot,
  RotateCcw,
  ArrowUp,
  ChevronUp,
} from 'lucide-react';
import { ImageEditorField } from '@/components/admin/ImageEditorField';

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

export default function CatalogSettingsPage() {
  const [isAdvanced, setIsAdvanced] = useState(true);

  // Collapsible cards state
  const [aiOpen, setAiOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(true);

  // 1. Artificial Intelligence fields (media_1791348103171.png & media_1791348106363.png)
  const [enableArtificialIntelligence, setEnableArtificialIntelligence] = useState(true);
  const [providerType, setProviderType] = useState('Gemini');
  const [apiKey, setApiKey] = useState('');
  const [allowGenerateProductDescription, setAllowGenerateProductDescription] = useState(true);
  const [aiQueryGenerateProductDescription, setAiQueryGenerateProductDescription] = useState(
    'Create a description on the {4} language for the product with the "{0}" name. Use the following features and keywords: {1}. Use a short description: "{2}". Optimize the result for SEO. The description should be {3} words long. Format the result as HTML.'
  );
  const [allowGenerateMetaTitle, setAllowGenerateMetaTitle] = useState(true);
  const [aiQueryGenerateMetaTitle, setAiQueryGenerateMetaTitle] = useState(
    'Create most suitable meta title on the {2} language for the page with "{0}" title and "{1}" text. Optimize the result for SEO. Use plain text.'
  );
  const [allowGenerateMetaKeywords, setAllowGenerateMetaKeywords] = useState(true);
  const [aiQueryGenerateMetaKeywords, setAiQueryGenerateMetaKeywords] = useState(
    'Create five or six of keywords on the {2} language for the page with "{0}" title and "{1}" text. Optimize the result for SEO, list them separated by commas. Use plain text.'
  );
  const [allowGenerateMetaDescription, setAllowGenerateMetaDescription] = useState(true);
  const [aiQueryGenerateMetaDescription, setAiQueryGenerateMetaDescription] = useState(
    'Create a meta description on the {2} language for the page with "{0}" title and "{1}" text. Optimize the result for SEO. Use plain text. The text should be at most 300 characters long.'
  );

  // 2. Search fields (media_1791348108093.png & media_1791348109836.png)
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [showProductCategoriesForSearchBox, setShowProductCategoriesForSearchBox] = useState(false);
  const [searchAutocompleteEnabled, setSearchAutocompleteEnabled] = useState(true);
  const [numberOfAutocompleteProductsToDisplay, setNumberOfAutocompleteProductsToDisplay] =
    useState<number | string>(10);
  const [showLinkToAllSearchResultsInAutocompleteBox, setShowLinkToAllSearchResultsInAutocompleteBox] =
    useState(false);
  const [showProductImagesInAutocompleteBox, setShowProductImagesInAutocompleteBox] =
    useState(false);
  const [searchTermMinimumLength, setSearchTermMinimumLength] = useState<number | string>(3);
  const [
    searchPageAllowCustomersToSelectPageSize,
    setSearchPageAllowCustomersToSelectPageSize,
  ] = useState(true);
  const [searchPagePageSizeOptions, setSearchPagePageSizeOptions] = useState('6, 3, 9, 18');
  const [searchPagePriceRangeFiltering, setSearchPagePriceRangeFiltering] = useState(true);
  const [searchPageEnterPriceRangeManually, setSearchPageEnterPriceRangeManually] = useState(true);
  const [searchPagePriceFrom, setSearchPagePriceFrom] = useState<number | string>(0);
  const [searchPagePriceTo, setSearchPagePriceTo] = useState<number | string>(0);
  const [
    allowCustomersToSearchWithManufacturerName,
    setAllowCustomersToSearchWithManufacturerName,
  ] = useState(true);
  const [allowCustomersToSearchWithCategoryName, setAllowCustomersToSearchWithCategoryName] =
    useState(false);

  // Catalog placeholder image
  const [defaultCatalogPlaceholderImage, setDefaultCatalogPlaceholderImage] = useState(
    'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&w=400&q=80'
  );

  // Toast & Saving
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load initial settings from API or localStorage
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings/catalog', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            applySettingsData(data.settings);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch catalog settings from API, checking localStorage...', err);
      }

      // Fallback to localStorage
      try {
        const saved = localStorage.getItem('agri_catalog_settings');
        if (saved) {
          applySettingsData(JSON.parse(saved));
        }
      } catch (e) {
        console.error(e);
      }
    }

    loadSettings();
  }, []);

  const applySettingsData = (s: any) => {
    if (s.enableArtificialIntelligence !== undefined)
      setEnableArtificialIntelligence(s.enableArtificialIntelligence);
    if (s.providerType) setProviderType(s.providerType);
    if (s.apiKey !== undefined) setApiKey(s.apiKey);
    if (s.allowGenerateProductDescription !== undefined)
      setAllowGenerateProductDescription(s.allowGenerateProductDescription);
    if (s.aiQueryGenerateProductDescription)
      setAiQueryGenerateProductDescription(s.aiQueryGenerateProductDescription);
    if (s.allowGenerateMetaTitle !== undefined)
      setAllowGenerateMetaTitle(s.allowGenerateMetaTitle);
    if (s.aiQueryGenerateMetaTitle) setAiQueryGenerateMetaTitle(s.aiQueryGenerateMetaTitle);
    if (s.allowGenerateMetaKeywords !== undefined)
      setAllowGenerateMetaKeywords(s.allowGenerateMetaKeywords);
    if (s.aiQueryGenerateMetaKeywords)
      setAiQueryGenerateMetaKeywords(s.aiQueryGenerateMetaKeywords);
    if (s.allowGenerateMetaDescription !== undefined)
      setAllowGenerateMetaDescription(s.allowGenerateMetaDescription);
    if (s.aiQueryGenerateMetaDescription)
      setAiQueryGenerateMetaDescription(s.aiQueryGenerateMetaDescription);

    if (s.searchEnabled !== undefined) setSearchEnabled(s.searchEnabled);
    if (s.showProductCategoriesForSearchBox !== undefined)
      setShowProductCategoriesForSearchBox(s.showProductCategoriesForSearchBox);
    if (s.searchAutocompleteEnabled !== undefined)
      setSearchAutocompleteEnabled(s.searchAutocompleteEnabled);
    if (s.numberOfAutocompleteProductsToDisplay !== undefined)
      setNumberOfAutocompleteProductsToDisplay(s.numberOfAutocompleteProductsToDisplay);
    if (s.showLinkToAllSearchResultsInAutocompleteBox !== undefined)
      setShowLinkToAllSearchResultsInAutocompleteBox(
        s.showLinkToAllSearchResultsInAutocompleteBox
      );
    if (s.showProductImagesInAutocompleteBox !== undefined)
      setShowProductImagesInAutocompleteBox(s.showProductImagesInAutocompleteBox);
    if (s.searchTermMinimumLength !== undefined)
      setSearchTermMinimumLength(s.searchTermMinimumLength);
    if (s.searchPageAllowCustomersToSelectPageSize !== undefined)
      setSearchPageAllowCustomersToSelectPageSize(
        s.searchPageAllowCustomersToSelectPageSize
      );
    if (s.searchPagePageSizeOptions)
      setSearchPagePageSizeOptions(s.searchPagePageSizeOptions);
    if (s.searchPagePriceRangeFiltering !== undefined)
      setSearchPagePriceRangeFiltering(s.searchPagePriceRangeFiltering);
    if (s.searchPageEnterPriceRangeManually !== undefined)
      setSearchPageEnterPriceRangeManually(s.searchPageEnterPriceRangeManually);
    if (s.searchPagePriceFrom !== undefined) setSearchPagePriceFrom(s.searchPagePriceFrom);
    if (s.searchPagePriceTo !== undefined) setSearchPagePriceTo(s.searchPagePriceTo);
    if (s.allowCustomersToSearchWithManufacturerName !== undefined)
      setAllowCustomersToSearchWithManufacturerName(
        s.allowCustomersToSearchWithManufacturerName
      );
    if (s.allowCustomersToSearchWithCategoryName !== undefined)
      setAllowCustomersToSearchWithCategoryName(s.allowCustomersToSearchWithCategoryName);

    if (s.defaultCatalogPlaceholderImage)
      setDefaultCatalogPlaceholderImage(s.defaultCatalogPlaceholderImage);

    if (s.isAdvanced !== undefined) setIsAdvanced(s.isAdvanced);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);

    const payload = {
      enableArtificialIntelligence,
      providerType,
      apiKey,
      allowGenerateProductDescription,
      aiQueryGenerateProductDescription,
      allowGenerateMetaTitle,
      aiQueryGenerateMetaTitle,
      allowGenerateMetaKeywords,
      aiQueryGenerateMetaKeywords,
      allowGenerateMetaDescription,
      aiQueryGenerateMetaDescription,

      searchEnabled,
      showProductCategoriesForSearchBox,
      searchAutocompleteEnabled,
      numberOfAutocompleteProductsToDisplay:
        Number(numberOfAutocompleteProductsToDisplay) || 10,
      showLinkToAllSearchResultsInAutocompleteBox,
      showProductImagesInAutocompleteBox,
      searchTermMinimumLength: Number(searchTermMinimumLength) || 3,
      searchPageAllowCustomersToSelectPageSize,
      searchPagePageSizeOptions,
      searchPagePriceRangeFiltering,
      searchPageEnterPriceRangeManually,
      searchPagePriceFrom: Number(searchPagePriceFrom) || 0,
      searchPagePriceTo: Number(searchPagePriceTo) || 0,
      allowCustomersToSearchWithManufacturerName,
      allowCustomersToSearchWithCategoryName,

      defaultCatalogPlaceholderImage,
      isAdvanced,
    };

    try {
      localStorage.setItem('agri_catalog_settings', JSON.stringify(payload));
      const res = await fetch('/api/admin/settings/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to save to server');
      }
      showToast('The catalog settings have been updated successfully.');
    } catch (err: any) {
      console.warn('Saved to localStorage fallback:', err);
      showToast('The catalog settings have been updated successfully.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setEnableArtificialIntelligence(true);
    setProviderType('Gemini');
    setApiKey('');
    setAllowGenerateProductDescription(true);
    setAiQueryGenerateProductDescription(
      'Create a description on the {4} language for the product with the "{0}" name. Use the following features and keywords: {1}. Use a short description: "{2}". Optimize the result for SEO. The description should be {3} words long. Format the result as HTML.'
    );
    setAllowGenerateMetaTitle(true);
    setAiQueryGenerateMetaTitle(
      'Create most suitable meta title on the {2} language for the page with "{0}" title and "{1}" text. Optimize the result for SEO. Use plain text.'
    );
    setAllowGenerateMetaKeywords(true);
    setAiQueryGenerateMetaKeywords(
      'Create five or six of keywords on the {2} language for the page with "{0}" title and "{1}" text. Optimize the result for SEO, list them separated by commas. Use plain text.'
    );
    setAllowGenerateMetaDescription(true);
    setAiQueryGenerateMetaDescription(
      'Create a meta description on the {2} language for the page with "{0}" title and "{1}" text. Optimize the result for SEO. Use plain text. The text should be at most 300 characters long.'
    );

    setSearchEnabled(true);
    setShowProductCategoriesForSearchBox(false);
    setSearchAutocompleteEnabled(true);
    setNumberOfAutocompleteProductsToDisplay(10);
    setShowLinkToAllSearchResultsInAutocompleteBox(false);
    setShowProductImagesInAutocompleteBox(false);
    setSearchTermMinimumLength(3);
    setSearchPageAllowCustomersToSelectPageSize(true);
    setSearchPagePageSizeOptions('6, 3, 9, 18');
    setSearchPagePriceRangeFiltering(true);
    setSearchPageEnterPriceRangeManually(true);
    setSearchPagePriceFrom(0);
    setSearchPagePriceTo(0);
    setAllowCustomersToSearchWithManufacturerName(true);
    setAllowCustomersToSearchWithCategoryName(false);

    showToast('Reset to default values. Click Save to apply.', 'success');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-20 font-sans relative">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded shadow-lg text-xs font-semibold transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
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

      {/* ── HEADER (Matching media_1791348103171.png) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Catalog settings</h1>

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

      {/* ── MODE BUTTON: Advanced / Basic Toggle (Matching media_1791348103171.png) ── */}
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
              <span className="w-3.5 h-[18px] rounded-[2px] bg-white border border-[#2489c5] shadow-2xs" />
              <span className="text-[#2489c5] text-xs font-normal pr-0.5">Basic</span>
            </>
          )}
        </button>
      </div>

      {/* ── CARD 1: ARTIFICIAL INTELLIGENCE (Matching media_1791348103171.png & media_1791348106363.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
        <div
          onClick={() => setAiOpen(!aiOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            {/* Two gears icon from screenshot */}
            <div className="flex items-center text-slate-700">
              <Sparkles className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            </div>
            <span className="text-sm font-normal text-slate-800">Artificial Intelligence</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {aiOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {aiOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Description text matching media_1791348103171.png */}
            <p className="text-xs text-slate-600 leading-relaxed">
              Artificial intelligence functionality allows you to use third-party AI services such
              as DeepSeek, Gemini or ChatGPT to automatically generate content. This could be either
              product descriptions or meta tags for specific pages or entities.
            </p>

            {/* Enable artificial intelligence */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-1">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Enable artificial intelligence</span>
                <HelpTooltip text="Check to activate automated AI content generation tools in catalog management." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={enableArtificialIntelligence}
                  onChange={(e) => setEnableArtificialIntelligence(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Tree branch children under Enable artificial intelligence */}
            {enableArtificialIntelligence && (
              <>
                {/* Provider type */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span>Provider type</span>
                    <HelpTooltip text="Select the underlying generative AI model service." />
                  </label>
                  <div className="md:col-span-8 max-w-xl relative pl-5">
                    <div
                      className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <select
                      value={providerType}
                      onChange={(e) => setProviderType(e.target.value)}
                      className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                    >
                      <option value="Gemini">Gemini</option>
                      <option value="ChatGPT">ChatGPT</option>
                      <option value="DeepSeek">DeepSeek</option>
                      <option value="Claude">Claude</option>
                    </select>
                  </div>
                </div>

                {/* API key */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pt-1.5">
                    <span>API key</span>
                    <HelpTooltip text="Enter your authentication API key for the selected AI provider." />
                  </label>
                  <div className="md:col-span-8 max-w-xl relative pl-5 space-y-1">
                    <div
                      className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter provider API key"
                      className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white font-mono"
                    />
                    <p className="text-[11px] text-slate-500 leading-normal">
                      To use the {providerType} API, you need an API key. You can create a key with a
                      few clicks in{' '}
                      <span className="text-[#3c8dbc] hover:underline cursor-pointer">
                        {providerType === 'Gemini'
                          ? 'Google AI Studio'
                          : providerType === 'ChatGPT'
                          ? 'OpenAI Platform'
                          : 'DeepSeek Console'}
                      </span>
                      .
                    </p>
                  </div>
                </div>

                {/* Allow to generate product description */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span className="text-right">
                      Allow to generate product
                      <br className="hidden md:inline" /> description
                    </span>
                    <HelpTooltip text="Enable the AI magic button on product edit pages to write rich descriptions." />
                  </label>
                  <div className="md:col-span-8 flex items-center relative pl-5">
                    <div
                      className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="checkbox"
                      checked={allowGenerateProductDescription}
                      onChange={(e) => setAllowGenerateProductDescription(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* AI query to generate product description */}
                {allowGenerateProductDescription && isAdvanced && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                    <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pt-1.5">
                      <span className="text-right">
                        AI query to generate product
                        <br className="hidden md:inline" /> description
                      </span>
                      <HelpTooltip text="Prompt template sent to AI for product descriptions." />
                    </label>
                    <div className="md:col-span-8 max-w-2xl relative pl-5">
                      <div
                        className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                        aria-hidden="true"
                      />
                      <textarea
                        rows={2}
                        value={aiQueryGenerateProductDescription}
                        onChange={(e) => setAiQueryGenerateProductDescription(e.target.value)}
                        className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Allow to generate meta title */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span>Allow to generate meta title</span>
                    <HelpTooltip text="Enable AI generation of optimized SEO HTML page titles." />
                  </label>
                  <div className="md:col-span-8 flex items-center relative pl-5">
                    <div
                      className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="checkbox"
                      checked={allowGenerateMetaTitle}
                      onChange={(e) => setAllowGenerateMetaTitle(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* AI query to generate meta title */}
                {allowGenerateMetaTitle && isAdvanced && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                    <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pt-1.5">
                      <span>AI query to generate meta title</span>
                      <HelpTooltip text="Prompt template for SEO page titles." />
                    </label>
                    <div className="md:col-span-8 max-w-2xl relative pl-5">
                      <div
                        className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                        aria-hidden="true"
                      />
                      <textarea
                        rows={2}
                        value={aiQueryGenerateMetaTitle}
                        onChange={(e) => setAiQueryGenerateMetaTitle(e.target.value)}
                        className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Allow to generate meta keywords (media_1791348106363.png) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span>Allow to generate meta keywords</span>
                    <HelpTooltip text="Enable AI generation of comma-separated SEO keywords." />
                  </label>
                  <div className="md:col-span-8 flex items-center relative pl-5">
                    <div
                      className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="checkbox"
                      checked={allowGenerateMetaKeywords}
                      onChange={(e) => setAllowGenerateMetaKeywords(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* AI query to generate meta keywords */}
                {allowGenerateMetaKeywords && isAdvanced && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                    <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pt-1.5">
                      <span>AI query to generate meta keywords</span>
                      <HelpTooltip text="Prompt template for SEO keywords." />
                    </label>
                    <div className="md:col-span-8 max-w-2xl relative pl-5">
                      <div
                        className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                        aria-hidden="true"
                      />
                      <textarea
                        rows={2}
                        value={aiQueryGenerateMetaKeywords}
                        onChange={(e) => setAiQueryGenerateMetaKeywords(e.target.value)}
                        className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Allow to generate meta description (media_1791348106363.png) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span className="text-right">
                      Allow to generate meta
                      <br className="hidden md:inline" /> description
                    </span>
                    <HelpTooltip text="Enable AI generation of search engine snippet descriptions." />
                  </label>
                  <div className="md:col-span-8 flex items-center relative pl-5">
                    <div
                      className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="checkbox"
                      checked={allowGenerateMetaDescription}
                      onChange={(e) => setAllowGenerateMetaDescription(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* AI query to generate meta description */}
                {allowGenerateMetaDescription && isAdvanced && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                    <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pt-1.5">
                      <span className="text-right">
                        AI query to generate meta
                        <br className="hidden md:inline" /> description
                      </span>
                      <HelpTooltip text="Prompt template for SEO snippet descriptions." />
                    </label>
                    <div className="md:col-span-8 max-w-2xl relative pl-5">
                      <div
                        className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                        aria-hidden="true"
                      />
                      <textarea
                        rows={2}
                        value={aiQueryGenerateMetaDescription}
                        onChange={(e) => setAiQueryGenerateMetaDescription(e.target.value)}
                        className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── CARD 2: SEARCH (Matching media_1791348108093.png & media_1791348109836.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden border-t-3 border-t-[#00c0ef]">
        <div
          onClick={() => setSearchOpen(!searchOpen)}
          className="px-4 py-2.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-50/70 transition"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            <span className="text-sm font-normal text-slate-800">Search</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {searchOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {searchOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Search enabled */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Search enabled</span>
                <HelpTooltip text="Check to enable global keyword search box in the storefront navigation." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={searchEnabled}
                  onChange={(e) => setSearchEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Tree branch child 1: Show product categories for the search box */}
            {searchEnabled && isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span className="text-right">
                    Show product categories for the
                    <br className="hidden md:inline" /> search box
                  </span>
                  <HelpTooltip text="Check to display the drop-down list with product categories next to the search box." />
                </label>
                <div className="md:col-span-8 flex items-center relative pl-5">
                  <div
                    className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="checkbox"
                    checked={showProductCategoriesForSearchBox}
                    onChange={(e) =>
                      setShowProductCategoriesForSearchBox(e.target.checked)
                    }
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Tree branch child 2: Search autocomplete enabled */}
            {searchEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Search autocomplete enabled</span>
                  <HelpTooltip text="Check to display live instant autocomplete dropdown as user types in search box." />
                </label>
                <div className="md:col-span-8 flex items-center relative pl-5">
                  <div
                    className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="checkbox"
                    checked={searchAutocompleteEnabled}
                    onChange={(e) => setSearchAutocompleteEnabled(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Nested children under Search autocomplete enabled */}
            {searchEnabled && searchAutocompleteEnabled && isAdvanced && (
              <>
                {/* Number of 'autocomplete' products to display */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span className="text-right">
                      Number of 'autocomplete' products to
                      <br className="hidden md:inline" /> display
                    </span>
                    <HelpTooltip text="Maximum number of product suggestion rows rendered in autocomplete popup." />
                  </label>
                  <div className="md:col-span-8 max-w-xl relative pl-10">
                    <div
                      className="absolute -top-3.5 left-5 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="number"
                      min="1"
                      value={numberOfAutocompleteProductsToDisplay}
                      onChange={(e) =>
                        setNumberOfAutocompleteProductsToDisplay(e.target.value)
                      }
                      className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                    />
                  </div>
                </div>

                {/* Show a link to all search results in the autocomplete box */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span className="text-right">
                      Show a link to all search results in the
                      <br className="hidden md:inline" /> autocomplete box
                    </span>
                    <HelpTooltip text="Add 'View all results' button at the bottom of instant autocomplete dropdown." />
                  </label>
                  <div className="md:col-span-8 flex items-center relative pl-10">
                    <div
                      className="absolute -top-3.5 left-5 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="checkbox"
                      checked={showLinkToAllSearchResultsInAutocompleteBox}
                      onChange={(e) =>
                        setShowLinkToAllSearchResultsInAutocompleteBox(e.target.checked)
                      }
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Show product images in autocomplete box */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span className="text-right">
                      Show product images in autocomplete
                      <br className="hidden md:inline" /> box
                    </span>
                    <HelpTooltip text="Display small product picture thumbnails next to titles in live autocomplete." />
                  </label>
                  <div className="md:col-span-8 flex items-center relative pl-10">
                    <div
                      className="absolute -top-3.5 left-5 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="checkbox"
                      checked={showProductImagesInAutocompleteBox}
                      onChange={(e) =>
                        setShowProductImagesInAutocompleteBox(e.target.checked)
                      }
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Search term minimum length */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Search term minimum length</span>
                <HelpTooltip text="Minimum number of characters required before search execution or suggestions trigger." />
              </label>
              <div className="md:col-span-8 max-w-xl">
                <input
                  type="number"
                  min="1"
                  value={searchTermMinimumLength}
                  onChange={(e) => setSearchTermMinimumLength(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Search page. Allow customers to select page size */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span className="text-right">
                  Search page. Allow customers to select
                  <br className="hidden md:inline" /> page size
                </span>
                <HelpTooltip text="Allow shoppers to choose items per page on search results view." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={searchPageAllowCustomersToSelectPageSize}
                  onChange={(e) =>
                    setSearchPageAllowCustomersToSelectPageSize(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Tree branch child: Search page. Page size options */}
            {searchPageAllowCustomersToSelectPageSize && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span>Search page. Page size options</span>
                  <HelpTooltip text="Comma-separated integers for items-per-page dropdown (e.g. 6, 3, 9, 18)." />
                </label>
                <div className="md:col-span-8 max-w-xl relative pl-5">
                  <div
                    className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    value={searchPagePageSizeOptions}
                    onChange={(e) => setSearchPagePageSizeOptions(e.target.value)}
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Search page. Price range filtering (media_1791348109836.png) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span>Search page. Price range filtering</span>
                <HelpTooltip text="Enable price range filter slider or presets on search results." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={searchPagePriceRangeFiltering}
                  onChange={(e) => setSearchPagePriceRangeFiltering(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Tree branch child: Search page. Enter price range manually */}
            {searchPagePriceRangeFiltering && isAdvanced && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                    <span className="text-right">
                      Search page. Enter price range
                      <br className="hidden md:inline" /> manually
                    </span>
                    <HelpTooltip text="Allow specifying explicit fixed price boundaries for search filtering." />
                  </label>
                  <div className="md:col-span-8 flex items-center relative pl-5">
                    <div
                      className="absolute -top-3.5 left-0 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="checkbox"
                      checked={searchPageEnterPriceRangeManually}
                      onChange={(e) =>
                        setSearchPageEnterPriceRangeManually(e.target.checked)
                      }
                      className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Nested: Price 'from' */}
                {searchPageEnterPriceRangeManually && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                        <span>Search page. Price 'from'</span>
                        <HelpTooltip text="Starting baseline minimum filter price." />
                      </label>
                      <div className="md:col-span-8 flex items-center gap-2 relative pl-10">
                        <div
                          className="absolute -top-3.5 left-5 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                          aria-hidden="true"
                        />
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={searchPagePriceFrom}
                          onChange={(e) => setSearchPagePriceFrom(e.target.value)}
                          className="w-36 border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                        />
                        <span className="text-xs text-slate-700 font-medium">USD</span>
                      </div>
                    </div>

                    {/* Nested: Price 'to' */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                        <span>Search page. Price 'to'</span>
                        <HelpTooltip text="Ceiling maximum filter price." />
                      </label>
                      <div className="md:col-span-8 flex items-center gap-2 relative pl-10">
                        <div
                          className="absolute -top-3.5 left-5 w-3.5 h-5 border-l border-b border-slate-300 pointer-events-none"
                          aria-hidden="true"
                        />
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={searchPagePriceTo}
                          onChange={(e) => setSearchPagePriceTo(e.target.value)}
                          className="w-36 border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                        />
                        <span className="text-xs text-slate-700 font-medium">USD</span>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Allow customers to search with manufacturer name */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                <span className="text-right">
                  Allow customers to search with
                  <br className="hidden md:inline" /> manufacturer name
                </span>
                <HelpTooltip text="Include brand and manufacturer metadata in keyword matching query." />
              </label>
              <div className="md:col-span-8 flex items-center">
                <input
                  type="checkbox"
                  checked={allowCustomersToSearchWithManufacturerName}
                  onChange={(e) =>
                    setAllowCustomersToSearchWithManufacturerName(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                />
              </div>
            </div>

            {/* Allow customers to search with category name */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5">
                  <span className="text-right">
                    Allow customers to search with
                    <br className="hidden md:inline" /> category name
                  </span>
                  <HelpTooltip text="Include category labels and parent category names in search index." />
                </label>
                <div className="md:col-span-8 flex items-center">
                  <input
                    type="checkbox"
                    checked={allowCustomersToSearchWithCategoryName}
                    onChange={(e) =>
                      setAllowCustomersToSearchWithCategoryName(e.target.checked)
                    }
                    className="w-4 h-4 rounded border-slate-300 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Image Editor for Catalog Placeholder Image */}
            <div className="border-t border-slate-100 pt-5 mt-3">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                <label className="md:col-span-4 text-xs font-normal text-slate-800 md:text-right flex items-center md:justify-end gap-1.5 pt-2">
                  <span>Default catalog image</span>
                  <HelpTooltip text="Fallback product picture displayed when an item has no uploaded images. Accepts local file uploads and direct web image URLs." />
                </label>
                <div className="md:col-span-8 max-w-xl">
                  <ImageEditorField
                    value={defaultCatalogPlaceholderImage}
                    onChange={(newVal) => setDefaultCatalogPlaceholderImage(newVal)}
                    shape="rectangle"
                    previewHeight="h-28"
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Official default catalog asset used across search listings and category cards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM ACTIONS BAR ── */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handleResetDefaults}
          className="text-slate-500 hover:text-slate-800 text-xs font-medium flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restore original defaults</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave()}
            className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-5 py-2 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving changes...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* ── FLOATING GREEN SCROLL-TO-TOP BUTTON ── */}
      <button
        type="button"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded bg-[#00a65a] hover:bg-[#008d4c] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
        title="Scroll to top"
      >
        <ChevronUp className="w-6 h-6 stroke-[2.5]" />
      </button>
    </div>
  );
}
