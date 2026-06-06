import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { SportCard } from '@/components/sports/sport-card';
import { sports } from '@/data/sports';
import Link from 'next/link';

export function FeaturedSports() {
  const featured = sports.slice(0, 8);
  return (
    <Section>
      <Container size="lg">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Featured sports</h2>
            <p className="text-muted-foreground text-sm">Explore the sports ecosystem across India.</p>
          </div>
          <Link href="/sports" className="text-muted-foreground hover:text-foreground text-sm">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((s) => (
            <SportCard key={s.id} sport={s} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
