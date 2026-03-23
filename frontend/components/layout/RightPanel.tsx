'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { User } from '@/types';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';

export default function RightPanel() {
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const currentUser = useAuthStore((s) => s.user);

  useEffect(() => {
    if (currentUser) {
      api.get('/users/suggestions').then(({ data }) => {
        setSuggestions(data);
      }).catch(() => {});
    }
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <aside className="hidden xl:block w-80 fixed right-0 top-16 bottom-0 p-4 overflow-y-auto">
      {/* Who to follow */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
        <h3 className="text-lg font-semibold text-zinc-200 mb-4">
          Who to follow
        </h3>
        {suggestions.length === 0 ? (
          <p className="text-zinc-500 text-sm">No suggestions yet</p>
        ) : (
          <div className="space-y-4">
            {suggestions.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between"
              >
                <Link
                  href={`/profile/${user._id}`}
                  className="flex items-center space-x-3 min-w-0"
                >
                  <Avatar src={user.avatar} alt={user.name} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">{user.bio || 'No bio'}</p>
                  </div>
                </Link>
                <Link href={`/profile/${user._id}`}>
                  <Button variant="secondary" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 text-xs text-zinc-600 px-2">
        <p>Connect Hub &copy; 2026</p>
        <p className="mt-1">Built with Next.js & Socket.io</p>
      </div>
    </aside>
  );
}
