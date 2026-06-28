'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { getDashboardStats, type DashboardStats } from '@/lib/api/admin';

const kpis = [
  { key: 'totalUsers' as const, label: 'Total users' },
  { key: 'totalEnquiries' as const, label: 'Enquiry volume' },
  { key: 'totalAcademies' as const, label: 'Verified academies' },
  { key: 'pendingVerifications' as const, label: 'Pending verifications' },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getDashboardStats().then((res) => {
      if (cancelled) return;
      if (res.ok) {
        setStats(res.data);
        setError(null);
      } else {
        setError(res.error.message);
      }
      setLoading(false);
    }).catch(() => {
      if (!cancelled) {
        setError('Failed to load dashboard stats');
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return <ErrorState description={error} onRetry={() => { setError(null); setLoading(true); getDashboardStats().then((res) => { if (res.ok) setStats(res.data); else setError(res.error.message); setLoading(false); }).catch(() => { setError('Failed to load dashboard stats'); setLoading(false); }); }} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.key}>
          <CardHeader className="pb-2">
            <CardDescription>{kpi.label}</CardDescription>
            <CardTitle className="text-2xl">
              {loading ? <Skeleton className="h-7 w-16" /> : stats?.[kpi.key] ?? '—'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-xs">All time</CardContent>
        </Card>
      ))}
    </div>
  );
}
