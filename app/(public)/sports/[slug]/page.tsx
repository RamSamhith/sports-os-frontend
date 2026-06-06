import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { PathwayTimeline } from '@/components/sports/pathway-timeline';
import { SportDisclaimer } from '@/components/sports/sport-disclaimer';
import { notFound } from 'next/navigation';
import { sportBySlug } from '@/data/sports';

export default function SportDetailPage({ params }: { params: { slug: string } }) {
  const sport = sportBySlug(params.slug);
  if (!sport) notFound();

  const { slug, name, explorationGuidance, competitionPathway } = sport;
  const ageRange = explorationGuidance?.ageSuitability;
  const ageText =
    ageRange?.min !== undefined && ageRange?.max !== undefined
      ? `Ages ${ageRange.min}–${ageRange.max}`
      : ageRange?.min !== undefined
        ? `Ages ${ageRange.min}+`
        : null;

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
            Overview, pathway, and exploration guidance.
          </p>
        )}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            {competitionPathway?.levels?.length ? (
              <PathwayTimeline levels={competitionPathway.levels} />
            ) : (
              <div className="border-border/60 bg-card/40 rounded-xl border border-dashed p-6 text-center">
                <p className="text-muted-foreground text-sm">Competition pathway is not available yet.</p>
              </div>
            )}
          </div>
          <div>
            <SportDisclaimer />
          </div>
        </div>
      </Container>
    </Section>
  );
}
