'use client';

import { useEffect, useState } from 'react';
import { DataTable, type Column } from '@/components/admin/data-table';
import { StatusPill } from '@/components/admin/status-pill';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { EmptyState } from '@/components/feedback/empty-state';
import { getAdminEnquiries, type AdminEnquiry } from '@/lib/api/admin';

type Row = AdminEnquiry & { id: string };

const columns: Column<Row>[] = [
  { key: 'parent', header: 'Parent', cell: (r) => r.parentInfo?.name ?? '—' },
  { key: 'target', header: 'Target', cell: (r) => r.targetType },
  { key: 'sport', header: 'Sport', cell: (r) => r.sportInterest },
  { key: 'status', header: 'Status', cell: (r) => <StatusPill status={r.status as 'new' | 'contacted' | 'qualified'} /> },
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

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAdminEnquiries().then((res) => {
      if (cancelled) return;
      if (res.ok) {
        setEnquiries(res.data.map((e) => ({ ...e, id: e.id || (e as unknown as { _id: string })._id })));
        setError(null);
      } else {
        setError(res.error.message);
      }
      setLoading(false);
    }).catch(() => {
      if (!cancelled) {
        setError('Failed to load enquiries');
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return <ErrorState description={error} onRetry={() => { setError(null); setLoading(true); getAdminEnquiries().then((res) => { if (res.ok) setEnquiries(res.data.map((e) => ({ ...e, id: e.id || (e as unknown as { _id: string })._id }))); else setError(res.error.message); setLoading(false); }).catch(() => { setError('Failed to load enquiries'); setLoading(false); }); }} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Enquiries</h1>
      {loading ? <TableSkeleton /> : (
        <DataTable
          rows={enquiries}
          columns={columns}
          empty={<EmptyState title="No enquiries found" description="No enquiries have been submitted yet." />}
        />
      )}
    </div>
  );
}
