'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Save,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
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

const AVAILABLE_TOKENS = [
  { token: '%Store.Name%', label: 'Store Name' },
  { token: '%Store.URL%', label: 'Store URL' },
  { token: '%Store.Email%', label: 'Store Email' },
  { token: '%Customer.Email%', label: 'Customer Email' },
  { token: '%Customer.FullName%', label: 'Full Name' },
  { token: '%Customer.FirstName%', label: 'First Name' },
  { token: '%Customer.LastName%', label: 'Last Name' },
  { token: '%Customer.PhoneNumber%', label: 'Phone Number' },
  { token: '%Newsletter.SubscribedEmail%', label: 'Subscriber Email' },
  { token: '%Newsletter.UnsubscribeUrl%', label: 'Unsubscribe Link' },
];

export default function AddNewCampaignPage() {
  const router = useRouter();

  // Form Fields matching media_1791181095264.png
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [showTokens, setShowTokens] = useState(false);
  const [plannedDateOfSending, setPlannedDateOfSending] = useState('');
  const [limitedToCustomerRole, setLimitedToCustomerRole] = useState('All');
  const [limitedToSubscriptionTypes, setLimitedToSubscriptionTypes] = useState('All');

  // Saving & Feedback
  const [saving, setSaving] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleCopyToken = (tok: string) => {
    navigator.clipboard?.writeText(tok);
    setCopiedToken(tok);
    setTimeout(() => setCopiedToken(null), 2000);
    // Also append token to body conveniently
    setBody((prev) => (prev ? `${prev} ${tok}` : tok));
  };

  const handleSave = async (continueEditing: boolean = false) => {
    if (!name.trim()) {
      showToast('Campaign Name is required.', 'error');
      return;
    }
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
        name: name.trim(),
        subject: subject.trim(),
        body: body.trim(),
        plannedDateOfSending: plannedDateOfSending.trim() || '—',
        limitedToCustomerRole,
        limitedToSubscriptionTypes,
      };

      const res = await fetch('/api/admin/promotions/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        showToast('The new campaign has been added successfully.', 'success');
        if (!continueEditing) {
          setTimeout(() => {
            router.push('/admin/promotions/campaigns');
          }, 800);
        }
      } else {
        showToast(json.error || 'Failed to save campaign.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'An unexpected error occurred.', 'error');
    } finally {
      setSaving(false);
    }
  };

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

      {/* ── TOP HEADER (Matching media_1791181095264.png) ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-normal text-slate-800 tracking-tight">Add a new campaign</h1>
          <Link
            href="/admin/promotions/campaigns"
            className="inline-flex items-center gap-1 text-xs text-[#2489c5] hover:underline"
          >
            <span className="w-4 h-4 rounded-full bg-[#2489c5] text-white flex items-center justify-center shrink-0">
              <ArrowLeft className="w-2.5 h-2.5 stroke-[2.5]" />
            </span>
            <span>back to campaign list</span>
          </Link>
        </div>

        {/* Action Buttons */}
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
        </div>
      </div>

      {/* ── MAIN FORM CARD (Matching media_1791181095264.png) ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs p-6 md:p-8 space-y-4">
        {/* Name Field */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
            <span>Name</span>
            <HelpTooltip text="The name of the campaign for internal identification." />
          </div>
          <div className="md:col-span-9 flex items-center gap-1.5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=""
              className="flex-1 border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs px-2.5 py-1.5 text-xs text-slate-800 bg-white transition"
            />
            <span className="text-red-500 font-bold text-sm shrink-0 leading-none select-none">*</span>
          </div>
        </div>

        {/* Subject Field */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
            <span>Subject</span>
            <HelpTooltip text="The email subject line displayed in recipient inboxes." />
          </div>
          <div className="md:col-span-9 flex items-center gap-1.5">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder=""
              className="flex-1 border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs px-2.5 py-1.5 text-xs text-slate-800 bg-white transition"
            />
            <span className="text-red-500 font-bold text-sm shrink-0 leading-none select-none">*</span>
          </div>
        </div>

        {/* Body Field */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
          <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700 pt-2">
            <span>Body</span>
            <HelpTooltip text="The HTML or plain text body of the campaign email message." />
          </div>
          <div className="md:col-span-9 flex items-start gap-1.5">
            <textarea
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder=""
              className="flex-1 border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs p-2.5 text-xs text-slate-800 bg-white transition font-sans resize-y"
            />
            <span className="text-red-500 font-bold text-sm shrink-0 leading-none select-none pt-2">*</span>
          </div>
        </div>

        {/* Allowed message tokens */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
          <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
            <span>Allowed message tokens</span>
            <HelpTooltip text="Allowed message tokens that will be replaced with actual store and customer values when sending." />
            <button
              type="button"
              onClick={() => setShowTokens(!showTokens)}
              className="text-[#2489c5] hover:underline font-normal cursor-pointer ml-1 text-xs"
            >
              {showTokens ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="md:col-span-9">
            {showTokens ? (
              <div className="p-3 bg-slate-50 border border-[#d2d6de] rounded text-xs space-y-2">
                <p className="text-[11px] text-slate-500">
                  Click any token below to copy and append it directly into the email body:
                </p>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TOKENS.map((t) => (
                    <button
                      key={t.token}
                      type="button"
                      onClick={() => handleCopyToken(t.token)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white border border-slate-300 hover:border-[#3c8dbc] hover:text-[#3c8dbc] text-slate-700 text-xs font-mono transition cursor-pointer shadow-2xs"
                      title={`Insert ${t.token} (${t.label})`}
                    >
                      <span>{t.token}</span>
                      {copiedToken === t.token ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Planned date of sending */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
            <span>Planned date of sending</span>
            <HelpTooltip text="The planned date and time of sending this campaign." />
          </div>
          <div className="md:col-span-9">
            <div className="relative w-full max-w-[260px]">
              <input
                type="text"
                value={plannedDateOfSending}
                onChange={(e) => setPlannedDateOfSending(e.target.value)}
                placeholder="mm/dd/yyyy --:-- --"
                className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs pl-2.5 pr-8 py-1.5 text-xs text-slate-800 bg-white transition"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Limited to customer role */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
            <span>Limited to customer role</span>
            <HelpTooltip text="Send emails only to customers in the selected customer role, or select All." />
          </div>
          <div className="md:col-span-9">
            <select
              value={limitedToCustomerRole}
              onChange={(e) => setLimitedToCustomerRole(e.target.value)}
              className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs px-2.5 py-1.5 text-xs text-slate-800 bg-white transition cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Administrators">Administrators</option>
              <option value="Forum Moderators">Forum Moderators</option>
              <option value="Registered">Registered</option>
              <option value="Vendors">Vendors</option>
              <option value="Farmers">Farmers</option>
              <option value="Guests">Guests</option>
            </select>
          </div>
        </div>

        {/* Limited to subscription types */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 text-xs font-semibold text-slate-700">
            <span>Limited to subscription types</span>
            <HelpTooltip text="Send emails only to subscribers belonging to selected newsletter/advisory subscription types, or select All." />
          </div>
          <div className="md:col-span-9">
            <select
              value={limitedToSubscriptionTypes}
              onChange={(e) => setLimitedToSubscriptionTypes(e.target.value)}
              className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded-xs px-2.5 py-1.5 text-xs text-slate-800 bg-white transition cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Weekly Newsletter">Weekly Newsletter</option>
              <option value="Promotions & Offers">Promotions & Offers</option>
              <option value="Agri Weather Advisories">Agri Weather Advisories</option>
              <option value="Equipment & Rental Updates">Equipment & Rental Updates</option>
              <option value="SMS Broadcasts">SMS Broadcasts</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
