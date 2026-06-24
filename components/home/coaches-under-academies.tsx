'use client';

import * as React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VerifiedBadge } from '@/components/trust/verified-badge';
import { getAcademies } from '@/lib/api/academies';
import { getCoaches } from '@/lib/api/coaches';
import { Star, MapPin, Clock, Award, ChevronRight, Loader2 } from 'lucide-react';
import type { Academy } from '@/types/domain/academy';
import type { Coach } from '@/types/domain/coach';

interface AcademyWithCoaches extends Academy {
  coaches: Coach[];
}

export function CoachesUnderAcademies() {
  const [academiesWithCoaches, setAcademiesWithCoaches] = React.useState<AcademyWithCoaches[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const academiesRes = await getAcademies({ pageSize: 3 });
        if (cancelled) return;

        if (!academiesRes.ok) {
          return;
        }

        const topAcademies = [...academiesRes.data.items]
          .sort((a, b) => b.rating.average - a.rating.average)
          .slice(0, 3);

        const coachesRes = await getCoaches({ pageSize: 100 });
        if (cancelled) return;

        const allCoaches = coachesRes.ok ? coachesRes.data.items : [];

        const result = topAcademies.map((academy) => ({
          ...academy,
          coaches: allCoaches
            .filter((c) => c.academyId === academy.id)
            .sort((a, b) => b.rating.average - a.rating.average)
            .slice(0, 2),
        }));

        setAcademiesWithCoaches(result);
      } catch {
        // network error — leave empty
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <Section>
        <Container size="lg">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </Container>
      </Section>
    );
  }

  const academiesWithContent = academiesWithCoaches.filter((a) => a.coaches.length > 0);
  if (academiesWithContent.length === 0) return null;

  return (
    <Section>
      <Container size="lg">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Coaches at top academies</h2>
            <p className="text-muted-foreground text-sm">Meet the coaches behind India's best academies.</p>
          </div>
          <Link href="/academies" className="text-muted-foreground hover:text-foreground text-sm">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {academiesWithContent.map((academy) => (
            <AcademyCoachesCard key={academy.id} academy={academy} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function AcademyCoachesCard({ academy }: { academy: AcademyWithCoaches }) {
  return (
    <Card className="overflow-hidden">
      <div className="border-border/50 border-b p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/academies/${academy.slug}`} className="hover:underline">
              <h3 className="text-sm font-semibold tracking-tight line-clamp-1">{academy.name}</h3>
            </Link>
            <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{academy.location.city}</span>
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-medium">{academy.rating.average.toFixed(1)}</span>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {academy.sportsOffered.slice(0, 3).map((sport) => (
            <Badge key={sport} variant="secondary" className="capitalize text-[10px]">
              {sport.replace(/-/g, ' ')}
            </Badge>
          ))}
        </div>
      </div>
      <div className="divide-y divide-border/50">
        {academy.coaches.map((coach) => (
          <Link
            key={coach.id}
            href={`/coaches/${coach.slug}`}
            className="hover:bg-accent/5 flex items-center gap-3 p-4 transition-colors"
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
                  {coach.rating.average}
                </span>
                {coach.certifications.length > 0 && (
                  <span className="flex items-center gap-0.5">
                    <Award className="h-3 w-3" />
                    {coach.certifications.length} cert
                  </span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {coach.sportsCoached.slice(0, 2).map((sport) => (
                  <Badge key={sport} variant="outline" className="capitalize text-[10px] px-1.5 py-0">
                    {sport.replace(/-/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </div>
      <div className="border-border/50 border-t p-3">
        <Link
          href={`/academies/${academy.slug}`}
          className="text-primary flex items-center justify-center gap-1 text-xs font-medium hover:underline"
        >
          View Academy <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </Card>
  );
}
