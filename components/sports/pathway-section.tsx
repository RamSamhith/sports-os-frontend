'use client';

import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { CompetitionChip } from '@/components/sports/competition-chip';
import { CompetitionDetail } from '@/components/sports/competition-detail';
import type { Competition } from '@/types/domain/competition';

interface PathwaySectionProps {
  sportSlug: string;
  sportName: string;
  competitions: Competition[];
}

/**
 * PathwaySection — the "Education / Discoverability" panel.
 *
 * Shows:
 *   - A one-line intro about the pathway.
 *   - A helper text "Tap a competition to learn more."
 *   - Compact competition chips grouped by level (district / state / national / international).
 *
 * Tapping a chip opens a side panel on desktop or a bottom sheet on
 * mobile. The user never navigates away from the sport page.
 */
export function PathwaySection({ sportSlug, sportName, competitions }: PathwaySectionProps) {
  const [openCompetition, setOpenCompetition] = React.useState<Competition | null>(null);

  if (competitions.length === 0) {
    return (
      <div className="border-border/60 bg-card/40 rounded-xl border border-dashed p-6 text-center">
        <p className="text-muted-foreground text-sm">Pathway information coming soon.</p>
      </div>
    );
  }

  const grouped: Array<{ level: 'state' | 'national' | 'international'; items: Competition[] }> = [
    { level: 'state', items: competitions.filter((c) => c.level === 'state') },
    { level: 'national', items: competitions.filter((c) => c.level === 'national') },
    { level: 'international', items: competitions.filter((c) => c.level === 'international') },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1.5">
        <div className="text-muted-foreground text-[10px] tracking-widest uppercase">
          {sportName} Pathway
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Understand the competitions and milestones that help players progress.
        </h2>
        <p className="text-muted-foreground text-sm text-pretty">
          Tap a competition to learn more.
        </p>
      </header>

      {grouped.map((group) => (
        <section key={group.level} className="flex flex-col gap-3">
          <div className="text-muted-foreground text-[10px] tracking-widest uppercase">
            {group.level === 'state'
              ? 'State level'
              : group.level === 'national'
                ? 'National level'
                : 'International level'}
          </div>
          <div className="flex flex-wrap gap-2">
            {group.items.map((c) => (
              <CompetitionChip key={c.id} competition={c} onOpen={setOpenCompetition} />
            ))}
          </div>
        </section>
      ))}

      <div className="border-border/60 mt-2 flex flex-col gap-2 border-t pt-5">
        <p className="text-muted-foreground text-xs">
          Looking for a {sportName.toLowerCase()} academy or coach?
        </p>
        <div className="flex flex-wrap gap-2">
          <ExploreLink href={`/academies?sport=${sportSlug}`} label={`Explore ${sportName} Academies`} />
          <ExploreLink href={`/coaches?sport=${sportSlug}`} label={`Explore ${sportName} Coaches`} />
        </div>
      </div>

      <CompetitionDetail
        competition={openCompetition}
        onClose={() => setOpenCompetition(null)}
      />
    </div>
  );
}

function ExploreLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="motion-press group/explore border-border bg-card text-foreground hover:border-foreground/30 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium"
    >
      <span>{label}</span>
      <ChevronRight
        aria-hidden
        className="h-3.5 w-3.5 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-spring)] group-hover/explore:translate-x-0.5"
      />
    </Link>
  );
}
