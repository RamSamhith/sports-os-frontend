'use client';

import { useEffect, useState } from 'react';
import { DataTable, type Column } from '@/components/admin/data-table';
import { StatusPill } from '@/components/admin/status-pill';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { EmptyState } from '@/components/feedback/empty-state';
import { listSports } from '@/lib/api/sports';
import type { Sport } from '@/types/domain/sport';

type Row = Sport & { id: string };

const columns: Column<Row>[] = [
  { key: 'name', header: 'Name', cell: (r) => r.name },
  { key: 'slug', header: 'Slug', cell: (r) => <span className="text-muted-foreground font-mono text-xs">{r.slug}</span> },
  { key: 'category', header: 'Category', cell: (r) => r.category },
  { key: 'status', header: 'Status', cell: (r) => <StatusPill status={r.status} /> },
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

export default function AdminSportsPage() {
  const [sports, setSports] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSports = () => {
    setLoading(true);
    setError(null);
    listSports({ limit: 100 }).then((res) => {
      if (res.ok) {
        setSports(res.data.items.map((s) => ({ ...s, id: s.id || (s as unknown as { _id: string })._id })));
        setError(null);
      } else {
        setError(res.error.message);
      }
      setLoading(false);
    }).catch(() => {
      setError('Failed to load sports');
      setLoading(false);
    });
  };

  useEffect(() => {
    let cancelled = false;
    fetchSports();
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return <ErrorState description={error} onRetry={fetchSports} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Sports</h1>
      {loading ? <TableSkeleton /> : (
        <DataTable
          rows={sports}
          columns={columns}
          empty={<EmptyState title="No sports found" description="No sports have been added yet." />}
        />
      )}
    </div>
  );
}
