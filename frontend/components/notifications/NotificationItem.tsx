'use client';

import Link from 'next/link';
import { HiOutlineHeart, HiOutlineChat, HiOutlineUserAdd } from 'react-icons/hi';
import { Notification } from '@/types';
import Avatar from '@/components/ui/Avatar';
import { formatDate } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
}

const iconMap = {
  like: HiOutlineHeart,
  comment: HiOutlineChat,
  follow: HiOutlineUserAdd,
  message: HiOutlineChat,
};

const textMap = {
  like: 'liked your post',
  comment: 'commented on your post',
  follow: 'started following you',
  message: 'sent you a message',
};

export default function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const Icon = iconMap[notification.type];

  const handleClick = () => {
    if (!notification.read) {
      onRead(notification._id);
    }
  };

  const getLink = () => {
    if (notification.type === 'follow') return `/profile/${notification.sender._id}`;
    if (notification.type === 'message') return '/chat';
    return `/profile/${notification.sender._id}`;
  };

  return (
    <Link
      href={getLink()}
      onClick={handleClick}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        notification.read
          ? 'hover:bg-dark-hover'
          : 'bg-primary/5 border border-primary/10 hover:bg-primary/10'
      }`}
    >
      <Avatar src={notification.sender.avatar} alt={notification.sender.name} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-300">
          <span className="font-semibold text-zinc-200">
            {notification.sender.name}
          </span>{' '}
          {textMap[notification.type]}
        </p>
        {notification.refPost && (
          <p className="text-xs text-zinc-500 truncate mt-0.5">
            &quot;{notification.refPost.content}&quot;
          </p>
        )}
        <p className="text-xs text-zinc-600 mt-0.5">
          {formatDate(notification.createdAt)}
        </p>
      </div>
      <Icon
        className={`w-5 h-5 flex-shrink-0 ${
          notification.type === 'like'
            ? 'text-accent-pink'
            : notification.type === 'follow'
            ? 'text-primary'
            : 'text-accent-green'
        }`}
      />
    </Link>
  );
}
