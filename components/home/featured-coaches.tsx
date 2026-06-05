import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { CoachCardPlaceholder } from '@/components/coaches/coach-card-placeholder';

export function FeaturedCoaches() {
  return (
    <Section>
      <Container size="lg">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Featured coaches</h2>
            <p className="text-muted-foreground text-sm">Verified coaches across India.</p>
          </div>
          <Link href="/coaches" className="text-muted-foreground hover:text-foreground text-sm">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <CoachCardPlaceholder key={i} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
