import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from '@/components/providers/AuthProvider';
import SocketProvider from '@/components/providers/SocketProvider';
import NotificationToast from '@/components/notifications/NotificationToast';
import DebugLog from '@/components/DebugLog';

export const metadata: Metadata = {
  title: 'Connect Hub - Social Network',
  description: 'A modern social media platform with real-time chat',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dark-bg antialiased">
        <AuthProvider>
          <SocketProvider>
            {children}
            <NotificationToast />
            <DebugLog />
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
