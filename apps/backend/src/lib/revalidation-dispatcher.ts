import { SyncEventType, RevalidationWebhookPayload } from '@agrimart/contracts';
import { sseManager } from './sse-manager';

export async function dispatchFrontendRevalidation(params: {
  event: SyncEventType;
  entityId?: string;
  paths?: string[];
  tags?: string[];
  payload?: any;
}): Promise<{ success: boolean; error?: string }> {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3010';
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

  // 2. Dispatch authenticated revalidation webhook to Next.js Frontend server
  const webhookPayload: RevalidationWebhookPayload = {
    secret,
    event: params.event,
    entityId: params.entityId,
    paths: params.paths || [],
    tags: params.tags || [],
    timestamp: new Date().toISOString(),
  };

  try {
    const res = await fetch(`${frontendUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
      signal: AbortSignal.timeout(4000),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.warn(`[REVALIDATION] Frontend revalidation webhook returned ${res.status}: ${errText}`);
      return { success: false, error: `Frontend responded with status ${res.status}` };
    }

    const data = await res.json().catch(() => ({}));
    console.log(`[REVALIDATION] Successfully revalidated frontend for event [${params.event}]`, data);
    return { success: true };
  } catch (fetchErr: any) {
    // If frontend is not running during isolated backend test, log gracefully
    console.warn(`[REVALIDATION] Could not contact frontend webhook at ${frontendUrl}/api/revalidate (${fetchErr.message})`);
    return { success: false, error: fetchErr.message };
  }
}

export async function revalidateFrontendPath(path: string) {
  return dispatchFrontendRevalidation({
    event: 'CATEGORY_UPDATED',
    paths: [path],
  });
}

