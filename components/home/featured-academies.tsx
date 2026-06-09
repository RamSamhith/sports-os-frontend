import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { AcademyCardPlaceholder } from '@/components/academies/academy-card-placeholder';
import { academies } from '@/data/academies';
import { School } from 'lucide-react';

export function FeaturedAcademies() {
  const featured = [...academies]
    .sort((a, b) => b.rating.average - a.rating.average)
    .slice(0, 3);

  return (
    <Section>
      <Container size="lg">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Featured academies</h2>
            <p className="text-muted-foreground text-sm">Top-rated, verified academies.</p>
          </div>
          <Link href="/academies" className="text-muted-foreground hover:text-foreground text-sm">
            View all →
          </Link>
        </div>
        {featured.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
            <School className="h-10 w-10 opacity-40" />
            <div>
              <p className="text-foreground font-medium">No academies yet</p>
              <p className="text-sm">Check back soon for verified academies in your area.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((academy, i) => (
              <AcademyCardPlaceholder key={academy.id} academy={academy} priority={i === 0} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
