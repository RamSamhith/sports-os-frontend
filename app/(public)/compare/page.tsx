import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { CompareView } from '@/components/compare/compare-view';

export const metadata = {
  title: 'Compare',
  description: 'Side-by-side comparison of academies, coaches, and sports on SportsOS.',
};

export default function ComparePage() {
  return (
    <Section>
      <Container>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Compare</h1>
        <p className="text-muted-foreground mt-1 text-sm">Side-by-side comparison of up to 3 items.</p>
        <div className="mt-6">
          <CompareView />
        </div>
      </Container>
    </Section>
  );
}
