'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { User } from '@/types';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { HiOutlineSearch } from 'react-icons/hi';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (q) {
      setIsLoading(true);
      api
        .get(`/users/search?q=${encodeURIComponent(q)}`)
        .then(({ data }) => setResults(data))
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [q]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-100 mb-2">Search Results</h1>
      {q && (
        <p className="text-zinc-500 mb-6">
          Results for &quot;{q}&quot;
        </p>
      )}

      {isLoading ? (
        <div className="py-12">
          <Spinner />
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12">
          <HiOutlineSearch className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500">
            {q ? 'No users found' : 'Search for people'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {results.map((user) => (
            <Link
              key={user._id}
              href={`/profile/${user._id}`}
              className="flex items-center space-x-3 p-4 bg-dark-surface border border-dark-border rounded-xl hover:border-dark-hover transition-all"
            >
              <Avatar src={user.avatar} alt={user.name} size="lg" />
              <div className="flex-1">
                <p className="font-semibold text-zinc-200">{user.name}</p>
                <p className="text-sm text-zinc-500">{user.bio || 'No bio'}</p>
              </div>
              <Button variant="secondary" size="sm">
                View Profile
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
