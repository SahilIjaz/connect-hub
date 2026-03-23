'use client';

import { useState, useEffect } from 'react';
import { HiOutlinePaperAirplane } from 'react-icons/hi';
import api from '@/lib/api';
import { Comment } from '@/types';
import Avatar from '@/components/ui/Avatar';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

interface CommentSectionProps {
  postId: string;
  onCommentAdded: () => void;
}

export default function CommentSection({ postId, onCommentAdded }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.get(`/posts/${postId}/comments`).then(({ data }) => {
      setComments(data);
    });
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      const { data } = await api.post(`/posts/${postId}/comments`, { text });
      setComments([data, ...comments]);
      setText('');
      onCommentAdded();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 pt-3 border-t border-dark-border">
      {/* Add comment */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 mb-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          maxLength={280}
          className="flex-1 px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="p-2 rounded-lg text-primary hover:bg-dark-hover transition-colors disabled:opacity-50"
        >
          <HiOutlinePaperAirplane className="w-5 h-5 rotate-90" />
        </button>
      </form>

      {/* Comments list */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment._id} className="flex space-x-2">
            <Link href={`/profile/${comment.author._id}`}>
              <Avatar src={comment.author.avatar} alt={comment.author.name} size="sm" />
            </Link>
            <div className="flex-1 bg-dark-bg rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2">
                <Link
                  href={`/profile/${comment.author._id}`}
                  className="text-xs font-semibold text-zinc-300 hover:text-primary"
                >
                  {comment.author.name}
                </Link>
                <span className="text-xs text-zinc-600">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-sm text-zinc-400 mt-0.5">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
