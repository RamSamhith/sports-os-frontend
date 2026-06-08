'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { CompareButton } from '@/components/academies/compare-button';
import { fixtureImages } from '@/lib/images';
import { ease, duration } from '@/components/motion/constants';
import type { Sport } from '@/types/domain/sport';

export function SportCard({ sport }: { sport: Sport }) {
  const reduced = useReducedMotion();
  const { slug, name, category, coverImage, description, explorationGuidance, id } = sport;
  const imageSrc = coverImage ?? fixtureImages.sports[id];
  const initial = name.charAt(0);
  const ageRange = explorationGuidance?.ageSuitability;
  const ageText =
    ageRange?.min !== undefined && ageRange?.max !== undefined
      ? `Ages ${ageRange.min}–${ageRange.max}`
      : ageRange?.min !== undefined
        ? `Ages ${ageRange.min}+`
        : null;

  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -3, scale: 1.005 }}
      whileTap={reduced ? undefined : { scale: 0.995 }}
      transition={{ duration: duration.fast, ease: ease.athletic }}
      className="border-border/60 bg-card/40 hover:border-foreground/30 group relative flex flex-col gap-3 overflow-hidden rounded-xl border p-4 backdrop-blur-md will-change-transform"
    >
      <div className="flex items-center gap-3">
        <span className="bg-muted/40 relative h-9 w-9 shrink-0 overflow-hidden rounded-md">
          <ImageWithFallback
            src={imageSrc}
            alt={`${name} cover`}
            fill
            sizes="36px"
            className="object-cover"
            fallback={
              <span className="bg-primary/15 text-foreground/80 grid h-full w-full place-items-center text-sm font-semibold uppercase">
                {initial}
              </span>
            }
          />
        </span>
        <div className="min-w-0 flex-1">
          <Link href={`/sports/${slug}`} className="hover:underline">
            <div className="line-clamp-1 font-medium">{name}</div>
          </Link>
          <div className="text-muted-foreground text-xs capitalize">{category}</div>
        </div>
        <CompareButton
          entityType="sport"
          id={id}
          label={name}
          sublabel={category}
          href={`/sports/${slug}`}
        />
      </div>
      {description ? (
        <Link
          href={`/sports/${slug}`}
          className="text-muted-foreground line-clamp-2 text-xs text-pretty hover:text-foreground/80"
        >
          {description}
        </Link>
      ) : null}
      {ageText ? (
        <span className="text-muted-foreground text-[10px] tracking-widest uppercase">
          {ageText}
        </span>
      ) : null}
    </motion.div>
  );
}
