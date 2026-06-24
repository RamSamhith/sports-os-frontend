'use client';

import * as React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { CoachCardPlaceholder } from '@/components/coaches/coach-card-placeholder';
import { getCoaches } from '@/lib/api/coaches';
import { Users } from 'lucide-react';
import { CoachCardSkeleton } from '@/components/feedback/skeletons';
import type { Coach } from '@/types/domain/coach';

export function FeaturedCoaches() {
  const [coaches, setCoaches] = React.useState<Coach[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await getCoaches({ pageSize: 100 });
        if (cancelled) return;
        if (res.ok) {
          setCoaches(res.data.items);
        }
      } catch {
        // network error — leave coaches empty
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const featured = [...coaches]
    .sort((a, b) => b.rating.average - a.rating.average)
    .slice(0, 3);

  return (
    <Section>
      <Container size="lg">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Featured coaches</h2>
            <p className="text-muted-foreground text-sm">Top-rated, verified coaches.</p>
          </div>
          <Link href="/coaches" className="text-muted-foreground hover:text-foreground text-sm min-h-[44px] flex items-center">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CoachCardSkeleton key={i} />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
            <Users className="h-10 w-10 opacity-40" />
            <div>
              <p className="text-foreground font-medium">No coaches yet</p>
              <p className="text-sm">Check back soon for verified coaches in your area.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((coach) => (
              <CoachCardPlaceholder key={coach.id} coach={coach} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
