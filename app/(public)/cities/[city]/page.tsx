'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AcademyCardPlaceholder } from '@/components/academies/academy-card-placeholder';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { LocationMap } from '@/components/academy/location-map';
import { getAcademies } from '@/lib/api/academies';
import { getCoaches } from '@/lib/api/coaches';
import { VerifiedBadge } from '@/components/trust/verified-badge';
import { fixtureImages } from '@/lib/images';
import { MapPin, Star, Users, Trophy, ArrowLeft, Filter, Navigation } from 'lucide-react';
import type { Academy } from '@/types/domain/academy';
import type { Coach } from '@/types/domain/coach';

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
  const [coaches, setCoaches] = React.useState<Coach[]>([]);
  const [allAcademies, setAllAcademies] = React.useState<Academy[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [sortBy, setSortBy] = React.useState<'top-rated' | 'most-reviewed' | 'name'>('top-rated');

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const [academiesRes, coachesRes] = await Promise.all([
        getAcademies({ pageSize: 200 }),
        getCoaches({ pageSize: 200 }),
      ]);
      if (cancelled) return;

      if (academiesRes.ok) {
        setAllAcademies(academiesRes.data.items);
        const cityAcademies = academiesRes.data.items.filter(
          (a) => a.location.city.toLowerCase() === cityName.toLowerCase()
        );
        setAcademies(cityAcademies);
      }

      if (coachesRes.ok) {
        const cityCoaches = coachesRes.data.items.filter(
          (c) => c.location.city.toLowerCase() === cityName.toLowerCase()
        );
        setCoaches(cityCoaches);
      }

      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [cityName]);

  const sortedAcademies = React.useMemo(() => {
    const sorted = [...academies];
    switch (sortBy) {
      case 'top-rated':
        return sorted.sort((a, b) => b.rating.average - a.rating.average);
      case 'most-reviewed':
        return sorted.sort((a, b) => b.rating.count - a.rating.count);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  }, [academies, sortBy]);

  const topSports = React.useMemo(() => {
    const sportMap = new Map<string, number>();
    academies.forEach((a) => {
      a.sportsOffered.forEach((s) => {
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
      .filter((a) => nearbySlugs.includes(a.location.city.toLowerCase().replace(/\s+/g, '-')))
      .reduce((map, a) => {
        if (!map.has(a.location.city)) map.set(a.location.city, { name: a.location.city, count: 0 });
        map.get(a.location.city)!.count++;
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
          <div className="flex items-center justify-center py-24">
            <div className="text-muted-foreground text-sm">Loading academies in {cityName}...</div>
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
            { label: 'Cities', href: '/search' },
            { label: cityName },
          ]}
          className="mb-3"
        />

        <Button asChild variant="ghost" className="mb-3 -ml-2 min-h-[44px]">
          <Link href="/search"><ArrowLeft className="h-4 w-4 mr-1" /> Back to search</Link>
        </Button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Sports Academies in {cityName}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {academies.length} academies · {coaches.length} coaches · {topSports.length} sports
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
              className="border-border/60 bg-card/40 rounded-md border px-2 py-1.5 text-xs"
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
          <div className="border-border/60 bg-card/40 flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
            <MapPin className="h-10 w-10 opacity-40" />
            <div>
              <p className="text-foreground font-medium">No academies found in {cityName}</p>
              <p className="text-sm text-muted-foreground">Try searching for a nearby city or sport.</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/search">Search all academies</Link>
            </Button>
          </div>
        )}

        {/* Top Coaches */}
        {coaches.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">
              Top Coaches in {cityName}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {coaches
                .sort((a, b) => b.rating.average - a.rating.average)
                .slice(0, 6)
                .map((coach) => (
                  <Link
                    key={coach.id}
                    href={`/coaches/${coach.slug}`}
                    className="group border-border/60 bg-card/40 hover:border-foreground/20 rounded-xl border p-3 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-muted relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                        {coach.avatar ? (
                          <ImageWithFallback
                            src={coach.avatar}
                            alt={coach.name}
                            fill
                            sizes="48px"
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
                            {coach.rating.average.toFixed(1)}
                          </span>
                          <span>{coach.experienceYears}+ yrs</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {coach.sportsCoached.slice(0, 2).map((s) => (
                            <Badge key={s} variant="secondary" className="text-[10px] px-1 py-0 capitalize">
                              {s.replace(/-/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
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
