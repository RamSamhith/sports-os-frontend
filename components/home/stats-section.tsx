'use client';

import * as React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { getAcademies } from '@/lib/api/academies';
import { listSports } from '@/lib/api/sports';
import { StatsSkeleton } from '@/components/feedback/skeletons';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function formatCount(n: number) {
  return new Intl.NumberFormat('en-IN').format(n);
}

interface Stat {
  label: string;
  value: string;
  href: string;
}

export function StatsSection() {
  const [stats, setStats] = React.useState<Stat[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadStats = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [academiesRes, sportsRes] = await Promise.all([
        getAcademies({ pageSize: 200 }),
        listSports({ status: 'published', limit: 100 }),
      ]);

      const academyCount = academiesRes.ok ? academiesRes.data.pagination?.total ?? academiesRes.data.items.length : 0;
      const sportCount = sportsRes.ok ? sportsRes.data.pagination?.total ?? sportsRes.data.items.length : 0;

      const cities = new Set<string>();
      if (academiesRes.ok) {
        academiesRes.data.items.forEach((a) => cities.add(a.location.city));
      }

      setStats([
        { label: 'Academies', value: formatCount(academyCount), href: '/academies' },
        { label: 'Sports', value: formatCount(sportCount), href: '/sports' },
        { label: 'Cities', value: formatCount(cities.size), href: '/search' },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) {
    return (
      <Section spacing="sm">
        <Container size="lg">
          <StatsSkeleton />
        </Container>
      </Section>
    );
  }

  if (error) {
    return (
      <Section spacing="sm">
        <Container size="lg">
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
            <AlertTriangle className="h-10 w-10 text-destructive/40" />
            <div>
              <p className="text-foreground font-medium">Failed to load stats</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button size="sm" variant="outline" onClick={loadStats}>
              Try again
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="sm">
      <Container size="lg">
        <div className="grid grid-cols-3 gap-2 md:grid-cols-3">
          {stats.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="border-border/60 bg-card/40 hover:border-foreground/20 rounded-lg border px-3 py-3 text-center transition-colors md:px-4 md:py-4"
            >
              <div className="text-xl font-semibold tracking-tight md:text-2xl">{s.value}</div>
              <div className="text-muted-foreground mt-0.5 text-[10px] tracking-wide uppercase md:text-xs">{s.label}</div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
