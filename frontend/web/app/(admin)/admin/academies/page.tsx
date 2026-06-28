'use client';

import { useEffect, useState } from 'react';
import { DataTable, type Column } from '@/components/admin/data-table';
import { StatusPill } from '@/components/admin/status-pill';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { EmptyState } from '@/components/feedback/empty-state';
import { getAdminAcademies } from '@/lib/api/admin';
import type { Academy } from '@/types/domain/academy';

type Row = Academy & { id: string };

const columns: Column<Row>[] = [
  { key: 'name', header: 'Name', cell: (r) => r.name },
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

export default function AdminAcademiesPage() {
  const [academies, setAcademies] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAdminAcademies().then((res) => {
      if (cancelled) return;
      if (res.ok) {
        setAcademies(res.data.items.map((a) => ({ ...a, id: a.id || (a as unknown as { _id: string })._id })));
        setError(null);
      } else {
        setError(res.error.message);
      }
      setLoading(false);
    }).catch(() => {
      if (!cancelled) {
        setError('Failed to load academies');
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return <ErrorState description={error} onRetry={() => { setError(null); setLoading(true); getAdminAcademies().then((res) => { if (res.ok) setAcademies(res.data.items.map((a) => ({ ...a, id: a.id || (a as unknown as { _id: string })._id }))); else setError(res.error.message); setLoading(false); }).catch(() => { setError('Failed to load academies'); setLoading(false); }); }} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Academies</h1>
      {loading ? <TableSkeleton /> : (
        <DataTable
          rows={academies}
          columns={columns}
          empty={<EmptyState title="No academies found" description="No academies have been registered yet." />}
        />
      )}
    </div>
  );
}
