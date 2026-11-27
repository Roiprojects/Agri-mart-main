'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export interface WmsCounts {
  locations: number;
  stockVariants: number;
  transfers: number;
  incoming: number;
  ordersDispatch: number;
  deliveries: number;
  exceptions: number;
}

interface WmsContextValue {
  loading: boolean;
  busy: boolean;
  error: string | null;
  portalData: any;
  counts: WmsCounts;
  allLocations: any[];
  activeStaff: any;
  activeStaffId: string;
  setActiveStaffId: (id: string) => void;
  activeLocationId: string;
  setActiveLocationId: (id: string) => void;
  refreshPortal: () => Promise<void>;
  postAction: (payload: any) => Promise<any>;
  notify: (type: 'ok' | 'err', text: string) => void;
}

const WmsContext = createContext<WmsContextValue | null>(null);

export function WmsProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [portalData, setPortalData] = useState<any>(null);
  const [activeStaffId, setActiveStaffId] = useState<string>('');
  const [activeLocationId, setActiveLocationId] = useState<string>('ALL');
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const notify = useCallback((type: 'ok' | 'err', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4500);
  }, []);

  const refreshPortal = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/warehouse/portal');
      if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to load warehouse portal');
      setPortalData(json);
      setActiveStaffId((prev) => prev || json.staffUsers?.[0]?.id || '');
    } catch (err: any) {
      setError(err?.message || 'Unable to connect to Warehouse Management API');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPortal();
  }, [refreshPortal]);

  const postAction = useCallback(
    async (payload: any) => {
      setBusy(true);
      try {
        const res = await fetch('/api/warehouse/portal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!json.success) {
          notify('err', json.error || 'Action failed');
          return null;
        }
        if (json.message) notify('ok', json.message);
        await refreshPortal();
        return json;
      } catch (err: any) {
        notify('err', err?.message || 'Request error');
        return null;
      } finally {
        setBusy(false);
      }
    },
    [notify, refreshPortal]
  );

  const allLocations = useMemo(() => {
    if (!portalData) return [];
    return [
      ...(portalData.warehouses || []).map((w: any) => ({ ...w, kind: 'WAREHOUSE' })),
      ...(portalData.franchisees || []).map((f: any) => ({ ...f, kind: 'FRANCHISEE' })),
    ];
  }, [portalData]);

  const activeStaff = useMemo(() => {
    return (
      portalData?.staffUsers?.find((s: any) => s.id === activeStaffId) ||
      portalData?.staffUsers?.[0] ||
      null
    );
  }, [portalData, activeStaffId]);

  const counts = useMemo<WmsCounts>(() => {
    if (!portalData) {
      return {
        locations: 0,
        stockVariants: 0,
        transfers: 0,
        incoming: 0,
        ordersDispatch: 0,
        deliveries: 0,
        exceptions: 0,
      };
    }

    let incoming = 0;
    for (const t of portalData.transfers || []) {
      for (const g of t.groups || []) {
        if (activeLocationId !== 'ALL' && g.destinationId !== activeLocationId) continue;
        if (['IN_TRANSIT', 'PARTIAL_RECEIPT', 'PENDING_SIGNED_COPY'].includes(g.status)) {
          incoming++;
        }
      }
    }

    const deliveries = (portalData.orders || []).filter((o: any) => {
      if (!o.fulfillment?.franchiseeId) return false;
      if (activeLocationId !== 'ALL' && o.fulfillment.franchiseeId !== activeLocationId) return false;
      return true;
    }).length;

    const exceptions = (portalData.exceptions || []).filter((e: any) => {
      if (e.status === 'RESOLVED') return false;
      if (activeLocationId !== 'ALL' && e.locationId && e.locationId !== activeLocationId) return false;
      return true;
    }).length;

    return {
      locations: (portalData.warehouses?.length || 0) + (portalData.franchisees?.length || 0),
      stockVariants: portalData.catalogVariants?.length || 0,
      transfers: portalData.transfers?.length || 0,
      incoming,
      ordersDispatch: portalData.orders?.length || 0,
      deliveries,
      exceptions,
    };
  }, [portalData, activeLocationId]);

  return (
    <WmsContext.Provider
      value={{
        loading,
        busy,
        error,
        portalData,
        counts,
        allLocations,
        activeStaff,
        activeStaffId,
        setActiveStaffId,
        activeLocationId,
        setActiveLocationId,
        refreshPortal,
        postAction,
        notify,
      }}
    >
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded border shadow-lg text-xs font-medium flex items-center gap-2 ${
            toast.type === 'ok'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}
        >
          {toast.type === 'ok' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-600" />
          )}
          <span>{toast.text}</span>
        </div>
      )}
      {children}
    </WmsContext.Provider>
  );
}

export function useWmsContext() {
  const ctx = useContext(WmsContext);
  if (!ctx) throw new Error('useWmsContext must be used inside WmsProvider');
  return ctx;
}
