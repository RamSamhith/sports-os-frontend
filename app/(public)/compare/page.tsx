import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { CompareView } from '@/components/compare/compare-view';

export const metadata = {
  title: 'Compare',
  description: 'Side-by-side comparison of academies, coaches, and sports on SportsOS.',
};

export default function ComparePage() {
  return (
    <Section>
      <Container>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Compare' },
          ]}
          className="mb-3"
        />
        <CompareView />
      </Container>
    </Section>
  );
}
