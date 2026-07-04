'use client';

import * as React from 'react';
import Link from 'next/link';
import { MapPin, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { getAcademies } from '@/lib/api/academies';
import type { Academy } from '@/types/domain/academy';

interface RelatedAcademiesProps {
  sportSlug: string;
  sportName: string;
}

export function RelatedAcademies({ sportSlug, sportName }: RelatedAcademiesProps) {
  const [academies, setAcademies] = React.useState<Academy[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await getAcademies({ sport: sportName, pageSize: 3 });
        if (!cancelled && res.ok) {
          setAcademies(res.data.items.slice(0, 3));
        }
      } catch {
        // silently fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [sportSlug, sportName]);

  if (loading) {
    return (
      <div className="border-border/40 rounded-xl border p-4">
        <div className="text-muted-foreground text-[10px] tracking-widest uppercase mb-2">
          {sportName} Academies
        </div>
        <div className="flex flex-col gap-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-muted/30 h-16 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (academies.length === 0) {
    return (
      <div className="border-border/40 rounded-xl border p-4">
        <div className="text-muted-foreground text-[10px] tracking-widest uppercase mb-2">
          {sportName} Academies
        </div>
        <p className="text-muted-foreground text-sm">
          No academies found for {sportName} yet.
        </p>
        <Button asChild size="sm" variant="outline" className="mt-2">
          <Link href={`/academies?sport=${sportSlug}`}>
            Browse all academies <ChevronRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="border-border/40 rounded-xl border p-4">
      <div className="text-muted-foreground text-[10px] tracking-widest uppercase mb-3">
        {sportName} Academies
      </div>
      <div className="flex flex-col gap-2">
        {academies.map((academy) => {
          const avg = typeof academy.rating === 'number' ? academy.rating : (academy.rating?.average ?? 0);
          return (
            <Link
              key={academy.id}
              href={`/academies/${academy.slug}`}
              className="group flex items-center gap-3 rounded-lg border border-border/40 p-2.5 transition-all hover:border-foreground/20 hover:bg-muted/20"
            >
              <div className="bg-muted/40 relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                <ImageWithFallback
                  src={academy.coverImage || ''}
                  alt={academy.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                  fallback={
                    <div className="bg-primary/10 flex h-full w-full items-center justify-center text-xs font-semibold text-primary">
                      {academy.name.charAt(0)}
                    </div>
                  }
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{academy.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {avg > 0 && (
                    <span className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {avg.toFixed(1)}
                    </span>
                  )}
                  {academy.location?.city && (
                    <span className="flex items-center gap-0.5">
                      <MapPin className="h-3 w-3" />
                      {academy.location.city}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="text-muted-foreground h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>
      <Button asChild size="sm" variant="outline" className="mt-3 w-full">
        <Link href={`/academies?sport=${sportSlug}`}>
          View all {sportName} academies <ChevronRight className="ml-1 h-3 w-3" />
        </Link>
      </Button>
    </div>
  );
}
