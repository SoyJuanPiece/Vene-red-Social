import type React from 'react';

// Core Types
export interface User {
  id: string;
  email: string;
  username: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  website?: string;
  is_private: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  caption: string;
  visibility: 'public' | 'private' | 'unlisted';
  has_media: boolean;
  media_count: number;
  location?: string;
  is_nsfw: boolean;
  content_warning?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  post_id: string;
  media_type: 'photo' | 'video';
  url: string;
  thumbnail_url?: string;
  width?: number;
  height?: number;
  duration?: number;
  file_size?: number;
  sort_order: number;
  created_at: string;
}

export interface Like {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id?: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: User;
  likes_count?: number;
}

export interface Notification {
  id: string;
  recipient_id: string;
  sender_id?: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'reply';
  post_id?: string;
  comment_id?: string;
  is_read: boolean;
  created_at: string;
  sender?: User;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface Story {
  id: string;
  user_id: string;
  media_url: string;
  media_type: 'photo' | 'video';
  thumbnail_url?: string;
  duration: number;
  views_count: number;
  created_at: string;
  expires_at: string;
  user?: User;
}

export interface DirectMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  media_url?: string;
  is_read: boolean;
  created_at: string;
  sender?: User;
}

// API Response Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Auth Types
export interface AuthSession {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  username: string;
  display_name: string;
}

// UI Component Props Types
export interface TouchableProps {
  onPress?: () => void;
  disabled?: boolean;
  style?: any;
}

export interface TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'bodyLarge' | 'body' | 'bodySmall' | 'caption' | 'button' | 'label';
  color?: string;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  children: React.ReactNode;
  style?: any;
}

export interface ButtonProps extends TouchableProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'text' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export interface InputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  editable?: boolean;
  multiline?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  maxLength?: number;
  error?: string;
  label?: string;
  style?: any;
}

export interface CardProps {
  variant?: 'default' | 'flat' | 'outlined';
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
}

export interface AvatarProps {
  source?: { uri: string };
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  placeholder?: string;
  showStoryRing?: boolean;
  hasStory?: boolean;
  style?: any;
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
  Splash: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type AppStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  EditProfile: undefined;
  PostDetail: { postId: string };
  Search: undefined;
  Explore: undefined;
  Notifications: undefined;
  Messages: undefined;
  Settings: undefined;
};

// Context Types
export interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isSignout: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  restoreToken: () => Promise<void>;
}

export interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
