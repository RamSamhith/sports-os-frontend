'use client';

import { useAuth } from '@/lib/hooks/use-auth';

/**
 * @deprecated Use `useAuth().role` from `@/lib/hooks/use-auth` instead.
 * This wrapper exists for backward compatibility only.
 */
export function useRole(): 'athlete' | 'parent' | null {
  const { role } = useAuth();
  return role;
}

export type { OnboardingRole } from '@/lib/hooks/use-auth';
