'use client';

import { useEffect, createContext, useContext, ReactNode, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket';
import { Notification } from '@/types';

const SocketContext = createContext<{
  socket: Socket | null;
  onlineUsers: string[];
}>({
  socket: null,
  onlineUsers: [],
});

export const useSocket = () => useContext(SocketContext);

export default function SocketProvider({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (token && user) {
      const s = connectSocket(token);
      setSocket(s);

      s.on('getOnlineUsers', (users: string[]) => {
        setOnlineUsers(users);
      });

      s.on('newNotification', (notification: Notification) => {
        addNotification(notification);
      });

      return () => {
        disconnectSocket();
        setSocket(null);
      };
    } else {
      disconnectSocket();
      setSocket(null);
    }
  }, [token, user, addNotification]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
}
