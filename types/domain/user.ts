import type { LocationSummary, Radius } from './location';

export type UserRole = 'athlete' | 'parent' | 'coach' | 'academy_rep' | 'admin';

export type AdminRole = 'super_admin' | 'ops_admin' | 'lead_admin' | 'analyst' | 'support';

export interface UserPreferences {
  location?: LocationSummary;
  defaultRadiusKm?: Radius;
  defaultSportInterests?: string[]; // sport slugs
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
  authProvider?: 'credentials' | 'google' | 'phone';
  lastLoginAt?: string;
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
  themePreference?: 'midnight-ice' | 'ember-orange' | 'graphite-titanium' | 'alpine-light' | 'system';
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

export interface AdminUser {
  id: string;
  userId: string;
  role: AdminRole;
  scopes?: string[];
  isActive: boolean;
  lastActiveAt?: string;
}
