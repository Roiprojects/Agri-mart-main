'use client';

import { useState, useEffect } from 'react';
import { Plug, RefreshCw, CheckCircle2, Zap } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  category: string;
  provider: string;
  status: string;
  lastPingAt?: string;
  latencyMs?: number;
  environment: string;
}

export default function AdminIntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [pingingId, setPingingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/integrations/diagnostics');
      const json = await res.json();
      if (json.success) {
        setIntegrations(json.integrations || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handlePing = async (id: string) => {
    try {
      setPingingId(id);
      setNotice(null);
      const res = await fetch('/api/integrations/diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ integrationId: id }),
      });
      const json = await res.json();
      if (json.success) {
        setNotice(json.message || `Ping successful for ${id}`);
        fetchIntegrations();
        setTimeout(() => setNotice(null), 3500);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setPingingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Plug className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">API Gateways & Integrations</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time diagnostics for Razorpay, Gupshup SMS, Shiprocket, and dark warehouse dispatch webhooks.
          </p>
        </div>

        <button
          onClick={fetchIntegrations}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-xs transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Status
        </button>
      </div>

      {notice && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between space-y-4 shadow-xs"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                      {item.environment}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Provider: {item.provider}</p>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    item.status === 'SANDBOX_ACTIVE'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      item.status === 'SANDBOX_ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  {item.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-3 font-mono text-[11px]">
                {item.latencyMs !== undefined && (
                  <span>
                    ⚡ <strong className="text-slate-900">{item.latencyMs} ms</strong>
                  </span>
                )}
                {item.lastPingAt && (
                  <span className="text-slate-400">
                    Checked {new Date(item.lastPingAt).toLocaleTimeString('en-IN')}
                  </span>
                )}
              </div>

              <button
                onClick={() => handlePing(item.id)}
                disabled={pingingId === item.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition disabled:opacity-50"
              >
                <Zap className={`h-3.5 w-3.5 ${pingingId === item.id ? 'animate-bounce text-amber-500' : 'text-emerald-600'}`} />
                {pingingId === item.id ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
