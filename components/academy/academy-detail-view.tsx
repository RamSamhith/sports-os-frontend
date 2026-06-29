'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShortlistToggle } from '@/components/shortlist/shortlist-toggle';
import { CompareButton } from '@/components/academies/compare-button';
import { AcademyInfo } from '@/components/academy/academy-info';
import { LocationMap } from '@/components/academy/location-map';
import { VerifiedBadge } from '@/components/trust/verified-badge';
import { LastUpdated } from '@/components/trust/last-updated';
import { CertificationIndicator } from '@/components/trust/certification-indicator';
import { ProtectedLink } from '@/components/auth/protected-link';
import { ReviewsSection } from '@/components/reviews/reviews-section';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { AcademyDetailSkeleton } from '@/components/feedback/skeletons';
import { fixtureImages } from '@/lib/images';
import { getAcademy, getAcademies } from '@/lib/api/academies';
import { getCoaches } from '@/lib/api/coaches';
import type { Academy } from '@/types/domain/academy';
import type { Coach } from '@/types/domain/coach';
import {
  Globe, Mail, Phone, AlertTriangle, Star, MapPin,
  Clock, Award, ChevronRight, Users, ArrowLeft,
  Shield, CheckCircle2, Building2, GraduationCap, PhoneCall, Dumbbell, MessageSquare, MessageCircle
} from 'lucide-react';

const facilityLabels: Record<string, string> = {
  indoor: 'Indoor',
  outdoor: 'Outdoor',
  ground: 'Ground',
  court: 'Court',
  equipment: 'Equipment',
  changing_room: 'Changing Room',
  parking: 'Parking',
  physio: 'Physiotherapy',
  gym: 'Gym',
};

