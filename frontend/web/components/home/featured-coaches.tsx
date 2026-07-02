'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CoachImage } from '@/components/ui/coach-image';
import { VerifiedBadge } from '@/components/trust/verified-badge';
import { getCoaches } from '@/lib/api/coaches';
import { ease, duration } from '@/components/motion/constants';
import { Star, MapPin, Users } from 'lucide-react';
import type { Coach } from '@/types/domain/coach';

export function FeaturedCoaches() {
  const [coaches, setCoaches] = React.useState<Coach[]>([]);
  const [loading, setLoading] = React.useState(true);
  const reduced = useReducedMotion();

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

  if (loading) {
    return (
      <Section spacing="md">
        <Container size="lg">
          <div className="mb-4">
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Featured Coaches</h2>
            <p className="text-muted-foreground text-xs">Top-rated, verified coaches ready to train you.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl border bg-card">
                <div className="aspect-[16/9] animate-pulse bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-full animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    );
  }

  if (coaches.length === 0) return null;

  return (
    <Section spacing="md">
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coaches.map((coach) => (
            <motion.div
              key={coach.id}
              whileHover={reduced ? undefined : { y: -4, scale: 1.008 }}
              whileTap={reduced ? undefined : { scale: 0.995 }}
              transition={{ duration: duration.fast, ease: ease.athletic }}
              className="w-full"
            >
              <Card className="group overflow-hidden border-border/40 hover:border-foreground/20 hover:shadow-xl transition-all duration-300">
                <Link
                  href={`/coaches/${coach.slug}`}
                  className="bg-muted/40 relative block aspect-[16/9] w-full overflow-hidden focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  aria-label={coach.name}
                >
                  <CoachImage
                    avatar={coach.avatar}
                    sportsCoached={coach.sportsCoached}
                    name={coach.name}
                    alt={coach.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <VerifiedBadge status={coach.verificationStatus} />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-base font-bold text-white drop-shadow-sm line-clamp-1">{coach.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-1 text-white/90">
                        <Star aria-hidden className="h-3.5 w-3.5 fill-amber-400 text-amber-400 drop-shadow-sm" />
                        <span className="text-sm font-semibold">{(coach.rating?.average ?? 0).toFixed(1)}</span>
                      </div>
                      <span className="flex items-center gap-1 text-white/70 text-xs">
                        <MapPin aria-hidden className="h-3 w-3" />
                        {coach.location?.city ?? 'Unknown'}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="flex flex-col gap-3 p-4">
                  <div className="flex flex-wrap gap-1">
                    {(coach.sportsCoached ?? []).slice(0, 2).map((s) => (
                      <Badge key={s} variant="secondary" className="capitalize text-xs">
                        {s.replace(/-/g, ' ')}
                      </Badge>
                    ))}
                    {(coach.specialization ?? []).slice(0, 1).map((sp) => (
                      <Badge key={sp} variant="outline" className="text-xs">
                        {sp}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-foreground">{(coach.rating?.average ?? 0).toFixed(1)}</span>
                    <span>({coach.rating?.count ?? 0})</span>
                    <span className="mx-1">&middot;</span>
                    <Users className="h-3 w-3" />
                    <span>{coach.experienceYears}+ yrs</span>
                  </div>

                  <Button size="lg" className="w-full h-11" asChild>
                    <Link href={`/coaches/${coach.slug}`}>View Profile</Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
