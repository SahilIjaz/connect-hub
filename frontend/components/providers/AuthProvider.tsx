'use client';

import { useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const loadUser = useAuthStore((s) => s.loadUser);

  useEffect(() => {
    console.log('🚀 AuthProvider mounted - initializing');
    console.log('📍 Current URL:', window.location.href);
    console.log('🔑 Stored token:', localStorage.getItem('token') ? 'YES' : 'NO');
    loadUser();
  }, [loadUser]);

  return <>{children}</>;
}
