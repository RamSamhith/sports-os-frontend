'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Bookmark, BookmarkCheck, GitCompare, MapPin, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AcademyImage } from '@/components/ui/academy-image';
import { VerifiedBadge } from '@/components/trust/verified-badge';
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

export const AcademyCardPlaceholder = React.memo(function AcademyCardPlaceholder({ academy, priority = false }: AcademyCardPlaceholderProps) {
  const reduced = useReducedMotion();
  const {
    id,
    slug,
    name,
    location,
    sportsOffered,
    rating,
    verificationStatus,
    coverImage,
  } = academy;
  const avg = typeof rating === 'number' ? rating : (rating?.average ?? 0);
  const cnt = typeof rating === 'number' ? 0 : (rating?.count ?? 0);
  const primarySport = sportsOffered?.[0];
  const sportCount = sportsOffered?.length ?? 0;

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
      <Card className="group overflow-hidden border-border/40 hover:border-foreground/20 hover:shadow-xl transition-all duration-300">
        <Link
          href={`/academies/${slug}`}
          className="bg-muted/40 relative block aspect-[16/9] w-full overflow-hidden focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          aria-label={`${name}, ${location?.city ?? 'Unknown'}`}
        >
          <AcademyImage
            coverImage={coverImage}
            slug={slug}
            sportsOffered={sportsOffered}
            name={name}
            alt={`${name} cover image`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          <div className="absolute top-3 left-3 flex gap-2">
            <VerifiedBadge status={verificationStatus} />
          </div>

          <div className="absolute top-3 right-3 flex gap-1.5">
            <Button
              size="icon-touch"
              variant={isSaved ? 'default' : 'secondary'}
              className="bg-background/80 backdrop-blur-sm hover:bg-background/95 shadow-sm"
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
                    sublabel: `${location?.city ?? 'Unknown'}, ${location?.state ?? ''}`,
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
              className="bg-background/80 backdrop-blur-sm hover:bg-background/95 shadow-sm"
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
                    sublabel: `${location?.city ?? 'Unknown'}, ${location?.state ?? ''}`,
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

          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-base font-bold text-white drop-shadow-sm line-clamp-1">{name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-1 text-white/90">
                <Star aria-hidden className="h-3.5 w-3.5 fill-amber-400 text-amber-400 drop-shadow-sm" />
                <span className="text-sm font-semibold">{avg.toFixed(1)}</span>
              </div>
              <span className="flex items-center gap-1 text-white/70 text-xs">
                <MapPin aria-hidden className="h-3 w-3" />
                {location?.city ?? 'Unknown'}
              </span>
            </div>
          </div>
        </Link>

        <div className="flex flex-col gap-3 p-4">
          {primarySport && (
            <Badge variant="secondary" className="w-fit capitalize text-xs">
              {primarySport.replace(/-/g, ' ')}
              {sportCount > 1 && <span className="ml-1 text-muted-foreground">+{sportCount - 1}</span>}
            </Badge>
          )}

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">{avg.toFixed(1)}</span>
            <span>({cnt})</span>
            <span className="mx-1.5">&middot;</span>
            <MapPin className="h-3 w-3" />
            <span>{location?.city ?? 'Unknown'}{location?.state ? `, ${location.state}` : ''}</span>
          </div>

          <Button size="lg" className="w-full h-11 mt-1" asChild>
            <Link href={`/academies/${slug}`} onClick={() => trackAcademyCardClick(slug, 0, 'listing')}>
              View Details
            </Link>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
});
