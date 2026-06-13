'use client';

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AuthContext, type AuthContextValue, type OnboardingRole, type UserProfile } from '@/lib/hooks/use-auth';

const STORAGE_KEY = 'sportsos:auth-state';
const PROFILE_KEY = 'sportsos:profile';

interface PersistedAuthState {
  isAuthenticated: boolean;
  role: OnboardingRole | null;
  onboardingCompleted: boolean;
  verified: boolean;
}

interface PersistedProfile {
  name: string;
  email: string;
  phone: string;
}

const defaultProfile: UserProfile = { name: '', email: '', phone: '' };

function readState(): PersistedAuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { isAuthenticated: false, role: null, onboardingCompleted: false, verified: false };
    const parsed = JSON.parse(raw);
    return {
      isAuthenticated: !!parsed.isAuthenticated,
      role: parsed.role === 'athlete' || parsed.role === 'parent' ? parsed.role : null,
      onboardingCompleted: !!parsed.onboardingCompleted,
      verified: !!parsed.verified,
    };
  } catch {
    return { isAuthenticated: false, role: null, onboardingCompleted: false, verified: false };
  }
}

function writeState(state: PersistedAuthState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable
  }
}

function readProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return { ...defaultProfile };
    const parsed: PersistedProfile = JSON.parse(raw);
    return {
      name: typeof parsed.name === 'string' ? parsed.name : '',
      email: typeof parsed.email === 'string' ? parsed.email : '',
      phone: typeof parsed.phone === 'string' ? parsed.phone : '',
    };
  } catch {
    return { ...defaultProfile };
  }
}

function writeProfile(profile: UserProfile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
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
    verified: false,
  });
  const [profile, setProfileState] = useState<UserProfile>({ ...defaultProfile });
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = readState();
    const migrated = migrateLegacyKeys(stored);
    setState(migrated);
    writeState(migrated);
    setProfileState(readProfile());
    setHydrated(true);
  }, []);

  // Persist auth state on every change (after hydration)
  useEffect(() => {
    if (hydrated) {
      writeState(state);
    }
  }, [state, hydrated]);

  // Persist profile on every change (after hydration)
  useEffect(() => {
    if (hydrated) {
      writeProfile(profile);
    }
  }, [profile, hydrated]);

  const setAuth = useCallback((authenticated: boolean, onboarded?: boolean) => {
    setState((prev) => {
      if (prev.isAuthenticated === authenticated && (onboarded === undefined || prev.onboardingCompleted === onboarded)) return prev;
      return {
        ...prev,
        isAuthenticated: authenticated,
        verified: authenticated ? true : prev.verified,
        onboardingCompleted: onboarded ?? prev.onboardingCompleted,
      };
    });
  }, []);

  const setRole = useCallback((role: OnboardingRole) => {
    setState((prev) => {
      if (prev.role === role) return prev;
      return { ...prev, role };
    });
  }, []);

  const completeOnboarding = useCallback(() => {
    setState((prev) => {
      if (prev.onboardingCompleted) return prev;
      return { ...prev, onboardingCompleted: true };
    });
  }, []);

  const setVerified = useCallback((verified: boolean) => {
    setState((prev) => {
      if (prev.verified === verified) return prev;
      return { ...prev, verified };
    });
  }, []);

  const setProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...updates };
      if (next.name === prev.name && next.email === prev.email && next.phone === prev.phone) {
        return prev;
      }
      return next;
    });
  }, []);

  const signOut = useCallback(() => {
    setState({ isAuthenticated: false, role: null, onboardingCompleted: false, verified: false });
    setProfileState({ ...defaultProfile });
    // Clear all app-specific localStorage keys
    try {
      localStorage.removeItem('sportsos:auth-token');
      localStorage.removeItem('sportsos:settings');
      localStorage.removeItem('sportsos:preferences');
      localStorage.removeItem('sportsos:children');
      localStorage.removeItem('sportsos:active-child');
      localStorage.removeItem('sportsos:notifications');
      localStorage.removeItem('sportsos:privacy');
      localStorage.removeItem('sportsos:motion');
      localStorage.removeItem('sportsos:location');
      localStorage.removeItem('sportsos:location-radius');
      localStorage.removeItem('sportsos:shortlist');
      localStorage.removeItem('sportsos:compare');
      localStorage.removeItem('sportsos:recent-searches');
      localStorage.removeItem('sportsos:academy-status');
      localStorage.removeItem('sportsos:selected-academy');
      localStorage.removeItem('sportsos:recently-viewed');
    } catch { /* ignore */ }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: state.isAuthenticated,
      isLoading: !hydrated,
      role: state.role,
      onboardingCompleted: state.onboardingCompleted,
      verified: state.verified,
      profile,
      setAuth,
      setRole,
      completeOnboarding,
      setVerified,
      setProfile,
      signOut,
    }),
    [state, hydrated, profile, setAuth, setRole, completeOnboarding, setVerified, setProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Re-export createContext for compatibility with module graph (no-op export)
export { createContext };
