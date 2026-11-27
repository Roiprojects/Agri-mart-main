'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface WmsCounts {
  locations: number;
  stockVariants: number;
  transfers: number;
  incoming: number;
  ordersDispatch: number;
  deliveries: number;
  exceptions: number;
}

export interface WmsLocationItem {
  id: string;
  name: string;
  code: string;
  tier?: string;
}

export interface WmsStaffItem {
  id: string;
  name: string;
  status: string;
  roles: string[];
}

interface WmsContextValue {
  loading: boolean;
  error: string | null;
  counts: WmsCounts;
  warehouses: WmsLocationItem[];
  franchisees: WmsLocationItem[];
  staffUsers: WmsStaffItem[];
  activeStaffId: string;
  setActiveStaffId: (id: string) => void;
  activeLocationId: string;
  setActiveLocationId: (id: string) => void;
  refreshSummary: () => Promise<void>;
}

const DEFAULT_COUNTS: WmsCounts = {
  locations: 0,
  stockVariants: 0,
  transfers: 0,
  incoming: 0,
  ordersDispatch: 0,
  deliveries: 0,
  exceptions: 0,
};

const WmsContext = createContext<WmsContextValue | null>(null);

export function WmsProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState<WmsCounts>(DEFAULT_COUNTS);
  const [warehouses, setWarehouses] = useState<WmsLocationItem[]>([]);
  const [franchisees, setFranchisees] = useState<WmsLocationItem[]>([]);
  const [staffUsers, setStaffUsers] = useState<WmsStaffItem[]>([]);
  const [activeStaffId, setActiveStaffId] = useState<string>('');
  const [activeLocationId, setActiveLocationId] = useState<string>('ALL');

  const refreshSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/warehouse/summary?locationId=${encodeURIComponent(activeLocationId)}`
      );
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || 'Failed to fetch WMS summary');
      }
      setCounts(json.counts || DEFAULT_COUNTS);
      setWarehouses(json.warehouses || []);
      setFranchisees(json.franchisees || []);
      setStaffUsers(json.staffUsers || []);
      setActiveStaffId((prev) => prev || json.staffUsers?.[0]?.id || '');
    } catch (err: any) {
      setError(err?.message || 'Unable to connect to Warehouse Management API');
    } finally {
      setLoading(false);
    }
  }, [activeLocationId]);

  useEffect(() => {
    refreshSummary();
  }, [refreshSummary]);

  return (
    <WmsContext.Provider
      value={{
        loading,
        error,
        counts,
        warehouses,
        franchisees,
        staffUsers,
        activeStaffId,
        setActiveStaffId,
        activeLocationId,
        setActiveLocationId,
        refreshSummary,
      }}
    >
      {children}
    </WmsContext.Provider>
  );
}

export function useWmsContext() {
  const ctx = useContext(WmsContext);
  if (!ctx) {
    throw new Error('useWmsContext must be used inside WmsProvider');
  }
  return ctx;
}
