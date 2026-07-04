import type { ThemePreference } from '@/config/theme';

export type UserRole = 'athlete' | 'parent' | 'admin';

export interface UserPreferences {
  defaultSportInterests?: string[]; // sport slugs
  favoriteSports?: string[];
  city?: string;
  radius?: number;
  skillLevel?: string;
  goals?: string;
  notifications?: boolean;
  language?: string;
}

export interface ConsentFlags {
  analytics: boolean;
  marketing: boolean;
  whatsapp: boolean;
}

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  authProvider?: 'credentials' | 'google' | 'microsoft' | 'guest';
  lastLoginAt?: string;
  isVerified?: boolean;
  phoneVerified?: boolean;
  onboardingCompleted?: boolean;
  // Onboarding profile fields (persisted to backend)
  age?: number | null;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
  sportInterests?: string[];
  skillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'competitive' | null;
  goals?: string;
  location?: string;
  children?: Child[];
  preferences?: UserPreferences;
  themePreference?: ThemePreference;
  consent?: ConsentFlags;
  createdAt: string;
  updatedAt: string;
}

export interface Child {
  id: string;
  parentId: string;
  name: string;
  age: number;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  sportInterests: string[]; // sport slugs
  skillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'competitive';
  createdAt: string;
  updatedAt: string;
}
