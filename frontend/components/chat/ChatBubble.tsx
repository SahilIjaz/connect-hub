'use client';

import { Message } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { formatDate } from '@/lib/utils';

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const user = useAuthStore((s) => s.user);
  const isMine = message.sender._id === user?._id;

  return (
    <div
      className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
          isMine
            ? 'bg-primary text-white rounded-br-md'
            : 'bg-dark-surface border border-dark-border text-zinc-200 rounded-bl-md'
        }`}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>
        <p
          className={`text-xs mt-1 ${
            isMine ? 'text-indigo-200' : 'text-zinc-500'
          }`}
        >
          {formatDate(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
