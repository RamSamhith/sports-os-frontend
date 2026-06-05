import type { ReactNode } from 'react';
import { Container } from '@/components/layout/container';
import { AuroraBackground } from '@/components/layout/aurora-background';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate min-h-screen">
      <AuroraBackground />
      <Container size="sm" className="relative flex min-h-screen flex-col items-center justify-center py-10">
        <Link href="/" className="mb-6 flex items-center gap-2 font-semibold">
          <span className="bg-primary/20 ring-primary/30 grid h-8 w-8 place-items-center rounded-lg ring-1">
            <span className="bg-primary h-3 w-3 rounded-sm" />
          </span>
          SportsOS
        </Link>
        {children}
      </Container>
    </div>
  );
}
