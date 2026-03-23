import { create } from 'zustand';
import api from '@/lib/api';
import { Conversation, Message } from '@/types';

interface ChatState {
  conversations: Conversation[];
  activeMessages: Message[];
  isLoading: boolean;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  addMessage: (message: Message) => void;
  setConversations: (conversations: Conversation[]) => void;
  updateConversationLastMessage: (conversationId: string, text: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeMessages: [],
  isLoading: false,

  fetchConversations: async () => {
    set({ isLoading: true });
    const { data } = await api.get<Conversation[]>('/chat/conversations');
    set({ conversations: data, isLoading: false });
  },

  fetchMessages: async (conversationId: string) => {
    set({ isLoading: true });
    const { data } = await api.get<Message[]>(
      `/chat/messages/${conversationId}`
    );
    set({ activeMessages: data, isLoading: false });
  },

  addMessage: (message: Message) => {
    set({ activeMessages: [...get().activeMessages, message] });
  },

  setConversations: (conversations: Conversation[]) => {
    set({ conversations });
  },

  updateConversationLastMessage: (conversationId: string, text: string) => {
    set({
      conversations: get().conversations.map((c) =>
        c._id === conversationId
          ? { ...c, lastMessage: text, updatedAt: new Date().toISOString() }
          : c
      ),
    });
  },
}));
