import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { AcademyCardPlaceholder } from '@/components/academies/academy-card-placeholder';

export function FeaturedAcademies() {
  return (
    <Section>
      <Container size="lg">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Featured academies</h2>
            <p className="text-muted-foreground text-sm">Trusted academies with verified information.</p>
          </div>
          <Link href="/academies" className="text-muted-foreground hover:text-foreground text-sm">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <AcademyCardPlaceholder key={i} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
