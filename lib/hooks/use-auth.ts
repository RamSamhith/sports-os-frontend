'use client';

import { createContext, useContext } from 'react';

export type OnboardingRole = 'athlete' | 'parent';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

export interface AuthContextValue {
  /** Whether the user is authenticated (frontend flag). */
  isAuthenticated: boolean;
  /** Loading / hydrating state — true until localStorage has been read. */
  isLoading: boolean;

  /** Selected role from onboarding, or null if not yet chosen. */
  role: OnboardingRole | null;
  /** Whether the user has completed the onboarding role selection. */
  onboardingCompleted: boolean;
  /** Whether the user has completed OTP verification after signup. */
  verified: boolean;

  /** User profile data (name, email, phone). */
  profile: UserProfile;

  /** Set authenticated flag (true after register / login). */
  setAuth: (authenticated: boolean) => void;
  /** Set the user's role (called from onboarding role selection). */
  setRole: (role: OnboardingRole) => void;
  /** Mark onboarding as complete (called after role selection). */
  completeOnboarding: () => void;
  /** Mark OTP verification as complete. */
  setVerified: (verified: boolean) => void;
  /** Update user profile data. */
  setProfile: (profile: Partial<UserProfile>) => void;
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
