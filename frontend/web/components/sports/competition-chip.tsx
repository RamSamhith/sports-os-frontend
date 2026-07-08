'use client';

import * as React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { Competition, CompetitionLevel } from '@/types/domain/competition';

const levelLabel: Record<CompetitionLevel, string> = {
  district: 'District',
  state: 'State',
  national: 'National',
  international: 'International',
};

const levelStyles: Record<CompetitionLevel, string> = {
  district: 'border-border/60 bg-muted/50 text-muted-foreground',
  state: 'border-info/30 bg-info/10 text-info',
  national: 'border-primary/30 bg-primary/10 text-primary',
  international: 'border-warning/30 bg-warning/10 text-warning',
};

/**
 * CompetitionChip — a compact, premium, clickable chip for a single
 * competition. Tapping opens the competition detail panel.
 *
 * The arrow is part of the affordance — it nudges forward by 1 px on
 * hover so the user immediately knows "this opens something".
 */
export function CompetitionChip({
  competition,
  onOpen,
}: {
  competition: Competition;
  onOpen: (c: Competition) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(competition)}
      aria-label={`Open details for ${competition.name}`}
      className={cn(
        'group/competition motion-press inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-left text-xs font-medium',
        levelStyles[competition.level],
        'hover:border-foreground/30',
      )}
    >
      <span className="text-foreground/90 whitespace-nowrap">{competition.name}</span>
      <span
        aria-hidden
        className="text-muted-foreground/80 inline-flex h-3.5 w-3.5 items-center justify-center transition-transform duration-[var(--duration-fast)] ease-[var(--ease-spring)] group-hover/competition:translate-x-0.5 group-hover/competition:-translate-y-0.5"
      >
        <ArrowUpRight className="h-3 w-3" />
      </span>
    </button>
  );
}

export function CompetitionLevelTag({ level }: { level: CompetitionLevel }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase',
        levelStyles[level],
      )}
    >
      {levelLabel[level]}
    </span>
  );
}
