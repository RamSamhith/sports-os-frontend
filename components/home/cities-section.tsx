'use client';

import * as React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { useHomepageData } from '@/lib/hooks/use-homepage-data';
import { MapPin, ChevronRight, ChevronLeft, AlertTriangle, Search } from 'lucide-react';
import { CityCarouselSkeleton } from '@/components/feedback/skeletons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Academy } from '@/types/domain/academy';

interface CityData {
  name: string;
  slug: string;
  academyCount: number;
  topSports: string[];
  rating: number;
}

function cityToSlug(name: string) {
  return encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'));
}

export function CitiesSection() {
  const { academies, academiesTotal, loading, error, refetch } = useHomepageData();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [showAll, setShowAll] = React.useState(false);

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

  const allCities = React.useMemo(() => {
    if (academies.length === 0) return [];

    const cityMap = new Map<string, { sports: Set<string>; totalRating: number; count: number }>();

    academies.forEach((academy) => {
      const city = academy.location?.city;
      if (!city) return;
      const existing = cityMap.get(city) ?? { sports: new Set(), totalRating: 0, count: 0 };
      (academy.sportsOffered ?? []).forEach((s) => existing.sports.add(s));
      existing.totalRating += typeof academy.rating === 'number' ? academy.rating : (academy.rating?.average ?? 0);
      existing.count += 1;
      cityMap.set(city, existing);
    });

    return Array.from(cityMap.entries())
      .map(([name, data]) => ({
        name,
        slug: cityToSlug(name),
        academyCount: data.count,
        topSports: Array.from(data.sports).slice(0, 2),
        rating: data.count > 0 ? data.totalRating / data.count : 0,
      }))
      .sort((a, b) => b.academyCount - a.academyCount);
  }, [academies]);

  const filteredCities = React.useMemo(() => {
    if (!search.trim()) return allCities;
    const q = search.toLowerCase();
    return allCities.filter((c) => c.name.toLowerCase().includes(q));
  }, [allCities, search]);

  const displayCities = showAll ? filteredCities : filteredCities.slice(0, 10);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Section spacing="sm">
        <Container size="lg">
          <CityCarouselSkeleton />
        </Container>
      </Section>
    );
  }

  if (error) {
    return (
      <Section spacing="sm">
        <Container size="lg">
          <div className="mb-4">
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Explore by city</h2>
            <p className="text-muted-foreground text-xs">Find academies in your city.</p>
          </div>
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
            <AlertTriangle className="h-10 w-10 text-destructive/40" />
            <div>
              <p className="text-foreground font-medium">Failed to load cities</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button size="sm" variant="outline" onClick={refetch}>
              Try again
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  if (allCities.length === 0) return null;

  return (
    <Section spacing="sm">
      <Container size="lg">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Explore by city</h2>
            <p className="text-muted-foreground text-xs">
              {allCities.length} cities with {academiesTotal || academies.length} academies
            </p>
          </div>
          <div className="flex items-center gap-1">
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

        {/* Search */}
        {allCities.length > 10 && (
          <div className="relative mb-3">
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowAll(true); }}
              placeholder="Search cities..."
              className="pl-9 h-9"
            />
          </div>
        )}

        {/* Carousel view (default) */}
        {!showAll && (
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto pb-2 scrollbar-none"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {displayCities.map((city) => (
              <Link
                key={city.name}
                href={`/cities/${city.slug}`}
                className="group border-border/60 bg-card/40 hover:border-foreground/20 w-[180px] shrink-0 rounded-xl border p-3 transition-colors"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="flex items-center gap-1.5">
                  <MapPin className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                  <h3 className="text-sm font-semibold">{city.name}</h3>
                </div>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {city.academyCount} academies
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {city.topSports.map((sport) => (
                    <span
                      key={sport}
                      className="bg-muted/60 text-muted-foreground rounded px-1.5 py-0.5 text-[10px] capitalize"
                    >
                      {sport.replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
                <div className="text-muted-foreground mt-1.5 flex items-center gap-1 text-[10px]">
                  <span>{city.rating.toFixed(1)} ★</span>
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Grid view (when searching or showing all) */}
        {showAll && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {displayCities.map((city) => (
              <Link
                key={city.name}
                href={`/cities/${city.slug}`}
                className="group border-border/60 bg-card/40 hover:border-foreground/20 rounded-lg border p-2.5 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <MapPin className="text-muted-foreground h-3 w-3 shrink-0" />
                  <h3 className="text-sm font-medium">{city.name}</h3>
                </div>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  {city.academyCount} academies
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* Toggle + link */}
        <div className="mt-3 flex items-center justify-between">
          {allCities.length > 10 && !showAll && (
            <Button variant="ghost" size="sm" onClick={() => setShowAll(true)}>
              View all {allCities.length} cities
            </Button>
          )}
          {showAll && (
            <Button variant="ghost" size="sm" onClick={() => { setShowAll(false); setSearch(''); }}>
              Show less
            </Button>
          )}
        </div>
      </Container>
    </Section>
  );
}
