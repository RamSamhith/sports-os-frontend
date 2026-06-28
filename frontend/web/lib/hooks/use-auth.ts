'use client';

import { createContext, useContext } from 'react';
import type { UserRole } from '@/types/domain/user';

export type OnboardingRole = 'athlete' | 'parent' | 'coach' | 'academy_owner';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  authProvider?: 'credentials' | 'google' | 'guest';
}

export interface AuthChild {
  id: string;
  parentId: string;
  name: string;
  age: number;
  gender?: string;
  sportInterests: string[];
  skillLevel?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextValue {
  /** Whether the user is authenticated (frontend flag). */
  isAuthenticated: boolean;
  /** Loading / hydrating state — true until localStorage has been read. */
  isLoading: boolean;
  /** Whether the user is in guest mode. */
  isGuest: boolean;

  /** Selected role from onboarding, or null if not yet chosen. */
  role: UserRole | null;
  /** Whether the user has completed the onboarding role selection. */
  onboardingCompleted: boolean;
  /** Whether the user has completed OTP verification after signup. */
  verified: boolean;

  /** User profile data (name, email, phone). */
  profile: UserProfile;

  /** Onboarding data from backend (populated on login/me). */
  onboarding: {
    age: number | null;
    gender: string | null;
    sportInterests: string[];
    skillLevel: string | null;
    goals: string;
    location: string;
    children: AuthChild[];
  };

  /** Set authenticated flag (true after register / login). */
  setAuth: (authenticated: boolean, onboarded?: boolean) => void;
  /** Set the user's role (called from onboarding role selection). */
  setRole: (role: UserRole) => void;
  /** Mark onboarding as complete (called after role selection). */
  completeOnboarding: () => void;
  /** Mark OTP verification as complete. */
  setVerified: (verified: boolean) => void;
  /** Update user profile data. */
  setProfile: (profile: Partial<UserProfile>) => void;
  /** Update onboarding data from backend response. */
  setOnboarding: (data: Partial<AuthContextValue['onboarding']>) => void;
  /** Enter guest mode. */
  enterGuestMode: () => void;
  /** Convert guest to registered user (migration). */
  convertGuestToUser: () => void;
  /** Clear all auth state and redirect. */
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
