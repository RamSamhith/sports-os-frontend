import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { SportGrid } from '@/components/sports/sport-grid';
import { SportDisclaimer } from '@/components/sports/sport-disclaimer';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';

export default function SportsPage() {
  return (
    <Section>
      <Container>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Sports' }]} className="mb-4" />
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Sports</h1>
          <p className="text-muted-foreground mt-1 text-sm">Explore sports and pathways across India.</p>
        </div>
        <SportDisclaimer />
        <div className="mt-6">
          <SportGrid />
        </div>
      </Container>
    </Section>
  );
}
