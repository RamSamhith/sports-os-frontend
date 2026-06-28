import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { SportDetailView } from '@/components/sports/sport-detail-view';
import { PathwaySection } from '@/components/sports/pathway-section';
import { SportDisclaimer } from '@/components/sports/sport-disclaimer';
import { notFound } from 'next/navigation';
import { competitionsBySport } from '@/data/competitions';
import { siteConfig } from '@/config/site';
import { getSport } from '@/lib/api/sports';

async function fetchSport(slug: string) {
  const res = await getSport(slug);
  return res.ok ? res.data : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const sport = await fetchSport(slug);
  if (!sport) {
    notFound();
    return {};
  }

  const title = `${sport.name} — Sports Pathway & Competitions`;
  const description = (sport.shortDescription || '').slice(0, 155);
  const url = `${siteConfig.url}/sports/${sport.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: 'website',
      locale: siteConfig.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function SportDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sport = await fetchSport(slug);
  if (!sport) notFound();

  const { slug: sportSlug, name } = sport;
  const competitions = competitionsBySport(sportSlug);

  return (
    <Section>
      <Container>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Sports', href: '/sports' },
            { label: name },
          ]}
          className="mb-4"
        />

        <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <SportDetailView sport={sport} />
          </div>
          <div className="flex flex-col gap-6">
            <PathwaySection
              sportSlug={sportSlug}
              sportName={name}
              competitions={competitions}
            />
            <SportDisclaimer />
          </div>
        </div>
      </Container>
    </Section>
  );
}
