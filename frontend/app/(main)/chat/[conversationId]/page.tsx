'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import api from '@/lib/api';
import { Conversation } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import ChatWindow from '@/components/chat/ChatWindow';
import Avatar from '@/components/ui/Avatar';
import Spinner from '@/components/ui/Spinner';
import { useSocket } from '@/components/providers/SocketProvider';

export default function ChatRoomPage() {
  const { conversationId } = useParams();
  const user = useAuthStore((s) => s.user);
  const { onlineUsers } = useSocket();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const { data } = await api.get('/chat/conversations');
        const found = data.find((c: Conversation) => c._id === conversationId);
        setConversation(found || null);
      } catch (error) {
        console.error('Error fetching conversation:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConversation();
  }, [conversationId]);

  if (isLoading) {
    return (
      <div className="py-12">
        <Spinner />
      </div>
    );
  }

  const otherUser = conversation?.participants.find(
    (p) => p._id !== user?._id
  );
  const isOnline = otherUser ? onlineUsers.includes(otherUser._id) : false;

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center space-x-3 px-4 py-3 border-b border-dark-border">
        <Link
          href="/chat"
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-dark-hover lg:hidden"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
        </Link>
        {otherUser && (
          <>
            <Avatar
              src={otherUser.avatar}
              alt={otherUser.name}
              size="sm"
              online={isOnline}
            />
            <div>
              <p className="text-sm font-semibold text-zinc-200">
                {otherUser.name}
              </p>
              <p className="text-xs text-zinc-500">
                {isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Chat */}
      <div className="h-[calc(100%-3.5rem)]">
        <ChatWindow
          conversationId={conversationId as string}
          conversation={conversation}
        />
      </div>
    </div>
  );
}
