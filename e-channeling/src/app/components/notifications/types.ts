export type NotificationType = 
  | "appointment_reminder" 
  | "appointment_confirmed" 
  | "payment_reminder"
  | "appointment_cancelled"
  | "prescription_ready";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  link?: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}