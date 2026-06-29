'use client';

import * as React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { SportCard } from '@/components/sports/sport-card';
import { useHomepageData } from '@/lib/hooks/use-homepage-data';
import { Trophy, ChevronLeft, ChevronRight, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Sport } from '@/types/domain/sport';

export function FeaturedSports() {
  const { sports: allSports, loading, error } = useHomepageData();
  const sports = React.useMemo(() => allSports.slice(0, 10), [allSports]);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const loadSports = React.useCallback(async () => {
    window.location.reload();
  }, []);

  const checkScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 280;
    el.scrollBy({ left: direction === 'left' ? -cardWidth : cardWidth, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Section spacing="sm">
        <Container size="lg">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Popular sports</h2>
              <p className="text-muted-foreground text-xs">Explore sports, benefits, and pathways.</p>
            </div>
          </div>
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </Container>
      </Section>
    );
  }

  if (error) {
    return (
      <Section spacing="sm">
        <Container size="lg">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Popular sports</h2>
              <p className="text-muted-foreground text-xs">Explore sports, benefits, and pathways.</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
            <AlertTriangle className="h-10 w-10 text-destructive/40" />
            <div>
              <p className="text-foreground font-medium">Failed to load sports</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button size="sm" variant="outline" onClick={loadSports}>
              Try again
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  if (sports.length === 0) return null;

  return (
    <Section spacing="sm">
      <Container size="lg">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Popular sports</h2>
            <p className="text-muted-foreground text-xs">Explore sports, benefits, and pathways.</p>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/sports" className="text-muted-foreground hover:text-foreground mr-2 text-xs min-h-[44px] flex items-center">
              View all →
            </Link>
            <Button
              variant="outline"
              size="icon-touch"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-touch"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-none"
          style={{ scrollSnapType: 'x mandatory' }}
          role="region"
          aria-label="Popular sports"
        >
          {sports.map((s) => (
            <div key={s.id} className="w-[260px] shrink-0" style={{ scrollSnapAlign: 'start' }}>
              <SportCard sport={s} />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
