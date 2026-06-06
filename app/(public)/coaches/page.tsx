import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { CoachesListing } from '@/components/coaches/coaches-listing';

export const metadata = {
  title: 'Coaches',
  description: 'Find verified coaches across India on SportsOS.',
};

export default function CoachesPage() {
  return (
    <Section>
      <Container>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Coaches' }]} className="mb-4" />
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Coaches</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Verified coaches across India.
          </p>
        </div>
        <CoachesListing />
      </Container>
    </Section>
  );
}
