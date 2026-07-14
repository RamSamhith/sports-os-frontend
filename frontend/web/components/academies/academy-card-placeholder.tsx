'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Bookmark, BookmarkCheck, GitCompare, MapPin, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VerifiedBadge } from '@/components/trust/verified-badge';
import { useShortlist } from '@/lib/hooks/use-shortlist';
import { useCompare } from '@/lib/hooks/use-compare';
import { trackAcademyCardClick } from '@/lib/analytics/events';
import { ease, duration } from '@/components/motion/constants';
import type { Academy } from '@/types/domain/academy';

interface AcademyCardPlaceholderProps {
  academy: Academy;
  priority?: boolean;
}

const SPORT_ACCENT: Record<string, string> = {
  football: 'bg-green-500/10 text-green-600 dark:text-green-400',
  basketball: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  swimming: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  athletics: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  badminton: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
  cricket: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  tennis: 'bg-lime-500/10 text-lime-600 dark:text-lime-400',
  'table-tennis': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  wrestling: 'bg-red-500/10 text-red-600 dark:text-red-400',
  boxing: 'bg-red-500/10 text-red-600 dark:text-red-400',
  karate: 'bg-red-500/10 text-red-600 dark:text-red-400',
  judo: 'bg-red-500/10 text-red-600 dark:text-red-400',
  kabaddi: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  hockey: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  chess: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  skating: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  archery: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  shooting: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
  yoga: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  gymnastics: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  volleyball: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
};

const SPORT_DISPLAY: Record<string, string> = {
  cricket: 'Cricket',
  football: 'Football',
  basketball: 'Basketball',
  badminton: 'Badminton',
  tennis: 'Tennis',
  'table-tennis': 'Table Tennis',
  swimming: 'Swimming',
  athletics: 'Athletics',
  wrestling: 'Wrestling',
  boxing: 'Boxing',
  karate: 'Karate',
  judo: 'Judo',
  kabaddi: 'Kabaddi',
  hockey: 'Hockey',
  chess: 'Chess',
  skating: 'Skating',
  archery: 'Archery',
  shooting: 'Shooting',
  yoga: 'Yoga',
  gymnastics: 'Gymnastics',
  volleyball: 'Volleyball',
};

const SPORT_EMOJI: Record<string, string> = {
  football: '⚽',
  basketball: '🏀',
  swimming: '🏊',
  athletics: '🏃',
  badminton: '🏸',
  cricket: '🏏',
  tennis: '🎾',
  'table-tennis': '🏓',
  wrestling: '🤼',
  boxing: '🥊',
  karate: '🥋',
  judo: '🥋',
  kabaddi: '🏋️',
  hockey: '🏑',
  chess: '♟️',
  skating: '⛸️',
  archery: '🏹',
  shooting: '🎯',
  yoga: '🧘',
  gymnastics: '🤸',
  volleyball: '🏐',
};

const SPORT_ACCENT_BORDER: Record<string, string> = {
  football: 'border-t-green-500',
  basketball: 'border-t-orange-500',
  swimming: 'border-t-blue-500',
  athletics: 'border-t-amber-500',
  badminton: 'border-t-teal-500',
  cricket: 'border-t-emerald-500',
  tennis: 'border-t-lime-500',
  'table-tennis': 'border-t-cyan-500',
  wrestling: 'border-t-red-500',
  boxing: 'border-t-red-500',
  karate: 'border-t-red-500',
  judo: 'border-t-red-500',
  kabaddi: 'border-t-orange-500',
  hockey: 'border-t-blue-500',
  chess: 'border-t-violet-500',
  skating: 'border-t-sky-500',
  archery: 'border-t-amber-500',
  shooting: 'border-t-slate-500',
  yoga: 'border-t-purple-500',
  gymnastics: 'border-t-pink-500',
  volleyball: 'border-t-orange-500',
};

export const AcademyCardPlaceholder = React.memo(function AcademyCardPlaceholder({
  academy,
  priority = false,
}: AcademyCardPlaceholderProps) {
  const reduced = useReducedMotion();
  const {
    id,
    slug,
    name,
    location,
    sportsOffered,
    rating,
    verificationStatus,
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

  const accent = primarySport ? (SPORT_ACCENT[primarySport] ?? 'bg-muted text-muted-foreground') : 'bg-muted text-muted-foreground';
  const accentBorder = primarySport ? (SPORT_ACCENT_BORDER[primarySport] ?? 'border-t-border') : 'border-t-border';
  const sportLabel = primarySport ? (SPORT_DISPLAY[primarySport] ?? primarySport.replace(/-/g, ' ')) : '';
  const sportEmoji = primarySport ? (SPORT_EMOJI[primarySport] ?? '🏅') : null;

  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -2 }}
      whileTap={reduced ? undefined : { scale: 0.998 }}
      transition={{ duration: duration.fast, ease: ease.athletic }}
      className="w-full"
    >
      <Card className={`group overflow-hidden border border-border/60 bg-card transition-all duration-200 hover:border-border hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 border-t-[2px] ${accentBorder}`}>
        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-start gap-3">
            {primarySport && (
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accent}`}>
                <span className="text-2xl leading-none" aria-hidden>
                  {sportEmoji}
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-center gap-1.5">
                <h3 className="text-[15px] font-semibold leading-snug text-foreground line-clamp-1">
                  {name}
                </h3>
                {sportCount > 1 && (
                  <span className="inline-flex items-center rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground tabular-nums">
                    {sportCount} sports
                  </span>
                )}
              </div>
              {sportLabel && (
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                  {sportLabel}
                  {location?.city ? ` · ${location.city}` : ''}
                </p>
              )}
            </div>
            <VerifiedBadge status={verificationStatus} className="text-xs shrink-0" />
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span className="font-medium text-foreground">{avg > 0 ? avg.toFixed(1) : '—'}</span>
              {cnt > 0 && <span className="text-muted-foreground">({cnt})</span>}
            </span>
            {location?.city && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {location.city}
                {location.state ? `, ${location.state}` : ''}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <Button size="sm" className="flex-1" asChild>
              <Link href={`/academies/${slug}`} onClick={() => trackAcademyCardClick(slug, 0, 'listing')}>
                View Details
              </Link>
            </Button>
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={isSaved ? `Remove ${name} from saved` : `Save ${name}`}
              aria-pressed={isSaved}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isSaved) {
                  removeFromShortlist('academy', id);
                  toast(`Removed ${name} from saved`);
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
            </button>
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
              <GitCompare className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});
