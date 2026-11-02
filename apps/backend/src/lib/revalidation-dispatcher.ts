import { SyncEventType, RevalidationWebhookPayload } from '@agrimart/contracts';
import { sseManager } from './sse-manager';

export async function dispatchFrontendRevalidation(params: {
  event: SyncEventType;
  entityId?: string;
  paths?: string[];
  tags?: string[];
  payload?: any;
}): Promise<{ success: boolean; error?: string }> {
  const rawFrontendUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:3010';
  const frontendUrl = rawFrontendUrl.replace('://localhost:', '://127.0.0.1:');
  const secret = process.env.REVALIDATION_SECRET || 'agrimart_secret_reval_2026';

  // 1. Broadcast to active browser clients via Server-Sent Events
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

  // 2. Dispatch authenticated revalidation webhook to Next.js Frontend server asynchronously (non-blocking)
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
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(webhookPayload),
    signal: AbortSignal.timeout(4000),
  })
    .then(async (res) => {
      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        console.warn(`[REVALIDATION] Frontend revalidation webhook returned ${res.status}: ${errText}`);
      }
    })
    .catch((fetchErr: any) => {
      console.warn(`[REVALIDATION] Could not contact frontend webhook at ${frontendUrl}/api/revalidate (${fetchErr.message})`);
    });

  return { success: true };
}

export async function revalidateFrontendPath(path: string) {
  return dispatchFrontendRevalidation({
    event: 'CATEGORY_UPDATED',
    paths: [path],
  });
}

