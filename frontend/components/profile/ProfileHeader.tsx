'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiOutlinePencil, HiOutlineChat } from 'react-icons/hi';
import api from '@/lib/api';
import { User } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';

interface ProfileHeaderProps {
  profileUser: User;
  onUpdate?: (user: User) => void;
}

export default function ProfileHeader({ profileUser, onUpdate }: ProfileHeaderProps) {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.user);
  const [isFollowing, setIsFollowing] = useState(
    Array.isArray(profileUser.followers)
      ? profileUser.followers.some((f: any) => (typeof f === 'string' ? f : f._id) === currentUser?._id)
      : false
  );
  const [followerCount, setFollowerCount] = useState(profileUser.followers.length);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);

  const isOwn = currentUser?._id === profileUser._id;

  const handleFollow = async () => {
    setIsLoadingFollow(true);
    try {
      const { data } = await api.post(`/users/${profileUser._id}/follow`);
      setIsFollowing(data.following);
      setFollowerCount((prev) => (data.following ? prev + 1 : prev - 1));
    } catch (error) {
      console.error('Error following:', error);
    } finally {
      setIsLoadingFollow(false);
    }
  };

  const handleMessage = async () => {
    try {
      const { data } = await api.post('/chat/conversation', {
        participantId: profileUser._id,
      });
      router.push(`/chat/${data._id}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
      {/* Banner */}
      <div className="h-32 bg-gradient-to-r from-primary/30 via-accent-pink/20 to-primary/30" />

      {/* Profile info */}
      <div className="px-6 pb-6">
        <div className="flex items-end justify-between -mt-12">
          <Avatar src={profileUser.avatar} alt={profileUser.name} size="xl" />
          <div className="flex items-center space-x-2 mt-14">
            {isOwn ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push('/profile/edit')}
              >
                <HiOutlinePencil className="w-4 h-4 mr-1" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMessage}
                >
                  <HiOutlineChat className="w-4 h-4 mr-1" />
                  Message
                </Button>
                <Button
                  variant={isFollowing ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={handleFollow}
                  isLoading={isLoadingFollow}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="mt-4">
          <h1 className="text-xl font-bold text-zinc-100">{profileUser.name}</h1>
          {profileUser.bio && (
            <p className="text-sm text-zinc-400 mt-1">{profileUser.bio}</p>
          )}

          <div className="flex items-center space-x-6 mt-4">
            <div className="text-sm">
              <span className="font-semibold text-zinc-200">
                {profileUser.following.length}
              </span>{' '}
              <span className="text-zinc-500">Following</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-zinc-200">
                {followerCount}
              </span>{' '}
              <span className="text-zinc-500">Followers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
