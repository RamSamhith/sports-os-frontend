import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShortlistToggle } from '@/components/shortlist/shortlist-toggle';
import { CompareButton } from '@/components/academies/compare-button';
import { VerifiedBadge } from '@/components/trust/verified-badge';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { fixtureImages } from '@/lib/images';
import { notFound } from 'next/navigation';
import { coachBySlug } from '@/data/coaches';

export default function CoachDetailPage({ params }: { params: { slug: string } }) {
  const coach = coachBySlug(params.slug);
  if (!coach) notFound();

  return (
    <Section>
      <Container>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Coaches', href: '/coaches' },
            { label: coach.name },
          ]}
          className="mb-4"
        />
        <Card className="overflow-hidden">
          <div className="bg-muted/40 relative aspect-[21/9] w-full overflow-hidden">
            <ImageWithFallback
              src={coach.avatar ?? fixtureImages.coaches[coach.id]}
              alt={`${coach.name} cover image`}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-2xl">{coach.name}</CardTitle>
              <VerifiedBadge status={coach.verificationStatus} />
            </div>
            <CardDescription>
              {coach.location.city} · {coach.experienceYears}+ yrs experience
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-pretty">
              Specialisation: {coach.specialization.join(', ')}.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Button>Request callback</Button>
              <ShortlistToggle
                itemType="coach"
                itemId={coach.id}
                label={coach.name}
                sublabel={`${coach.location.city} · ${coach.experienceYears}+ yrs`}
                href={`/coaches/${coach.slug}`}
                labelText="Save"
              />
              <CompareButton entityType="coach" id={coach.id} />
            </div>
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
