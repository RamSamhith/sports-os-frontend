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

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = React.useState(() => searchParams.get('q') ?? '');
  const [activeTab, setActiveTab] = React.useState<'all' | 'academies' | 'coaches' | 'sports'>('all');

  const handleSearch = (value: string) => {
    setQuery(value);
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

  if (activeTab === 'academies') {
    return <AcademyListing />;
  }

  if (activeTab === 'coaches') {
    return <CoachesListing />;
  }

  if (activeTab === 'sports') {
    return <SportsListing />;
  }

  return (
    <Section>
      <Container size="lg">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Search Results</h1>
          {query && (
            <p className="text-muted-foreground mt-1 text-sm">
              Results for &ldquo;{query}&rdquo;
            </p>
          )}
        </header>

        <div className="mb-6">
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

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="academies">Academies</TabsTrigger>
            <TabsTrigger value="coaches">Coaches</TabsTrigger>
            <TabsTrigger value="sports">Sports</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid gap-8 md:grid-cols-3">
              <section className="md:col-span-1">
                <h2 className="text-lg font-semibold mb-3">Academies</h2>
                <AcademyListing />
              </section>
              <section className="md:col-span-1">
                <h2 className="text-lg font-semibold mb-3">Coaches</h2>
                <CoachesListing />
              </section>
              <section className="md:col-span-1">
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