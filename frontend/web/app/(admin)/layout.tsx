import type { ReactNode } from 'react';
import { SkipLink } from '@/components/layout/skip-link';
import { AdminShell } from '@/components/admin/admin-shell';
import { AdminGuard } from '@/components/auth/admin-guard';
import { ErrorBoundary } from '@/components/feedback/error-boundary';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <SkipLink />
      <AdminShell>
        <ErrorBoundary label="Admin section">{children}</ErrorBoundary>
      </AdminShell>
    </AdminGuard>
  );
}
