'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Save,
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
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

interface PollAnswer {
  id: string;
  name: string;
  numberOfVotes: number;
  displayOrder: number;
}

interface PollData {
  id: string;
  name: string;
  language: string;
  systemKeyword: string;
  published: boolean;
  showOnHomePage: boolean;
  allowGuestsToVote: boolean;
  displayOrder: number;
  startDate: string;
  endDate: string;
  answers: PollAnswer[];
}

const mockPolls: Record<string, PollData> = {
  '1': {
    id: '1',
    name: 'Which irrigation technique do you plan to adopt this summer?',
    language: 'English',
    systemKeyword: 'summer-irrigation-technique',
    published: true,
    showOnHomePage: true,
    allowGuestsToVote: true,
    displayOrder: 1,
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    answers: [
      { id: '1', name: 'Drip irrigation system', numberOfVotes: 45, displayOrder: 1 },
      { id: '2', name: 'Sprinkler irrigation', numberOfVotes: 28, displayOrder: 2 },
      { id: '3', name: 'Furrow / Ridge flooding', numberOfVotes: 12, displayOrder: 3 },
      { id: '4', name: 'Solar automated drip timers', numberOfVotes: 19, displayOrder: 4 },
    ],
  },
  '2': {
    id: '2',
    name: 'Would you prefer solar rooftop loans integrated with farm electricity?',
    language: 'English',
    systemKeyword: 'solar-rooftop-farm-loans',
    published: true,
    showOnHomePage: false,
    allowGuestsToVote: true,
    displayOrder: 2,
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    answers: [
      { id: '1', name: 'Yes, with subsidized 4% interest rate', numberOfVotes: 62, displayOrder: 1 },
      { id: '2', name: 'Yes, but only with net-metering grid tie-in', numberOfVotes: 31, displayOrder: 2 },
      { id: '3', name: 'No, prefer conventional diesel/electric pump', numberOfVotes: 9, displayOrder: 3 },
    ],
  },
  '3': {
    id: '3',
    name: 'How satisfied are you with district agri machinery rental delivery?',
    language: 'English',
    systemKeyword: 'machinery-rental-satisfaction',
    published: true,
    showOnHomePage: true,
    allowGuestsToVote: false,
    displayOrder: 3,
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    answers: [
      { id: '1', name: 'Very satisfied (delivered within 4 hours)', numberOfVotes: 74, displayOrder: 1 },
      { id: '2', name: 'Moderately satisfied', numberOfVotes: 18, displayOrder: 2 },
      { id: '3', name: 'Needs improvement (driver delays)', numberOfVotes: 11, displayOrder: 3 },
    ],
  },
};

