import type { ReactNode } from 'react';
import { SkipLink } from '@/components/layout/skip-link';
import { AdminShell } from '@/components/admin/admin-shell';
import { ErrorBoundary } from '@/components/feedback/error-boundary';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <AdminShell>
        <ErrorBoundary label="Admin section">{children}</ErrorBoundary>
      </AdminShell>
    </>
  );
}
