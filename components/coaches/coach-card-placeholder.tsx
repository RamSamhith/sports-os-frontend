import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { VerifiedBadge } from '@/components/trust/verified-badge';
import { CompareButton } from '@/components/academies/compare-button';
import { MapPin } from 'lucide-react';
import { fixtureImages } from '@/lib/images';
import type { Coach } from '@/types/domain/coach';

export function CoachCardPlaceholder({ coach }: { coach: Coach }) {
  const { slug, name, location, experienceYears, sportsCoached, verificationStatus, avatar, id } = coach;
  const imageSrc = avatar ?? fixtureImages.coaches[id];
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('');

  return (
    <Card className="motion-card flex flex-wrap items-center gap-3 p-4 sm:flex-nowrap">
      <span
        className="bg-muted/40 relative h-12 w-12 shrink-0 overflow-hidden rounded-full"
        aria-hidden
      >
        <ImageWithFallback
          src={imageSrc}
          alt={name}
          fill
          sizes="48px"
          className="object-cover"
          fallback={
            <span className="bg-primary/15 text-foreground/80 grid h-full w-full place-items-center text-sm font-semibold uppercase">
              {initials}
            </span>
          }
        />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/coaches/${slug}`} className="hover:underline">
            <h3 className="line-clamp-1 text-sm font-semibold">{name}</h3>
          </Link>
          <VerifiedBadge status={verificationStatus} />
        </div>
        <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
          <MapPin aria-hidden className="h-3 w-3 shrink-0" />
          <span className="truncate">
            {location.city} · {experienceYears}+ yrs
          </span>
        </p>
        {sportsCoached.length > 0 ? (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {sportsCoached.map((s) => (
              <Badge key={s} variant="secondary" className="capitalize">
                {s.replace(/-/g, ' ')}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
      <div className="flex items-center gap-1.5">
        <CompareButton
          entityType="coach"
          id={id}
          label={name}
          sublabel={`${location.city} · ${experienceYears}+ yrs`}
          href={`/coaches/${slug}`}
        />
        <Button size="md" variant="outline" asChild className="h-11 px-4">
          <Link href={`/coaches/${slug}`}>View</Link>
        </Button>
      </div>
    </Card>
  );
}
