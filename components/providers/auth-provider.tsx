'use client';

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AuthContext, type AuthContextValue, type OnboardingRole } from '@/lib/hooks/use-auth';

const STORAGE_KEY = 'sportsos:auth-state';

interface PersistedAuthState {
  isAuthenticated: boolean;
  role: OnboardingRole | null;
  onboardingCompleted: boolean;
}

function readState(): PersistedAuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { isAuthenticated: false, role: null, onboardingCompleted: false };
    const parsed = JSON.parse(raw);
    return {
      isAuthenticated: !!parsed.isAuthenticated,
      role: parsed.role === 'athlete' || parsed.role === 'parent' ? parsed.role : null,
      onboardingCompleted: !!parsed.onboardingCompleted,
    };
  } catch {
    return { isAuthenticated: false, role: null, onboardingCompleted: false };
  }
}

function writeState(state: PersistedAuthState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable
  }
}

/**
 * Migrate legacy localStorage keys into the unified auth state.
 * Runs once on mount.
 */
function migrateLegacyKeys(current: PersistedAuthState): PersistedAuthState {
  let next = { ...current };
  try {
    // Migrate sportsos:auth → isAuthenticated
    if (!next.isAuthenticated) {
      const legacyAuth = localStorage.getItem('sportsos:auth');
      if (legacyAuth === 'true') {
        next.isAuthenticated = true;
      }
    }
    // Migrate sportsos:onboarding-role → role + onboardingCompleted
    if (!next.role) {
      const legacyRole = localStorage.getItem('sportsos:onboarding-role');
      if (legacyRole === 'athlete' || legacyRole === 'parent') {
        next.role = legacyRole;
        next.onboardingCompleted = true;
      }
    }
    // Clean up legacy keys
    localStorage.removeItem('sportsos:auth');
    localStorage.removeItem('sportsos:onboarding-role');
  } catch {
    // ignore
  }
  return next;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedAuthState>({
    isAuthenticated: false,
    role: null,
    onboardingCompleted: false,
  });
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = readState();
    const migrated = migrateLegacyKeys(stored);
    setState(migrated);
    writeState(migrated);
    setHydrated(true);
  }, []);

  // Persist on every state change (after hydration)
  useEffect(() => {
    if (hydrated) {
      writeState(state);
    }
  }, [state, hydrated]);

  const setAuth = useCallback((authenticated: boolean) => {
    setState((prev) => ({ ...prev, isAuthenticated: authenticated }));
  }, []);

  const setRole = useCallback((role: OnboardingRole) => {
    setState((prev) => ({ ...prev, role, onboardingCompleted: true }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setState((prev) => ({ ...prev, onboardingCompleted: true }));
  }, []);

  const signOut = useCallback(() => {
    setState({ isAuthenticated: false, role: null, onboardingCompleted: false });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: state.isAuthenticated,
      isLoading: !hydrated,
      role: state.role,
      onboardingCompleted: state.onboardingCompleted,
      setAuth,
      setRole,
      completeOnboarding,
      signOut,
    }),
    [state, hydrated, setAuth, setRole, completeOnboarding, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Re-export createContext for compatibility with module graph (no-op export)
export { createContext };
