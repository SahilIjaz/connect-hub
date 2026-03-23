'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineChat,
  HiOutlineBell,
  HiOutlineGlobe,
} from 'react-icons/hi';
import { useAuthStore } from '@/store/useAuthStore';

const navItems = [
  { href: '/feed', icon: HiOutlineHome, label: 'Feed' },
  { href: '/explore', icon: HiOutlineGlobe, label: 'Explore' },
  { href: '/chat', icon: HiOutlineChat, label: 'Messages' },
  { href: '/notifications', icon: HiOutlineBell, label: 'Notifications' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  return (
    <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-16 bottom-0 bg-dark-surface/50 border-r border-dark-border p-4">
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-dark-hover'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
        {user && (
          <Link
            href={`/profile/${user._id}`}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              pathname.startsWith('/profile')
                ? 'bg-primary/10 text-primary'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-dark-hover'
            }`}
          >
            <HiOutlineUser className="w-6 h-6" />
            <span className="font-medium">Profile</span>
          </Link>
        )}
      </nav>
    </aside>
  );
}