export function AcademyDetailView({ slug }: { slug: string }) {
  const [academy, setAcademy] = React.useState<Academy | null>(null);
  const [coaches, setCoaches] = React.useState<Coach[]>([]);
  const [related, setRelated] = React.useState<Academy[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showStickyCta, setShowStickyCta] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyCta(!entry.isIntersecting),
      { threshold: 0 }
    );
    const el = document.getElementById('academy-cta');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [loading]);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      const res = await getAcademy(slug);
      if (cancelled) return;
      if (res.ok) {
        setAcademy(res.data);
        const coachesRes = await getCoaches({ pageSize: 100 });
        if (!cancelled && coachesRes.ok) {
          setCoaches(coachesRes.data.items.filter((c) => c.academyId === res.data.id));
        }
        const relatedRes = await getAcademies({ pageSize: 100 });
        if (!cancelled && relatedRes.ok) {
          const relatedAcademies = relatedRes.data.items
            .filter((a) => a.id !== res.data.id)
            .filter((a) =>
              a.location?.city === res.data.location?.city ||
              (a.sportsOffered ?? []).some((s) => (res.data.sportsOffered ?? []).includes(s))
            )
            .sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0))
            .slice(0, 3);
          setRelated(relatedAcademies);
        }
      } else {
        setError(res.error.message);
      }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <Section>
        <Container>
          <AcademyDetailSkeleton />
        </Container>
      </Section>
    );
  }

  if (error || !academy) {
    return (
      <Section>
        <Container>
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive/40" />
            <div>
              <h2 className="text-xl font-semibold">Academy not found</h2>
              <p className="text-muted-foreground mt-1 text-sm">{error || 'This academy may have been removed.'}</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/">Go home</Link>
              </Button>
              <Button asChild>
                <Link href="/academies">Browse academies</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  const facilityCount = academy.facilities.length;
  const coachCount = coaches.length;
  const totalExperience = coaches.reduce((sum, c) => sum + c.experienceYears, 0);

  return (
    <Section spacing="sm">
      <Container>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Academies', href: '/academies' },
            { label: academy.name },
          ]}
          className="mb-3"
        />

        <Button asChild variant="ghost" className="mb-3 -ml-2 min-h-[44px]">
          <Link href="/academies"><ArrowLeft className="h-4 w-4 mr-1" /> Back to academies</Link>
        </Button>

        {/* Gallery */}
        <div className="bg-muted/40 relative h-56 w-full overflow-hidden rounded-xl md:h-72 lg:h-80">
          <ImageWithFallback
            src={academy.coverImage ?? fixtureImages.academies[academy.id]}
            alt={`${academy.name} cover image`}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-1">
              <VerifiedBadge status={academy.verificationStatus} />
              {academy.verificationStatus === 'verified' && (
                <Badge className="bg-emerald-500/90 text-white border-0 text-[10px] px-1.5 py-0">Verified Academy</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{academy.name}</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
              <MapPin className="h-3.5 w-3.5" />
              {academy.location.city}, {academy.location.state}
              <span className="text-muted-foreground mx-1">·</span>
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-foreground font-semibold">{(academy.rating?.average ?? 0).toFixed(1)}</span>
              <span className="text-muted-foreground">({academy.rating.count} reviews)</span>
            </p>
          </div>
          <div id="academy-cta" className="flex flex-wrap items-center gap-2">
            {academy.contact.phone && (
              <Button asChild variant="outline" size="lg" className="h-12">
                <a href={`tel:${academy.contact.phone}`}>
                  <Phone className="h-4 w-4 mr-1" /> Call Now
                </a>
              </Button>
            )}
            {academy.contact.phone && (
              <Button asChild variant="outline" size="lg" className="h-12 border-emerald-500/50 text-emerald-600 hover:bg-emerald-500/10">
                <a
                  href={`https://wa.me/${academy.contact.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 mr-1" /> WhatsApp
                </a>
              </Button>
            )}
            <Button asChild size="lg" className="h-12 px-6">
              <ProtectedLink href={`/enquiry/academy/${academy.slug}`}>Enquire</ProtectedLink>
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
              slug={academy.slug}
              label={academy.name}
              sublabel={`${academy.location.city}, ${academy.location.state}`}
              href={`/academies/${academy.slug}`}
            />
          </div>
        </div>

        {/* Trust bar */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
          {[
            { icon: Shield, label: 'Verified', value: academy.verificationStatus === 'verified' ? 'Yes' : 'Pending' },
            { icon: Clock, label: 'Experience', value: totalExperience > 0 ? `${totalExperience}+ yrs` : 'N/A' },
            { icon: Dumbbell, label: 'Sports', value: `${academy.sportsOffered.length}` },
            { icon: Users, label: 'Coaches', value: `${coachCount}` },
            { icon: PhoneCall, label: 'Response', value: '< 24 hrs' },
            { icon: Building2, label: 'Facilities', value: `${facilityCount}` },
          ].map((item) => (
            <div key={item.label} className="border-border/60 bg-card/40 flex items-center gap-2.5 rounded-lg border p-2.5">
              <item.icon className="h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs font-semibold">{item.value}</p>
                <p className="text-[10px] text-muted-foreground">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        {academy.description && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <h2 className="text-sm font-semibold mb-2">About this academy</h2>
              <p className="text-sm text-pretty leading-relaxed">{academy.description}</p>
              <div className="text-muted-foreground flex items-center gap-3 text-xs mt-3">
                <LastUpdated at={academy.lastUpdatedAt || academy.createdAt} />
                <CertificationIndicator count={academy.certifications.length} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sports */}
        {academy.sportsOffered.length > 0 && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <h2 className="text-sm font-semibold mb-2">Sports offered</h2>
              <div className="flex flex-wrap gap-1.5">
                {academy.sportsOffered.map((sport) => (
                  <Link key={sport} href={`/sports/${sport}`}>
                    <Badge variant="secondary" className="capitalize hover:bg-accent/20 transition-colors cursor-pointer">
                      {sport.replace(/-/g, ' ')}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Facilities */}
        {academy.facilities.length > 0 && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <h2 className="text-sm font-semibold mb-2">Facilities</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {academy.facilities.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{facilityLabels[f] ?? f.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Coaches */}
        {coaches.length > 0 && (
          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                Certified Coaches ({coaches.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid gap-3 sm:grid-cols-2">
                {coaches.map((coach) => (
                  <Link
                    key={coach.id}
                    href={`/coaches/${coach.slug}`}
                    className="group flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:border-foreground/20 hover:bg-accent/5"
                  >
                    <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold uppercase">
                      {coach.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold line-clamp-1">{coach.name}</p>
                        <VerifiedBadge status={coach.verificationStatus} />
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-3 w-3" />
                          {coach.experienceYears}+ yrs
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {(coach.rating?.average ?? 0).toFixed(1)}
                        </span>
                        {coach.certifications.length > 0 && (
                          <span className="flex items-center gap-0.5">
                            <Award className="h-3 w-3" />
                            {coach.certifications.length} cert
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact + Map grid */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
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

          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-foreground">Contact</h2>
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

        {/* Achievements */}
        {academy.achievementSignals && (
          academy.achievementSignals.competitionParticipations.length > 0 ||
          academy.achievementSignals.milestones.length > 0 ||
          academy.achievementSignals.stateAthletesProduced > 0 ||
          academy.achievementSignals.nationalAthletesProduced > 0
        ) && (
          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Achievements</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 flex flex-col gap-3">
              {academy.achievementSignals.competitionParticipations.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-foreground mb-1.5">Competitions</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {academy.achievementSignals.competitionParticipations.map((comp) => (
                      <Badge key={comp} variant="secondary" className="text-xs">{comp}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {academy.achievementSignals.milestones.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-foreground mb-1.5">Milestones</h3>
                  <ul className="space-y-1">
                    {academy.achievementSignals.milestones.map((m) => (
                      <li key={m} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {(academy.achievementSignals.stateAthletesProduced > 0 || academy.achievementSignals.nationalAthletesProduced > 0) && (
                <div className="flex flex-wrap gap-3">
                  {academy.achievementSignals.stateAthletesProduced > 0 && (
                    <div className="rounded-lg bg-muted px-3 py-2 text-xs">
                      <span className="font-semibold">{academy.achievementSignals.stateAthletesProduced}</span>
                      <span className="text-muted-foreground ml-1">State athletes</span>
                    </div>
                  )}
                  {academy.achievementSignals.nationalAthletesProduced > 0 && (
                    <div className="rounded-lg bg-muted px-3 py-2 text-xs">
                      <span className="font-semibold">{academy.achievementSignals.nationalAthletesProduced}</span>
                      <span className="text-muted-foreground ml-1">National athletes</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Reviews */}
        <ReviewsSection targetType="academy" targetId={academy.id} />

        {/* Map */}
        <div className="mt-4">
          <LocationMap
            lat={academy.location.lat}
            lng={academy.location.lng}
            label={academy.name}
            className="h-[180px] sm:h-[200px] md:h-[220px] lg:h-[250px]"
          />
        </div>

        {/* Related Academies */}
        {related.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Related academies in {academy.location.city}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <Link
                  key={a.id}
                  href={`/academies/${a.slug}`}
                  className="group border-border/60 bg-card/40 hover:border-foreground/20 rounded-xl border p-3 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-muted relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                      <ImageWithFallback
                        src={a.coverImage ?? fixtureImages.academies[a.id]}
                        alt={a.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold line-clamp-1 group-hover:underline">{a.name}</h3>
                      <p className="text-muted-foreground text-xs flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {a.location?.city}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-0.5 text-xs">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {(a.rating?.average ?? 0).toFixed(1)}
                        </span>
                        <div className="flex gap-1">
                          {(a.sportsOffered ?? []).slice(0, 2).map((s) => (
                            <Badge key={s} variant="outline" className="text-[10px] px-1 py-0 capitalize">{s}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Continue exploring */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Button asChild variant="outline" className="min-h-[44px]">
            <Link href="/academies">Browse all academies</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-[44px]">
            <Link href="/sports">Explore sports</Link>
          </Button>
        </div>
      </Container>

      {/* Sticky CTA for mobile */}
      {showStickyCta && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm p-3 pb-safe md:hidden">
          <div className="flex items-center gap-2">
            {academy.contact.phone && (
              <Button asChild variant="outline" className="h-12 min-w-[44px]">
                <a href={`tel:${academy.contact.phone}`}>
                  <Phone className="h-4 w-4 mr-1" /> Call
                </a>
              </Button>
            )}
            {academy.contact.phone && (
              <Button asChild variant="outline" className="h-12 min-w-[44px] border-emerald-500/50 text-emerald-600">
                <a
                  href={`https://wa.me/${academy.contact.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button asChild className="flex-1 h-12">
              <ProtectedLink href={`/enquiry/academy/${academy.slug}`}>Enquire</ProtectedLink>
            </Button>
            <ShortlistToggle
              itemType="academy"
              itemId={academy.id}
              label={academy.name}
              sublabel={`${academy.location.city}, ${academy.location.state}`}
              href={`/academies/${academy.slug}`}
              labelText="Save"
            />
          </div>
        </div>
      )}
    </Section>
  );
}
