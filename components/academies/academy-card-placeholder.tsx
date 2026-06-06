'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bookmark, BookmarkCheck, GitCompare, MapPin, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { VerifiedBadge } from '@/components/trust/verified-badge';
import { LastUpdated } from '@/components/trust/last-updated';
import { CertificationIndicator } from '@/components/trust/certification-indicator';
import type { Academy } from '@/types/domain/academy';

export function AcademyCardPlaceholder({ academy }: { academy: Academy }) {
  const {
    slug,
    name,
    location,
    sportsOffered,
    rating,
    verificationStatus,
    certifications,
    lastUpdatedAt,
    coverImage,
  } = academy;
  const sportSlugs = sportsOffered.slice(0, 3);
  const moreCount = sportsOffered.length - sportSlugs.length;

  const [saved, setSaved] = React.useState(false);
  const [compared, setCompared] = React.useState(false);

  return (
    <Card className="group overflow-hidden">
      <Link
        href={`/academies/${slug}`}
        className="bg-muted/40 relative block aspect-[16/10] w-full overflow-hidden"
        aria-label={`${name}, ${location.city}`}
      >
        <ImageWithFallback
          src={coverImage}
          alt={`${name} cover image`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          fallback={
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-4 text-center">
              <span className="bg-background/30 text-foreground/80 grid h-10 w-10 place-items-center rounded-md text-sm font-semibold uppercase backdrop-blur-sm">
                {name.charAt(0)}
              </span>
              <span className="text-foreground/80 line-clamp-1 text-xs font-medium">{name}</span>
            </div>
          }
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <VerifiedBadge status={verificationStatus} />
        </div>
      </Link>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/academies/${slug}`}
              className="hover:underline focus-visible:ring-ring rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <h3 className="line-clamp-2 text-base font-semibold tracking-tight text-balance">{name}</h3>
            </Link>
            <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {location.city}, {location.state}
              </span>
            </p>
          </div>
          <div className="shrink-0 text-right">
            <div className="flex items-center justify-end gap-1 text-sm font-semibold">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {rating.average.toFixed(1)}
            </div>
            <div className="text-muted-foreground text-[10px] tracking-widest uppercase">
              {rating.count} review{rating.count === 1 ? '' : 's'}
            </div>
          </div>
        </div>

        {sportSlugs.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {sportSlugs.map((s) => (
              <Badge key={s} variant="secondary" className="capitalize">
                {s.replace(/-/g, ' ')}
              </Badge>
            ))}
            {moreCount > 0 ? <Badge variant="outline">+{moreCount}</Badge> : null}
          </div>
        ) : null}

        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <CertificationIndicator count={certifications.length} />
          <LastUpdated at={lastUpdatedAt} />
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Button size="sm" className="flex-1" asChild>
            <Link href={`/academies/${slug}`}>View details</Link>
          </Button>
          <Button
            size="icon"
            variant={saved ? 'default' : 'outline'}
            aria-label={saved ? `Remove ${name} from shortlist` : `Save ${name} to shortlist`}
            aria-pressed={saved}
            onClick={() => setSaved((v) => !v)}
          >
            {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </Button>
          <Button
            size="icon"
            variant={compared ? 'default' : 'outline'}
            aria-label={compared ? `Remove ${name} from compare` : `Add ${name} to compare`}
            aria-pressed={compared}
            onClick={() => setCompared((v) => !v)}
          >
            <GitCompare className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
