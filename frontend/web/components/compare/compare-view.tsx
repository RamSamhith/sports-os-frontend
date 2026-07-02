'use client';

import * as React from 'react';
import Link from 'next/link';
import { GitCompare, X, Star } from 'lucide-react';
import { CompareTableSkeleton } from '@/components/feedback/skeletons';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AcademyImage } from '@/components/ui/academy-image';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { EmptyState } from '@/components/feedback/empty-state';
import { VerifiedBadge } from '@/components/trust/verified-badge';
import { useCompare } from '@/lib/hooks/use-compare';
import { ProtectedLink } from '@/components/auth/protected-link';
import { cn } from '@/lib/utils/cn';
import { getAcademy } from '@/lib/api/academies';
import { getCoach } from '@/lib/api/coaches';
import { getSport } from '@/lib/api/sports';
import type { Academy } from '@/types/domain/academy';
import type { Coach } from '@/types/domain/coach';
import type { Sport } from '@/types/domain/sport';
import { sportsContent } from '@/data/sports-content';

type Entity =
  | { kind: 'academy'; entity: Academy }
  | { kind: 'coach'; entity: Coach }
  | { kind: 'sport'; entity: Sport };

const cardGridClassFor: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
};

export function CompareView() {
  const { items, remove, clear, maxItems, minItems, hydrated } = useCompare();
  const [resolved, setResolved] = React.useState<Entity[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [failedCount, setFailedCount] = React.useState(0);

  React.useEffect(() => {
    if (!hydrated || items.length === 0) {
      setResolved([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function resolveAll() {
      const results: Entity[] = [];
      let failures = 0;
      await Promise.all(
        items.map(async (it) => {
          try {
            if (it.entityType === 'academy') {
              const res = await getAcademy(it.id);
              if (!cancelled && res.ok) results.push({ kind: 'academy', entity: res.data });
              else if (!cancelled && !res.ok) failures++;
            } else if (it.entityType === 'coach') {
              const res = await getCoach(it.id);
              if (!cancelled && res.ok) results.push({ kind: 'coach', entity: res.data });
              else if (!cancelled && !res.ok) failures++;
            } else {
              const res = await getSport(it.id);
              if (!cancelled && res.ok) results.push({ kind: 'sport', entity: res.data });
              else if (!cancelled && !res.ok) failures++;
            }
          } catch {
            if (!cancelled) failures++;
          }
        })
      );
      if (!cancelled) {
        setResolved(results);
        setFailedCount(failures);
        setLoading(false);
      }
    }
    resolveAll();
    return () => { cancelled = true; };
  }, [items, hydrated]);

  if (!hydrated || loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Compare</h1>
        </div>
        <CompareTableSkeleton />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Compare</h1>
          <p className="text-muted-foreground text-sm">
            Side-by-side comparison of up to {maxItems} items.
          </p>
        </header>
        <EmptyState
          icon={<GitCompare className="h-5 w-5" />}
          title="Start building your comparison"
          description="Browse academies, coaches, or sports and tap the compare icon to add them here. You'll see them side by side."
          action={
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/academies">Explore Academies</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/coaches">Find Coaches</Link>
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  const count = Math.max(1, Math.min(maxItems, resolved.length));
  const cardGrid = cardGridClassFor[count];
  const belowMinimum = resolved.length < minItems;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Compare</h1>
        <p className="text-muted-foreground text-sm">
          Side-by-side comparison of {maxItems === Infinity ? 'unlimited' : `up to ${maxItems}`} items.
        </p>
      </header>

      {belowMinimum ? (
        <div className="border-info/30 bg-info/10 text-info-foreground/90 rounded-lg border px-3 py-2 text-sm" role="status">
          Add at least {minItems} items to see the side-by-side comparison.
        </div>
      ) : null}

      {failedCount > 0 ? (
        <div className="border-destructive/30 bg-destructive/10 text-destructive-foreground/90 rounded-lg border px-3 py-2 text-sm" role="alert">
          {failedCount} item{failedCount > 1 ? 's' : ''} could not be loaded and were skipped.
        </div>
      ) : null}

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {resolved.length} of {maxItems === Infinity ? 'unlimited' : maxItems} selected
        </p>
        <Button variant="ghost" className="min-h-[44px] min-w-[44px]" onClick={() => { clear(); toast('Cleared compare'); }} aria-label="Clear all compare items">
          <X className="h-4 w-4" /> Clear all
        </Button>
      </div>

      <div className={cn('grid items-start gap-4', cardGrid)}>
        {resolved.map((slot) => (
          <CompareCard
            key={`${slot.kind}-${slot.entity.id}`}
            slot={slot}
            onRemove={() => {
              const name = slot.kind === 'sport' ? (slot.entity as Sport).name : (slot.entity as Academy | Coach).name;
              remove(slot.kind, slot.entity.id);
              toast(`Removed ${name} from compare`);
            }}
          />
        ))}
      </div>

      {resolved.length >= minItems ? <ComparisonTable slots={resolved} /> : null}
    </div>
  );
}

function CompareCard({ slot, onRemove }: { slot: Entity; onRemove: () => void }) {
  const { kind, entity } = slot;
  const href = kind === 'academy' ? `/academies/${(entity as Academy).slug}` : kind === 'coach' ? `/coaches/${(entity as Coach).slug}` : `/sports/${(entity as Sport).slug}`;
  const imageSrc = kind === 'coach' ? ((entity as Coach).avatar ?? '') : kind === 'sport' ? ((entity as Sport).coverImage ?? '') : '';
  const sublabel = kind === 'academy' ? `${(entity as Academy).location.city}, ${(entity as Academy).location.state}` : kind === 'coach' ? `${(entity as Coach).location.city} · ${(entity as Coach).experienceYears}+ yrs` : (entity as Sport).category;

  return (
    <Card className="overflow-hidden">
      <div className="bg-muted/40 relative aspect-[16/10] w-full">
        {kind === 'academy' ? (
          <AcademyImage
            coverImage={(entity as Academy).coverImage}
            slug={(entity as Academy).slug}
            sportsOffered={(entity as Academy).sportsOffered}
            name={(entity as Academy).name}
            alt={`${sublabel} cover`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <ImageWithFallback src={imageSrc} alt={`${sublabel} cover`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        )}
        {kind !== 'sport' ? (
          <div className="absolute top-3 left-3">
            <VerifiedBadge status={(entity as Academy | Coach).verificationStatus} />
          </div>
        ) : null}
        <button type="button" onClick={onRemove} className="bg-card/90 hover:bg-card text-foreground focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none absolute top-3 right-3 grid h-11 w-11 place-items-center rounded-full shadow" aria-label={`Remove ${kind} from compare`}>
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <CardContent className="flex flex-col gap-2 p-4">
        <Link href={href} className="hover:underline">
          <h3 className="line-clamp-1 font-semibold">{kind === 'sport' ? (entity as Sport).name : (entity as Academy | Coach).name}</h3>
        </Link>
        <p className="text-muted-foreground line-clamp-1 text-xs capitalize">{sublabel}</p>
        {(kind === 'academy' || kind === 'coach') && (
          <div className="flex items-center gap-1 text-xs">
            <Star aria-hidden className="fill-rating text-rating h-3.5 w-3.5" />
            <span className="font-semibold">{((entity as Academy | Coach).rating?.average ?? 0).toFixed(1)}</span>
            <span className="text-muted-foreground">({((entity as Academy | Coach).rating?.count ?? 0)})</span>
          </div>
        )}
        <div className="flex flex-wrap gap-2 pt-1">
          <Button size="sm" variant="default" className="min-h-[44px]" asChild><Link href={href}>View Details</Link></Button>
          {kind !== 'sport' && (
            <Button size="sm" variant="outline" className="min-h-[44px]" asChild><ProtectedLink href={`/enquiry/${kind}/${(entity as Academy | Coach).slug}`}>Enquire</ProtectedLink></Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ComparisonRow {
  key: string;
  label: string;
  values: Array<string | React.ReactNode>;
  type?: 'numeric' | 'text' | 'status';
}

function getHighlightClass(row: ComparisonRow, index: number): string {
  if (row.type === 'numeric') {
    const nums = row.values
      .map((v) => (typeof v === 'string' ? parseFloat(v) : NaN))
      .filter((n) => !isNaN(n));
    if (nums.length < 2) return '';
    const val = parseFloat(typeof row.values[index] === 'string' ? row.values[index] as string : '');
    if (isNaN(val)) return '';
    const max = Math.max(...nums);
    const min = Math.min(...nums);
    if (max === min) return 'bg-muted/30';
    if (val === max) return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
    if (val === min) return 'bg-red-500/10 text-red-700 dark:text-red-400';
    return 'bg-amber-500/10 text-amber-700 dark:text-amber-400';
  }
  if (row.type === 'status') {
    const val = typeof row.values[index] === 'string' ? row.values[index] as string : '';
    if (val === 'verified') return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
    if (val === 'rejected') return 'bg-red-500/10 text-red-700 dark:text-red-400';
    if (val === 'pending' || val === 'submitted' || val === 'under_review') return 'bg-amber-500/10 text-amber-700 dark:text-amber-400';
    return '';
  }
  if (row.type === 'text') {
    const val = typeof row.values[index] === 'string' ? row.values[index] as string : '';
    if (!val || val === '—') return 'text-muted-foreground';
    return 'font-medium';
  }
  return '';
}

function ComparisonTable({ slots }: { slots: Entity[] }) {
  const rows: ComparisonRow[] = [];
  const anyAcademy = slots.some((s) => s.kind === 'academy');
  const anyCoach = slots.some((s) => s.kind === 'coach');
  const anySport = slots.some((s) => s.kind === 'sport');

  const allSportSlugs = slots
    .filter((s) => s.kind === 'sport')
    .map((s) => (s.entity as Sport).slug);

  const sportsContentData = React.useMemo(() => {
    const slugs = slots
      .filter((s) => s.kind === 'sport')
      .map((s) => (s.entity as Sport).slug);
    return slugs.map((slug) => sportsContent[slug]).filter(Boolean);
  }, [slots]);

  if (anyAcademy || anyCoach) {
    rows.push({ key: 'rating', label: 'Rating', type: 'numeric', values: slots.map((s) => s.kind === 'sport' ? '—' : ((s.entity as Academy | Coach).rating?.average ?? 0).toFixed(1)) });
    rows.push({ key: 'verification', label: 'Verification', type: 'status', values: slots.map((s) => s.kind === 'sport' ? '—' : (s.entity as Academy | Coach).verificationStatus) });
    rows.push({ key: 'reviews', label: 'Reviews', type: 'numeric', values: slots.map((s) => s.kind === 'sport' ? '—' : `${(s.entity as Academy | Coach).rating?.count ?? 0}`) });
  }
  if (anySport) {
    rows.push({ key: 'category', label: 'Category', type: 'text', values: slots.map((s) => s.kind === 'sport' ? (s.entity as Sport).category : '—') });
    rows.push({ key: 'sportType', label: 'Sport Type', type: 'text', values: slots.map((s) => s.kind === 'sport' ? (s.entity as Sport).sportType || '—' : '—') });
    rows.push({ key: 'age', label: 'Age range', type: 'text', values: slots.map((s) => { if (s.kind !== 'sport') return '—'; const r = (s.entity as Sport).explorationGuidance?.ageSuitability; return r?.min !== undefined && r?.max !== undefined ? `${r.min}–${r.max}` : r?.min !== undefined ? `${r.min}+` : '—'; }) });
    rows.push({ key: 'difficulty', label: 'Difficulty', type: 'text', values: allSportSlugs.map((slug, i) => sportsContentData[i]?.beginnerDifficulty || '—') });
    rows.push({ key: 'fitness', label: 'Fitness Level', type: 'text', values: slots.map((s) => s.kind === 'sport' ? (s.entity as Sport).fitnessLevelRequired || '—' : '—') });
    rows.push({ key: 'olympic', label: 'Olympic Sport', type: 'text', values: allSportSlugs.map((slug, i) => sportsContentData[i]?.olympic ? 'Yes' : 'No') });
    rows.push({ key: 'indoorOutdoor', label: 'Indoor / Outdoor', type: 'text', values: slots.map((s) => s.kind === 'sport' ? ((s.entity as Sport).sportType ?? '—') : '—') });
    rows.push({ key: 'individualTeam', label: 'Individual / Team', type: 'text', values: allSportSlugs.map((slug, i) => sportsContentData[i]?.individualOrTeam || '—') });
    rows.push({ key: 'beginner', label: 'Beginner Friendly', type: 'text', values: slots.map((s) => s.kind === 'sport' ? ((s.entity as Sport).beginnerFriendly ? 'Yes' : 'No') : '—') });
    rows.push({ key: 'endurance', label: 'Endurance', type: 'text', values: slots.map((s) => s.kind === 'sport' ? 'Varies' : '—') });
    rows.push({ key: 'strength', label: 'Strength', type: 'text', values: slots.map((s) => s.kind === 'sport' ? 'Varies' : '—') });
    rows.push({ key: 'agility', label: 'Agility', type: 'text', values: slots.map((s) => s.kind === 'sport' ? 'Varies' : '—') });
    rows.push({ key: 'flexibility', label: 'Flexibility', type: 'text', values: slots.map((s) => s.kind === 'sport' ? 'Varies' : '—') });
    rows.push({ key: 'coordination', label: 'Coordination', type: 'text', values: slots.map((s) => s.kind === 'sport' ? 'Varies' : '—') });
    rows.push({ key: 'mentalFocus', label: 'Mental Focus', type: 'text', values: slots.map((s) => s.kind === 'sport' ? 'Varies' : '—') });
    rows.push({ key: 'reactionSpeed', label: 'Reaction Speed', type: 'text', values: slots.map((s) => s.kind === 'sport' ? 'Varies' : '—') });
    rows.push({ key: 'calories', label: 'Calories Burned', type: 'text', values: slots.map((s) => s.kind === 'sport' ? 'Varies' : '—') });
    rows.push({ key: 'equipment', label: 'Equipment Required', type: 'text', values: allSportSlugs.map((slug, i) => (sportsContentData[i]?.equipment ?? []).join(', ') || '—') });
    rows.push({ key: 'trainingFreq', label: 'Training Frequency', type: 'text', values: slots.map((s) => s.kind === 'sport' ? (s.entity as Sport).trainingFrequency || '—' : '—') });
    rows.push({ key: 'injuryRisk', label: 'Injury Risk', type: 'text', values: slots.map((s) => s.kind === 'sport' ? (s.entity as Sport).injuryRisk || '—' : '—') });
    rows.push({ key: 'competitionPath', label: 'Competition Path', type: 'text', values: allSportSlugs.map((slug, i) => {
      const comps = sportsContentData[i]?.competitions;
      if (!comps) return '—';
      const path = [];
      if (comps.state?.length) path.push('District/State');
      if (comps.national?.length) path.push('National');
      if (comps.international?.length) path.push('International');
      return path.join(' → ') || '—';
    })});
  }
  rows.push({ key: 'sports', label: 'Sports', type: 'text', values: slots.map((s) => s.kind === 'academy' ? (s.entity as Academy).sportsOffered?.join(', ') ?? '' : s.kind === 'coach' ? (s.entity as Coach).sportsCoached?.join(', ') ?? '' : (s.entity as Sport).name) });
  if (anyAcademy) {
    rows.push({ key: 'facilities', label: 'Facilities', type: 'text', values: slots.map((s) => s.kind === 'academy' ? (s.entity as Academy).facilities?.join(', ') ?? '' : '—') });
    rows.push({ key: 'levels', label: 'Training levels', type: 'text', values: slots.map((s) => s.kind === 'academy' ? (s.entity as Academy).trainingLevels?.join(', ') ?? '' : '—') });
  }
  if (anyCoach) {
    rows.push({ key: 'specialization', label: 'Specialisation', type: 'text', values: slots.map((s) => s.kind === 'coach' ? (s.entity as Coach).specialization?.join(', ') ?? '' : '—') });
  }
  if (anySport) {
    rows.push({ key: 'bestFor', label: 'Best For', type: 'text', values: allSportSlugs.map((slug, i) => {
      const ageR = (slots.find((s) => s.kind === 'sport')?.entity as Sport | undefined)?.explorationGuidance?.ageSuitability;
      const groups = [];
      if (!ageR || (ageR.min ?? 0) <= 12) groups.push('Kids');
      if (!ageR || (ageR.min ?? 0) <= 18) groups.push('Students');
      if (!ageR || (ageR.max ?? 99) >= 18) groups.push('Adults');
      const content = sportsContentData[i];
      if (content?.careerOpportunities?.length) groups.push('Professionals');
      const benefits = content?.benefits;
      if (benefits?.physical?.length) groups.push('Fitness');
      return groups.join(', ') || 'All ages';
    })});
  }

  return (
    <div className="border-border bg-card mt-4 overflow-x-auto rounded-xl border" role="region" aria-label="Comparison details">
      <table className="w-full min-w-[640px] text-sm" style={{ tableLayout: 'auto' }}>
        <thead className="bg-card sticky top-0 z-[1]">
          <tr className="border-border border-b">
            <th scope="col" className="text-muted-foreground bg-card p-3 text-left text-xs font-medium tracking-widest uppercase">Attribute</th>
            {slots.map((s) => (
              <th key={`${s.kind}-${s.entity.id}-h`} scope="col" className="bg-card p-3 text-left text-xs font-semibold">{s.entity.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-border/40 border-b last:border-0">
              <th scope="row" className="text-muted-foreground p-3 text-left text-xs tracking-wide uppercase">{row.label}</th>
              {row.values.map((v, i) => (
                <td key={`${row.key}-${i}`} className={`p-3 align-top text-sm ${getHighlightClass(row, i)}`}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
