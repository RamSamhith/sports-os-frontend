import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShortlistToggle } from '@/components/shortlist/shortlist-toggle';
import { CompareButton } from '@/components/academies/compare-button';
import { CoachesAtAcademy } from '@/components/academy/coaches-at-academy';
import { AcademyInfo } from '@/components/academy/academy-info';
import { LocationMap } from '@/components/academy/location-map';
import { VerifiedBadge } from '@/components/trust/verified-badge';
import { LastUpdated } from '@/components/trust/last-updated';
import { CertificationIndicator } from '@/components/trust/certification-indicator';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { fixtureImages } from '@/lib/images';
import { notFound } from 'next/navigation';
import { academyBySlug, academies } from '@/data/academies';
import { coaches } from '@/data/coaches';
import { siteConfig } from '@/config/site';
import Link from 'next/link';
import { Globe, Mail, Phone, Instagram, Facebook, Youtube } from 'lucide-react';

export function generateStaticParams() {
  return academies.map((academy) => ({ slug: academy.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const academy = academyBySlug(params.slug);
  if (!academy) {
    notFound();
    return {};
  }

  const title = `${academy.name} — Sports Academy in ${academy.location.city}`;
  const description = academy.description.slice(0, 155);
  const url = `${siteConfig.url}/academies/${academy.slug}`;

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

export default function AcademyDetailPage({ params }: { params: { slug: string } }) {
  const academy = academyBySlug(params.slug);
  if (!academy) notFound();

  const academyCoaches = coaches.filter((c) => c.academyId === academy.id);

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
            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild>
                <Link href={`/enquiry/academy/${academy.slug}`}>Request Trial</Link>
              </Button>
              <ShortlistToggle
                itemType="academy"
                itemId={academy.id}
                label={academy.name}
                sublabel={`${academy.location.city}, ${academy.location.state}`}
                href={`/academies/${academy.slug}`}
                labelText="Save"
              />
              <CompareButton
                entityType="academy"
                id={academy.id}
                label={academy.name}
                sublabel={`${academy.location.city}, ${academy.location.state}`}
                href={`/academies/${academy.slug}`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Academy Info */}
        <div className="mt-6">
          <Card>
            <CardContent className="p-4">
              <AcademyInfo
                address={academy.location.address}
                city={academy.location.city}
                state={academy.location.state}
                country={academy.location.country}
                sportsOffered={academy.sportsOffered}
                website={academy.contact.website}
              />
            </CardContent>
          </Card>
        </div>

        {/* Contact */}
        <div className="mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Contact</h2>
                <div className="grid gap-2 text-sm">
                  {academy.contact.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <a href={`tel:${academy.contact.phone}`} className="text-primary hover:underline">
                        {academy.contact.phone}
                      </a>
                    </div>
                  )}
                  {academy.contact.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <a href={`mailto:${academy.contact.email}`} className="text-primary hover:underline line-clamp-1">
                        {academy.contact.email}
                      </a>
                    </div>
                  )}
                  {academy.contact.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <a
                        href={academy.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline line-clamp-1"
                      >
                        {academy.contact.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Links */}
        <div className="mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Social Links</h2>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-muted-foreground">Not Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Facebook className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-muted-foreground">Not Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Youtube className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-muted-foreground">Not Available</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coaches */}
        {academyCoaches.length > 0 && (
          <div className="mt-6">
            <CoachesAtAcademy coaches={academyCoaches} academyName={academy.name} />
          </div>
        )}

        {/* Map - Compact */}
        <div className="mt-6">
          <LocationMap
            lat={academy.location.lat}
            lng={academy.location.lng}
            label={academy.name}
            className="h-[180px] sm:h-[200px] md:h-[220px] lg:h-[250px]"
          />
        </div>
      </Container>
    </Section>
  );
}
