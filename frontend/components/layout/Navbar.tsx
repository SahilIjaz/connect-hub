'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiOutlineBell, HiOutlineChat, HiOutlineSearch, HiOutlineLogout, HiOutlineMenu, HiX } from 'react-icons/hi';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import Avatar from '@/components/ui/Avatar';

export default function Navbar() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-dark-surface/80 backdrop-blur-xl border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/feed" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent-pink rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CH</span>
            </div>
            <span className="text-xl font-bold text-zinc-100 hidden sm:block">
              Connect Hub
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-full text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
            </div>
          </form>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              href="/chat"
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-dark-hover transition-colors"
            >
              <HiOutlineChat className="w-6 h-6" />
            </Link>

            <Link
              href="/notifications"
              className="relative p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-dark-hover transition-colors"
            >
              <HiOutlineBell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-accent-pink text-white text-xs flex items-center justify-center rounded-full">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            <Link
              href={`/profile/${user._id}`}
              className="ml-2"
            >
              <Avatar src={user.avatar} alt={user.name} size="sm" />
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-dark-hover transition-colors"
            >
              <HiOutlineLogout className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-zinc-200"
          >
            {showMobileMenu ? <HiX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-dark-border space-y-2">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search people..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-full text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
            </form>
            <Link
              href="/feed"
              onClick={() => setShowMobileMenu(false)}
              className="block px-3 py-2 rounded-lg text-zinc-300 hover:bg-dark-hover"
            >
              Feed
            </Link>
            <Link
              href="/chat"
              onClick={() => setShowMobileMenu(false)}
              className="block px-3 py-2 rounded-lg text-zinc-300 hover:bg-dark-hover"
            >
              Messages
            </Link>
            <Link
              href="/notifications"
              onClick={() => setShowMobileMenu(false)}
              className="block px-3 py-2 rounded-lg text-zinc-300 hover:bg-dark-hover"
            >
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </Link>
            <Link
              href={`/profile/${user._id}`}
              onClick={() => setShowMobileMenu(false)}
              className="block px-3 py-2 rounded-lg text-zinc-300 hover:bg-dark-hover"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-dark-hover"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
