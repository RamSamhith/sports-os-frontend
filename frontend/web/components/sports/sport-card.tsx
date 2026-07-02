'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { Card } from '@/components/ui/card';
import { CompareButton } from '@/components/academies/compare-button';
import { ease, duration } from '@/components/motion/constants';
import { Check } from 'lucide-react';
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

export const SportCard = React.memo(function SportCard({ sport }: { sport: Sport }) {
  const reduced = useReducedMotion();
  const { slug, name, sportType, coverImage, shortDescription, explorationGuidance, id } = sport;
  const imageSrc = coverImage ?? `/images/sports/${slug}.svg`;
  const initial = name.charAt(0);
  const ageRange = explorationGuidance?.ageSuitability;
  const ageText =
    ageRange?.min !== undefined && ageRange?.max !== undefined
      ? `Ages ${ageRange.min}–${ageRange.max}`
      : ageRange?.min !== undefined
        ? `Ages ${ageRange.min}+`
        : null;

  const benefits = sport.physicalBenefits?.slice(0, 3) ?? sportBenefits[slug] ?? [];

  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -3, scale: 1.005 }}
      whileTap={reduced ? undefined : { scale: 0.995 }}
      transition={{ duration: duration.fast, ease: ease.athletic }}
      className="w-full"
    >
      <Card className="group flex flex-col gap-3 p-4 hover:border-foreground/25">
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
              <h3 className="line-clamp-1 text-base font-semibold tracking-tight">{name}</h3>
            </Link>
            <div className="text-muted-foreground text-xs capitalize">{sportType}</div>
          </div>
          <CompareButton
            entityType="sport"
            slug={slug}
            label={name}
            sublabel={sportType}
            href={`/sports/${slug}`}
          />
        </div>
        {shortDescription ? (
          <Link
            href={`/sports/${slug}`}
            className="text-muted-foreground line-clamp-2 text-xs text-pretty hover:text-foreground/80"
          >
            {shortDescription}
          </Link>
        ) : null}
        {benefits.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {benefits.map((benefit) => (
              <span key={benefit} className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Check className="h-3 w-3 text-primary/70" />
                {benefit}
              </span>
            ))}
          </div>
        )}
        {ageText ? (
          <span className="text-muted-foreground text-[10px] tracking-widest uppercase">
            {ageText}
          </span>
        ) : null}
      </Card>
    </motion.div>
  );
});
