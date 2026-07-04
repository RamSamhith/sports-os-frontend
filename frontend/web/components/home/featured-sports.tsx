'use client';

import * as React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { SportCard } from '@/components/sports/sport-card';
import { useHomepageData } from '@/lib/hooks/use-homepage-data';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FeaturedSports() {
  const { sports: allSports, loading, error, refetch } = useHomepageData();
  const sports = React.useMemo(() => allSports.slice(0, 6), [allSports]);

  if (loading) {
    return (
      <Container size="lg">
        <div className="mb-4">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Popular Sports</h2>
          <p className="text-muted-foreground text-xs">Sports, difficulty levels, and pathways.</p>
        </div>
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg">
        <div className="mb-4">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Popular Sports</h2>
          <p className="text-muted-foreground text-xs">Sports, difficulty levels, and pathways.</p>
        </div>
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive/40" />
          <div>
            <p className="text-foreground font-medium">Failed to load sports</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button size="sm" variant="outline" onClick={refetch}>
            Try again
          </Button>
        </div>
      </Container>
    );
  }

  if (sports.length === 0) return null;

  return (
    <Container size="lg">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Popular Sports</h2>
          <p className="text-muted-foreground text-xs">Sports, difficulty levels, and pathways.</p>
        </div>
        <Link href="/sports" className="text-muted-foreground hover:text-foreground text-xs min-h-[44px] flex items-center shrink-0">
          View all &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sports.map((s) => (
          <SportCard key={s.id} sport={s} />
        ))}
      </div>
    </Container>
  );
}
