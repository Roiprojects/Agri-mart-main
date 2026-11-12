'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Save,
  ArrowLeft,
  Copy,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Upload,
  Check,
  Send,
} from 'lucide-react';

function HelpTooltip({ text }: { text: string }) {
  return (
    <span
      title={text}
      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#3c8dbc] text-white text-[10px] font-bold cursor-help shrink-0 shadow-2xs select-none"
    >
      ?
    </span>
  );
}

const TEMPLATE_TOKENS: Record<string, string[]> = {
  'Blog.BlogComment': [
    '%Store.Name%',
    '%Store.URL%',
    '%Store.Email%',
    '%BlogComment.BlogPostId%',
    '%BlogPost.Title%',
    '%BlogComment.CustomerName%',
    '%BlogComment.CommentText%',
    '%BlogComment.CreatedOn%',
  ],
  'Customer.BackInStock': [
    '%Store.Name%',
    '%Store.URL%',
    '%Customer.FullName%',
    '%Customer.Email%',
    '%Product.Name%',
    '%Product.ProductURL%',
  ],
  'Customer.EmailValidationMessage': [
    '%Store.Name%',
    '%Store.URL%',
    '%Customer.FullName%',
    '%Customer.Email%',
    '%Customer.EmailValidationURL%',
  ],
  'Customer.PasswordRecovery': [
    '%Store.Name%',
    '%Store.URL%',
    '%Customer.FullName%',
    '%Customer.Email%',
    '%Customer.PasswordRecoveryURL%',
  ],
  'Customer.WelcomeMessage': [
    '%Store.Name%',
    '%Store.URL%',
    '%Customer.FullName%',
    '%Customer.Email%',
  ],
  'OrderPlaced.CustomerNotification': [
    '%Store.Name%',
    '%Store.URL%',
    '%Order.OrderNumber%',
    '%Order.CustomerFullName%',
    '%Order.CustomerEmail%',
    '%Order.OrderTotal%',
    '%Order.OrderDetailsURL%',
  ],
};

const DEFAULT_TOKENS = [
  '%Store.Name%',
  '%Store.URL%',
  '%Store.Email%',
  '%Customer.FullName%',
  '%Customer.Email%',
];

