'use client';

import CreatePost from '@/components/feed/CreatePost';
import PostList from '@/components/feed/PostList';

export default function FeedPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-100">Your Feed</h1>
      <CreatePost />
      <PostList mode="feed" />
    </div>
  );
}
