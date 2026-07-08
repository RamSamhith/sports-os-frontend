'use client';

import * as React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { useHomepageData } from '@/lib/hooks/use-homepage-data';
import { MapPin, ChevronRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function cityToSlug(name: string) {
  return encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'));
}

export function CitiesSection() {
  const { academies, loading, error, refetch } = useHomepageData();

  const allCities = React.useMemo(() => {
    if (academies.length === 0) return [];

    const cityMap = new Map<string, { sports: Set<string>; count: number }>();

    academies.forEach((academy) => {
      const city = academy.location?.city;
      if (!city) return;
      const existing = cityMap.get(city) ?? { sports: new Set(), count: 0 };
      (academy.sportsOffered ?? []).forEach((s) => existing.sports.add(s));
      existing.count += 1;
      cityMap.set(city, existing);
    });

    return Array.from(cityMap.entries())
      .map(([name, data]) => ({
        name,
        slug: cityToSlug(name),
        academyCount: data.count,
        topSports: Array.from(data.sports).slice(0, 2),
      }))
      .sort((a, b) => b.academyCount - a.academyCount);
  }, [academies]);

  const displayCities = allCities.slice(0, 8);

  if (loading) {
    return (
      <Container size="lg">
        <div className="mb-4">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Explore by City</h2>
          <p className="text-muted-foreground text-sm">Find academies in your city.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border-border/60 bg-card/50 h-24 animate-pulse rounded-xl border" />
          ))}
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg">
        <div className="mb-4">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Explore by City</h2>
          <p className="text-muted-foreground text-sm">Find academies in your city.</p>
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
    );
  }

  if (allCities.length === 0) return null;

  return (
    <Container size="lg">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Explore by City</h2>
          <p className="text-muted-foreground text-sm">
            {allCities.length} cities with academies across India
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {displayCities.map((city) => (
          <Link
            key={city.name}
            href={`/cities/${city.slug}`}
            className="group border-border/40 bg-card/40 hover:border-foreground/20 hover:bg-primary/5 flex flex-col justify-between rounded-xl border p-4 transition-all duration-300 hover:shadow-lg"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <MapPin className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                <h3 className="text-sm font-semibold">{city.name}</h3>
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                {city.academyCount} academ{city.academyCount === 1 ? 'y' : 'ies'}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {city.topSports.map((sport) => (
                  <span
                    key={sport}
                    className="bg-muted/60 text-muted-foreground rounded px-1.5 py-0.5 text-xs capitalize"
                  >
                    {sport.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-muted-foreground mt-3 flex items-center gap-1 text-xs group-hover:text-primary transition-colors">
              <span>Explore</span>
              <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>

      {allCities.length > 8 && (
        <div className="mt-4 text-center">
          <Link href="/cities" className="text-muted-foreground hover:text-foreground text-sm">
            +{allCities.length - 8} more cities &rarr;
          </Link>
        </div>
      )}
    </Container>
  );
}
