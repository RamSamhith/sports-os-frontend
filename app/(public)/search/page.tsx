'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchInput } from '@/components/ui/search-input';
import { AcademyListing } from '@/components/academies/academy-listing';
import { SportsListing } from '@/components/sports/sports-listing';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { RecentSearches } from '@/components/search/recent-searches';
import { useRecentSearches } from '@/components/command/recent-searches-store';
import Link from 'next/link';
import { TrendingUp, MapPin, Trophy, School, Loader2 } from 'lucide-react';
import { trackSearch, trackSearchResultClick, trackSportClick, trackCityClick, trackGuestSearch } from '@/lib/analytics/events';
import { useAuth } from '@/lib/hooks/use-auth';
import { getAcademies } from '@/lib/api/academies';
import { listSports } from '@/lib/api/sports';

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <Section spacing="sm">
          <Container size="lg">
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          </Container>
        </Section>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items: recentItems, push: pushRecent } = useRecentSearches();
  const { isGuest, isAuthenticated } = useAuth();

  const [query, setQuery] = React.useState(() => searchParams.get('q') ?? '');
  const [activeTab, setActiveTab] = React.useState<'all' | 'academies' | 'sports' | 'cities'>('all');
  const [trendingSports, setTrendingSports] = React.useState<string[]>([]);
  const [topCities, setTopCities] = React.useState<string[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      const [academiesRes, sportsRes] = await Promise.all([
        getAcademies({ pageSize: 200 }),
        listSports({ status: 'published', limit: 10 }),
      ]);
      if (cancelled) return;
      if (sportsRes.ok) {
        setTrendingSports(sportsRes.data.items.map((s) => s.name).slice(0, 5));
      }
      if (academiesRes.ok) {
        const cityCounts = new Map<string, number>();
        academiesRes.data.items.forEach((a) => {
          const city = a.location?.city;
          if (city) cityCounts.set(city, (cityCounts.get(city) || 0) + 1);
        });
        setTopCities(
          [...cityCounts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([city]) => city)
        );
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      pushRecent(value.trim());
      trackSearch(value.trim(), 0, activeTab);
      if (isGuest || !isAuthenticated) {
        trackGuestSearch(value.trim(), 0);
      }
    }
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('q', value);
    else params.delete('q');
    params.delete('sport');
    params.delete('facility');
    params.delete('level');
    params.delete('status');
    router.replace(`/search?${params.toString()}`, { scroll: false });
  };

  const handleClear = () => {
    setQuery('');
    router.replace('/search', { scroll: false });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'all' | 'academies' | 'sports' | 'cities');
  };

  const recentQueries = recentItems.map((r) => r.query);
  const hasQuery = query.trim().length > 0;

  return (
    <Section spacing="sm">
      <Container size="lg">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Search' }]} className="mb-4" />
        <header className="mb-4">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Search</h1>
          {hasQuery && (
            <p className="text-muted-foreground mt-1 text-sm">
              Results for &ldquo;{query}&rdquo;
            </p>
          )}
        </header>

        <div className="mb-4">
          <SearchInput
            value={query}
            onValueChange={setQuery}
            onSearch={handleSearch}
            label="Search"
            placeholder="Search academies, sports, cities…"
            size="lg"
            onClear={handleClear}
          />
        </div>

        {!hasQuery && (
          <div className="flex flex-col gap-6">
            {recentQueries.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">Recent searches</h2>
                <RecentSearches
                  queries={recentQueries}
                  onSelect={(q) => {
                    setQuery(q);
                    handleSearch(q);
                  }}
                />
              </div>
            )}

            {trendingSports.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Trending sports
                </h2>
                <div className="flex flex-wrap gap-2">
                  {trendingSports.map((sport, i) => (
                    <button
                      key={sport}
                      onClick={() => {
                        trackSportClick(sport.toLowerCase(), i, 'search_trending');
                        handleSearch(sport);
                      }}
                      className="border-border/60 bg-card/40 hover:border-foreground/20 inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm transition-colors"
                    >
                      <Trophy className="h-3.5 w-3.5 text-muted-foreground" />
                      {sport}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {topCities.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  Top cities
                </h2>
                <div className="flex flex-wrap gap-2">
                  {topCities.map((city, i) => (
                    <button
                      key={city}
                      onClick={() => {
                        trackCityClick(city, i);
                        setQuery(city);
                        handleSearch(city);
                      }}
                      className="border-border/60 bg-card/40 hover:border-foreground/20 inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm transition-colors"
                    >
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                <School className="h-3.5 w-3.5" />
                Quick links
              </h2>
              <div className="flex flex-wrap gap-2">
                <Link href="/academies" className="border-border/60 bg-card/40 hover:border-foreground/20 inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm transition-colors">
                  Browse all academies
                </Link>
                <Link href="/sports" className="border-border/60 bg-card/40 hover:border-foreground/20 inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm transition-colors">
                  Explore sports
                </Link>
              </div>
            </div>
          </div>
        )}

        {hasQuery && (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="academies">Academies</TabsTrigger>
              <TabsTrigger value="sports">Sports</TabsTrigger>
              <TabsTrigger value="cities">Cities</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="flex flex-col gap-6">
                <section>
                  <h2 className="text-sm font-semibold mb-2">Academies</h2>
                  <AcademyListing />
                </section>
                <section>
                  <h2 className="text-sm font-semibold mb-2">Sports</h2>
                  <SportsListing />
                </section>
              </div>
            </TabsContent>
            <TabsContent value="academies" className="mt-4">
              <AcademyListing />
            </TabsContent>
            <TabsContent value="sports" className="mt-4">
              <SportsListing />
            </TabsContent>
            <TabsContent value="cities" className="mt-4">
              <AcademyListing />
            </TabsContent>
          </Tabs>
        )}
      </Container>
    </Section>
  );
}
