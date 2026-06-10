'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { ProfileSkeleton } from '@/components/feedback/skeletons';

export function PrivateGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, verified, onboardingCompleted } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace('/welcome');
    } else if (!verified) {
      router.replace('/verify/signup');
    } else if (!onboardingCompleted) {
      router.replace('/onboarding/wizard');
    }
  }, [isLoading, isAuthenticated, verified, onboardingCompleted, router]);

  if (isLoading) {
    return (
      <div aria-busy="true" aria-label="Loading profile" className="flex flex-col gap-6 py-10">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!isAuthenticated || !verified || !onboardingCompleted) {
    return null;
  }

  return <>{children}</>;
}
