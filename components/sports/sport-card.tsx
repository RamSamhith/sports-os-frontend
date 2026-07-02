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

const sportBenefits: Record<string, string[]> = {
  cricket: ['Teamwork', 'Hand-eye coordination', 'Fitness'],
  football: ['Stamina', 'Speed', 'Team spirit'],
  badminton: ['Agility', 'Reflexes', 'Endurance'],
  tennis: ['Coordination', 'Speed', 'Core strength'],
  'table-tennis': ['Reflexes', 'Hand-eye coordination', 'Wrist flexibility'],
  swimming: ['Full body workout', 'Lung capacity', 'Flexibility'],
  athletics: ['Speed', 'Power', 'Discipline'],
  wrestling: ['Full-body strength', 'Grip strength', 'Endurance'],
  boxing: ['Speed', 'Power', 'Core stability'],
  karate: ['Flexibility', 'Discipline', 'Speed'],
  judo: ['Balance', 'Coordination', 'Mental discipline'],
  kabaddi: ['Strength', 'Lung capacity', 'Tactical awareness'],
  hockey: ['Stamina', 'Agility', 'Stick-handling'],
  chess: ['Focus', 'Pattern recognition', 'Memory'],
  skating: ['Balance', 'Leg strength', 'Flexibility'],
  archery: ['Steady hand', 'Core stability', 'Visual focus'],
  shooting: ['Composure', 'Steady hand', 'Visual focus'],
  yoga: ['Flexibility', 'Balance', 'Breath control'],
  gymnastics: ['Flexibility', 'Spatial awareness', 'Strength'],
  basketball: ['Height coordination', 'Agility', 'Endurance'],
};

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
  const { slug, name, sportType, coverImage, shortDescription, explorationGuidance, id } = sport;
  const imageSrc = coverImage ?? `/images/sports/${slug}.svg`;
  const ageRange = explorationGuidance?.ageSuitability;
  const ageText =
    ageRange?.min !== undefined && ageRange?.max !== undefined
      ? `${ageRange.min}–${ageRange.max} yrs`
      : ageRange?.min !== undefined
        ? `${ageRange.min}+ yrs`
        : null;

  const benefits = sport.physicalBenefits?.slice(0, 3) ?? sportBenefits[slug] ?? [];
  const gradient = sportGradients[slug] ?? sportGradients.default;

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
            <div className="flex items-center gap-2 mt-0.5">
              <span className="bg-white/20 text-white/80 rounded-full px-2 py-0.5 text-[10px] capitalize backdrop-blur-sm">
                {sportType}
              </span>
              {ageText && (
                <span className="text-white/70 text-xs">{ageText}</span>
              )}
            </div>
          </div>
        </Link>
        <div className="flex flex-col gap-3 p-4">
          {shortDescription && (
            <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">{shortDescription}</p>
          )}
          {benefits.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {benefits.map((benefit) => (
                <Badge key={benefit} variant="secondary" className="text-[10px]">
                  {benefit}
                </Badge>
              ))}
            </div>
          )}
          <Button size="lg" className="w-full h-11 mt-1" asChild>
            <Link href={`/sports/${slug}`}>
              Explore {name}
            </Link>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
});
