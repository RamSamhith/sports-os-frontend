'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { ProfileSkeleton } from '@/components/feedback/skeletons';

export function PrivateGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, onboardingCompleted, role } = useAuth();
  const hydratedOnce = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    hydratedOnce.current = true;
    if (!isAuthenticated) {
      router.replace('/welcome');
    } else if (!onboardingCompleted) {
      router.replace(role ? '/onboarding/wizard' : '/onboarding/role');
    }
  }, [isLoading, isAuthenticated, onboardingCompleted, role, router]);

  if (isLoading) {
    if (!hydratedOnce.current) {
      return (
        <div aria-busy="true" aria-label="Loading profile" className="flex flex-col gap-6 py-10">
          <ProfileSkeleton />
        </div>
      );
    }
    return null;
  }

  if (!isAuthenticated || !onboardingCompleted) {
    return null;
  }

  return <>{children}</>;
}
