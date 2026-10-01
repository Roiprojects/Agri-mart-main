import { dataStore } from './store';

export type NotificationChannel = 'SMS' | 'EMAIL' | 'PUSH' | 'WHATSAPP';

export interface NotificationPayload {
  channel: NotificationChannel;
  recipient: string;
  event: string;
  message: string;
}

export function sendNotification(payload: NotificationPayload) {
  const newNotif = {
    id: 'notif-' + Date.now(),
    channel: payload.channel,
    recipient: payload.recipient,
    event: payload.event,
    message: payload.message,
    status: 'DELIVERED',
    sentAt: new Date().toISOString(),
  };

  dataStore.notifications.unshift(newNotif);
  console.log(`[Notification Service] ${payload.event} dispatched to ${payload.recipient}: ${payload.message}`);
  return newNotif;
}
