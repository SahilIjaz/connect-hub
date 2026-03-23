import { create } from 'zustand';
import api from '@/lib/api';
import { Post, FeedResponse } from '@/types';

interface FeedState {
  posts: Post[];
  hasMore: boolean;
  page: number;
  isLoading: boolean;
  fetchFeed: (reset?: boolean) => Promise<void>;
  fetchExplorePosts: (reset?: boolean) => Promise<void>;
  addPost: (post: Post) => void;
  updatePostLikes: (postId: string, likes: string[], liked: boolean) => void;
  updateCommentCount: (postId: string, delta: number) => void;
  removePost: (postId: string) => void;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: [],
  hasMore: true,
  page: 1,
  isLoading: false,

  fetchFeed: async (reset = false) => {
    const currentPage = reset ? 1 : get().page;
    set({ isLoading: true });

    const { data } = await api.get<FeedResponse>(
      `/posts/feed?page=${currentPage}&limit=10`
    );

    set({
      posts: reset ? data.posts : [...get().posts, ...data.posts],
      hasMore: data.hasMore,
      page: currentPage + 1,
      isLoading: false,
    });
  },

  fetchExplorePosts: async (reset = false) => {
    const currentPage = reset ? 1 : get().page;
    set({ isLoading: true });

    const { data } = await api.get<FeedResponse>(
      `/posts/explore?page=${currentPage}&limit=10`
    );

    set({
      posts: reset ? data.posts : [...get().posts, ...data.posts],
      hasMore: data.hasMore,
      page: currentPage + 1,
      isLoading: false,
    });
  },

  addPost: (post: Post) => {
    set({ posts: [post, ...get().posts] });
  },

  updatePostLikes: (postId: string, likes: string[], liked: boolean) => {
    set({
      posts: get().posts.map((p) =>
        p._id === postId ? { ...p, likes } : p
      ),
    });
  },

  updateCommentCount: (postId: string, delta: number) => {
    set({
      posts: get().posts.map((p) =>
        p._id === postId ? { ...p, commentCount: p.commentCount + delta } : p
      ),
    });
  },

  removePost: (postId: string) => {
    set({ posts: get().posts.filter((p) => p._id !== postId) });
  },
}));
