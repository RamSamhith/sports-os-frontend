import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { PathwaySection } from '@/components/sports/pathway-section';
import { SportDisclaimer } from '@/components/sports/sport-disclaimer';
import { notFound } from 'next/navigation';
import { competitionsBySport } from '@/data/competitions';
import { siteConfig } from '@/config/site';

async function getSport(slug: string) {
  const API_BASE = process.env.BACKEND_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${API_BASE}/sports/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.ok ? json.data : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const sport = await getSport(slug);
  if (!sport) {
    notFound();
    return {};
  }

  const title = `${sport.name} — Sports Pathway & Competitions`;
  const description = (sport.description || '').slice(0, 155);
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
  const sport = await getSport(slug);
  if (!sport) notFound();

  const { slug: sportSlug, name, explorationGuidance } = sport;
  const ageRange = explorationGuidance?.ageSuitability;
  const ageText =
    ageRange?.min !== undefined && ageRange?.max !== undefined
      ? `Ages ${ageRange.min}–${ageRange.max}`
      : ageRange?.min !== undefined
        ? `Ages ${ageRange.min}+`
        : null;
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
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{name}</h1>
        {ageText ? (
          <p className="text-muted-foreground mt-1 text-sm">{ageText}</p>
        ) : (
          <p className="text-muted-foreground mt-1 text-sm">
            Pathway, competitions, and exploration guidance.
          </p>
        )}

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <PathwaySection
              sportSlug={sportSlug}
              sportName={name}
              competitions={competitions}
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
