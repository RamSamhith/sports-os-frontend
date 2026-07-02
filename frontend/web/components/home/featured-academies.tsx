'use client';

import * as React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { useHomepageData } from '@/lib/hooks/use-homepage-data';
import { useOnboarding } from '@/lib/hooks/use-onboarding';
import { School, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { AcademyCardSkeleton } from '@/components/feedback/skeletons';
import { AcademyCardPlaceholder } from '@/components/academies/academy-card-placeholder';
import { Button } from '@/components/ui/button';

export function FeaturedAcademies() {
  const { academies: allAcademies, loading, error, refetch } = useHomepageData();
  const { completed: onboarded } = useOnboarding();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const academies = React.useMemo(
    () => [...allAcademies].sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0)).slice(0, 8),
    [allAcademies]
  );

  const title = onboarded ? 'Recommended For You' : 'Top Rated Academies';
  const subtitle = onboarded
    ? 'Personalised picks based on your interests.'
    : 'Top-rated, verified academies across India.';

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
    const cardWidth = 320;
    el.scrollBy({ left: direction === 'left' ? -cardWidth : cardWidth, behavior: 'smooth' });
  };

  return (
    <Section spacing="md">
      <Container size="lg">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h2>
            <p className="text-muted-foreground text-xs">{subtitle}</p>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/academies" className="text-muted-foreground hover:text-foreground mr-2 text-xs min-h-[44px] flex items-center">
              View all &rarr;
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
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-[300px] shrink-0">
                <AcademyCardSkeleton />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
            <AlertTriangle className="h-10 w-10 text-destructive/40" />
            <div>
              <p className="text-foreground font-medium">Failed to load academies</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button size="sm" variant="outline" onClick={refetch}>
              Try again
            </Button>
          </div>
        ) : academies.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
            <School className="h-10 w-10 opacity-40" />
            <div>
              <p className="text-foreground font-medium">No academies yet</p>
              <p className="text-sm">Check back soon for verified academies in your area.</p>
            </div>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-none"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {academies.map((academy, i) => (
              <div key={academy.id} className="w-[300px] shrink-0" style={{ scrollSnapAlign: 'start' }}>
                <AcademyCardPlaceholder academy={academy} priority={i === 0} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
