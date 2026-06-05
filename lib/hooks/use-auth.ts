'use client';

import { createContext, useContext } from 'react';
import type { User, UserRole } from '@/types/domain/user';

export interface AuthContextValue {
  user?: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (input: { email: string; password?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
