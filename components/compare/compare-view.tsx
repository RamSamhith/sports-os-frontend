'use client';

import * as React from 'react';
import Link from 'next/link';
import { GitCompare, X, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { EmptyState } from '@/components/feedback/empty-state';
import { VerifiedBadge } from '@/components/trust/verified-badge';
import { fixtureImages } from '@/lib/images';
import { useCompare } from '@/lib/hooks/use-compare';
import { cn } from '@/lib/utils/cn';
import { academiesById, academiesBySlug } from '@/data/academies';
import { coachesById, coachesBySlug } from '@/data/coaches';
import { sportsById, sportsBySlug } from '@/data/sports';
import type { Academy } from '@/types/domain/academy';
import type { Coach } from '@/types/domain/coach';
import type { Sport } from '@/types/domain/sport';

type Entity =
  | { kind: 'academy'; entity: Academy }
  | { kind: 'coach'; entity: Coach }
  | { kind: 'sport'; entity: Sport };

function resolve(entityType: 'academy' | 'coach' | 'sport', id: string): Entity | null {
  if (entityType === 'academy') {
    const a = academiesById(id) ?? academiesBySlug(id);
    return a ? { kind: 'academy', entity: a } : null;
  }
  if (entityType === 'coach') {
    const c = coachesById(id) ?? coachesBySlug(id);
    return c ? { kind: 'coach', entity: c } : null;
  }
  const s = sportsById(id) ?? sportsBySlug(id);
  return s ? { kind: 'sport', entity: s } : null;
}

/** Grid columns for the side-by-side cards. We expose one Tailwind class
 *  per count so the JIT engine can see them. `count` is clamped to 1–4. */
const cardGridClassFor: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
};

