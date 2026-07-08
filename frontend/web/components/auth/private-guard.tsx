'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { ProfileSkeleton } from '@/components/feedback/skeletons';

export function PrivateGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isGuest, isLoading, onboardingCompleted, role } = useAuth();
  const hydratedOnce = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    hydratedOnce.current = true;
    // Allow guests through — they see a limited profile view
    if (isGuest) return;
    if (!isAuthenticated) {
      router.replace('/welcome');
    } else if (!onboardingCompleted) {
      router.replace(role ? '/onboarding/wizard' : '/onboarding/role');
    }
  }, [isLoading, isAuthenticated, isGuest, onboardingCompleted, role, router]);

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

  // Guests see a limited profile — allow through
  if (isGuest) return <>{children}</>;

  if (!isAuthenticated || !onboardingCompleted) {
    return null;
  }

  return <>{children}</>;
}
