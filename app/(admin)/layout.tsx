import type { ReactNode } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { ErrorBoundary } from '@/components/feedback/error-boundary';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminShell>
      <ErrorBoundary label="Admin section">{children}</ErrorBoundary>
    </AdminShell>
  );
}
