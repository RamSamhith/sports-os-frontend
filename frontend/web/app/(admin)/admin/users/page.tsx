'use client';

import { useEffect, useState } from 'react';
import { DataTable, type Column } from '@/components/admin/data-table';
import { StatusPill } from '@/components/admin/status-pill';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { EmptyState } from '@/components/feedback/empty-state';
import { getUsers, type AdminUser } from '@/lib/api/admin';

const columns: Column<AdminUser>[] = [
  { key: 'name', header: 'Name', cell: (r) => r.name },
  { key: 'email', header: 'Email', cell: (r) => r.email },
  { key: 'role', header: 'Role', cell: (r) => <span className="capitalize">{r.role.replace('_', ' ')}</span> },
  { key: 'isVerified', header: 'Verified', cell: (r) => <StatusPill status={r.isVerified ? 'verified' : 'pending'} /> },
];

function TableSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getUsers().then((res) => {
      if (cancelled) return;
      if (res.ok) {
        setUsers(res.data.items);
        setError(null);
      } else {
        setError(res.error.message);
      }
      setLoading(false);
    }).catch(() => {
      if (!cancelled) {
        setError('Failed to load users');
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return <ErrorState description={error} onRetry={() => { setError(null); setLoading(true); getUsers().then((res) => { if (res.ok) setUsers(res.data.items); else setError(res.error.message); setLoading(false); }).catch(() => { setError('Failed to load users'); setLoading(false); }); }} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
      {loading ? <TableSkeleton /> : (
        <DataTable
          rows={users}
          columns={columns}
          empty={<EmptyState title="No users found" description="No users have registered yet." />}
        />
      )}
    </div>
  );
}
