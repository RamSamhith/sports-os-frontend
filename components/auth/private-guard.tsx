'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileSkeleton } from '@/components/feedback/skeletons';

const AUTH_KEY = 'sportsos:auth';

export function PrivateGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const authed = localStorage.getItem(AUTH_KEY) === 'true';
      if (authed) {
        setAllowed(true);
      } else {
        router.replace('/welcome');
      }
    } catch {
      router.replace('/welcome');
    }
  }, [router]);

  if (allowed === null) {
    return (
      <div className="flex flex-col gap-6 py-10">
        <ProfileSkeleton />
      </div>
    );
  }

  return <>{children}</>;
}
