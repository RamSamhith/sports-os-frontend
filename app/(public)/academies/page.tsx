import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Suspense } from 'react';
import { AcademyListing } from '@/components/academies/academy-listing';

export const metadata = {
  title: 'Academies',
  description: 'Find sports academies across India on SportsOS. Search by sport, city, or facility.',
};

export default function AcademiesPage() {
  return (
    <Section>
      <Container>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Academies' }]} className="mb-4" />
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Academies</h1>
          <p className="text-muted-foreground mt-1 text-sm">Find the right academy for your sport.</p>
        </div>
        <Suspense fallback={null}>
          <AcademyListing />
        </Suspense>
      </Container>
    </Section>
  );
}
