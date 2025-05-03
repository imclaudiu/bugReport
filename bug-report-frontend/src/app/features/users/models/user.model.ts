export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  phone?: string;
  score: number;
  isModerator: boolean;
  isBanned: boolean;
}

export interface UserActivity {
  id: number;
  type: 'BUG_CREATED' | 'BUG_UPDATED' | 'COMMENT_ADDED';
  description: string;
  timestamp: Date;
  targetId?: number;
}

export interface UserSettings {
  id: number;
  userId: number;
  displayName: string;
  email: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  DEVELOPER = 'DEVELOPER',
  TESTER = 'TESTER',
  USER = 'USER'
}

export interface UserSession {
  id: string;
  deviceInfo: string;
  lastActive: Date;
  ipAddress: string;
}

export enum ActivityType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  PROFILE_UPDATE = 'PROFILE_UPDATE',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  BUG_CREATED = 'BUG_CREATED',
  BUG_UPDATED = 'BUG_UPDATED',
  BUG_ASSIGNED = 'BUG_ASSIGNED',
  COMMENT_ADDED = 'COMMENT_ADDED'
} 