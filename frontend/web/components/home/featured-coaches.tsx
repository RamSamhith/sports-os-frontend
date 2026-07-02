'use client';

import * as React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Star, ChevronRight, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { VerifiedBadge } from '@/components/trust/verified-badge';
import { getCoaches } from '@/lib/api/coaches';
import type { Coach } from '@/types/domain/coach';

export function FeaturedCoaches() {
  const [coaches, setCoaches] = React.useState<Coach[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await getCoaches({ pageSize: 6 });
        if (!cancelled && res.ok) {
          const sorted = (res.data.items ?? [])
            .sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0))
            .slice(0, 6);
          setCoaches(sorted);
        }
      } catch {
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading || coaches.length === 0) return null;

  return (
    <Section spacing="sm">
      <Container size="lg">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Featured Coaches</h2>
            <p className="text-muted-foreground text-xs">Top-rated, verified coaches ready to train you.</p>
          </div>
          <Link href="/coaches" className="text-muted-foreground hover:text-foreground mr-2 text-xs min-h-[44px] flex items-center">
            View all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {coaches.map((coach) => (
            <Link
              key={coach.id}
              href={`/coaches/${coach.slug}`}
              className="group border-border/60 bg-card/40 hover:border-foreground/20 rounded-xl border p-3 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="bg-muted relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                  {coach.avatar ? (
                    <ImageWithFallback
                      src={coach.avatar}
                      alt={coach.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="bg-primary/15 text-foreground/80 grid h-full w-full place-items-center text-sm font-semibold uppercase">
                      {coach.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-semibold line-clamp-1 group-hover:underline">{coach.name}</h3>
                    <VerifiedBadge status={coach.verificationStatus} />
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {(coach.rating?.average ?? 0).toFixed(1)}
                    </span>
                    <span>{coach.experienceYears}+ yrs</span>
                    <span className="flex items-center gap-0.5">
                      <MapPin className="h-3 w-3" />
                      {coach.location.city}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(coach.sportsCoached ?? []).slice(0, 2).map((s) => (
                      <Badge key={s} variant="secondary" className="text-[10px] px-1 py-0 capitalize">
                        {s.replace(/-/g, ' ')}
                      </Badge>
                    ))}
                    {(coach.specialization ?? []).slice(0, 1).map((sp) => (
                      <Badge key={sp} variant="outline" className="text-[10px] px-1 py-0">
                        {sp}
                      </Badge>
                    ))}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground mt-1" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
