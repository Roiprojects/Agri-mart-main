'use client';

import { useEffect, useRef } from 'react';
import { LiveSyncEvent } from '@agrimart/contracts';

interface UseLiveSyncOptions {
  onEvent?: (event: LiveSyncEvent) => void;
  onPriceStockUpdate?: (data: any) => void;
  onOrderUpdate?: (data: any) => void;
  autoRefetchOnFocus?: boolean;
}

export function useLiveSync(options: UseLiveSyncOptions = {}) {
  const { onEvent, onPriceStockUpdate, onOrderUpdate, autoRefetchOnFocus = true } = options;
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    const sseUrl = `${backendUrl}/api/sync/events`;

    try {
      const es = new EventSource(sseUrl);
      eventSourceRef.current = es;

      es.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data) as LiveSyncEvent;
          if (onEvent) onEvent(parsed);

          if (parsed.event === 'PRODUCT_PRICE_CHANGED' || parsed.event === 'STOCK_CHANGED') {
            if (onPriceStockUpdate) onPriceStockUpdate(parsed.payload);
          } else if (parsed.event === 'ORDER_STATUS_CHANGED') {
            if (onOrderUpdate) onOrderUpdate(parsed.payload);
          }
        } catch (err) {
          console.warn('[LiveSync] Failed to parse SSE event message:', err);
        }
      };

      es.onerror = () => {
        // SSE connection error; automatically reconnects or falls back to polling
      };
    } catch (err) {
      console.warn('[LiveSync] EventSource not supported or failed to connect:', err);
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [onEvent, onPriceStockUpdate, onOrderUpdate]);

  // Handle Window Focus Revalidation
  useEffect(() => {
    if (!autoRefetchOnFocus || typeof window === 'undefined') return;

    const handleFocus = () => {
      // Trigger a soft refresh of current router data if active
      if (typeof window !== 'undefined' && (window as any).__AGRIMART_REFRESH) {
        (window as any).__AGRIMART_REFRESH();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [autoRefetchOnFocus]);
}
