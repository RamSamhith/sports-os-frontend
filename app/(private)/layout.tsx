import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ProfileSidebar } from '@/components/profile/profile-sidebar';
import { Container } from '@/components/layout/container';
import { ErrorBoundary } from '@/components/feedback/error-boundary';

const sampleChildren = [
  { id: 'c1', name: 'Aarav' },
  { id: 'c2', name: 'Diya' },
];

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <Container className="grid grid-cols-1 gap-6 py-10 md:grid-cols-[240px_1fr]">
        <ProfileSidebar kids={sampleChildren} />
        <main className="min-w-0">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </Container>
      <Footer />
    </>
  );
}
