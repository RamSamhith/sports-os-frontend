'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Bookmark, BookmarkCheck, GitCompare, MapPin, Star, Navigation, Shield, Clock, Users, Trophy, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { VerifiedBadge } from '@/components/trust/verified-badge';
import { fixtureImages } from '@/lib/images';
import { useShortlist } from '@/lib/hooks/use-shortlist';
import { useCompare } from '@/lib/hooks/use-compare';
import { trackAcademyCardClick } from '@/lib/analytics/events';
import { ease, duration } from '@/components/motion/constants';
import type { Academy } from '@/types/domain/academy';

interface AcademyCardPlaceholderProps {
  academy: Academy;
  priority?: boolean;
  distance?: number;
}

export const AcademyCardPlaceholder = React.memo(function AcademyCardPlaceholder({ academy, priority = false, distance }: AcademyCardPlaceholderProps) {
  const reduced = useReducedMotion();
  const {
    id,
    slug,
    name,
    location,
    sportsOffered,
    rating,
    verificationStatus,
    facilities,
    description,
    coverImage,
  } = academy;
  const sportSlugs = sportsOffered.slice(0, 3);
  const moreCount = sportsOffered.length - sportSlugs.length;
  const imageSrc = coverImage ?? fixtureImages.academies[academy.id];
  const rankingScore = Math.round((rating.average / 5) * 100 + Math.min(rating.count, 100));

  const { has: hasShortlist, addWithMeta, remove: removeFromShortlist } = useShortlist();
  const isSaved = hasShortlist('academy', id);

  const {
    has: hasCompare,
    addWithMeta: addToCompare,
    remove: removeFromCompare,
    canAdd: canAddToCompare,
    maxItems,
  } = useCompare();
  const isCompared = hasCompare('academy', slug);

  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -4, scale: 1.008 }}
      whileTap={reduced ? undefined : { scale: 0.995 }}
      transition={{ duration: duration.fast, ease: ease.athletic }}
      className="w-full"
    >
    <Card className="group overflow-hidden border-border/40 hover:border-foreground/20 hover:shadow-lg transition-shadow duration-300">
      <Link
        href={`/academies/${slug}`}
        className="bg-muted/40 relative block aspect-[16/10] w-full overflow-hidden focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label={`${name}, ${location.city}`}
      >
        <ImageWithFallback
          src={imageSrc}
          alt={`${name} cover image`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
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
          {rankingScore >= 90 && (
            <span className="bg-amber-500/90 text-white inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm">
              <Trophy className="h-2.5 w-2.5" />
              Top Ranked
            </span>
          )}
        </div>
        {/* Ranking Score Pill */}
        {rankingScore >= 70 && (
          <div className="absolute bottom-3 right-3">
            <span className="bg-background/80 text-foreground inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold backdrop-blur-sm border border-border/40">
              [{rankingScore}]
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-1.5">
          <Button
            size="icon-touch"
            variant={isSaved ? 'default' : 'secondary'}
            className="bg-background/80 backdrop-blur-sm hover:bg-background/95"
            aria-label={isSaved ? `Remove ${name} from shortlist` : `Save ${name}`}
            aria-pressed={isSaved}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isSaved) {
                removeFromShortlist('academy', id);
                toast(`Removed ${name} from shortlist`);
              } else {
                addWithMeta('academy', id, {
                  label: name,
                  sublabel: `${location.city}, ${location.state}`,
                  href: `/academies/${slug}`,
                });
                toast.success(`Saved ${name}`);
              }
            }}
          >
            {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </Button>
          <Button
            size="icon-touch"
            variant={isCompared ? 'default' : 'secondary'}
            className="bg-background/80 backdrop-blur-sm hover:bg-background/95"
            aria-label={isCompared ? `Remove ${name} from compare` : `Compare ${name}`}
            aria-pressed={isCompared}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isCompared) {
                removeFromCompare('academy', slug);
                toast(`Removed ${name} from compare`);
              } else if (canAddToCompare('academy', slug)) {
                addToCompare('academy', slug, {
                  label: name,
                  sublabel: `${location.city}, ${location.state}`,
                  href: `/academies/${slug}`,
                });
                toast.success(`Added ${name} to compare`);
              } else {
                toast.error(`You can compare up to ${maxItems} items.`);
              }
            }}
          >
            <GitCompare aria-hidden className="h-4 w-4" />
          </Button>
        </div>
      </Link>

      <div className="flex flex-col gap-2.5 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link
              href={`/academies/${slug}`}
              className="hover:underline focus-visible:ring-ring rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <h3 className="line-clamp-1 text-base font-semibold tracking-tight text-balance">{name}</h3>
            </Link>
            <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
              <MapPin aria-hidden className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {location.city}, {location.state}
              </span>
            </p>
          </div>
          <div className="shrink-0 text-right">
            <div className="flex items-center justify-end gap-1 text-sm font-semibold">
              <Star aria-hidden className="fill-rating text-rating h-3.5 w-3.5" />
              {rating.average.toFixed(1)}
            </div>
            <div className="text-muted-foreground text-[10px] tracking-widest uppercase">
              {rating.count} review{rating.count === 1 ? '' : 's'}
            </div>
          </div>
        </div>

        {distance != null && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Navigation className="h-3 w-3 shrink-0" />
            <span>{distance} km away</span>
          </div>
        )}

        {description && (
          <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">{description}</p>
        )}

        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          {facilities.length > 0 && (
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {facilities.length} facilities
            </span>
          )}
          {sportsOffered.length > 0 && (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {sportsOffered.length} sport{sportsOffered.length === 1 ? '' : 's'}
            </span>
          )}
        </div>

        {sportSlugs.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {sportSlugs.map((s) => (
              <Badge key={s} variant="secondary" className="capitalize px-1.5 py-0 text-[10px]">
                {s.replace(/-/g, ' ')}
              </Badge>
            ))}
            {moreCount > 0 ? <Badge variant="outline" className="px-1.5 py-0 text-[10px]">+{moreCount}</Badge> : null}
          </div>
        ) : null}

        <Button size="lg" className="mt-1 w-full h-11" asChild>
          <Link href={`/academies/${slug}`} onClick={() => trackAcademyCardClick(slug, 0, 'listing')}>View details</Link>
        </Button>
      </div>
    </Card>
    </motion.div>
  );
});
