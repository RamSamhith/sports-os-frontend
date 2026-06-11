import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShortlistToggle } from '@/components/shortlist/shortlist-toggle';
import { CompareButton } from '@/components/academies/compare-button';
import { VerifiedBadge } from '@/components/trust/verified-badge';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { fixtureImages } from '@/lib/images';
import { notFound } from 'next/navigation';
import { coachBySlug, coaches } from '@/data/coaches';
import { academyById } from '@/data/academies';
import { siteConfig } from '@/config/site';
import Link from 'next/link';
import { School, MapPin, Star, ChevronRight } from 'lucide-react';

export function generateStaticParams() {
  return coaches.map((coach) => ({ slug: coach.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const coach = coachBySlug(params.slug);
  if (!coach) {
    notFound();
    return {};
  }

  const title = `${coach.name} — Sports Coach in ${coach.location.city}`;
  const description = `${coach.specialization.join(', ')} — ${coach.experienceYears}+ years experience in ${coach.location.city}, ${coach.location.state}.`;
  const url = `${siteConfig.url}/coaches/${coach.slug}`;

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

export default function CoachDetailPage({ params }: { params: { slug: string } }) {
  const coach = coachBySlug(params.slug);
  if (!coach) notFound();

  const academy = coach.academyId ? academyById(coach.academyId) : null;

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
          <div className="bg-muted/40 relative h-48 w-full overflow-hidden md:h-56 lg:h-64 xl:h-72">
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
            <div className="flex flex-wrap gap-1">
              {coach.sportsCoached.map((sport) => (
                <Badge key={sport} variant="secondary" className="text-xs">
                  {sport}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild>
                <Link href={`/enquiry/coach/${coach.slug}`}>Request callback</Link>
              </Button>
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

        {academy && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">Academy Affiliation</h2>
            <Link href={`/academies/${academy.slug}`} className="group block">
              <Card className="transition-all hover:shadow-md group-hover:border-primary/50">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <School className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-tight line-clamp-1">
                      {academy.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{academy.location.city}, {academy.location.state}</span>
                      <span>·</span>
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{academy.rating.average.toFixed(1)}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </CardContent>
              </Card>
            </Link>
          </div>
        )}

        {/* Achievements */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Certifications, awards, and career milestones</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {coach.certifications.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Certifications</h3>
                  <ul className="space-y-2">
                    {coach.certifications.map((cert, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                        <div>
                          <span className="text-foreground font-medium">{cert.name}</span>
                          <span className="ml-1">— {cert.issuer} ({cert.year})</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Experience Milestones</h3>
                <div className="rounded-lg bg-muted px-3 py-2 text-sm">
                  <span className="font-semibold">{coach.experienceYears}+ years</span>
                  <span className="text-muted-foreground ml-1">of coaching experience</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Awards</h3>
                <p className="text-sm text-muted-foreground">No achievements available yet</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Athletes Trained</h3>
                <p className="text-sm text-muted-foreground">No achievements available yet</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
