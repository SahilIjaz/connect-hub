'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HiOutlineHeart, HiHeart, HiOutlineChat, HiOutlineTrash } from 'react-icons/hi';
import api from '@/lib/api';
import { Post } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { useFeedStore } from '@/store/useFeedStore';
import Avatar from '@/components/ui/Avatar';
import CommentSection from './CommentSection';
import { formatDate, getAvatarUrl } from '@/lib/utils';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const user = useAuthStore((s) => s.user);
  const { updatePostLikes, updateCommentCount, removePost } = useFeedStore();
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const isLiked = user ? post.likes.includes(user._id) : false;
  const isAuthor = user?._id === post.author._id;

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const { data } = await api.put(`/posts/${post._id}/like`);
      updatePostLikes(post._id, data.likes, data.liked);
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    try {
      await api.delete(`/posts/${post._id}`);
      removePost(post._id);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-4 transition-all duration-200 hover:border-dark-hover">
      {/* Header */}
      <div className="flex items-start justify-between">
        <Link
          href={`/profile/${post.author._id}`}
          className="flex items-center space-x-3"
        >
          <Avatar src={post.author.avatar} alt={post.author.name} size="md" />
          <div>
            <p className="text-sm font-semibold text-zinc-200 hover:text-primary transition-colors">
              {post.author.name}
            </p>
            <p className="text-xs text-zinc-500">{formatDate(post.createdAt)}</p>
          </div>
        </Link>
        {isAuthor && (
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-dark-hover transition-colors"
          >
            <HiOutlineTrash className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <p className="mt-3 text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Image */}
      {post.image && (
        <div className="mt-3 rounded-xl overflow-hidden">
          <img
            src={`${process.env.NEXT_PUBLIC_UPLOADS_URL || 'http://localhost:5000'}${post.image}`}
            alt="Post"
            className="w-full max-h-96 object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-6 mt-4 pt-3 border-t border-dark-border">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1.5 transition-colors ${
            isLiked
              ? 'text-accent-pink'
              : 'text-zinc-400 hover:text-accent-pink'
          }`}
        >
          {isLiked ? (
            <HiHeart className="w-5 h-5" />
          ) : (
            <HiOutlineHeart className="w-5 h-5" />
          )}
          <span className="text-sm">{post.likes.length}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1.5 text-zinc-400 hover:text-primary transition-colors"
        >
          <HiOutlineChat className="w-5 h-5" />
          <span className="text-sm">{post.commentCount}</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <CommentSection
          postId={post._id}
          onCommentAdded={() => updateCommentCount(post._id, 1)}
        />
      )}
    </div>
  );
}
