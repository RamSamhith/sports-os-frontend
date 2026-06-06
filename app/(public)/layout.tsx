import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CompareTray } from '@/components/compare/compare-tray';
import { SkipLink } from '@/components/layout/skip-link';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main" tabIndex={-1} className="min-h-[60vh] focus:outline-none">
        {children}
      </main>
      <Footer />
      <CompareTray />
    </>
  );
}
