"use client";
import React from "react";
import { Calendar, MessageSquare, CheckCircle, CreditCard } from "lucide-react";
import { Notification, NotificationType } from "./types";
import { useRouter } from "next/navigation";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
}) => {
  const router = useRouter();

  const getIcon = (type: NotificationType) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case "appointment_reminder":
        return <Calendar className={iconClass} />;
      case "new_message":
        return <MessageSquare className={iconClass} />;
      case "appointment_confirmed":
        return <CheckCircle className={iconClass} />;
      case "payment_reminder":
        return <CreditCard className={iconClass} />;
      default:
        return <Calendar className={iconClass} />;
    }
  };

  const getIconBgColor = (type: NotificationType) => {
    switch (type) {
      case "appointment_reminder":
        return "bg-blue-100 text-blue-600";
      case "new_message":
        return "bg-green-100 text-green-600";
      case "appointment_confirmed":
        return "bg-emerald-100 text-emerald-600";
      case "payment_reminder":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    } else {
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    }
  };

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0 ${
        !notification.isRead ? "bg-blue-50/30" : ""
      }`}
    >
      {/* Icon */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getIconBgColor(
          notification.type
        )}`}
      >
        {getIcon(notification.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-gray-900">
            {notification.title}
          </h4>
          {!notification.isRead && (
            <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1"></span>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
          {notification.description}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {getTimeAgo(notification.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default NotificationItem;