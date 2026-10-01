'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, MessageSquare, Smartphone, CheckCircle2 } from 'lucide-react';

export default function CustomerNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/customer/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNotifications(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-xs">
      <Link href="/account" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Account
      </Link>

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Notification History &amp; Dispatch Alerts</h1>
        <p className="text-xs text-slate-500 mt-0.5">Audit log of SMS, WhatsApp, and portal notifications dispatched to your registered mobile.</p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500">
          No notifications logged yet.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
          {notifications.map((n) => (
            <div key={n.id} className="p-5 space-y-2 hover:bg-slate-50 transition">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase ${
                    n.channel === 'WHATSAPP' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {n.channel}
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm">{n.title || n.event}</span>
                </div>
                <span className="text-slate-400 text-[11px]">
                  {new Date(n.sentAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <p className="text-slate-700 leading-relaxed">{n.message}</p>

              <div className="text-[10px] text-slate-400 flex items-center gap-2">
                <span>Recipient: +91-{n.recipient}</span>
                <span>&bull;</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Delivered
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
