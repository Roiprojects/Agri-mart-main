import { LiveSyncEvent } from '@agrimart/contracts';

type ClientListener = (event: LiveSyncEvent) => void;

class ServerSentEventsManager {
  private listeners: Set<ClientListener> = new Set();

  subscribe(listener: ClientListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  broadcast(event: LiveSyncEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (err) {
        console.error('[SSE_MANAGER] Error dispatching to subscriber:', err);
      }
    }
  }

  getActiveSubscribersCount(): number {
    return this.listeners.size;
  }
}

export const sseManager = new ServerSentEventsManager();