export default function EditPollPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const router = useRouter();

  // Collapsible cards
  const [infoOpen, setInfoOpen] = useState(true);
  const [answersOpen, setAnswersOpen] = useState(true);

  // Form fields
  const [language, setLanguage] = useState('English');
  const [name, setName] = useState('');
  const [systemKeyword, setSystemKeyword] = useState('');
  const [published, setPublished] = useState(true);
  const [showOnHomePage, setShowOnHomePage] = useState(true);
  const [allowGuestsToVote, setAllowGuestsToVote] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Poll answers
  const [answers, setAnswers] = useState<PollAnswer[]>([]);
  const [newAnswerName, setNewAnswerName] = useState('');

  // Toast & Saving
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const item = mockPolls[id] || {
      id,
      name: `Poll #${id}`,
      language: 'English',
      systemKeyword: `poll-${id}`,
      published: true,
      showOnHomePage: true,
      allowGuestsToVote: true,
      displayOrder: 1,
      startDate: '',
      endDate: '',
      answers: [
        { id: '1', name: 'Option 1', numberOfVotes: 0, displayOrder: 1 },
        { id: '2', name: 'Option 2', numberOfVotes: 0, displayOrder: 2 },
      ],
    };

    setName(item.name);
    setLanguage(item.language);
    setSystemKeyword(item.systemKeyword);
    setPublished(item.published);
    setShowOnHomePage(item.showOnHomePage);
    setAllowGuestsToVote(item.allowGuestsToVote);
    setDisplayOrder(item.displayOrder);
    setStartDate(item.startDate);
    setEndDate(item.endDate);
    setAnswers(item.answers);
  }, [id]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAddAnswer = () => {
    if (!newAnswerName.trim()) return;
    setAnswers([
      ...answers,
      {
        id: Date.now().toString(),
        name: newAnswerName.trim(),
        numberOfVotes: 0,
        displayOrder: answers.length + 1,
      },
    ]);
    setNewAnswerName('');
  };

  const handleDeleteAnswer = (ansId: string) => {
    setAnswers(answers.filter((a) => a.id !== ansId));
  };

  const handleSave = async (continueEditing: boolean = false) => {
    if (!name.trim()) {
      showToast('Poll name is required', 'error');
      return;
    }
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSaving(false);
    showToast('The poll has been updated successfully.');
    if (!continueEditing) {
      setTimeout(() => {
        router.push('/admin/content/polls');
      }, 1200);
    }
  };

  return (
    <div style={{ display: 'none' }} className="hidden space-y-4 max-w-full text-slate-800 pb-20 font-sans">
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

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-normal text-slate-800 tracking-tight">
            Edit poll details - {name || 'Loading...'}
          </h1>
          <Link
            href="/admin/content/polls"
            className="text-xs text-[#2489c5] hover:text-[#196b9c] hover:underline flex items-center gap-1 font-normal transition"
          >
            <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#2489c5] text-white text-[9px] font-bold">
              ←
            </span>
            <span>back to poll list</span>
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
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to delete this poll?')) {
                router.push('/admin/content/polls');
              }
            }}
            className="bg-[#d73925] hover:bg-[#c9302c] text-white text-xs font-semibold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
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
                <HelpTooltip text="The language of the poll." />
              </label>
              <div className="md:col-span-9 max-w-2xl">
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white appearance-none pr-8 cursor-pointer"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Kannada">Kannada</option>
                    <option value="Marathi">Marathi</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Name</span>
                <HelpTooltip text="The poll question or title." />
              </label>
              <div className="md:col-span-9 max-w-2xl flex items-center gap-1.5">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
                <span className="text-red-500 font-bold text-sm select-none">*</span>
              </div>
            </div>

            {/* System keyword */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>System keyword</span>
                <HelpTooltip text="The system keyword for referencing this poll in source code or widgets." />
              </label>
              <div className="md:col-span-9 max-w-2xl">
                <input
                  type="text"
                  value={systemKeyword}
                  onChange={(e) => setSystemKeyword(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Published */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Published</span>
                <HelpTooltip text="Determines whether the poll is published on the portal." />
              </label>
              <div className="md:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Show on home page */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Show on home page</span>
                <HelpTooltip text="Determines whether the poll is displayed on the main home page." />
              </label>
              <div className="md:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={showOnHomePage}
                  onChange={(e) => setShowOnHomePage(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Allow guests to vote */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Allow guests to vote</span>
                <HelpTooltip text="Determines whether non-registered visitors can submit votes." />
              </label>
              <div className="md:col-span-9 flex items-center">
                <input
                  type="checkbox"
                  checked={allowGuestsToVote}
                  onChange={(e) => setAllowGuestsToVote(e.target.checked)}
                  className="w-4 h-4 text-[#3c8dbc] border-[#d2d6de] rounded focus:ring-0 cursor-pointer accent-[#3c8dbc]"
                />
              </div>
            </div>

            {/* Display order */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Display order</span>
                <HelpTooltip text="Display order for the poll. 1 represents top." />
              </label>
              <div className="md:col-span-9 max-w-xs">
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value) || 1)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Start date */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>Start date</span>
                <HelpTooltip text="The poll voting start date." />
              </label>
              <div className="md:col-span-9 max-w-xs">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* End date */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-3 text-xs font-semibold text-slate-700 md:text-right flex items-center md:justify-end gap-1">
                <span>End date</span>
                <HelpTooltip text="The poll voting end date." />
              </label>
              <div className="md:col-span-9 max-w-xs">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── POLL ANSWERS CARD ── */}
      <div className="bg-white rounded border border-[#d2d6de] shadow-2xs overflow-hidden">
        <div
          onClick={() => setAnswersOpen(!answersOpen)}
          className="px-4 py-2.5 bg-slate-50/90 border-b border-[#d2d6de] flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-100/70 transition"
        >
          <div className="flex items-center gap-2">
            <span className="font-serif italic font-bold text-slate-600 text-sm">✓</span>
            <span className="text-sm font-normal text-slate-800">Poll answers</span>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            {answersOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {answersOpen && (
          <div className="p-5 space-y-4 text-xs text-slate-700">
            {/* Add new answer bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-xl">
              <input
                type="text"
                value={newAnswerName}
                onChange={(e) => setNewAnswerName(e.target.value)}
                placeholder="Enter answer option (e.g. Drip irrigation)"
                className="flex-1 border border-[#d2d6de] focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none rounded px-3 py-1.5 text-xs text-slate-800 bg-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAnswer();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddAnswer}
                className="bg-[#2489c5] hover:bg-[#1f72a3] text-white text-xs font-semibold px-4 py-1.5 rounded flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add answer</span>
              </button>
            </div>

            {/* Answers Table */}
            <div className="border border-[#e5e7eb] rounded overflow-hidden">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-[#f9fafb] text-[11px] uppercase tracking-wider text-slate-600 border-b border-[#e5e7eb] font-semibold">
                  <tr>
                    <th className="px-4 py-2.5">Name</th>
                    <th className="px-4 py-2.5 text-center w-32">Number of votes</th>
                    <th className="px-4 py-2.5 text-center w-28">Display order</th>
                    <th className="px-4 py-2.5 text-center w-20">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4f4f4]">
                  {answers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-slate-400 italic">
                        No answers added yet
                      </td>
                    </tr>
                  ) : (
                    answers.map((ans, idx) => (
                      <tr key={ans.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-2.5 font-medium text-slate-800">{ans.name}</td>
                        <td className="px-4 py-2.5 text-center font-mono">{ans.numberOfVotes}</td>
                        <td className="px-4 py-2.5 text-center font-mono">{ans.displayOrder || idx + 1}</td>
                        <td className="px-4 py-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteAnswer(ans.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
