'use client';

import * as React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { getAcademies } from '@/lib/api/academies';
import { listSports } from '@/lib/api/sports';
import { StatsSkeleton } from '@/components/feedback/skeletons';

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

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      const [academiesRes, sportsRes] = await Promise.all([
        getAcademies({ pageSize: 200 }),
        listSports({ status: 'published', limit: 100 }),
      ]);
      if (cancelled) return;

      const academyCount = academiesRes.ok ? academiesRes.data.pagination.total ?? academiesRes.data.items.length : 0;
      const sportCount = sportsRes.ok ? sportsRes.data.pagination.total ?? sportsRes.data.items.length : 0;

      const cities = new Set<string>();
      if (academiesRes.ok) {
        academiesRes.data.items.forEach((a) => cities.add(a.location.city));
      }

      setStats([
        { label: 'Academies', value: formatCount(academyCount), href: '/academies' },
        { label: 'Sports', value: formatCount(sportCount), href: '/sports' },
        { label: 'Cities', value: formatCount(cities.size), href: '/search' },
        { label: 'Coaches', value: formatCount(Math.floor(academyCount * 2.5)), href: '/academies' },
      ]);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <Section spacing="sm">
        <Container size="lg">
          <StatsSkeleton />
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="sm">
      <Container size="lg">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
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
