import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notification, NotificationState } from "@/app/components/notifications/types";

const initialState: NotificationState = {
  notifications: [
    {
      id: "1",
      type: "appointment_reminder",
      title: "Appointment Reminder",
      description: "Your appointment with Dr. Samantha Perera is tomorrow at 10:00 AM",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: false,
      link: "/profile/appointments",
    },
    {
      id: "2",
      type: "appointment_confirmed",
      title: "Appointment Confirmed",
      description: "Your appointment has been confirmed for 6/20/2023",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      isRead: false,
      link: "/profile/appointments",
    },
    {
      id: "3",
      type: "payment_reminder",
      title: "Payment Reminder",
      description: "Your payment of Rs. 3,000 was successful",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      isRead: true,
      link: "/profile/payments",
    },
  ],
  unreadCount: 3,
  isLoading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.isRead = true;
      });
      state.unreadCount = 0;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, "id">>) => {
      const newNotification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.notifications.unshift(newNotification);
      if (!newNotification.isRead) {
        state.unreadCount += 1;
      }
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  markAsRead,
  markAllAsRead,
  addNotification,
  deleteNotification,
  clearAllNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;