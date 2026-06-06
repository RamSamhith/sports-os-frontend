import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { AcademyGrid } from '@/components/academies/academy-grid';
import { AcademyFilters } from '@/components/academies/academy-filters';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { academies } from '@/data/academies';

export default function AcademiesPage() {
  return (
    <Section>
      <Container>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Academies' }]} className="mb-4" />
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Academies</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {academies.length} academies across India.
            </p>
          </div>
          <AcademyFilters />
        </div>
        <AcademyGrid academies={academies} />
      </Container>
    </Section>
  );
}
