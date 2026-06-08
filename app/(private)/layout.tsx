import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { SkipLink } from '@/components/layout/skip-link';
import { ProfileSidebar } from '@/components/profile/profile-sidebar';
import { Container } from '@/components/layout/container';
import { ErrorBoundary } from '@/components/feedback/error-boundary';
import { PrivateGuard } from '@/components/auth/private-guard';

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <Navbar />
      <ErrorBoundary>
        <PrivateGuard>
          <Container className="grid grid-cols-1 gap-6 py-10 md:grid-cols-[240px_1fr]">
            <ProfileSidebar />
            <main id="main" className="min-w-0">{children}</main>
          </Container>
        </PrivateGuard>
      </ErrorBoundary>
      <Footer />
    </>
  );
}
