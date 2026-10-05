'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Mail,
  Send,
  Eye,
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

// Map template names to their standard tokens
const TEMPLATE_DEFAULT_TOKENS: Record<string, string[]> = {
  'Blog.BlogComment': [
    '%Store.Name%',
    '%Store.URL%',
    '%BlogComment.BlogPostTitle%',
  ],
  'Customer.BackInStock': [
    '%Store.Name%',
    '%Store.URL%',
    '%Customer.FullName%',
    '%Product.Name%',
  ],
  'Customer.EmailValidationMessage': [
    '%Store.Name%',
    '%Store.URL%',
    '%Customer.FullName%',
    '%Customer.EmailValidationURL%',
  ],
  'Customer.PasswordRecovery': [
    '%Store.Name%',
    '%Store.URL%',
    '%Customer.FullName%',
    '%Customer.PasswordRecoveryURL%',
  ],
  'Customer.WelcomeMessage': [
    '%Store.Name%',
    '%Store.URL%',
    '%Customer.FullName%',
  ],
  'OrderPlaced.CustomerNotification': [
    '%Store.Name%',
    '%Store.URL%',
    '%Order.OrderNumber%',
    '%Order.CustomerFullName%',
    '%Order.OrderTotal%',
  ],
};

export default function SendTestEmailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Form states matching media_1791195374180.png
  const [sendEmailTo, setSendEmailTo] = useState('');
  const [tokenValues, setTokenValues] = useState<Record<string, string>>({
    '%Store.Name%': 'Agri-Mart Mega Network',
    '%Store.URL%': 'http://localhost:3000',
    '%BlogComment.BlogPostTitle%': 'Top 5 Organic Fertilizers for Cotton Yield Maximization',
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [sentResult, setSentResult] = useState<{ subject: string; body: string; sentTo: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (!id) return;
    const fetchTemplate = async () => {
      try {
        const res = await fetch(`/api/admin/content/message-templates/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          const t = json.data;
          setTemplate(t);

          // Extract tokens or use default tokens for this template
          const definedTokens = TEMPLATE_DEFAULT_TOKENS[t.name] || [
            '%Store.Name%',
            '%Store.URL%',
            '%Customer.FullName%',
          ];

          const initialTokens: Record<string, string> = {};
          definedTokens.forEach((tok) => {
            if (tok === '%Store.Name%') initialTokens[tok] = 'Agri-Mart Mega Network';
            else if (tok === '%Store.URL%') initialTokens[tok] = 'http://localhost:3000';
            else if (tok === '%BlogComment.BlogPostTitle%') initialTokens[tok] = 'Top 5 Organic Fertilizers for Cotton Yield Maximization';
            else if (tok === '%Customer.FullName%') initialTokens[tok] = 'Suresh Gowda';
            else if (tok === '%Order.OrderNumber%') initialTokens[tok] = 'ORD-2026-9812';
            else if (tok === '%Order.OrderTotal%') initialTokens[tok] = '₹ 14,500.00';
            else initialTokens[tok] = '';
          });

          setTokenValues(initialTokens);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [id]);

  const handleSend = async () => {
    if (!sendEmailTo.trim()) {
      showToast('Recipient email is required.', 'error');
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`/api/admin/content/message-templates/${id}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailTo: sendEmailTo.trim(),
          tokens: tokenValues,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast(json.message || 'Email has been sent successfully.', 'success');
        if (json.data) {
          setSentResult(json.data);
        }
      } else {
        showToast(json.error || 'Failed to send test email.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'An error occurred while sending test email.', 'error');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500 font-sans">Loading test template...</div>;
  }

  const tokenKeys = Object.keys(tokenValues);

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

      {/* ── TOP HEADER (Matching media_1791195374180.png) ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Send test email</h1>
          <Link
            href={`/admin/content/message-templates/${id}`}
            className="inline-flex items-center gap-1.5 text-xs text-[#2489c5] hover:underline"
          >
            <span>back to template</span>
            <span className="w-4 h-4 rounded-full bg-[#2489c5] text-white flex items-center justify-center shrink-0">
              <ArrowLeft className="w-2.5 h-2.5 stroke-[2.5]" />
            </span>
          </Link>
        </div>

        {/* Send Button on the right */}
        <div>
          <button
            type="button"
            disabled={sending}
            onClick={handleSend}
            className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-4 py-1.5 rounded shadow-2xs transition disabled:opacity-50 cursor-pointer"
          >
            <span>{sending ? 'Sending...' : 'Send'}</span>
          </button>
        </div>
      </div>

      {/* ── MAIN CARD (Matching media_1791195374180.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs p-6 md:p-8 space-y-4">
        {/* Send email to */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
            <span>Send email to</span>
            <HelpTooltip text="Send test email to this email address." />
          </div>
          <div className="md:col-span-9 flex items-center gap-1.5">
            <input
              type="email"
              value={sendEmailTo}
              onChange={(e) => setSendEmailTo(e.target.value)}
              placeholder="e.g. farmer.test@mail.com"
              className="flex-1 border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs px-2.5 py-1.5 text-xs text-slate-800 bg-white transition"
            />
            <span className="text-red-500 font-bold text-sm shrink-0 select-none">*</span>
          </div>
        </div>

        {/* Text instruction row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-3" />
          <div className="md:col-span-9">
            <p className="text-xs text-slate-700 font-normal">
              Please enter tokens you want to be replaced below
            </p>
          </div>
        </div>

        {/* Dynamic Token input fields matching screenshot */}
        {tokenKeys.map((tokenKey) => (
          <div key={tokenKey} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-mono text-slate-700">
              <span>{tokenKey}</span>
            </div>
            <div className="md:col-span-9">
              <input
                type="text"
                value={tokenValues[tokenKey] || ''}
                onChange={(e) =>
                  setTokenValues({ ...tokenValues, [tokenKey]: e.target.value })
                }
                placeholder={`Value for ${tokenKey}`}
                className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs px-2.5 py-1.5 text-xs text-slate-800 bg-white transition"
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── SENT EMAIL PREVIEW CARD (Visible after sending test) ── */}
      {sentResult && (
        <div className="bg-white rounded border border-emerald-300 shadow-2xs overflow-hidden border-t-3 border-t-emerald-600 animate-fadeIn">
          <div className="px-5 py-3 bg-emerald-50/70 border-b border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Test email delivered to {sentResult.sentTo}</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-mono">Status: Delivered (200 OK)</span>
          </div>

          <div className="p-5 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="font-semibold w-20">Subject:</span>
              <span className="font-medium text-slate-900 bg-slate-50 px-2 py-1 rounded border border-slate-200 flex-1">
                {sentResult.subject}
              </span>
            </div>

            <div className="space-y-1 text-slate-700">
              <span className="font-semibold block">Rendered Body:</span>
              <div
                className="p-4 bg-slate-50 border border-slate-200 rounded font-sans text-xs text-slate-800 leading-relaxed min-h-[90px]"
                dangerouslySetInnerHTML={{ __html: sentResult.body }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
