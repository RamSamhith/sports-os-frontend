import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { sportTaxonomy } from '@/lib/constants/sport-taxonomy';
import Link from 'next/link';

export function FeaturedSports() {
  const featured = sportTaxonomy.slice(0, 8);
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {featured.map((s) => (
            <Link
              key={s.slug}
              href={`/sports/${s.slug}`}
              className="border-border/60 bg-card/40 hover:border-primary/40 hover:bg-accent/10 group flex items-center gap-3 rounded-xl border p-4 transition-colors"
            >
              <span className="bg-muted/50 grid h-9 w-9 place-items-center rounded-md text-sm font-semibold uppercase">
                {s.name.charAt(0)}
              </span>
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-muted-foreground text-xs capitalize">{s.category}</div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
