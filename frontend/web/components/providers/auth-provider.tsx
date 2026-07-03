'use client';

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AuthContext, type AuthContextValue, type AuthChild, type UserProfile } from '@/lib/hooks/use-auth';
import type { UserRole } from '@/types/domain/user';
import { getMe, logout as apiLogout } from '@/lib/api/auth';

const STORAGE_KEY = 'sportsos:auth-state';
const PROFILE_KEY = 'sportsos:profile';
const ONBOARDING_KEY = 'sportsos:onboarding-data';
const GUEST_KEY = 'sportsos:is-guest';
const GUEST_ID_KEY = 'sportsos:guest-id';

const GUEST_STORAGE_KEYS = [
  'sportsos:shortlist',
  'sportsos:recent-searches',
  'sportsos:recently-viewed',
  'sportsos:compare',
  'sportsos:preferences',
  'sportsos:location',
  'sportsos:theme',
];

interface PersistedAuthState {
  isAuthenticated: boolean;
  role: UserRole | null;
  onboardingCompleted: boolean;
  verified: boolean;
}

interface PersistedProfile {
  name: string;
  email: string;
  phone: string;
  authProvider?: 'credentials' | 'google' | 'microsoft' | 'guest';
}

interface PersistedOnboarding {
  age: number | null;
  gender: string | null;
  sportInterests: string[];
  skillLevel: string | null;
  goals: string;
  location: string;
  children: AuthChild[];
}

const defaultProfile: UserProfile = { name: '', email: '', phone: '' };

const defaultOnboarding: PersistedOnboarding = {
  age: null,
  gender: null,
  sportInterests: [],
  skillLevel: null,
  goals: '',
  location: '',
  children: [],
};

const VALID_ROLES: readonly UserRole[] = ['athlete', 'parent', 'coach', 'academy_owner', 'admin'];

