import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { CompareTable } from '@/components/compare/compare-table';
import { EmptyState } from '@/components/feedback/empty-state';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ComparePage() {
  return (
    <Section>
      <Container>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Compare</h1>
        <p className="text-muted-foreground mt-1 text-sm">Side-by-side comparison of up to 3 items.</p>
        <div className="mt-6">
          <EmptyState
            title="Nothing to compare yet"
            description="Add academies or coaches to compare them here."
            action={
              <Button asChild>
                <Link href="/academies">Browse academies</Link>
              </Button>
            }
          />
        </div>
        <div className="mt-8">
          <CompareTable
            columns={['A', 'B', 'C']}
            rows={[
              { key: 'distance', label: 'Distance', values: ['2.4 km', '4.1 km', '—'] },
              { key: 'rating', label: 'Rating', values: ['4.6', '4.4', '—'] },
              { key: 'facilities', label: 'Facilities', values: ['Indoor, Outdoor', 'Outdoor', '—'] },
            ]}
          />
        </div>
      </Container>
    </Section>
  );
}
