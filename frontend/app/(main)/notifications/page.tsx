'use client';

import { useEffect } from 'react';
import { useNotificationStore } from '@/store/useNotificationStore';
import NotificationItem from '@/components/notifications/NotificationItem';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { HiOutlineBell } from 'react-icons/hi';

export default function NotificationsPage() {
  const {
    notifications,
    isLoading,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">Notifications</h1>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="py-12">
            <Spinner />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <HiOutlineBell className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-500">No notifications yet</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onRead={markAsRead}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
