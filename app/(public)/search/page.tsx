'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchInput } from '@/components/ui/search-input';
import { AcademyListing } from '@/components/academies/academy-listing';
import { CoachesListing } from '@/components/coaches/coaches-listing';
import { SportsListing } from '@/components/sports/sports-listing';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { RecentSearches } from '@/components/search/recent-searches';
import { useRecentSearches } from '@/components/command/recent-searches-store';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items: recentItems, push: pushRecent } = useRecentSearches();

  const [query, setQuery] = React.useState(() => searchParams.get('q') ?? '');
  const [activeTab, setActiveTab] = React.useState<'all' | 'academies' | 'coaches' | 'sports'>('all');

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim()) pushRecent(value.trim());
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
    setActiveTab(tab as 'all' | 'academies' | 'coaches' | 'sports');
  };

  const recentQueries = recentItems.map((r) => r.query);

  return (
    <Section spacing="sm">
      <Container size="lg">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Search' }]} className="mb-4" />
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Search Results</h1>
          {query && (
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
            placeholder="Search academies, coaches, sports, cities…"
            size="lg"
            onClear={handleClear}
          />
        </div>

        {!query && recentQueries.length > 0 && (
          <div className="mb-4">
            <RecentSearches
              queries={recentQueries}
              onSelect={(q) => {
                setQuery(q);
                handleSearch(q);
              }}
            />
          </div>
        )}

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="academies">Academies</TabsTrigger>
            <TabsTrigger value="coaches">Coaches</TabsTrigger>
            <TabsTrigger value="sports">Sports</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="flex flex-col gap-8">
              <section>
                <h2 className="text-lg font-semibold mb-3">Academies</h2>
                <AcademyListing />
              </section>
              <section>
                <h2 className="text-lg font-semibold mb-3">Coaches</h2>
                <CoachesListing />
              </section>
              <section>
                <h2 className="text-lg font-semibold mb-3">Sports</h2>
                <SportsListing />
              </section>
            </div>
          </TabsContent>
          <TabsContent value="academies" className="mt-6">
            <AcademyListing />
          </TabsContent>
          <TabsContent value="coaches" className="mt-6">
            <CoachesListing />
          </TabsContent>
          <TabsContent value="sports" className="mt-6">
            <SportsListing />
          </TabsContent>
        </Tabs>
      </Container>
    </Section>
  );
}