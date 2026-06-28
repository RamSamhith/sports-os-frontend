'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { getMe } from '@/lib/api/auth';
import { ProfileSkeleton } from '@/components/feedback/skeletons';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const hydratedOnce = useRef(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (isLoading) return;
    hydratedOnce.current = true;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    // Verify admin role from authoritative server response (not client-side JWT decode)
    getMe().then((res) => {
      if (res.ok && res.data && res.data.role === 'admin') {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        router.replace('/');
      }
    }).catch(() => {
      setIsAuthorized(false);
      router.replace('/login');
    });
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    if (!hydratedOnce.current) {
      return (
        <div aria-busy="true" aria-label="Loading admin" className="flex flex-col gap-6 py-10">
          <ProfileSkeleton />
        </div>
      );
    }
  }

  if (isAuthorized === null) {
    return (
      <div aria-busy="true" aria-label="Verifying admin access" className="flex flex-col gap-6 py-10">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!isAuthenticated || isAuthorized !== true) {
    return null;
  }

  return <>{children}</>;
}
