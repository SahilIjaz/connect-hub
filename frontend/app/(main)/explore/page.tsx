'use client';

import CreatePost from '@/components/feed/CreatePost';
import PostList from '@/components/feed/PostList';

export default function ExplorePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-100">Explore</h1>
      <CreatePost />
      <PostList mode="explore" />
    </div>
  );
}
