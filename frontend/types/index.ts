export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  followers: User[] | string[];
  following: User[] | string[];
  createdAt: string;
}



export interface Post {
  _id: string;
  author: User;
  content: string;
  image: string;
  likes: string[];
  commentCount: number;
  createdAt: string;
}

export interface Comment {
  _id: string;
  author: User;
  post: string;
  text: string;
  createdAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: User;
  text: string;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  participants: User[];
  lastMessage: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  sender: User;
  type: 'like' | 'comment' | 'follow' | 'message';
  refPost?: { _id: string; content: string };
  read: boolean;
  createdAt: string;
}

export interface FeedResponse {
  posts: Post[];
  hasMore: boolean;
  total: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}