export function CompareView() {
  const { items, remove, clear, maxItems, minItems, hydrated } = useCompare();

  if (!hydrated) {
    return (
      <div className="bg-muted/30 h-40 animate-pulse rounded-xl border border-dashed" aria-hidden />
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<GitCompare className="h-5 w-5" />}
        title="Nothing to compare yet"
        description="Tap the compare button on any academy, coach, or sport to add them here."
        action={
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/academies">Explore Academies</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/coaches">Explore Coaches</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/sports">Explore Sports</Link>
            </Button>
          </div>
        }
      />
    );
  }

  const resolved = items
    .map((it) => resolve(it.entityType, it.id))
    .filter((x): x is Entity => x !== null);

  // The actual number of items in the comparison. Clamped so the grid
  // class lookup never returns undefined.
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
        <div
          className="border-info/30 bg-info/10 text-info-foreground/90 rounded-lg border px-3 py-2 text-sm"
          role="status"
        >
          Add at least {minItems} items to see the side-by-side comparison.
        </div>
      ) : null}

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {resolved.length} of {maxItems} selected
        </p>
        <Button
          variant="ghost"
          className="min-h-[44px] min-w-[44px]"
          onClick={() => {
            clear();
            toast('Cleared compare');
          }}
          aria-label="Clear all compare items"
        >
          <X className="h-4 w-4" /> Clear all
        </Button>
      </div>

      <div className={cn('grid items-start gap-4', cardGrid)}>
        {resolved.map((slot) => (
          <CompareCard
            key={`${slot.kind}-${slot.entity.id}`}
            slot={slot}
            onRemove={() => {
              const name =
                slot.kind === 'sport'
                  ? (slot.entity as Sport).name
                  : (slot.entity as Academy | Coach).name;
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
  const href =
    kind === 'academy'
      ? `/academies/${(entity as Academy).slug}`
      : kind === 'coach'
        ? `/coaches/${(entity as Coach).slug}`
        : `/sports/${(entity as Sport).slug}`;
  const imageSrc =
    kind === 'academy'
      ? ((entity as Academy).coverImage ?? fixtureImages.academies[(entity as Academy).id])
      : kind === 'coach'
        ? ((entity as Coach).avatar ?? fixtureImages.coaches[(entity as Coach).id])
        : ((entity as Sport).coverImage ?? fixtureImages.sports[(entity as Sport).id]);
  const sublabel =
    kind === 'academy'
      ? `${(entity as Academy).location.city}, ${(entity as Academy).location.state}`
      : kind === 'coach'
        ? `${(entity as Coach).location.city} · ${(entity as Coach).experienceYears}+ yrs`
        : (entity as Sport).category;

  return (
    <Card className="overflow-hidden">
      <div className="bg-muted/40 relative aspect-[16/10] w-full">
        <ImageWithFallback
          src={imageSrc}
          alt={`${sublabel} cover`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        {kind !== 'sport' ? (
          <div className="absolute top-3 left-3">
            <VerifiedBadge status={(entity as Academy | Coach).verificationStatus} />
          </div>
        ) : null}
        <button
          type="button"
          onClick={onRemove}
          className="bg-card/90 hover:bg-card text-foreground focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full shadow"
          aria-label={`Remove ${kind} from compare`}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <CardContent className="flex flex-col gap-2 p-4">
        <Link href={href} className="hover:underline">
          <h3 className="line-clamp-1 font-semibold">
            {kind === 'sport' ? (entity as Sport).name : (entity as Academy | Coach).name}
          </h3>
        </Link>
        <p className="text-muted-foreground line-clamp-1 text-xs capitalize">{sublabel}</p>
        {kind === 'academy' ? (
          <div className="flex items-center gap-1 text-xs">
            <Star aria-hidden className="fill-rating text-rating h-3.5 w-3.5" />
            <span className="font-semibold">{(entity as Academy).rating.average.toFixed(1)}</span>
            <span className="text-muted-foreground">({(entity as Academy).rating.count})</span>
          </div>
        ) : null}
        {kind === 'coach' ? (
          <div className="flex items-center gap-1 text-xs">
            <Star aria-hidden className="fill-rating text-rating h-3.5 w-3.5" />
            <span className="font-semibold">{(entity as Coach).rating.average.toFixed(1)}</span>
            <span className="text-muted-foreground">({(entity as Coach).rating.count})</span>
          </div>
        ) : null}
        {kind === 'academy' && (
          <div className="flex gap-2 pt-1">
            <Button size="sm" variant="default" asChild className="h-7 text-xs">
              <Link href={href}>View Details</Link>
            </Button>
            <Button size="sm" variant="outline" asChild className="h-7 text-xs">
              <Link href={`/enquiry/academy/${(entity as Academy).slug}`}>Enquire Now</Link>
            </Button>
          </div>
        )}
        {kind === 'coach' && (
          <div className="flex gap-2 pt-1">
            <Button size="sm" variant="default" asChild className="h-7 text-xs">
              <Link href={href}>View Coach</Link>
            </Button>
            <Button size="sm" variant="outline" asChild className="h-7 text-xs">
              <Link href={`/enquiry/coach/${(entity as Coach).slug}`}>Enquire Now</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ComparisonRow {
  key: string;
  label: string;
  values: Array<string | React.ReactNode>;
}

function ComparisonTable({ slots }: { slots: Entity[] }) {
  const rows: ComparisonRow[] = [];

  const anyAcademyOrCoach = slots.some((s) => s.kind === 'academy' || s.kind === 'coach');
  const anyAcademy = slots.some((s) => s.kind === 'academy');
  const anyCoach = slots.some((s) => s.kind === 'coach');
  const anySport = slots.some((s) => s.kind === 'sport');

  if (anyAcademyOrCoach) {
    rows.push({
      key: 'rating',
      label: 'Rating',
      values: slots.map((s) => {
        if (s.kind === 'sport') return '—';
        return (s.entity as Academy | Coach).rating.average.toFixed(1);
      }),
    });
    rows.push({
      key: 'verification',
      label: 'Verification',
      values: slots.map((s) => {
        if (s.kind === 'sport') return '—';
        return (s.entity as Academy | Coach).verificationStatus === 'verified'
          ? 'Verified'
          : (s.entity as Academy | Coach).verificationStatus === 'pending'
            ? 'Pending'
            : 'Rejected';
      }),
    });
  }

  if (anySport) {
    rows.push({
      key: 'category',
      label: 'Category',
      values: slots.map((s) => (s.kind === 'sport' ? (s.entity as Sport).category : '—')),
    });
    rows.push({
      key: 'age',
      label: 'Age range',
      values: slots.map((s) => {
        if (s.kind !== 'sport') return '—';
        const r = (s.entity as Sport).explorationGuidance?.ageSuitability;
        if (r?.min !== undefined && r?.max !== undefined) return `${r.min}–${r.max}`;
        if (r?.min !== undefined) return `${r.min}+`;
        return '—';
      }),
    });
  }

  rows.push({
    key: 'sports',
    label: 'Sports',
    values: slots.map((s) => {
      if (s.kind === 'academy') return (s.entity as Academy).sportsOffered.join(', ');
      if (s.kind === 'coach') return (s.entity as Coach).sportsCoached.join(', ');
      return (s.entity as Sport).name;
    }),
  });

  if (anyAcademy) {
    rows.push({
      key: 'facilities',
      label: 'Facilities',
      values: slots.map((s) =>
        s.kind === 'academy' ? (s.entity as Academy).facilities.join(', ') : '—',
      ),
    });
    rows.push({
      key: 'levels',
      label: 'Training levels',
      values: slots.map((s) =>
        s.kind === 'academy' ? (s.entity as Academy).trainingLevels.join(', ') : '—',
      ),
    });
  }

  if (anyCoach) {
    rows.push({
      key: 'specialization',
      label: 'Specialisation',
      values: slots.map((s) =>
        s.kind === 'coach' ? (s.entity as Coach).specialization.join(', ') : '—',
      ),
    });
  }

  return (
    <div
      className="border-border bg-card mt-4 overflow-x-auto rounded-xl border"
      role="region"
      aria-label="Comparison details"
    >
      <table
        className="w-full min-w-[640px] text-sm"
        style={{ tableLayout: 'auto' }}
      >
        <thead className="bg-card sticky top-0 z-[1]">
          <tr className="border-border border-b">
            <th
              scope="col"
              className="text-muted-foreground bg-card p-3 text-left text-xs font-medium tracking-widest uppercase"
            >
              Attribute
            </th>
            {slots.map((s) => (
              <th
                key={`${s.kind}-${s.entity.id}-h`}
                scope="col"
                className="bg-card p-3 text-left text-xs font-semibold"
              >
                {sLabel(s)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-border/40 border-b last:border-0">
              <th
                scope="row"
                className="text-muted-foreground p-3 text-left text-xs tracking-wide uppercase"
              >
                {row.label}
              </th>
              {row.values.map((v, i) => (
                <td key={`${row.key}-${i}`} className="p-3 align-top text-sm">
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function sLabel(s: Entity): string {
  if (s.kind === 'sport') return s.entity.name;
  return s.entity.name;
}
