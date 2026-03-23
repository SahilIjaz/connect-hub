'use client';

import Link from 'next/link';
import { Conversation } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { useSocket } from '@/components/providers/SocketProvider';
import Avatar from '@/components/ui/Avatar';
import { formatDate, truncateText } from '@/lib/utils';

interface ConversationListProps {
  conversations: Conversation[];
  activeId?: string;
}

export default function ConversationList({ conversations, activeId }: ConversationListProps) {
  const user = useAuthStore((s) => s.user);
  const { onlineUsers } = useSocket();

  return (
    <div className="space-y-1">
      {conversations.map((conv) => {
        const otherUser = conv.participants.find((p) => p._id !== user?._id);
        if (!otherUser) return null;

        const isOnline = onlineUsers.includes(otherUser._id);
        const isActive = conv._id === activeId;

        return (
          <Link
            key={conv._id}
            href={`/chat/${conv._id}`}
            className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-primary/10 border border-primary/20'
                : 'hover:bg-dark-hover'
            }`}
          >
            <Avatar
              src={otherUser.avatar}
              alt={otherUser.name}
              size="md"
              online={isOnline}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-200 truncate">
                  {otherUser.name}
                </p>
                <span className="text-xs text-zinc-500">
                  {formatDate(conv.updatedAt)}
                </span>
              </div>
              {conv.lastMessage && (
                <p className="text-xs text-zinc-500 truncate mt-0.5">
                  {truncateText(conv.lastMessage, 40)}
                </p>
              )}
            </div>
          </Link>
        );
      })}

      {conversations.length === 0 && (
        <div className="text-center py-8">
          <p className="text-zinc-500 text-sm">No conversations yet</p>
          <p className="text-zinc-600 text-xs mt-1">
            Visit a profile to start a chat
          </p>
        </div>
      )}
    </div>
  );
}
