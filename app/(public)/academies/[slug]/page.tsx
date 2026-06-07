import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShortlistToggle } from '@/components/shortlist/shortlist-toggle';
import { CompareButton } from '@/components/academies/compare-button';
import { VerifiedBadge } from '@/components/trust/verified-badge';
import { LastUpdated } from '@/components/trust/last-updated';
import { CertificationIndicator } from '@/components/trust/certification-indicator';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { fixtureImages } from '@/lib/images';
import { notFound } from 'next/navigation';
import { academyBySlug } from '@/data/academies';

export default function AcademyDetailPage({ params }: { params: { slug: string } }) {
  const academy = academyBySlug(params.slug);
  if (!academy) notFound();

  return (
    <Section>
      <Container>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Academies', href: '/academies' },
            { label: academy.name },
          ]}
          className="mb-4"
        />
        <Card>
          <div className="bg-muted/40 relative aspect-[21/9] w-full overflow-hidden">
            <ImageWithFallback
              src={academy.coverImage ?? fixtureImages.academies[academy.id]}
              alt={`${academy.name} cover image`}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-2xl">{academy.name}</CardTitle>
              <VerifiedBadge status={academy.verificationStatus} />
            </div>
            <CardDescription>
              {academy.location.city}, {academy.location.state}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-pretty">{academy.description}</p>
            <div className="text-muted-foreground flex items-center gap-3 text-xs">
              <LastUpdated at={academy.lastUpdatedAt} />
              <CertificationIndicator count={academy.certifications.length} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button>Request trial</Button>
              <ShortlistToggle
                itemType="academy"
                itemId={academy.id}
                label={academy.name}
                sublabel={`${academy.location.city}, ${academy.location.state}`}
                href={`/academies/${academy.slug}`}
                labelText="Save"
              />
              <CompareButton entityType="academy" id={academy.id} />
            </div>
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}

