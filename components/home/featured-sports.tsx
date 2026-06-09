import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { SportCard } from '@/components/sports/sport-card';
import { sports } from '@/data/sports';
import Link from 'next/link';
import { Trophy } from 'lucide-react';

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
        {featured.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
            <Trophy className="h-10 w-10 opacity-40" />
            <div>
              <p className="text-foreground font-medium">No sports listed yet</p>
              <p className="text-sm">Explore the sports ecosystem as it grows.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((s) => (
              <SportCard key={s.id} sport={s} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
