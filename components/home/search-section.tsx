'use client';

import { useRouter } from 'next/navigation';
import { SearchBar } from '@/components/search/search-bar';
import { RecentSearches } from '@/components/search/recent-searches';
import { useRecentSearches } from '@/components/command/recent-searches-store';
import { Section } from '@/components/layout/section';
import { Container } from '@/components/layout/container';

export function SearchSection() {
  const router = useRouter();
  const { items: recentItems } = useRecentSearches();

  const handleSearch = (value: string) => {
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  const recentQueries = recentItems.map((r) => r.query);

  return (
    <Section spacing="sm">
      <Container size="lg">
        <div className="flex flex-col gap-3">
          <SearchBar onSearch={handleSearch} placeholder="Search academies, coaches, sports, cities…" />
          <RecentSearches
            queries={recentQueries}
            onSelect={(q) => router.push(`/search?q=${encodeURIComponent(q)}`)}
          />
        </div>
      </Container>
    </Section>
  );
}
