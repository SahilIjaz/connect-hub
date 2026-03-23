'use client';

import { useEffect } from 'react';
import { useChatStore } from '@/store/useChatStore';
import ConversationList from '@/components/chat/ConversationList';
import Spinner from '@/components/ui/Spinner';
import { HiOutlineChat } from 'react-icons/hi';

export default function ChatPage() {
  const { conversations, isLoading, fetchConversations } = useChatStore();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-100 mb-6">Messages</h1>

      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="py-12">
            <Spinner />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12">
            <HiOutlineChat className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-500">No conversations yet</p>
            <p className="text-zinc-600 text-sm mt-1">
              Visit someone&apos;s profile to start chatting
            </p>
          </div>
        ) : (
          <div className="p-2">
            <ConversationList conversations={conversations} />
          </div>
        )}
      </div>
    </div>
  );
}
