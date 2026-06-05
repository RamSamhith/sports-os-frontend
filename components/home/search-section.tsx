import { SearchBar } from '@/components/search/search-bar';
import { RecentSearches } from '@/components/search/recent-searches';
import { Section } from '@/components/layout/section';
import { Container } from '@/components/layout/container';

export function SearchSection() {
  return (
    <Section spacing="sm">
      <Container size="lg">
        <div className="flex flex-col gap-3">
          <SearchBar value="" onValueChange={() => undefined} />
          <RecentSearches queries={['Cricket in Bengaluru', 'Swimming near me', 'Football academy']} />
        </div>
      </Container>
    </Section>
  );
}
