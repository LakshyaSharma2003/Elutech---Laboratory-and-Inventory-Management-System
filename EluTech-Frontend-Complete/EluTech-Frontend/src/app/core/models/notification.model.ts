export interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  sentAt: string;
}

export interface SendNotification {
  userId: number;
  title: string;
  message: string;
  type: string;
}
