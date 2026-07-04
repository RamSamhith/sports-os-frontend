'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Button } from '@/components/ui/button';
import { AcademyCardPlaceholder } from '@/components/academies/academy-card-placeholder';
import { LocationMap } from '@/components/academy/location-map';
import { getAcademies } from '@/lib/api/academies';
import { MapPin, Trophy, ArrowLeft, Filter, Navigation } from 'lucide-react';
import type { Academy } from '@/types/domain/academy';

const nearbyCities: Record<string, string[]> = {
  'bengaluru': ['mumbai', 'chennai', 'hyderabad', 'pune'],
  'mumbai': ['pune', 'thane', 'navi-mumbai', 'bengaluru'],
  'chennai': ['bengaluru', 'hyderabad', 'coimbatore', 'madurai'],
  'hyderabad': ['bengaluru', 'chennai', 'vijayawada', 'warangal'],
  'delhi': ['noida', 'gurgaon', 'faridabad', 'ghaziabad'],
  'pune': ['mumbai', 'nashik', 'bengaluru', 'aurangabad'],
  'kolkata': ['howrah', 'durgapur', 'siliguri', 'bhubaneswar'],
  'ahmedabad': ['rajkot', 'surat', 'vadodara', 'jaipur'],
};

export default function CityPage() {
  const params = useParams<{ city: string }>();
  const citySlug = params.city;
  const cityName = decodeURIComponent(citySlug).replace(/-/g, ' ');

  const [academies, setAcademies] = React.useState<Academy[]>([]);
  const [allAcademies, setAllAcademies] = React.useState<Academy[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState<'top-rated' | 'most-reviewed' | 'name'>('top-rated');

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const academiesRes = await getAcademies({ pageSize: 200 });
        if (cancelled) return;

        if (academiesRes.ok) {
          const items = academiesRes.data.items;
          setAllAcademies(items);
          const normalizedCity = cityName.toLowerCase().trim();
          const cityAcademies = items.filter((a) => {
            const academyCity = (a.location?.city ?? '').toLowerCase().trim();
            const academyCitySlug = a.location?.city
              ? a.location.city.toLowerCase().replace(/\s+/g, '-')
              : '';
            return academyCity === normalizedCity || academyCitySlug === normalizedCity;
          });
          setAcademies(cityAcademies);
        } else {
          setError('Failed to load academies. Please try again.');
        }
      } catch {
        setError('Network error. Please check your connection and try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [cityName]);

  const sortedAcademies = React.useMemo(() => {
    const sorted = [...academies];
    switch (sortBy) {
      case 'top-rated':
        return sorted.sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0));
      case 'most-reviewed':
        return sorted.sort((a, b) => (typeof b.rating === 'number' ? 0 : (b.rating?.count ?? 0)) - (typeof a.rating === 'number' ? 0 : (a.rating?.count ?? 0)));
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  }, [academies, sortBy]);

  const topSports = React.useMemo(() => {
    const sportMap = new Map<string, number>();
    academies.forEach((a) => {
      (a.sportsOffered ?? []).forEach((s) => {
        sportMap.set(s, (sportMap.get(s) ?? 0) + 1);
      });
    });
    return Array.from(sportMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [academies]);

  const nearby = React.useMemo(() => {
    const slug = cityName.toLowerCase().replace(/\s+/g, '-');
    const nearbySlugs = nearbyCities[slug] ?? [];
    const nearbyData = allAcademies
      .filter((a) => nearbySlugs.includes((a.location?.city ?? '').toLowerCase().replace(/\s+/g, '-')))
      .reduce((map, a) => {
        const cityName = a.location?.city ?? '';
        if (!map.has(cityName)) map.set(cityName, { name: cityName, count: 0 });
        map.get(cityName)!.count++;
        return map;
      }, new Map<string, { name: string; count: number }>());
    return Array.from(nearbyData.values()).slice(0, 4);
  }, [cityName, allAcademies]);

  const avgLat = academies.length > 0 ? academies.reduce((s, a) => s + (a.location.lat || 0), 0) / academies.length : 28.6139;
  const avgLng = academies.length > 0 ? academies.reduce((s, a) => s + (a.location.lng || 0), 0) / academies.length : 77.2090;

  if (loading) {
    return (
      <Section>
        <Container>
          <div className="mb-3 h-4 w-48 animate-pulse rounded bg-muted" />
          <div className="mb-6 h-8 w-72 animate-pulse rounded bg-muted" />
          <div className="mb-6 flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-24 animate-pulse rounded-full bg-muted" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-card">
                <div className="aspect-[16/9] animate-pulse bg-muted rounded-t-xl" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-full animate-pulse rounded bg-muted" />
                  <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    );
  }

  if (error) {
    return (
      <Section>
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: cityName },
            ]}
            className="mb-3"
          />
          <Button asChild variant="ghost" className="mb-3 -ml-2 min-h-[44px]">
            <Link href="/"><ArrowLeft className="h-4 w-4 mr-1" /> Back to home</Link>
          </Button>
          <div className="border-border/60 bg-card/40 flex flex-col items-center gap-4 rounded-xl border border-dashed py-16 text-center">
            <div className="bg-destructive/10 grid h-16 w-16 place-items-center rounded-full">
              <MapPin className="h-8 w-8 text-destructive/60" />
            </div>
            <div className="max-w-sm">
              <p className="text-foreground text-lg font-semibold">Something went wrong</p>
              <p className="text-muted-foreground mt-1 text-sm">{error}</p>
            </div>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
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
            { label: cityName },
          ]}
          className="mb-3"
        />

        <Button asChild variant="ghost" className="mb-3 -ml-2 min-h-[44px]">
          <Link href="/"><ArrowLeft className="h-4 w-4 mr-1" /> Back to home</Link>
        </Button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Sports Academies in {cityName}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {academies.length} academies · {topSports.length} sports
          </p>
        </div>

        {/* Top Sports */}
        {topSports.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
              Popular sports in {cityName}
            </h2>
            <div className="flex flex-wrap gap-2">
              {topSports.map(([sport, count]) => (
                <Link
                  key={sport}
                  href={`/search?q=${encodeURIComponent(sport)}`}
                  className="border-border/60 bg-card/40 hover:border-foreground/20 inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm transition-colors"
                >
                  <Trophy className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="capitalize">{sport.replace(/-/g, ' ')}</span>
                  <span className="text-muted-foreground text-xs">({count})</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Map */}
        {academies.length > 0 && (
          <div className="mb-6">
            <LocationMap
              lat={avgLat}
              lng={avgLng}
              label={`Academies in ${cityName}`}
              className="h-[200px] sm:h-[250px] md:h-[300px]"
            />
          </div>
        )}

        {/* Sort & Filter */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold">
            {sortedAcademies.length} {sortedAcademies.length === 1 ? 'academy' : 'academies'}
          </h2>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="border-border/60 bg-card/40 min-h-[44px] rounded-md border px-3 py-2.5 text-xs"
            >
              <option value="top-rated">Top Rated</option>
              <option value="most-reviewed">Most Reviewed</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Academies Grid */}
        {sortedAcademies.length > 0 ? (
          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedAcademies.map((academy, i) => (
              <AcademyCardPlaceholder key={academy.id} academy={academy} priority={i === 0} />
            ))}
          </div>
        ) : (
          <div className="border-border/60 bg-card/40 flex flex-col items-center gap-4 rounded-xl border border-dashed py-16 text-center">
            <div className="bg-muted/50 grid h-16 w-16 place-items-center rounded-full">
              <MapPin className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <div className="max-w-sm">
              <p className="text-foreground text-lg font-semibold">No academies in {cityName} yet</p>
              <p className="text-muted-foreground mt-1 text-sm">
                We&apos;re expanding fast! Try a nearby city or browse all academies.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {nearby.length > 0 && (
                <Button asChild variant="outline">
                  <Link href={`/cities/${encodeURIComponent(nearby[0].name.toLowerCase().replace(/\s+/g, '-'))}`}>
                    Browse {nearby[0].name}
                  </Link>
                </Button>
              )}
              <Button asChild>
                <Link href="/search">Search all academies</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Nearby Cities */}
        {nearby.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">
              Nearby Cities
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {nearby.map((city) => (
                <Link
                  key={city.name}
                  href={`/cities/${encodeURIComponent(city.name.toLowerCase().replace(/\s+/g, '-'))}`}
                  className="border-border/60 bg-card/40 hover:border-foreground/20 rounded-xl border p-3 transition-colors text-center"
                >
                  <Navigation className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                  <p className="text-sm font-medium">{city.name}</p>
                  <p className="text-muted-foreground text-[11px]">{city.count} academies</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
