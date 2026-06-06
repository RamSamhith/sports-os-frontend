'use client';

import * as React from 'react';
import Link from 'next/link';
import { GitCompare, X, MapPin, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { EmptyState } from '@/components/feedback/empty-state';
import { VerifiedBadge } from '@/components/trust/verified-badge';
import { fixtureImages } from '@/lib/images';
import { useCompare } from '@/lib/hooks/use-compare';
import { academies } from '@/data/academies';
import { coaches } from '@/data/coaches';
import { sports } from '@/data/sports';
import type { Academy } from '@/types/domain/academy';
import type { Coach } from '@/types/domain/coach';
import type { Sport } from '@/types/domain/sport';

type Entity = { kind: 'academy'; entity: Academy } | { kind: 'coach'; entity: Coach } | { kind: 'sport'; entity: Sport };

function resolve(entityType: 'academy' | 'coach' | 'sport', id: string): Entity | null {
  if (entityType === 'academy') {
    const a = academies.find((x) => x.id === id);
    return a ? { kind: 'academy', entity: a } : null;
  }
  if (entityType === 'coach') {
    const c = coaches.find((x) => x.id === id);
    return c ? { kind: 'coach', entity: c } : null;
  }
  const s = sports.find((x) => x.id === id);
  return s ? { kind: 'sport', entity: s } : null;
}

export function CompareView() {
  const { items, remove, clear, maxItems } = useCompare();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Stale-id cleanup is performed by the CompareProvider on hydration
  // and on every storage event, so we don't need to do it here.

  if (!mounted) {
    return (
      <div className="bg-muted/30 h-40 animate-pulse rounded-xl border border-dashed" aria-hidden />
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<GitCompare className="h-5 w-5" />}
        title="Nothing to compare yet"
        description="Tap the compare button on academies or coaches to add them here."
        action={
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/academies">Browse academies</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/coaches">Browse coaches</Link>
            </Button>
          </div>
        }
      />
    );
  }

  const resolved = items
    .map((it) => resolve(it.entityType, it.id))
    .filter((x): x is Entity => x !== null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {resolved.length} of {maxItems} selected
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            clear();
            toast('Cleared compare');
          }}
        >
          <X className="h-3.5 w-3.5" /> Clear all
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: maxItems }).map((_, i) => {
          const slot = resolved[i];
          if (!slot) {
            return (
              <Card key={`empty-${i}`} className="bg-muted/10 flex items-center justify-center border-dashed p-6">
                <p className="text-muted-foreground text-sm">Empty slot</p>
              </Card>
            );
          }
          return (
            <CompareCard
              key={`${slot.kind}-${slot.entity.id}`}
              slot={slot}
              onRemove={() => {
                remove(slot.kind, slot.entity.id);
                toast(`Removed ${slot.entity.name ?? (slot.entity as { name: string }).name} from compare`);
              }}
            />
          );
        })}
      </div>

      <ComparisonTable slots={resolved} />
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
          onClick={onRemove}
          className="bg-card/80 hover:bg-card text-foreground absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full shadow"
          aria-label={`Remove from compare`}
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
        <p className="text-muted-foreground text-xs capitalize">
          {sublabel}
        </p>
        {kind === 'academy' ? (
          <div className="flex items-center gap-1 text-xs">
            <Star aria-hidden className="fill-rating text-rating h-3.5 w-3.5" />
            <span className="font-semibold">{(entity as Academy).rating.average.toFixed(1)}</span>
            <span className="text-muted-foreground">({(entity as Academy).rating.count})</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function ComparisonTable({ slots }: { slots: Entity[] }) {
  const rows: Array<{ key: string; label: string; values: string[] }> = [];
  const columns = slots.map((s) => sLabel(s));

  if (slots.some((s) => s.kind === 'academy' || s.kind === 'coach')) {
    rows.push({
      key: 'rating',
      label: 'Rating',
      values: slots.map((s) => {
        if (s.kind === 'academy') return s.entity.rating.average.toFixed(1);
        if (s.kind === 'coach') return s.entity.rating.average.toFixed(1);
        return '—';
      }),
    });
    rows.push({
      key: 'verification',
      label: 'Verification',
      values: slots.map((s) => {
        if (s.kind === 'sport') return '—';
        return s.entity.verificationStatus === 'verified' ? 'Verified' : 'Pending';
      }),
    });
  }

  // For sport rows, show category + age
  if (slots.some((s) => s.kind === 'sport')) {
    rows.push({
      key: 'category',
      label: 'Category',
      values: slots.map((s) => (s.kind === 'sport' ? s.entity.category : '—')),
    });
    rows.push({
      key: 'age',
      label: 'Age range',
      values: slots.map((s) => {
        if (s.kind !== 'sport') return '—';
        const r = s.entity.explorationGuidance?.ageSuitability;
        if (r?.min !== undefined && r?.max !== undefined) return `${r.min}–${r.max}`;
        if (r?.min !== undefined) return `${r.min}+`;
        return '—';
      }),
    });
  }

  // Sports offered / coached
  rows.push({
    key: 'sports',
    label: 'Sports',
    values: slots.map((s) => {
      if (s.kind === 'academy') return s.entity.sportsOffered.join(', ');
      if (s.kind === 'coach') return s.entity.sportsCoached.join(', ');
      return s.entity.name;
    }),
  });

  if (slots.some((s) => s.kind === 'academy')) {
    rows.push({
      key: 'facilities',
      label: 'Facilities',
      values: slots.map((s) => (s.kind === 'academy' ? s.entity.facilities.join(', ') : '—')),
    });
    rows.push({
      key: 'levels',
      label: 'Training levels',
      values: slots.map((s) => (s.kind === 'academy' ? s.entity.trainingLevels.join(', ') : '—')),
    });
  }

  if (slots.some((s) => s.kind === 'coach')) {
    rows.push({
      key: 'specialization',
      label: 'Specialisation',
      values: slots.map((s) => (s.kind === 'coach' ? s.entity.specialization.join(', ') : '—')),
    });
  }

  return (
    <div className="border-border/60 bg-card/40 mt-4 overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[480px] text-sm">
        <thead>
          <tr className="border-border/60 border-b">
            <th className="text-muted-foreground p-3 text-left text-xs font-medium tracking-widest uppercase">Attribute</th>
            {columns.map((c) => (
              <th key={c} className="p-3 text-left text-xs font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-border/40 border-b last:border-0">
              <td className="text-muted-foreground p-3 text-xs tracking-wide uppercase">{row.label}</td>
              {row.values.map((v, i) => (
                <td key={`${row.key}-${i}`} className="p-3 align-top">
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
  if (s.kind === 'academy') return s.entity.name;
  if (s.kind === 'coach') return s.entity.name;
  return s.entity.name;
}
