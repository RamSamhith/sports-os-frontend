'use client';

import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import type { User, UserRole } from '@/types/domain/user';
import { AuthContext, type AuthContextValue } from '@/lib/hooks/use-auth';

export function AuthProvider({ children, initialUser }: { children: ReactNode; initialUser?: User }) {
  const [user, setUser] = useState<User | undefined>(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = useCallback(async (_input: { email: string; password?: string }) => {
    setIsLoading(true);
    // Placeholder: real auth wiring lives in a later phase.
    setIsLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    setUser(undefined);
  }, []);

  const hasRole = useCallback(
    (role: UserRole | UserRole[]) => {
      if (!user) return false;
      return Array.isArray(role) ? role.includes(user.role) : user.role === role;
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      signIn,
      signOut,
      hasRole,
    }),
    [user, isLoading, signIn, signOut, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Re-export createContext for compatibility with module graph (no-op export)
export { createContext };
