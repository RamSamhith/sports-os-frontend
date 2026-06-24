'use client';

import { useEffect, useState } from 'react';
import { DataTable, type Column } from '@/components/admin/data-table';
import { StatusPill } from '@/components/admin/status-pill';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { EmptyState } from '@/components/feedback/empty-state';
import { getAdminCoaches } from '@/lib/api/admin';
import type { Coach } from '@/types/domain/coach';

type Row = Coach & { id: string };

const columns: Column<Row>[] = [
  { key: 'name', header: 'Name', cell: (r) => r.name },
  { key: 'sport', header: 'Sport', cell: (r) => r.sportsCoached?.[0] ?? '—' },
  { key: 'location', header: 'City', cell: (r) => r.location?.city ?? '—' },
  { key: 'verificationStatus', header: 'Status', cell: (r) => <StatusPill status={r.verificationStatus} /> },
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

export default function AdminCoachesPage() {
  const [coaches, setCoaches] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAdminCoaches().then((res) => {
      if (cancelled) return;
      if (res.ok) {
        setCoaches(res.data.items.map((c) => ({ ...c, id: c.id || (c as unknown as { _id: string })._id })));
        setError(null);
      } else {
        setError(res.error.message);
      }
      setLoading(false);
    }).catch(() => {
      if (!cancelled) {
        setError('Failed to load coaches');
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return <ErrorState description={error} onRetry={() => { setError(null); setLoading(true); getAdminCoaches().then((res) => { if (res.ok) setCoaches(res.data.items.map((c) => ({ ...c, id: c.id || (c as unknown as { _id: string })._id }))); else setError(res.error.message); setLoading(false); }).catch(() => { setError('Failed to load coaches'); setLoading(false); }); }} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Coaches</h1>
      {loading ? <TableSkeleton /> : (
        <DataTable
          rows={coaches}
          columns={columns}
          empty={<EmptyState title="No coaches found" description="No coaches have been registered yet." />}
        />
      )}
    </div>
  );
}