function readState(): PersistedAuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { isAuthenticated: false, role: null, onboardingCompleted: false, verified: false };
    const parsed = JSON.parse(raw);
    return {
      isAuthenticated: !!parsed.isAuthenticated,
      role: VALID_ROLES.includes(parsed.role) ? parsed.role : null,
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
      authProvider: parsed.authProvider,
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

function readOnboarding(): PersistedOnboarding {
  try {
    const raw = localStorage.getItem(ONBOARDING_KEY);
    if (!raw) return { ...defaultOnboarding };
    const parsed = JSON.parse(raw);
    return {
      age: typeof parsed.age === 'number' ? parsed.age : null,
      gender: typeof parsed.gender === 'string' ? parsed.gender : null,
      sportInterests: Array.isArray(parsed.sportInterests) ? parsed.sportInterests : [],
      skillLevel: typeof parsed.skillLevel === 'string' ? parsed.skillLevel : null,
      goals: typeof parsed.goals === 'string' ? parsed.goals : '',
      location: typeof parsed.location === 'string' ? parsed.location : '',
      children: Array.isArray(parsed.children) ? parsed.children : [],
    };
  } catch {
    return { ...defaultOnboarding };
  }
}

function writeOnboarding(data: PersistedOnboarding) {
  try {
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(data));
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
  const [onboarding, setOnboardingState] = useState<PersistedOnboarding>({ ...defaultOnboarding });
  const [hydrated, setHydrated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  // Hydrate from localStorage on mount, then fetch from backend if token exists
  useEffect(() => {
    const stored = readState();
    const migrated = migrateLegacyKeys(stored);
    setState(migrated);
    writeState(migrated);
    setProfileState(readProfile());
    setOnboardingState(readOnboarding());

    // Read guest flag
    try {
      const guestFlag = localStorage.getItem(GUEST_KEY);
      if (guestFlag === 'true' && !migrated.isAuthenticated) {
        setIsGuest(true);
        // Restore guest profile if not already set
        const storedProfile = readProfile();
        if (!storedProfile.name || storedProfile.authProvider !== 'guest') {
          const guestProfile: UserProfile = {
            name: 'Guest User',
            email: '',
            phone: '',
            authProvider: 'guest',
          };
          setProfileState(guestProfile);
          writeProfile(guestProfile);
        }
      }
    } catch { /* ignore */ }

    setHydrated(true);

    // If authenticated, fetch fresh data from backend
    // If access token expired, the API client will auto-refresh via cookie
    if (migrated.isAuthenticated) {
      getMe().then((res) => {
        if (res.ok && res.data) {
          const user = res.data;
          // Update profile from backend
          const backendProfile: UserProfile = {
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            authProvider: user.authProvider,
          };
          setProfileState(backendProfile);
          writeProfile(backendProfile);

          // Update onboarding from backend
          const backendOnboarding: PersistedOnboarding = {
            age: user.age ?? null,
            gender: user.gender ?? null,
            sportInterests: user.sportInterests || [],
            skillLevel: user.skillLevel ?? null,
            goals: user.goals || '',
            location: user.location || '',
            children: (user.children || []).map((c) => ({
              id: c.id,
              parentId: c.parentId,
              name: c.name,
              age: c.age,
              gender: c.gender,
              sportInterests: c.sportInterests || [],
              skillLevel: c.skillLevel,
              createdAt: c.createdAt,
              updatedAt: c.updatedAt,
            })),
          };
          setOnboardingState(backendOnboarding);
          writeOnboarding(backendOnboarding);

          // Update auth state from backend
          const validRole = VALID_ROLES.includes(user.role) ? user.role as UserRole : null;
          setState((prev) => ({
            ...prev,
            role: validRole || prev.role,
            onboardingCompleted: !!user.onboardingCompleted,
          }));
        } else if (res.ok === false && res.error?.code === 'UNAUTHORIZED') {
          // Session fully expired (refresh token also invalid) — sign out
          setState({ isAuthenticated: false, role: null, onboardingCompleted: false, verified: false });
          setProfileState({ ...defaultProfile });
          setOnboardingState({ ...defaultOnboarding });
          try { localStorage.removeItem('sportsos:auth-token'); } catch { /* ignore */ }
        }
      }).catch(() => {
        // Non-critical — localStorage fallback is already hydrated
      });
    }
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

  // Persist onboarding on every change (after hydration)
  useEffect(() => {
    if (hydrated) {
      writeOnboarding(onboarding);
    }
  }, [onboarding, hydrated]);

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

  const setRole = useCallback((role: UserRole) => {
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

  const setOnboarding = useCallback((updates: Partial<PersistedOnboarding>) => {
    setOnboardingState((prev) => {
      const next = { ...prev, ...updates };
      return next;
    });
  }, []);

  const enterGuestMode = useCallback(() => {
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const guestProfile: UserProfile = {
      name: 'Guest User',
      email: '',
      phone: '',
      authProvider: 'guest',
    };
    setIsGuest(true);
    setProfileState(guestProfile);
    try {
      localStorage.setItem(GUEST_KEY, 'true');
      localStorage.setItem(GUEST_ID_KEY, guestId);
      localStorage.setItem(PROFILE_KEY, JSON.stringify(guestProfile));
    } catch { /* ignore */ }
  }, []);

  const convertGuestToUser = useCallback(() => {
    // Migrate guest data to user session before clearing
    try {
      // Guest shortlist, recent searches, recently viewed, preferences, and theme
      // are already stored in shared localStorage keys that persist across sessions.
      // The migration is implicit — user data takes over the same keys.
    } catch { /* ignore */ }
    setIsGuest(false);
    try {
      localStorage.removeItem(GUEST_KEY);
      localStorage.removeItem(GUEST_ID_KEY);
    } catch { /* ignore */ }
  }, []);

  const signOut = useCallback(() => {
    // Notify backend to revoke refresh token and clear cookie
    apiLogout().catch(() => {});
    setState({ isAuthenticated: false, role: null, onboardingCompleted: false, verified: false });
    setProfileState({ ...defaultProfile });
    setOnboardingState({ ...defaultOnboarding });
    setIsGuest(false);
    // Clear all app-specific localStorage keys
    try {
      localStorage.removeItem(GUEST_KEY);
      localStorage.removeItem(GUEST_ID_KEY);
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
      localStorage.removeItem('sportsos:onboarding-data');
    } catch { /* ignore */ }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: state.isAuthenticated,
      isLoading: !hydrated,
      isGuest,
      role: state.role,
      onboardingCompleted: state.onboardingCompleted,
      verified: state.verified,
      profile,
      onboarding,
      setAuth,
      setRole,
      completeOnboarding,
      setVerified,
      setProfile,
      setOnboarding,
      enterGuestMode,
      convertGuestToUser,
      signOut,
    }),
    [state, hydrated, isGuest, profile, onboarding, setAuth, setRole, completeOnboarding, setVerified, setProfile, setOnboarding, enterGuestMode, convertGuestToUser, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
