import { Suspense } from 'react';
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
        <Suspense fallback={<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => (<div key={i} className="rounded-xl border bg-card"><div className="aspect-[16/9] animate-pulse bg-muted rounded-t-xl" /><div className="p-4 space-y-3"><div className="h-5 w-3/4 animate-pulse rounded bg-muted" /><div className="h-4 w-1/2 animate-pulse rounded bg-muted" /></div></div>))}</div>}>
          <SportsListing />
        </Suspense>
      </Container>
    </Section>
  );
}
