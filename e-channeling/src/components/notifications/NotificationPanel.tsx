"use client";
import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { markAsRead, markAllAsRead } from "@/store/notifications/notificationSlice";
import NotificationItem from "./NotificationItem";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch();
  const panelRef = useRef<HTMLDivElement>(null);
  const { notifications } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      ></div>
    
      <div
        ref={panelRef}
        className="fixed md:absolute right-0 md:right-0 left-0 md:left-auto top-0 md:top-auto md:mt-2 w-full md:w-96 h-full md:h-auto bg-white md:rounded-lg shadow-2xl border-0 md:border border-gray-200 z-50 animate-in slide-in-from-right md:slide-in-from-top-2 duration-200 flex flex-col"
      >

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {notifications.filter(n => !n.isRead).length}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Mark all as read
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 md:max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-sm font-medium">No notifications yet</p>
              <p className="text-gray-400 text-xs mt-1">
                You &apos;re all caught up!
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))
          )}
        </div>
      </div>
    </>  
  );
};

export default NotificationPanel;