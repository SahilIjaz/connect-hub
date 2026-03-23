'use client';

import { useEffect, useState } from 'react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Notification } from '@/types';
import Avatar from '@/components/ui/Avatar';

export default function NotificationToast() {
  const notifications = useNotificationStore((s) => s.notifications);
  const [toast, setToast] = useState<Notification | null>(null);
  const [lastSeen, setLastSeen] = useState(0);

  useEffect(() => {
    if (notifications.length > lastSeen && lastSeen > 0) {
      const newest = notifications[0];
      if (!newest.read) {
        setToast(newest);
        setTimeout(() => setToast(null), 4000);
      }
    }
    setLastSeen(notifications.length);
  }, [notifications.length]);

  if (!toast) return null;

  const textMap: Record<string, string> = {
    like: 'liked your post',
    comment: 'commented on your post',
    follow: 'started following you',
    message: 'sent you a message',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-dark-surface border border-dark-border rounded-xl shadow-2xl p-4 flex items-center space-x-3 max-w-sm">
        <Avatar src={toast.sender.avatar} alt={toast.sender.name} size="sm" />
        <div>
          <p className="text-sm text-zinc-200">
            <span className="font-semibold">{toast.sender.name}</span>{' '}
            {textMap[toast.type]}
          </p>
        </div>
      </div>
    </div>
  );
}
