'use client';

import * as React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { SportCard } from '@/components/sports/sport-card';
import { listSports } from '@/lib/api/sports';
import { Trophy, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Sport } from '@/types/domain/sport';

export function FeaturedSports() {
  const [sports, setSports] = React.useState<Sport[]>([]);
  const [loading, setLoading] = React.useState(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await listSports({ status: 'published', limit: 10 });
      if (cancelled) return;
      if (res.ok) setSports(res.data.items);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
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
