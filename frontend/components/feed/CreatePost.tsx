'use client';

import { useState, useRef } from 'react';
import { HiOutlinePhotograph, HiX } from 'react-icons/hi';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useFeedStore } from '@/store/useFeedStore';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';

export default function CreatePost() {
  const user = useAuthStore((s) => s.user);
  const addPost = useFeedStore((s) => s.addPost);
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) formData.append('image', image);

      const { data } = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      addPost(data);
      setContent('');
      removeImage();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          <Avatar src={user.avatar} alt={user.name} size="md" />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              maxLength={500}
              rows={3}
              className="w-full bg-transparent text-zinc-200 placeholder-zinc-500 resize-none focus:outline-none text-sm leading-relaxed"
            />

            {imagePreview && (
              <div className="relative mt-2 inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
                >
                  <HiX className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-border">
          <div className="flex items-center space-x-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="p-2 rounded-lg text-zinc-400 hover:text-primary hover:bg-dark-hover transition-colors"
            >
              <HiOutlinePhotograph className="w-5 h-5" />
            </button>
            <span className="text-xs text-zinc-500">{content.length}/500</span>
          </div>
          <Button
            type="submit"
            size="sm"
            isLoading={isLoading}
            disabled={!content.trim() && !image}
          >
            Post
          </Button>
        </div>
      </form>
    </div>
  );
}
