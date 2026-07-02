'use client';

import * as React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { useHomepageData } from '@/lib/hooks/use-homepage-data';
import { StatsSkeleton } from '@/components/feedback/skeletons';
import { AlertTriangle } from 'lucide-react';

function formatCount(n: number) {
  if (n >= 1000) {
    const rounded = Math.floor(n / 100) * 100;
    return `${new Intl.NumberFormat('en-IN').format(rounded)}+`;
  }
  return new Intl.NumberFormat('en-IN').format(n);
}

interface Stat {
  label: string;
  value: string;
  href: string;
}

export function StatsSection() {
  const { academies, sports, academiesTotal, sportsTotal, loading, error } = useHomepageData();

  const stats = React.useMemo<Stat[]>(() => {
    if (loading || error) return [];
    const cities = new Set(academies.map(a => a.location.city));
    return [
      { label: 'Academies', value: formatCount(academiesTotal || academies.length), href: '/academies' },
      { label: 'Sports', value: formatCount(sportsTotal || sports.length), href: '/sports' },
      { label: 'Cities', value: formatCount(cities.size), href: '/search' },
    ];
  }, [academies, sports, academiesTotal, sportsTotal, loading, error]);

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
