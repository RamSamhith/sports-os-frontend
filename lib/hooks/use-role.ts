'use client';

import { useEffect, useState } from 'react';

export type OnboardingRole = 'athlete' | 'parent';

const STORAGE_KEY = 'sportsos:onboarding-role';

export function useRole(): OnboardingRole | null {
  const [role, setRole] = useState<OnboardingRole | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'athlete' || stored === 'parent') {
        setRole(stored);
      }
    } catch {
      // localStorage unavailable (SSR / private browsing)
    }

    function handleStorage() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'athlete' || stored === 'parent') {
          setRole(stored);
        } else {
          setRole(null);
        }
      } catch {
        // ignore
      }
    }

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return role;
}
