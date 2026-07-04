'use client';

import * as React from 'react';
import { Loader2, AlertTriangle, Trophy, Search, ArrowLeftRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { useSearchQuery } from '@/lib/hooks/use-search-query';
import { listSports } from '@/lib/api/sports';
import { sportsCatalog, type CatalogSport } from '@/data/sports-catalog';
import { SportComparison } from '@/components/sports/sport-comparison';
import { cn } from '@/lib/utils/cn';
import type { Sport } from '@/types/domain/sport';

const sportGradients: Record<string, string> = {
  cricket: 'from-blue-600 to-blue-800/60',
  football: 'from-emerald-600 to-emerald-800/60',
  basketball: 'from-orange-600 to-orange-800/60',
  badminton: 'from-violet-600 to-violet-800/60',
  tennis: 'from-yellow-600 to-yellow-800/60',
  swimming: 'from-sky-600 to-sky-800/60',
  athletics: 'from-red-600 to-red-800/60',
  hockey: 'from-green-600 to-green-800/60',
  kabaddi: 'from-amber-600 to-amber-800/60',
  chess: 'from-slate-600 to-slate-800/60',
  boxing: 'from-rose-600 to-rose-800/60',
  wrestling: 'from-orange-700 to-orange-900/60',
  archery: 'from-teal-600 to-teal-800/60',
  shooting: 'from-zinc-600 to-zinc-800/60',
  gymnastics: 'from-pink-600 to-pink-800/60',
  'table-tennis': 'from-cyan-600 to-cyan-800/60',
  volleyball: 'from-indigo-600 to-indigo-800/60',
  cycling: 'from-lime-600 to-lime-800/60',
  skating: 'from-purple-600 to-purple-800/60',
  rugby: 'from-stone-600 to-stone-800/60',
  default: 'from-primary/60 to-primary/20',
};

function CatalogSportCard({ sport }: { sport: CatalogSport }) {
  const gradient = sportGradients[sport.slug] ?? sportGradients.default;
  return (
    <Link
      href={`/sports/${sport.slug}`}
      className="group border-border/40 bg-card/40 hover:border-foreground/20 hover:shadow-xl overflow-hidden rounded-xl border transition-all duration-300"
    >
      <div className="bg-muted/40 relative aspect-[16/9] w-full overflow-hidden">
        <ImageWithFallback
          src={`/images/sports/${sport.slug}.svg`}
          alt={`${sport.name} cover`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          fallback={
            <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}>
              <span className="text-3xl font-bold text-white/80 drop-shadow-sm">
                {sport.name.charAt(0)}
              </span>
            </div>
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-base font-bold text-white drop-shadow-sm line-clamp-1">{sport.name}</h3>
          <p className="text-white/80 mt-0.5 text-xs line-clamp-1">{sport.shortDescription}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2.5 p-4">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-[10px] capitalize">{sport.sportType === 'both' ? 'Individual & Team' : sport.sportType}</Badge>
          <Badge variant="secondary" className="text-[10px] capitalize">{sport.category}</Badge>
          <Badge variant="secondary" className={`text-[10px] capitalize ${sport.fitnessLevelRequired === 'Low' ? 'text-emerald-600' : sport.fitnessLevelRequired === 'High' ? 'text-red-600' : 'text-amber-600'}`}>
            {sport.fitnessLevelRequired}
          </Badge>
          {sport.olympicSport && <Badge variant="secondary" className="text-[10px] bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Olympic</Badge>}
          {sport.beginnerFriendly && <Badge variant="secondary" className="text-[10px] bg-green-500/10 text-green-600 border-green-500/20">Beginner</Badge>}
        </div>
        <Button size="lg" className="w-full h-11" asChild>
          <Link href={`/sports/${sport.slug}`}>
            Explore {sport.name}
          </Link>
        </Button>
      </div>
    </Link>
  );
}

export function SportsListing({ hideSearch = false }: { hideSearch?: boolean } = {}) {
  const { query, setQuery } = useSearchQuery();
  const [allSports, setAllSports] = React.useState<Sport[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadSports = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listSports({ status: 'published', limit: 100 });
      if (res.ok) setAllSports(res.data.items);
      else setError(res.error.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sports');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadSports();
  }, [loadSports]);

  const hasApiSports = allSports.length > 0;

  const filteredSports = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allSports;
    return allSports.filter((s) => {
      const haystack = [s.name, s.category, s.shortDescription ?? ''].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [query, allSports]);

  const filteredCatalog = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sportsCatalog;
    return sportsCatalog.filter((s) => {
      const haystack = [s.name, s.category, s.shortDescription].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {!hideSearch && (
          <SearchInput
            value=""
            onValueChange={() => {}}
            label="Search sports"
            placeholder="Search sports by name or category…"
            size="lg"
          />
        )}
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error && !hasApiSports) {
    return (
      <div className="flex flex-col gap-4">
        {!hideSearch && (
          <SearchInput
            value={query}
            onValueChange={setQuery}
            label="Search sports"
            placeholder="Search sports by name or category…"
            size="lg"
          />
        )}
        <p className="text-muted-foreground text-sm">
          {filteredCatalog.length} sports
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCatalog.map((sport) => (
            <CatalogSportCard key={sport.slug} sport={sport} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {!hideSearch && (
        <SearchInput
          value={query}
          onValueChange={setQuery}
          label="Search sports"
          placeholder="Search sports by name or category…"
          size="lg"
        />
      )}

      <p className="text-muted-foreground text-sm">
        {hasApiSports ? filteredSports.length : filteredCatalog.length} {hasApiSports ? `of ${allSports.length}` : ''} sports
      </p>

      {(hasApiSports ? filteredSports.length === 0 : filteredCatalog.length === 0) ? (
        <div className="border-border/40 bg-card/40 mx-auto flex w-full max-w-md flex-col items-center gap-4 rounded-xl border border-dashed p-12 text-center">
          <div className="bg-primary/10 grid h-16 w-16 place-items-center rounded-full">
            <Search className="h-7 w-7 text-primary/60" />
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight">No sports match your search</h3>
            <p className="text-muted-foreground mt-1 text-sm text-pretty">
              Try a different name or category.
            </p>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => setQuery('')}>
              Clear search
            </Button>
            <Button asChild size="sm">
              <Link href="/academies">Browse academies</Link>
            </Button>
          </div>
        </div>
      ) : hasApiSports ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSports.map((sport) => (
            <SportCardApi key={sport.id} sport={sport} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCatalog.map((sport) => (
            <CatalogSportCard key={sport.slug} sport={sport} />
          ))}
        </div>
      )}

      {/* Sport Comparison Section */}
      <div className="mt-8">
        <SportComparison />
      </div>
    </div>
  );
}

function SportCardApi({ sport }: { sport: Sport }) {
  const slug = sport.slug;
  const name = sport.name;
  const gradient = sportGradients[slug] ?? sportGradients.default;
  const difficulty = sport.fitnessLevelRequired ?? 'Medium';
  const participation = sport.individualOrTeam ?? 'Both';
  const environment = sport.indoorOutdoor ?? 'Both';

  return (
    <Link
      href={`/sports/${slug}`}
      className="group border-border/40 bg-card/40 hover:border-foreground/20 hover:shadow-xl overflow-hidden rounded-xl border transition-all duration-300"
    >
      <div className="bg-muted/40 relative aspect-[16/9] w-full overflow-hidden">
        <ImageWithFallback
          src={sport.coverImage || `/images/sports/${slug}.svg`}
          alt={`${name} cover`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          fallback={
            <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}>
              <span className="text-3xl font-bold text-white/80 drop-shadow-sm">
                {name.charAt(0)}
              </span>
            </div>
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-base font-bold text-white drop-shadow-sm line-clamp-1">{name}</h3>
          <p className="text-white/80 mt-0.5 text-xs line-clamp-1">{sport.shortDescription}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2.5 p-4">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-[10px] capitalize">{participation}</Badge>
          <Badge variant="secondary" className="text-[10px] capitalize">{environment}</Badge>
          <Badge variant="secondary" className={`text-[10px] capitalize ${difficulty === 'Low' ? 'text-emerald-600' : difficulty === 'High' ? 'text-red-600' : 'text-amber-600'}`}>
            {difficulty}
          </Badge>
          {sport.olympicSport && <Badge variant="secondary" className="text-[10px] bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Olympic</Badge>}
          {sport.beginnerFriendly && <Badge variant="secondary" className="text-[10px] bg-green-500/10 text-green-600 border-green-500/20">Beginner</Badge>}
        </div>
        <Button size="lg" className="w-full h-11" asChild>
          <Link href={`/sports/${slug}`}>
            Explore {name}
          </Link>
        </Button>
      </div>
    </Link>
  );
}
