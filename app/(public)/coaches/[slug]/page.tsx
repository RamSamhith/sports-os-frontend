import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShortlistButton } from '@/components/shortlist/shortlist-button';
import { CompareButton } from '@/components/compare/compare-button';
import { VerifiedBadge } from '@/components/trust/verified-badge';

export default function CoachDetailPage({ params }: { params: { slug: string } }) {
  return (
    <Section>
      <Container>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Coaches', href: '/coaches' },
            { label: params.slug },
          ]}
          className="mb-4"
        />
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-2xl">Coach name</CardTitle>
              <VerifiedBadge status="verified" />
            </div>
            <CardDescription>Mumbai · 10+ yrs experience</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            <Button>Request callback</Button>
            <ShortlistButton itemType="coach" itemId={params.slug} />
            <CompareButton entityType="coach" id={params.slug} />
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
