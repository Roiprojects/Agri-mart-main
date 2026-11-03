import { SyncEventType, RevalidationWebhookPayload } from '@agrimart/contracts';
import { revalidatePath, revalidateTag } from 'next/cache';
import { sseManager } from './sse-manager';

export async function dispatchFrontendRevalidation(params: {
  event: SyncEventType;
  entityId?: string;
  paths?: string[];
  tags?: string[];
  payload?: any;
}): Promise<{ success: boolean; error?: string }> {
  // 1. Revalidate paths & tags in-process immediately (unified app)
  try {
    if (Array.isArray(params.paths)) {
      for (const p of params.paths) {
        if (typeof p === 'string' && p.startsWith('/')) {
          try {
            revalidatePath(p);
          } catch {}
        }
      }
    }
    if (Array.isArray(params.tags)) {
      for (const t of params.tags) {
        if (typeof t === 'string' && t.trim().length > 0) {
          try {
            // @ts-ignore
            revalidateTag(t);
          } catch {}
        }
      }
    }
  } catch {}

  // 2. Broadcast to active browser clients via Server-Sent Events
  try {
    sseManager.broadcast({
      id: `sync-${Date.now()}`,
      event: params.event,
      entityId: params.entityId,
      payload: params.payload,
      timestamp: new Date().toISOString(),
    });
  } catch (sseErr) {
    console.warn('[REVALIDATION] SSE broadcast non-fatal warning:', sseErr);
  }

  // 3. Optional external webhook if FRONTEND_URL is explicitly configured
  if (process.env.FRONTEND_URL) {
    const frontendUrl = process.env.FRONTEND_URL.replace('://localhost:', '://127.0.0.1:');
    const secret = process.env.REVALIDATION_SECRET || 'agrimart_secret_reval_2026';
    const webhookPayload: RevalidationWebhookPayload = {
      secret,
      event: params.event,
      entityId: params.entityId,
      paths: params.paths || [],
      tags: params.tags || [],
      timestamp: new Date().toISOString(),
    };

    fetch(`${frontendUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload),
      signal: AbortSignal.timeout(3000),
    }).catch(() => {});
  }

  return { success: true };
}

export async function revalidateFrontendPath(path: string) {
  return dispatchFrontendRevalidation({
    event: 'CATEGORY_UPDATED',
    paths: [path],
  });
}
