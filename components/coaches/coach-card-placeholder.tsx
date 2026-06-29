'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Bookmark, BookmarkCheck, MapPin, Star, Award, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/cn';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VerifiedBadge } from '@/components/trust/verified-badge';
import { CompareButton } from '@/components/academies/compare-button';
import { useShortlist } from '@/lib/hooks/use-shortlist';
import { ease, duration } from '@/components/motion/constants';
import type { Coach } from '@/types/domain/coach';

const sportColorMap: Record<string, string> = {
  cricket: 'bg-blue-500/15 text-blue-600',
  football: 'bg-emerald-500/15 text-emerald-600',
  basketball: 'bg-orange-500/15 text-orange-600',
  badminton: 'bg-violet-500/15 text-violet-600',
  tennis: 'bg-yellow-500/15 text-yellow-600',
  'table-tennis': 'bg-cyan-500/15 text-cyan-600',
  swimming: 'bg-sky-500/15 text-sky-600',
  athletics: 'bg-red-500/15 text-red-600',
  wrestling: 'bg-amber-500/15 text-amber-600',
  boxing: 'bg-rose-500/15 text-rose-600',
  karate: 'bg-pink-500/15 text-pink-600',
  judo: 'bg-purple-500/15 text-purple-600',
  kabaddi: 'bg-lime-500/15 text-lime-600',
  hockey: 'bg-indigo-500/15 text-indigo-600',
  chess: 'bg-slate-500/15 text-slate-600',
  skating: 'bg-teal-500/15 text-teal-600',
  archery: 'bg-fuchsia-500/15 text-fuchsia-600',
  shooting: 'bg-stone-500/15 text-stone-600',
  yoga: 'bg-green-500/15 text-green-600',
  gymnastics: 'bg-pink-500/15 text-pink-600',
};

function getSportColor(sport: string): string {
  return sportColorMap[sport] ?? 'bg-primary/15 text-primary';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('');
}

function CoachAvatar({ name, sport }: { name: string; sport: string }) {
  const initials = getInitials(name);
  const colorClass = getSportColor(sport);
  return (
    <span
      className={cn(
        'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold uppercase',
        colorClass,
      )}
      aria-hidden
    >
      {initials}
    </span>
  );
}

export const CoachCardPlaceholder = React.memo(function CoachCardPlaceholder({ coach }: { coach: Coach }) {
  const reduced = useReducedMotion();
  const {
    slug,
    name,
    location,
    experienceYears,
    sportsCoached,
    verificationStatus,
    certifications,
    rating,
    id,
  } = coach;

  const { has: hasShortlist, addWithMeta, remove: removeFromShortlist } = useShortlist();
  const isSaved = hasShortlist('coach', id);

  const highlight = certifications.length > 0 ? certifications[0].name : null;

  const sublabel = `${location.city} · ${experienceYears}+ yrs`;

  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -2, scale: 1.003 }}
      whileTap={reduced ? undefined : { scale: 0.997 }}
      transition={{ duration: duration.fast, ease: ease.athletic }}
      className="w-full"
    >
      <Card className="group relative flex flex-col p-4 transition-[box-shadow] duration-200 ease-out hover:shadow-[var(--shadow-md)]">
        {/* Top row: Avatar + Identity + Actions */}
        <div className="flex items-start gap-3">
          <CoachAvatar name={name} sport={sportsCoached[0] ?? 'athletics'} />

          <div className="min-w-0 flex-1">
            {/* Name + Verified */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Link
                href={`/coaches/${slug}`}
                className="focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none rounded-sm"
              >
                <h3 className="text-base font-semibold tracking-tight hover:underline">
                  {name}
                </h3>
              </Link>
              <VerifiedBadge status={verificationStatus} />
            </div>

            {/* Location + Experience */}
            <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
              <MapPin aria-hidden className="h-3 w-3 shrink-0" />
              <span className="truncate">{sublabel}</span>
            </p>

            {/* Highlight tag from top certification */}
            {highlight ? (
              <div className="mt-1.5">
                <span className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium">
                  <Award aria-hidden className="h-3 w-3" />
                  {highlight}
                </span>
              </div>
            ) : null}
          </div>

          {/* Action buttons — View Profile is primary */}
          <div className="flex shrink-0 items-center gap-1.5">
            <CompareButton
              entityType="coach"
              slug={slug}
              label={name}
              sublabel={sublabel}
              href={`/coaches/${slug}`}
            />
            <Button
              size="icon-touch"
              variant={isSaved ? 'default' : 'outline'}
              aria-label={isSaved ? `Remove ${name} from shortlist` : `Save ${name} to shortlist`}
              aria-pressed={isSaved}
              onClick={() => {
                if (isSaved) {
                  removeFromShortlist('coach', id);
                  toast(`Removed ${name} from shortlist`);
                } else {
                  addWithMeta('coach', id, {
                    label: name,
                    sublabel,
                    href: `/coaches/${slug}`,
                  });
                  toast.success(`Saved ${name} to shortlist`);
                }
              }}
            >
              {isSaved ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
            <Button size="sm" asChild>
              <Link href={`/coaches/${slug}`}>View Profile</Link>
            </Button>
          </div>
        </div>

        {/* Bottom row: Metrics + Sport tags */}
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border/50 pt-3 text-xs">
          {/* Rating */}
          <span className="text-muted-foreground flex items-center gap-1">
            <Star aria-hidden className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-foreground font-medium">{rating.average}</span>
            <span>({rating.count})</span>
          </span>

          {/* Experience */}
          <span className="text-muted-foreground flex items-center gap-1">
            <Clock aria-hidden className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{experienceYears}+ yrs</span>
          </span>

          {/* Certifications count */}
          {certifications.length > 0 ? (
            <span className="text-muted-foreground flex items-center gap-1">
              <Award aria-hidden className="h-3.5 w-3.5" />
              <span className="text-foreground font-medium">{certifications.length}</span>
              <span>cert{certifications.length !== 1 ? 's' : ''}</span>
            </span>
          ) : null}

          {/* Sport tags — pushed right */}
          {sportsCoached.length > 0 ? (
            <div className="ml-auto flex flex-wrap gap-1">
              {sportsCoached.map((s) => (
                <Badge key={s} variant="secondary" className="capitalize text-[10px]">
                  {s.replace(/-/g, ' ')}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </Card>
    </motion.div>
  );
});
