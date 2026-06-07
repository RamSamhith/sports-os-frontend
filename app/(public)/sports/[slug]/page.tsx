import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { PathwaySection } from '@/components/sports/pathway-section';
import { SportDisclaimer } from '@/components/sports/sport-disclaimer';
import { notFound } from 'next/navigation';
import { sportBySlug } from '@/data/sports';
import { competitionsBySport } from '@/data/competitions';

export default function SportDetailPage({ params }: { params: { slug: string } }) {
  const sport = sportBySlug(params.slug);
  if (!sport) notFound();

  const { slug, name, explorationGuidance } = sport;
  const ageRange = explorationGuidance?.ageSuitability;
  const ageText =
    ageRange?.min !== undefined && ageRange?.max !== undefined
      ? `Ages ${ageRange.min}–${ageRange.max}`
      : ageRange?.min !== undefined
        ? `Ages ${ageRange.min}+`
        : null;
  const competitions = competitionsBySport(slug);

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
              sportSlug={slug}
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
