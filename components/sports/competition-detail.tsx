'use client';

import * as React from 'react';
import { ArrowUpRight, X, Building2, Layers, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerPanel,
} from '@/components/ui/drawer';
import { CompetitionLevelTag } from '@/components/sports/competition-chip';
import type { Competition } from '@/types/domain/competition';

interface CompetitionDetailProps {
  competition: Competition | null;
  onClose: () => void;
}

/**
 * CompetitionDetail — opens a side panel on desktop and a bottom sheet
 * on mobile. Uses the existing `Drawer` primitive, which renders
 * Sheet with the right side on `md+` and bottom on mobile.
 *
 * The user never navigates away from the sport page. The panel answers
 * the five questions promised in the spec:
 *   1. What is it?
 *   2. What level is it?
 *   3. Who organises it?
 *   4. Why is it important?
 *   5. How does it help athlete progression?
 */
export function CompetitionDetail({ competition, onClose }: CompetitionDetailProps) {
  const open = competition !== null;

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent
        side="right"
        className="bg-card text-card-foreground border-border/70 w-full border-l p-0 sm:max-w-md"
      >
        {competition ? <CompetitionDetailBody competition={competition} onClose={onClose} /> : null}
      </DrawerContent>
    </Drawer>
  );
}

function CompetitionDetailBody({
  competition,
  onClose,
}: {
  competition: Competition;
  onClose: () => void;
}) {
  return (
    <DrawerPanel className="gap-0 p-0">
      <header className="border-border/60 sticky top-0 z-[var(--z-sticky)] flex items-center justify-between gap-2 border-b bg-card/95 px-5 py-4 backdrop-blur-md">
        <div className="min-w-0 flex-1">
          <div className="text-muted-foreground text-[10px] tracking-widest uppercase">
            Competition
          </div>
          <h2 className="text-foreground truncate text-lg font-semibold tracking-tight">
            {competition.name}
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Close competition details"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </header>

      <div className="flex flex-col gap-5 p-5 pb-24">
        <div className="flex flex-wrap items-center gap-2">
          <CompetitionLevelTag level={competition.level} />
          <span className="text-muted-foreground text-xs">Tap a level to learn more</span>
        </div>

        <DetailRow
          icon={<Sparkles className="h-3.5 w-3.5" />}
          label="What is it?"
          body={competition.whatIs}
        />
        <DetailRow
          icon={<TrendingUp className="h-3.5 w-3.5" />}
          label="Why is it important?"
          body={competition.whyImportant}
        />
        <DetailRow
          icon={<ArrowUpRight className="h-3.5 w-3.5" />}
          label="How does it help progression?"
          body={competition.progression}
        />
        <DetailRow
          icon={<Building2 className="h-3.5 w-3.5" />}
          label="Who organises it?"
          body={competition.organiser}
        />
        <DetailRow
          icon={<Layers className="h-3.5 w-3.5" />}
          label="Level"
          body={
            competition.level === 'district'
              ? 'District-level competition — the local entry point to the pathway.'
              : competition.level === 'state'
                ? 'State-level competition — a key selection filter for national squads.'
                : competition.level === 'national'
                  ? 'National-level competition — direct selection implications for India squads.'
                  : 'International competition — top of the global pathway.'
          }
        />
      </div>
    </DrawerPanel>
  );
}

function DetailRow({
  icon,
  label,
  body,
}: {
  icon: React.ReactNode;
  label: string;
  body: string;
}) {
  return (
    <section className="flex flex-col gap-1.5">
      <div className="text-muted-foreground inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase">
        <span className="text-foreground/80">{icon}</span>
        {label}
      </div>
      <p className="text-foreground text-sm leading-relaxed text-pretty">{body}</p>
    </section>
  );
}
