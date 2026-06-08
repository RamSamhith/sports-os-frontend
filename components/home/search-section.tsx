'use client';

import { useRouter } from 'next/navigation';
import { SearchBar } from '@/components/search/search-bar';
import { RecentSearches } from '@/components/search/recent-searches';
import { Section } from '@/components/layout/section';
import { Container } from '@/components/layout/container';

export function SearchSection() {
  const router = useRouter();

  const handleSearch = (value: string) => {
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <Section spacing="sm">
      <Container size="lg">
        <div className="flex flex-col gap-3">
          <SearchBar onSearch={handleSearch} placeholder="Search academies, coaches, sports, cities…" />
          <RecentSearches queries={['Cricket in Bengaluru', 'Swimming near me', 'Football academy']} />
        </div>
      </Container>
    </Section>
  );
}
