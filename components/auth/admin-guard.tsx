'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { ProfileSkeleton } from '@/components/feedback/skeletons';

function getBackendRole(): string | null {
  try {
    const token = localStorage.getItem('sportsos:auth-token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const hydratedOnce = useRef(false);
  const [backendRole, setBackendRole] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    hydratedOnce.current = true;
    const role = getBackendRole();
    setBackendRole(role);
    if (!isAuthenticated) {
      router.replace('/login');
    } else if (role !== 'admin') {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    if (!hydratedOnce.current) {
      return (
        <div aria-busy="true" aria-label="Loading admin" className="flex flex-col gap-6 py-10">
          <ProfileSkeleton />
        </div>
      );
    }
    return null;
  }

  if (!isAuthenticated || backendRole !== 'admin') {
    return null;
  }

  return <>{children}</>;
}
