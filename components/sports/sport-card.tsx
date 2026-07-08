'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Bookmark, BookmarkCheck, GitCompare, Star } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useShortlist } from '@/lib/hooks/use-shortlist';
import { useCompare } from '@/lib/hooks/use-compare';
import { sportsContent } from '@/data/sports-content';
import { ease, duration } from '@/components/motion/constants';
import type { Sport } from '@/types/domain/sport';

const sportGradients: Record<string, string> = {
  cricket: 'from-blue-600 to-blue-800/60',
  football: 'from-emerald-600 to-emerald-800/60',
  basketball: 'from-orange-600 to-orange-800/60',
  badminton: 'from-violet-600 to-violet-800/60',
  tennis: 'from-yellow-600 to-yellow-800/60',
  swimming: 'from-sky-600 to-sky-800/60',
  athletics: 'from-red-600 to-red-800/60',
  yoga: 'from-rose-600 to-rose-800/60',
  default: 'from-primary/60 to-primary/20',
};

export const SportCard = React.memo(function SportCard({ sport }: { sport: Sport }) {
  const reduced = useReducedMotion();
  const { slug, name, coverImage } = sport;
  const imageSrc = coverImage ?? `/images/sports/${slug}.svg`;
  const gradient = sportGradients[slug] ?? sportGradients.default;

  const { has: hasShortlist, addWithMeta: addToShortlist, remove: removeFromShortlist } = useShortlist();
  const { has: hasCompare, addWithMeta: addToCompare, remove: removeFromCompare, canAdd: canAddToCompare, maxItems } = useCompare();

  const isSaved = hasShortlist('sport', slug);
  const isCompared = hasCompare('sport', slug);

  const sc = sportsContent[slug];

  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -4, scale: 1.008 }}
      whileTap={reduced ? undefined : { scale: 0.995 }}
      transition={{ duration: duration.fast, ease: ease.athletic }}
      className="w-full"
    >
      <Card className="group overflow-hidden border-border/40 hover:border-foreground/20 hover:shadow-xl transition-all duration-300">
        <Link
          href={`/sports/${slug}`}
          className="bg-muted/40 relative block aspect-[16/9] w-full overflow-hidden"
        >
          <ImageWithFallback
            src={imageSrc}
            alt={`${name} cover`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            fallback={
              <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}>
                <span className="text-3xl font-bold text-white/80 drop-shadow-sm">
                  {name.charAt(0)}
                </span>
              </div>
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Action buttons */}
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
                  removeFromShortlist('sport', slug);
                  toast(`Removed ${name} from shortlist`);
                } else {
                  addToShortlist('sport', slug, {
                    label: name,
                    sublabel: `${sport.category} sport`,
                    href: `/sports/${slug}`,
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
                  removeFromCompare('sport', slug);
                  toast(`Removed ${name} from compare`);
                } else if (canAddToCompare('sport', slug)) {
                  addToCompare('sport', slug, {
                    label: name,
                    sublabel: `${sport.category} sport`,
                    href: `/sports/${slug}`,
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

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {sport.olympicSport && (
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-200 border-yellow-500/20 text-[10px] backdrop-blur-sm">
                <Star className="h-3 w-3 mr-0.5 fill-current" /> Olympic
              </Badge>
            )}
            {sport.beginnerFriendly && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-500/20 text-[10px] backdrop-blur-sm">
                Beginner
              </Badge>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-base font-bold text-white drop-shadow-sm line-clamp-1">{name}</h3>
          </div>
        </Link>
        <div className="flex flex-col gap-2.5 p-4">
          {sc?.tagline && (
            <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">{sc.tagline}</p>
          )}
          <Button size="lg" className="w-full h-11" asChild>
            <Link href={`/sports/${slug}`}>
              Explore {name}
            </Link>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
});
