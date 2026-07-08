import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { SportsListing } from '@/components/sports/sports-listing';

export const metadata = {
  title: 'Sports',
  description: 'Explore sports and pathways across India on SportsOS.',
};

export default function SportsPage() {
  return (
    <Section>
      <Container>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Sports' }]} className="mb-4" />
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Sports</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Discover sports, pathways, and exploration guidance.
          </p>
        </div>
        <SportsListing />
      </Container>
    </Section>
  );
}
