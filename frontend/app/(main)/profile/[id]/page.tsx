'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { User, Post } from '@/types';
import ProfileHeader from '@/components/profile/ProfileHeader';
import PostCard from '@/components/feed/PostCard';
import Spinner from '@/components/ui/Spinner';
import { useFeedStore } from '@/store/useFeedStore';

export default function ProfilePage() {
  const { id } = useParams();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync with feed store for like/comment updates
  const feedPosts = useFeedStore((s) => s.posts);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const [userRes, postsRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get(`/posts/user/${id}`),
        ]);
        setProfileUser(userRes.data);
        setPosts(postsRes.data.posts);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-12">
        <Spinner />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ProfileHeader profileUser={profileUser} />
      <h2 className="text-lg font-semibold text-zinc-200">Posts</h2>
      {posts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-zinc-500">No posts yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
