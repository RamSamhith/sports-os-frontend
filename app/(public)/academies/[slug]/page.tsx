import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShortlistButton } from '@/components/shortlist/shortlist-button';
import { CompareButton } from '@/components/compare/compare-button';
import { VerifiedBadge } from '@/components/trust/verified-badge';
import { LastUpdated } from '@/components/trust/last-updated';
import { CertificationIndicator } from '@/components/trust/certification-indicator';

export default function AcademyDetailPage({ params }: { params: { slug: string } }) {
  return (
    <Section>
      <Container>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Academies', href: '/academies' },
            { label: params.slug },
          ]}
          className="mb-4"
        />
        <Card>
          <div className="bg-muted/40 relative aspect-[21/9] w-full">
            <div className="absolute inset-0 grid place-items-center text-xs tracking-widest text-white/40 uppercase">
              Cover image
            </div>
          </div>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-2xl">Academy name</CardTitle>
              <VerifiedBadge status="verified" />
            </div>
            <CardDescription>Bengaluru, Karnataka</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="text-muted-foreground flex items-center gap-3 text-xs">
              <LastUpdated at={new Date().toISOString()} />
              <CertificationIndicator count={3} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button>Request trial</Button>
              <ShortlistButton itemType="academy" itemId={params.slug} />
              <CompareButton entityType="academy" id={params.slug} />
            </div>
            <p className="text-sm text-pretty">
              Detail sections (overview, sports offered, facilities, training levels, certifications,
              achievement signals, reviews) will be wired in a later phase.
            </p>
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
