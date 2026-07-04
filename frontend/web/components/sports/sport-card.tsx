'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

const difficultyColor: Record<string, string> = {
  Low: 'text-emerald-600',
  Medium: 'text-amber-600',
  High: 'text-red-600',
};

export const SportCard = React.memo(function SportCard({ sport }: { sport: Sport }) {
  const reduced = useReducedMotion();
  const { slug, name, coverImage } = sport;
  const imageSrc = coverImage ?? `/images/sports/${slug}.svg`;
  const gradient = sportGradients[slug] ?? sportGradients.default;

  const difficulty = sport.fitnessLevelRequired ?? 'Medium';
  const participation = sport.individualOrTeam ?? 'Both';
  const environment = sport.indoorOutdoor ?? 'Both';

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
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-base font-bold text-white drop-shadow-sm line-clamp-1">{name}</h3>
          </div>
        </Link>
        <div className="flex flex-col gap-2.5 p-4">
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-[10px] capitalize">{participation}</Badge>
            <Badge variant="secondary" className="text-[10px] capitalize">{environment}</Badge>
            <Badge variant="secondary" className={`text-[10px] capitalize ${difficultyColor[difficulty] ?? ''}`}>
              {difficulty}
            </Badge>
          </div>
          <Button size="lg" className="w-full h-10" asChild>
            <Link href={`/sports/${slug}`}>
              Explore {name}
            </Link>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
});
