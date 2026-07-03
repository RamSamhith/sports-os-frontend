'use client';

import * as React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { useHomepageData } from '@/lib/hooks/use-homepage-data';
import { MapPin, ChevronRight, AlertTriangle, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function cityToSlug(name: string) {
  return encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'));
}

export default function CitiesPage() {
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
        topSports: Array.from(data.sports).slice(0, 3),
      }))
      .sort((a, b) => b.academyCount - a.academyCount);
  }, [academies]);

  if (loading) {
    return (
      <Section spacing="sm">
        <Container>
          <div className="mb-3 h-4 w-48 animate-pulse rounded bg-muted" />
          <div className="mb-2 h-8 w-72 animate-pulse rounded bg-muted" />
          <div className="mb-6 h-4 w-96 animate-pulse rounded bg-muted" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border-border/60 bg-card/50 h-28 animate-pulse rounded-xl border" />
            ))}
          </div>
        </Container>
      </Section>
    );
  }

  if (error) {
    return (
      <Section spacing="sm">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Cities' },
            ]}
            className="mb-3"
          />
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
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

  return (
    <Section spacing="sm">
      <Container>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Cities' },
          ]}
          className="mb-3"
        />

        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Explore by City
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {allCities.length} {allCities.length === 1 ? 'city' : 'cities'} with sports academies across India
          </p>
        </div>

        {allCities.length === 0 ? (
          <div className="border-border/60 bg-card/40 flex flex-col items-center gap-4 rounded-xl border border-dashed py-16 text-center">
            <div className="bg-muted/50 grid h-16 w-16 place-items-center rounded-full">
              <Building2 className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <div className="max-w-sm">
              <p className="text-foreground text-lg font-semibold">No cities yet</p>
              <p className="text-muted-foreground mt-1 text-sm">
                We&apos;re adding academies every day. Check back soon!
              </p>
            </div>
            <Button asChild>
              <Link href="/academies">Browse all academies</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {allCities.map((city) => (
              <Link
                key={city.name}
                href={`/cities/${city.slug}`}
                className="group border-border/60 bg-card/40 hover:border-primary/40 hover:bg-primary/5 flex flex-col justify-between rounded-xl border p-4 transition-all"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                    <h2 className="text-sm font-semibold">{city.name}</h2>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {city.academyCount} academ{city.academyCount === 1 ? 'y' : 'ies'}
                  </p>
                  {city.topSports.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {city.topSports.map((sport) => (
                        <span
                          key={sport}
                          className="bg-muted/60 text-muted-foreground rounded px-1.5 py-0.5 text-[10px] capitalize"
                        >
                          {sport.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-muted-foreground mt-3 flex items-center gap-1 text-[10px] group-hover:text-primary transition-colors">
                  <span>Explore</span>
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
