'use client';

import * as React from 'react';
import Link from 'next/link';
import { X, Plus, ChevronDown, ChevronRight, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { cn } from '@/lib/utils/cn';
import { sportsCatalog, type CatalogSport } from '@/data/sports-catalog';
import { sportsContent } from '@/data/sports-content';

interface ComparisonRow {
  label: string;
  getValue: (sport: CatalogSport) => string | React.ReactNode;
}

const comparisonRows: ComparisonRow[] = [
  {
    label: 'Category',
    getValue: (s) => s.category,
  },
  {
    label: 'Type',
    getValue: (s) => s.sportType === 'both' ? 'Individual & Team' : s.sportType.charAt(0).toUpperCase() + s.sportType.slice(1),
  },
  {
    label: 'Olympic',
    getValue: (s) => s.olympicSport ? 'Yes' : 'No',
  },
  {
    label: 'Beginner Friendly',
    getValue: (s) => s.beginnerFriendly ? 'Yes' : 'No',
  },
  {
    label: 'Fitness Required',
    getValue: (s) => s.fitnessLevelRequired,
  },
  {
    label: 'Difficulty',
    getValue: (s) => {
      const sc = sportsContent[s.slug];
      return sc?.beginnerDifficulty ?? 'N/A';
    },
  },
  {
    label: 'Monthly Cost',
    getValue: (s) => {
      const sc = sportsContent[s.slug];
      return sc?.estimatedMonthlyCost ?? 'N/A';
    },
  },
  {
    label: 'Training',
    getValue: (s) => {
      const sc = sportsContent[s.slug];
      return sc?.trainingFrequency ?? 'N/A';
    },
  },
  {
    label: 'Learning Time',
    getValue: (s) => {
      const sc = sportsContent[s.slug];
      return sc?.averageLearningTime ?? 'N/A';
    },
  },
  {
    label: 'Injury Risk',
    getValue: (s) => {
      const sc = sportsContent[s.slug];
      return sc?.injuryRisk ?? 'N/A';
    },
  },
  {
    label: 'Season',
    getValue: (s) => {
      const sc = sportsContent[s.slug];
      return sc?.playingSeason ?? 'N/A';
    },
  },
  {
    label: 'Suitable For',
    getValue: (s) => s.suitableFor.join(', '),
  },
  {
    label: 'Key Skills',
    getValue: (s) => {
      const sc = sportsContent[s.slug];
      if (!sc?.skills) return 'N/A';
      return (
        <ul className="space-y-0.5">
          {sc.skills.slice(0, 3).map((sk) => (
            <li key={sk} className="text-xs">• {sk}</li>
          ))}
        </ul>
      );
    },
  },
  {
    label: 'Major Tournaments',
    getValue: (s) => {
      const sc = sportsContent[s.slug];
      if (!sc?.majorTournaments) return 'N/A';
      return sc.majorTournaments.slice(0, 2).join(', ');
    },
  },
];

export function SportComparison() {
  const [selectedSlugs, setSelectedSlugs] = React.useState<string[]>([]);
  const [selectorOpen, setSelectorOpen] = React.useState(false);
  const [selectorSlot, setSelectorSlot] = React.useState<number>(0);

  const selectedSports = selectedSlugs
    .map((slug) => sportsCatalog.find((s) => s.slug === slug))
    .filter(Boolean) as CatalogSport[];

  function addSport(slug: string) {
    if (selectedSlugs.length < 3 && !selectedSlugs.includes(slug)) {
      setSelectedSlugs((prev) => [...prev, slug]);
    }
    setSelectorOpen(false);
  }

  function removeSport(slug: string) {
    setSelectedSlugs((prev) => prev.filter((s) => s !== slug));
  }

  const availableSports = sportsCatalog.filter((s) => !selectedSlugs.includes(s.slug));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Compare Sports</h2>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Select up to 3 sports to see side-by-side differences
          </p>
        </div>
        {selectedSlugs.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedSlugs([])}
            className="text-muted-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Sport Selector Slots */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => {
          const sport = selectedSports[i];
          if (sport) {
            const sc = sportsContent[sport.slug];
            return (
              <div
                key={sport.slug}
                className="border-border/40 bg-card/40 relative rounded-xl border p-4 transition-all hover:border-foreground/20"
              >
                <button
                  onClick={() => removeSport(sport.slug)}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="bg-muted/40 relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                    <ImageWithFallback
                      src={`/images/sports/${sport.slug}.svg`}
                      alt={sport.name}
                      fill
                      sizes="40px"
                      className="object-contain p-1"
                      fallback={
                        <div className="bg-primary/10 flex h-full w-full items-center justify-center text-xs font-semibold text-primary">
                          {sport.name.charAt(0)}
                        </div>
                      }
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{sport.name}</p>
                    <p className="text-muted-foreground text-xs truncate">{sc?.tagline?.slice(0, 50) ?? sport.category}</p>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <button
              key={i}
              onClick={() => { setSelectorSlot(i); setSelectorOpen(true); }}
              className="border-border/40 border-dashed bg-muted/20 flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-6 text-center transition-colors hover:border-primary/40 hover:bg-muted/30"
            >
              <div className="bg-muted/50 grid h-10 w-10 place-items-center rounded-full">
                <Plus className="text-muted-foreground h-5 w-5" />
              </div>
              <span className="text-muted-foreground text-xs">Select sport</span>
            </button>
          );
        })}
      </div>

      {/* Sport Selector Modal */}
      {selectorOpen && (
        <div className="border-border/40 bg-card/95 fixed inset-x-4 top-20 z-50 mx-auto max-w-lg rounded-xl border p-4 shadow-2xl backdrop-blur-sm sm:inset-x-auto sm:w-full">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold">Choose a sport</span>
            <button onClick={() => setSelectorOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {availableSports.map((sport) => (
                <button
                  key={sport.slug}
                  onClick={() => addSport(sport.slug)}
                  className="flex items-center gap-2 rounded-lg border p-2.5 text-left transition-colors hover:border-foreground/20 hover:bg-muted/30"
                >
                  <div className="bg-muted/40 relative h-8 w-8 shrink-0 overflow-hidden rounded-md">
                    <ImageWithFallback
                      src={`/images/sports/${sport.slug}.svg`}
                      alt={sport.name}
                      fill
                      sizes="32px"
                      className="object-contain p-0.5"
                      fallback={
                        <div className="bg-primary/10 flex h-full w-full items-center justify-center text-[10px] font-semibold text-primary">
                          {sport.name.charAt(0)}
                        </div>
                      }
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{sport.name}</p>
                    <p className="text-muted-foreground text-[10px] truncate">{sport.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {selectedSports.length >= 2 && (
        <div className="border-border/40 overflow-hidden rounded-xl border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-border/40 border-b bg-muted/20">
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground w-32">Feature</th>
                  {selectedSports.map((sport) => (
                    <th key={sport.slug} className="p-3 text-left text-xs font-medium">
                      <Link href={`/sports/${sport.slug}`} className="hover:underline">
                        {sport.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.label}
                    className={cn(
                      'border-border/40 border-b last:border-b-0 transition-colors hover:bg-muted/10',
                      i % 2 === 0 ? 'bg-muted/5' : ''
                    )}
                  >
                    <td className="p-3 text-xs font-medium text-muted-foreground">{row.label}</td>
                    {selectedSports.map((sport) => (
                      <td key={sport.slug} className="p-3 text-sm">
                        {row.getValue(sport)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedSports.length < 2 && (
        <div className="border-border/40 bg-muted/20 flex flex-col items-center gap-3 rounded-xl border border-dashed p-8 text-center">
          <ArrowLeftRight className="text-muted-foreground h-8 w-8" />
          <p className="text-muted-foreground text-sm">
            Select at least 2 sports to compare them side by side
          </p>
        </div>
      )}
    </div>
  );
}
