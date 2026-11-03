'use client';

import { useState, useEffect } from 'react';

export interface FilterLevelItem {
  id: string;
  name: string;
  enabled: boolean;
  displayOrder: number;
}

export interface FilterYmmSettingsData {
  filterLevelEnabled: boolean;
  displayOnHomePage: boolean;
  displayOnProductDetailsPage: boolean;
  isAdvanced: boolean;
  levels: FilterLevelItem[];
}

export const DEFAULT_FILTER_YMM_SETTINGS: FilterYmmSettingsData = {
  filterLevelEnabled: true,
  displayOnHomePage: true,
  displayOnProductDetailsPage: true,
  isAdvanced: true,
  levels: [
    { id: 'lvl-1', name: 'Year', enabled: true, displayOrder: 1 },
    { id: 'lvl-2', name: 'Make', enabled: true, displayOrder: 2 },
    { id: 'lvl-3', name: 'Model', enabled: true, displayOrder: 3 },
  ],
};

export function useFilterYmmSettings() {
  const [settings, setSettings] = useState<FilterYmmSettingsData>(DEFAULT_FILTER_YMM_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      // 1. Check local storage first
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('admin_filter_ymm_settings');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (isMounted) {
              setSettings((prev) => ({ ...prev, ...parsed }));
            }
          } catch {
            // ignore
          }
        }
      }

      // 2. Fetch live settings from API
      try {
        const res = await fetch('/api/settings/filter-ymm');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && isMounted) {
            setSettings(json.data);
          }
        }
      } catch (e) {
        console.warn('Could not fetch filter YMM settings:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_filter_ymm_settings' && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          setSettings((prev) => ({ ...prev, ...updated }));
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { settings, loading };
}