export default function EditMessageTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  // Mode: Advanced (true) / Basic (false) - per media_1791194690462.png & media_1791194857334.png
  const [isAdvanced, setIsAdvanced] = useState(true);

  // Tabs
  const [activeTab, setActiveTab] = useState<'standard' | 'en' | 'rtl'>('standard');
  const [showTokens, setShowTokens] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Loading & Saving
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form Fields matching screenshots
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [bcc, setBcc] = useState('');
  const [emailAccount, setEmailAccount] = useState('Store name (test@mail.com)');
  const [isActive, setIsActive] = useState(true);
  const [sendImmediately, setSendImmediately] = useState(true);
  const [allowDirectReply, setAllowDirectReply] = useState(true);
  const [hasAttachedFile, setHasAttachedFile] = useState(true);
  const [attachedFileName, setAttachedFileName] = useState('');
  const [limitedToStores, setLimitedToStores] = useState('');

  // Test template modal
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('kisan.admin@agrimart.com');
  const [sendingTest, setSendingTest] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (!id) return;
    const fetchTemplate = async () => {
      try {
        const res = await fetch(`/api/admin/content/message-templates/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          const t = json.data;
          setName(t.name || '');
          setSubject(t.subject || '');
          setBody(t.body || '<p>\n<a href="%Store.URL%">%Store.Name%</a>\n<br />\n<br />\n</p>');
          setBcc(t.bcc || '');
          setEmailAccount(t.emailAccount || 'Store name (test@mail.com)');
          setIsActive(t.isActive !== undefined ? Boolean(t.isActive) : true);
          setSendImmediately(t.sendImmediately !== undefined ? Boolean(t.sendImmediately) : true);
          setAllowDirectReply(t.allowDirectReply !== undefined ? Boolean(t.allowDirectReply) : true);
          setHasAttachedFile(t.hasAttachedFile !== undefined ? Boolean(t.hasAttachedFile) : true);
          setLimitedToStores(t.limitedToStores === 'All stores' ? '' : t.limitedToStores || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [id]);

  const handleCopyToken = (tok: string) => {
    navigator.clipboard?.writeText(tok);
    setCopiedToken(tok);
    setTimeout(() => setCopiedToken(null), 2000);
    setBody((prev) => (prev ? `${prev} ${tok}` : tok));
  };

  const handleSave = async (continueEditing: boolean = false) => {
    if (!subject.trim()) {
      showToast('Subject is required.', 'error');
      return;
    }
    if (!body.trim()) {
      showToast('Body content is required.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name,
        subject: subject.trim(),
        body: body.trim(),
        bcc: bcc.trim(),
        emailAccount,
        isActive,
        sendImmediately,
        allowDirectReply,
        hasAttachedFile,
        limitedToStores: limitedToStores.trim() || 'All stores',
      };

      const res = await fetch(`/api/admin/content/message-templates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        showToast('The message template has been updated successfully.', 'success');
        if (!continueEditing) {
          setTimeout(() => {
            router.push('/admin/content/message-templates');
          }, 800);
        }
      } else {
        showToast(json.error || 'Failed to update message template.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'An error occurred while saving.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyTemplate = async () => {
    try {
      const newTemplateName = `${name}.Copy`;
      const res = await fetch('/api/admin/content/message-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTemplateName,
          subject: `${subject} (Copy)`,
          body,
          isActive,
          limitedToStores: limitedToStores || 'All stores',
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Template copied successfully as "${newTemplateName}".`, 'success');
        setTimeout(() => {
          router.push(`/admin/content/message-templates/${json.data.id}`);
        }, 1000);
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete message template "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/content/message-templates/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        router.push('/admin/content/message-templates');
      } else {
        showToast(json.error || 'Failed to delete template.', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleSendTestEmail = () => {
    if (!testEmailAddress.trim()) {
      showToast('Please enter an email address', 'error');
      return;
    }
    setSendingTest(true);
    setTimeout(() => {
      setSendingTest(false);
      setTestModalOpen(false);
      showToast(`Test email successfully dispatched to ${testEmailAddress}.`, 'success');
    }, 900);
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500 font-sans">Loading message template...</div>;
  }

  const tokensList = TEMPLATE_TOKENS[name] || DEFAULT_TOKENS;

  return (
    <div className="space-y-4 max-w-full text-slate-800 pb-20 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded shadow-lg text-white text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
            toast.type === 'success' ? 'bg-[#00a65a]' : 'bg-[#dd4b39]'
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

      {/* ── TOP HEADER (Matching media_1791194690462.png) ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-normal text-slate-800 tracking-tight">
            Edit message template details - <span className="font-semibold text-slate-900">{name}</span>
          </h1>
          <Link
            href="/admin/content/message-templates"
            className="inline-flex items-center gap-1 text-xs text-[#2489c5] hover:underline"
          >
            <span className="w-4 h-4 rounded-full bg-[#2489c5] text-white flex items-center justify-center shrink-0">
              <ArrowLeft className="w-2.5 h-2.5 stroke-[2.5]" />
            </span>
            <span>back to return message template list</span>
          </Link>
        </div>

        {/* Action Buttons matching screenshot */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(false)}
            className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(true)}
            className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save and Continue Edit</span>
          </button>
          <button
            type="button"
            onClick={handleCopyTemplate}
            className="bg-[#00a65a] hover:bg-[#008d4c] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy template</span>
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-[#dd4b39] hover:bg-[#d73925] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* ── MODE BUTTON: Advanced / Basic Toggle (Matching media_1791194690462.png & media_1791194857334.png) ── */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setIsAdvanced(!isAdvanced)}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer select-none shadow-2xs ${
            isAdvanced
              ? 'bg-[#2489c5] hover:bg-[#1f72a3] text-white'
              : 'bg-white hover:bg-slate-50 border border-[#d2d6de] text-slate-700'
          }`}
        >
          {!isAdvanced && (
            <span className="w-2.5 h-4.5 rounded-full border border-[#d2d6de] bg-white shadow-2xs inline-block shrink-0" />
          )}
          <span>{isAdvanced ? 'Advanced' : 'Basic'}</span>
          {isAdvanced && (
            <span className="w-2.5 h-4.5 rounded-full bg-white shadow-2xs inline-block shrink-0" />
          )}
        </button>
      </div>

      {/* ── DESCRIPTION BANNER matching screenshot ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs p-4 md:p-6 space-y-3">
        <p className="text-xs text-slate-600 italic leading-relaxed">
          This message template is used when a new blog comment to the certain blog post is created. The message is received by a store owner. You can set up this option by ticking the checkbox{' '}
          <strong className="font-semibold text-slate-700 not-italic">Notify about new blog comments</strong> in Configuration - Settings - Blog settings.
        </p>

        {/* Allowed message tokens row */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-semibold text-slate-700">Allowed message tokens</span>
          <HelpTooltip text="Tokens that will be dynamically replaced when this email template is dispatched." />
          <button
            type="button"
            onClick={() => setShowTokens(!showTokens)}
            className="text-[#2489c5] hover:underline cursor-pointer ml-1 font-normal text-xs"
          >
            {showTokens ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* Tokens list dropdown */}
        {showTokens && (
          <div className="p-3 bg-slate-50 border border-[#d2d6de] rounded text-xs space-y-2">
            <p className="text-[11px] text-slate-500">
              Click any token below to copy and append it into the message body:
            </p>
            <div className="flex flex-wrap gap-2">
              {tokensList.map((tok) => (
                <button
                  key={tok}
                  type="button"
                  onClick={() => handleCopyToken(tok)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white border border-slate-300 hover:border-[#3c8dbc] hover:text-[#3c8dbc] text-slate-700 text-xs font-mono transition cursor-pointer shadow-2xs"
                >
                  <span>{tok}</span>
                  {copiedToken === tok ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Name Row */}
        <div className="flex items-center gap-2 pt-1 text-xs">
          <span className="font-semibold text-slate-700 w-24 sm:w-32 text-right">Name</span>
          <HelpTooltip text="The system name of the message template." />
          <span className="font-semibold text-slate-800 ml-2 font-mono">{name}</span>
        </div>

        {/* ── TABS CARD (Standard / EN / RTL) ── */}
        <div className="border border-[#d2d6de] rounded-xs mt-4 overflow-hidden">
          {/* Tabs bar matching media_1791194690462.png */}
          <div className="bg-[#f9fafb] border-b border-[#d2d6de] flex items-center px-2 pt-1.5 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('standard')}
              className={`px-4 py-2 text-xs font-semibold rounded-t border-t-2 transition cursor-pointer ${
                activeTab === 'standard'
                  ? 'bg-white border-t-[#00c0ef] border-x border-b-transparent text-slate-800 -mb-px'
                  : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Standard
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('en')}
              className={`px-4 py-2 text-xs font-semibold rounded-t border-t-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'en'
                  ? 'bg-white border-t-[#00c0ef] border-x border-b-transparent text-slate-800 -mb-px'
                  : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>🇺🇸</span>
              <span>EN</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rtl')}
              className={`px-4 py-2 text-xs font-semibold rounded-t border-t-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'rtl'
                  ? 'bg-white border-t-[#00c0ef] border-x border-b-transparent text-slate-800 -mb-px'
                  : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>🇮🇱</span>
              <span>RTL</span>
            </button>
          </div>

          <div className="p-5 space-y-4 bg-white">
            {/* Subject Field */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
                <span>Subject</span>
                <HelpTooltip text="The email subject line." />
              </div>
              <div className="md:col-span-9 flex items-center gap-1.5">
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="flex-1 border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs px-2.5 py-1.5 text-xs text-slate-800 bg-white transition"
                />
                <span className="text-red-500 font-bold text-sm shrink-0 select-none">*</span>
              </div>
            </div>

            {/* Body Field */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700 pt-2">
                <span>Body</span>
                <HelpTooltip text="The email message body HTML." />
              </div>
              <div className="md:col-span-9 flex items-start gap-1.5">
                <textarea
                  rows={7}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="flex-1 border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs p-2.5 text-xs text-slate-800 bg-white transition font-mono resize-y"
                />
                <span className="text-red-500 font-bold text-sm shrink-0 select-none pt-2">*</span>
              </div>
            </div>

            {/* BCC (Advanced Only) */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
                  <span>BCC</span>
                  <HelpTooltip text="Blind carbon copy email addresses." />
                </div>
                <div className="md:col-span-9">
                  <input
                    type="text"
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                    placeholder=""
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs px-2.5 py-1.5 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Email Account (Advanced Only) */}
            {isAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
                  <span>Email account</span>
                  <HelpTooltip text="Choose the email account to send this message template from." />
                </div>
                <div className="md:col-span-9">
                  <select
                    value={emailAccount}
                    onChange={(e) => setEmailAccount(e.target.value)}
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs px-2.5 py-1.5 text-xs text-slate-800 bg-white cursor-pointer"
                  >
                    <option value="Store name (test@mail.com)">Store name (test@mail.com)</option>
                    <option value="Agri-Mart Support (support@agrimart.com)">Agri-Mart Support (support@agrimart.com)</option>
                    <option value="Agri-Mart Logistics (dispatch@agrimart.com)">Agri-Mart Logistics (dispatch@agrimart.com)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Test template button (Shown in both Basic and Advanced) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-1">
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
                <span>Test template</span>
              </div>
              <div className="md:col-span-9">
                <Link
                  href={`/admin/content/message-templates/${id}/test`}
                  className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-4 py-1.5 rounded inline-flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                >
                  <span>Test template</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── LOWER OPTIONS ── */}
        <div className="space-y-4 pt-3">
          {/* Is active (Shown in both Basic and Advanced) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
              <span>Is active</span>
              <HelpTooltip text="Determines whether this message template is enabled and active." />
            </div>
            <div className="md:col-span-9 flex items-center">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-[#2489c5] rounded border-[#d2d6de] cursor-pointer"
              />
            </div>
          </div>

          {/* ── Advanced Only Options per media_1791194695214.png ── */}
          {isAdvanced && (
            <>
              {/* Send immediately */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
                  <span>Send immediately</span>
                  <HelpTooltip text="Check to send the message immediately rather than queuing it." />
                </div>
                <div className="md:col-span-9 flex items-center">
                  <input
                    type="checkbox"
                    checked={sendImmediately}
                    onChange={(e) => setSendImmediately(e.target.checked)}
                    className="w-4 h-4 text-[#2489c5] rounded border-[#d2d6de] cursor-pointer"
                  />
                </div>
              </div>

              {/* Allow direct reply */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
                  <span>Allow direct reply</span>
                  <HelpTooltip text="Check to allow customer to directly reply to this email." />
                </div>
                <div className="md:col-span-9 flex items-center">
                  <input
                    type="checkbox"
                    checked={allowDirectReply}
                    onChange={(e) => setAllowDirectReply(e.target.checked)}
                    className="w-4 h-4 text-[#2489c5] rounded border-[#d2d6de] cursor-pointer"
                  />
                </div>
              </div>

              {/* Attached static file */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700 pt-1">
                  <span>Attached static file</span>
                  <HelpTooltip text="Attach a static document or policy file to this email." />
                </div>
                <div className="md:col-span-9 space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700 font-normal">
                    <input
                      type="checkbox"
                      checked={hasAttachedFile}
                      onChange={(e) => setHasAttachedFile(e.target.checked)}
                      className="w-4 h-4 text-[#2489c5] rounded border-[#d2d6de]"
                    />
                    <span>Has attached file</span>
                  </label>

                  {/* Dropzone container matching media_1791194695214.png */}
                  {hasAttachedFile && (
                    <div className="border border-[#d2d6de] rounded p-5 bg-white space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        <span className="sm:col-span-3 text-xs font-semibold text-slate-700 text-right">
                          Upload file
                        </span>
                        <div className="sm:col-span-9">
                          <label className="border border-slate-300 bg-slate-100 hover:bg-slate-200/80 rounded px-6 py-6 flex flex-col items-center justify-center text-xs text-slate-600 cursor-pointer transition">
                            <Upload className="w-5 h-5 text-slate-400 mb-1" />
                            <span>
                              {attachedFileName ? attachedFileName : 'Drop files here to upload / Browse'}
                            </span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setAttachedFileName(file.name);
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── FOOTER matching screenshot ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 border-t border-slate-200 pt-4 px-1">
        <span>
          Powered by <strong className="font-semibold text-slate-700">nopCommerce</strong>
        </span>
        <span>Monday, October 5, 2026 12:04 PM</span>
        <span>nopCommerce version 4.90.0</span>
      </div>

      {/* ── TEST TEMPLATE MODAL ── */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded border border-[#d2d6de] shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-[#d2d6de] flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                Send test message - {name}
              </h3>
              <button
                type="button"
                onClick={() => setTestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-base font-bold leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <p className="text-slate-600">
                Enter an email address to receive a rendered preview of this message template:
              </p>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Send test email to:</label>
                <input
                  type="email"
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  className="w-full border border-[#d2d6de] rounded-xs px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc]"
                />
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-[#d2d6de] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setTestModalOpen(false)}
                className="px-3.5 py-1.5 rounded border border-[#d2d6de] bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={sendingTest}
                onClick={handleSendTestEmail}
                className="px-4 py-1.5 rounded bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{sendingTest ? 'Sending...' : 'Send test message'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
