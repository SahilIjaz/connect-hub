'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useFeedStore } from '@/store/useFeedStore';
import PostCard from './PostCard';
import Spinner from '@/components/ui/Spinner';

interface PostListProps {
  mode?: 'feed' | 'explore';
}

export default function PostList({ mode = 'feed' }: PostListProps) {
  const { posts, hasMore, isLoading, fetchFeed, fetchExplorePosts } = useFeedStore();
  const observerRef = useRef<HTMLDivElement>(null);

  const fetchFn = mode === 'feed' ? fetchFeed : fetchExplorePosts;

  useEffect(() => {
    fetchFn(true);
  }, [mode]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        fetchFn();
      }
    },
    [hasMore, isLoading, fetchFn]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {isLoading && (
        <div className="py-8">
          <Spinner />
        </div>
      )}

      {!isLoading && posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-500">
            {mode === 'feed'
              ? 'No posts yet. Follow some people to see their posts!'
              : 'No posts to explore yet.'}
          </p>
        </div>
      )}

      <div ref={observerRef} className="h-4" />
    </div>
  );
}
