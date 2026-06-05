import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { CoachGrid } from '@/components/coaches/coach-grid';
import { CoachFilters } from '@/components/coaches/coach-filters';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';

export default function CoachesPage() {
  return (
    <Section>
      <Container>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Coaches' }]} className="mb-4" />
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Coaches</h1>
            <p className="text-muted-foreground mt-1 text-sm">Discover verified coaches across India.</p>
          </div>
          <CoachFilters />
        </div>
        <CoachGrid count={9} />
      </Container>
    </Section>
  );
}
