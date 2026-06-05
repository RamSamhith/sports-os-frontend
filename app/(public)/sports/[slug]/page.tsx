import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { PathwayTimeline } from '@/components/sports/pathway-timeline';
import { SportDisclaimer } from '@/components/sports/sport-disclaimer';

export default function SportDetailPage({ params }: { params: { slug: string } }) {
  return (
    <Section>
      <Container>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Sports', href: '/sports' },
            { label: params.slug },
          ]}
          className="mb-4"
        />
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl capitalize">{params.slug}</h1>
        <p className="text-muted-foreground mt-1 text-sm">Overview, pathway, and exploration guidance.</p>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <PathwayTimeline
              levels={[
                { key: 'district', label: 'District', description: 'School and local clubs.' },
                { key: 'state', label: 'State', description: 'State championships.' },
                { key: 'national', label: 'National', description: 'National-level competitions.' },
                { key: 'international', label: 'International', description: 'International representation.' },
              ]}
            />
          </div>
          <div>
            <SportDisclaimer />
          </div>
        </div>
      </Container>
    </Section>
  );
}
