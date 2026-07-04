import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { ShortlistTabs } from '@/components/shortlist/shortlist-tabs';

export const metadata = {
  title: 'Shortlist',
  description: 'Academies you have saved on SportsOS.',
};

export default function ShortlistPage() {
  return (
    <Section>
      <Container size="md">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Shortlist' }]} className="mb-4" />
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Shortlist</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Saved academies.
        </p>
        <div className="mt-6">
          <ShortlistTabs />
        </div>
      </Container>
    </Section>
  );
}
