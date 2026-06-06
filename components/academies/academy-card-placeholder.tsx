'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkCheck, GitCompare, MapPin, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { VerifiedBadge } from '@/components/trust/verified-badge';
import { LastUpdated } from '@/components/trust/last-updated';
import { CertificationIndicator } from '@/components/trust/certification-indicator';
import { fixtureImages } from '@/lib/images';
import { useShortlist } from '@/lib/hooks/use-shortlist';
import { useCompare } from '@/lib/hooks/use-compare';
import type { Academy } from '@/types/domain/academy';

export function AcademyCardPlaceholder({ academy, priority = false }: { academy: Academy; priority?: boolean }) {
  const {
    id,
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

  // Real image first; otherwise the local placeholder for this fixture; always resolves.
  const imageSrc = coverImage ?? fixtureImages.academies[academy.id];

  // Shortlist (persisted in localStorage by provider)
  const { has: hasShortlist, addWithMeta, remove: removeFromShortlist } = useShortlist();
  const isSaved = hasShortlist('academy', id);

  // Compare (persisted in localStorage by provider)
  const { has: hasCompare, add: addToCompare, remove: removeFromCompare, canAdd: canAddToCompare } = useCompare();
  const isCompared = hasCompare('academy', id);

  return (
    <Card className="group hover:shadow-[var(--shadow-md)] overflow-hidden transition-all duration-[var(--duration-fast)] ease-[var(--ease-standard)]">
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
              <MapPin aria-hidden className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {location.city}, {location.state}
              </span>
            </p>
          </div>
          <div className="shrink-0 text-right">
            <div className="flex items-center justify-end gap-1 text-sm font-semibold">
              <Star aria-hidden className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
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
            variant={isSaved ? 'default' : 'outline'}
            aria-label={isSaved ? `Remove ${name} from shortlist` : `Save ${name} to shortlist`}
            aria-pressed={isSaved}
            onClick={() => {
              if (isSaved) {
                removeFromShortlist('academy', id);
                toast(`Removed ${name} from shortlist`);
              } else {
                addWithMeta('academy', id, {
                  label: name,
                  sublabel: `${location.city}, ${location.state}`,
                  href: `/academies/${slug}`,
                });
                toast.success(`Saved ${name} to shortlist`);
              }
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isSaved ? 'saved' : 'unsaved'}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
                className="inline-flex"
              >
                {isSaved ? (
                  <BookmarkCheck className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </motion.span>
            </AnimatePresence>
          </Button>
          <Button
            size="icon"
            variant={isCompared ? 'default' : 'outline'}
            aria-label={isCompared ? `Remove ${name} from compare` : `Add ${name} to compare`}
            aria-pressed={isCompared}
            onClick={() => {
              if (isCompared) {
                removeFromCompare('academy', id);
                toast(`Removed ${name} from compare`);
              } else if (canAddToCompare('academy', id)) {
                addToCompare({ entityType: 'academy', id });
                toast.success(`Added ${name} to compare`);
              } else {
                toast.error('You can compare up to 3 academies.');
              }
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isCompared ? 'compared' : 'uncompared'}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
                className="inline-flex"
              >
                <GitCompare className="h-4 w-4" />
              </motion.span>
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </Card>
  );
}
