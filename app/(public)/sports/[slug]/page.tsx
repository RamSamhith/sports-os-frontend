import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { SportDetailView } from '@/components/sports/sport-detail-view';
import { PathwaySection } from '@/components/sports/pathway-section';
import { RelatedAcademies } from '@/components/sports/related-academies';
import { SportDisclaimer } from '@/components/sports/sport-disclaimer';
import { notFound } from 'next/navigation';
import { competitionsBySport } from '@/data/competitions';
import { getCatalogSport } from '@/data/sports-catalog';
import { siteConfig } from '@/config/site';
import { getSport } from '@/lib/api/sports';

async function fetchSport(slug: string) {
  const res = await getSport(slug);
  if (res.ok) return res.data;
  const catalog = getCatalogSport(slug);
  if (!catalog) return null;
  return {
    id: catalog.slug,
    slug: catalog.slug,
    name: catalog.name,
    category: catalog.category,
    sportType: catalog.sportType,
    shortDescription: catalog.shortDescription,
    fullDescription: catalog.shortDescription,
    origin: '',
    popularityInIndia: '',
    popularityWorldwide: '',
    icon: `/images/sports/${catalog.slug}.svg`,
    coverImage: `/images/sports/${catalog.slug}-cover.jpg`,
    howToPlay: '',
    objectiveOfGame: '',
    teamSize: '',
    matchDuration: '',
    scoringSystem: '',
    playingSurface: '',
    requiredEquipment: [],
    ageGroups: catalog.suitableFor.join(', '),
    beginnerFriendly: catalog.beginnerFriendly,
    olympicSport: catalog.olympicSport,
    estimatedMonthlyCost: '',
    playingSeason: 'All Year' as const,
    trainingFrequency: '',
    averageLearningTime: '',
    injuryRisk: 'Medium' as const,
    fitnessLevelRequired: catalog.fitnessLevelRequired,
    suitableFor: catalog.suitableFor as ('Kids' | 'Teens' | 'Adults' | 'Seniors')[],
    individualOrTeam: (catalog.sportType === 'both' ? 'Both' : catalog.sportType === 'team' ? 'Team' : 'Individual') as 'Individual' | 'Team' | 'Both',
    indoorOutdoor: catalog.category as 'Indoor' | 'Outdoor' | 'Both',
    physicalBenefits: [],
    mentalBenefits: [],
    skillsDeveloped: [],
    careerOpportunities: [],
    scholarships: [],
    professionalLeagues: [],
    tournaments: [],
    competitionPathway: { levels: [] },
    status: 'published' as const,
  };
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
            <RelatedAcademies sportSlug={sportSlug} sportName={name} />
            <SportDisclaimer />
          </div>
        </div>
      </Container>
    </Section>
  );
}
