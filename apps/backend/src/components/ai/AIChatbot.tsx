'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, X, Send } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actionLink?: { label: string; href: string };
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello! I am your AgriMart AI Farming Assistant. How can I help you today?',
      timestamp: 'Just now',
    },
    {
      id: '2',
      sender: 'bot',
      text: 'Ask me about recommended fertilizers, renting 7.5HP power weeders, booking tractor ploughing, or checking dark warehouse delivery.',
      timestamp: 'Just now',
    },
  ]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      let replyText =
        'Our AI Agronomy Engine recommends completing our 9-point Crop Advisory questionnaire for personalized recommendations and stage matching.';
      let link: { label: string; href: string } | undefined = {
        label: 'Open AI Crop Advisory',
        href: '/ai-advisory',
      };

      const lower = query.toLowerCase();
      if (lower.includes('rent') || lower.includes('weeder') || lower.includes('equipment')) {
        replyText =
          'We have 7.5HP Power Weeders and Brush Cutters available for rent on daily, weekly, or monthly rates with security deposit protection.';
        link = { label: 'Explore Equipment Rentals', href: '/rentals' };
      } else if (lower.includes('tractor') || lower.includes('plough') || lower.includes('service') || lower.includes('spray')) {
        replyText =
          'You can request on-field tractor ploughing, rotavator, or drone spraying via our GPS Smart Service booking system.';
        link = { label: 'Book On-Field Service', href: '/services/book' };
      } else if (lower.includes('repair') || lower.includes('job card') || lower.includes('mechanic')) {
        replyText =
          'AgriMart operates 1,500+ authorized dealer service centers with certified technicians, genuine OEM spare parts, and warranty support across Karnataka.';
        link = { label: 'Authorized Dealer Workshops', href: '/dealers' };
      }

      const botReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: replyText,
        timestamp: 'Just now',
        actionLink: link,
      };

      setMessages((prev) => [...prev, botReply]);
    }, 600);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-emerald-700 hover:bg-emerald-800 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 transition-transform transform hover:scale-105"
        aria-label="Open AI Farm Assistant"
      >
        <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
        <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">AI Farm Assistant</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-96 max-w-[calc(100vw-2rem)] h-[480px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden">
          <div className="bg-emerald-800 p-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <div className="text-xs font-bold">AgriMart AI Farm Assistant</div>
                <div className="text-[10px] text-emerald-200">{SITE_CONFIG.domain} Online</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 text-emerald-200 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-emerald-50 px-3 py-1.5 flex gap-1.5 overflow-x-auto text-[11px] border-b border-emerald-100">
            <button
              onClick={() => handleSend('Recommend fertilizer for Sugarcane')}
              className="flex-shrink-0 bg-white border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full hover:bg-emerald-100"
            >
              Sugarcane
            </button>
            <button
              onClick={() => handleSend('Rent 7.5HP Power Weeder')}
              className="flex-shrink-0 bg-white border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full hover:bg-emerald-100"
            >
              Rent Weeder
            </button>
            <button
              onClick={() => handleSend('Book Tractor Ploughing')}
              className="flex-shrink-0 bg-white border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full hover:bg-emerald-100"
            >
              Tractor
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-slate-50 text-xs">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 shadow-sm ${
                    m.sender === 'user' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-800 border border-slate-200'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                  {m.actionLink && (
                    <div className="mt-1.5 pt-1.5 border-t border-slate-100">
                      <a href={m.actionLink.href} className="font-bold text-emerald-700 underline text-[11px]">
                        {m.actionLink.label} &rarr;
                      </a>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-0.5 px-1">{m.timestamp}</span>
              </div>
            ))}
          </div>

          <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your query..."
              className="flex-1 text-xs px-3 py-1.5 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            />
            <button
              onClick={() => handleSend()}
              className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
