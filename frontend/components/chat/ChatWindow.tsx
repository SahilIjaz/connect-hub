'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useSocket } from '@/components/providers/SocketProvider';
import { Message, Conversation } from '@/types';
import api from '@/lib/api';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import Spinner from '@/components/ui/Spinner';

interface ChatWindowProps {
  conversationId: string;
  conversation: Conversation | null;
}

export default function ChatWindow({ conversationId, conversation }: ChatWindowProps) {
  const { activeMessages, fetchMessages, addMessage, isLoading } = useChatStore();
  const user = useAuthStore((s) => s.user);
  const { socket } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [typing, setTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const otherUser = conversation?.participants.find((p) => p._id !== user?._id);

  useEffect(() => {
    fetchMessages(conversationId);
  }, [conversationId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      if (message.conversationId === conversationId) {
        addMessage(message);
      }
    };

    const handleUserTyping = ({ conversationId: cId }: { conversationId: string }) => {
      if (cId === conversationId) {
        setTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setTyping(false), 2000);
      }
    };

    const handleUserStoppedTyping = ({ conversationId: cId }: { conversationId: string }) => {
      if (cId === conversationId) setTyping(false);
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('userTyping', handleUserTyping);
    socket.on('userStoppedTyping', handleUserStoppedTyping);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('userTyping', handleUserTyping);
      socket.off('userStoppedTyping', handleUserStoppedTyping);
    };
  }, [socket, conversationId, addMessage]);

  const handleSend = async (text: string) => {
    if (!otherUser) return;

    try {
      const { data } = await api.post('/chat/messages', {
        receiverId: otherUser._id,
        text,
      });

      addMessage(data.message);

      // Emit via socket for real-time delivery
      socket?.emit('sendMessage', {
        receiverId: otherUser._id,
        message: data.message,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = useCallback(() => {
    if (!otherUser || !socket) return;
    socket.emit('typing', { conversationId, receiverId: otherUser._id });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', { conversationId, receiverId: otherUser._id });
    }, 1000);
  }, [socket, conversationId, otherUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeMessages.map((msg) => (
          <ChatBubble key={msg._id} message={msg} />
        ))}
        {typing && (
          <div className="text-xs text-zinc-500 ml-2 mb-2">
            {otherUser?.name} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} onTyping={handleTyping} />
    </div>
  );
}
