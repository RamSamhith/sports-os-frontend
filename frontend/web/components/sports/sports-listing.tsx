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
import { SportCard } from '@/components/sports/sport-card';
import type { Sport } from '@/types/domain/sport';

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
            <SportCard key={sport.slug} sport={{
              id: sport.slug,
              slug: sport.slug,
              name: sport.name,
              category: sport.category,
              sportType: sport.sportType,
              shortDescription: sport.shortDescription,
              fullDescription: sport.shortDescription,
              origin: '',
              popularityInIndia: '',
              popularityWorldwide: '',
              icon: `/images/sports/${sport.slug}.svg`,
              coverImage: `/images/sports/${sport.slug}.svg`,
              howToPlay: '',
              objectiveOfGame: '',
              teamSize: '',
              matchDuration: '',
              scoringSystem: '',
              playingSurface: '',
              requiredEquipment: [],
              ageGroups: sport.suitableFor.join(', '),
              beginnerFriendly: sport.beginnerFriendly,
              olympicSport: sport.olympicSport,
              estimatedMonthlyCost: '',
              playingSeason: 'All Year' as const,
              trainingFrequency: '',
              averageLearningTime: '',
              injuryRisk: 'Medium' as const,
              fitnessLevelRequired: sport.fitnessLevelRequired,
              suitableFor: sport.suitableFor as ('Kids' | 'Teens' | 'Adults' | 'Seniors')[],
              individualOrTeam: (sport.sportType === 'both' ? 'Both' : sport.sportType === 'team' ? 'Team' : 'Individual') as 'Individual' | 'Team' | 'Both',
              indoorOutdoor: sport.category as 'Indoor' | 'Outdoor' | 'Both',
              physicalBenefits: [],
              mentalBenefits: [],
              skillsDeveloped: [],
              careerOpportunities: [],
              scholarships: [],
              professionalLeagues: [],
              tournaments: [],
              competitionPathway: { levels: [] },
              status: 'published' as const,
            }} />
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
            <SportCard key={sport.id} sport={sport} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCatalog.map((sport) => (
            <SportCard key={sport.slug} sport={{
              id: sport.slug,
              slug: sport.slug,
              name: sport.name,
              category: sport.category,
              sportType: sport.sportType,
              shortDescription: sport.shortDescription,
              fullDescription: sport.shortDescription,
              origin: '',
              popularityInIndia: '',
              popularityWorldwide: '',
              icon: `/images/sports/${sport.slug}.svg`,
              coverImage: `/images/sports/${sport.slug}.svg`,
              howToPlay: '',
              objectiveOfGame: '',
              teamSize: '',
              matchDuration: '',
              scoringSystem: '',
              playingSurface: '',
              requiredEquipment: [],
              ageGroups: sport.suitableFor.join(', '),
              beginnerFriendly: sport.beginnerFriendly,
              olympicSport: sport.olympicSport,
              estimatedMonthlyCost: '',
              playingSeason: 'All Year' as const,
              trainingFrequency: '',
              averageLearningTime: '',
              injuryRisk: 'Medium' as const,
              fitnessLevelRequired: sport.fitnessLevelRequired,
              suitableFor: sport.suitableFor as ('Kids' | 'Teens' | 'Adults' | 'Seniors')[],
              individualOrTeam: (sport.sportType === 'both' ? 'Both' : sport.sportType === 'team' ? 'Team' : 'Individual') as 'Individual' | 'Team' | 'Both',
              indoorOutdoor: sport.category as 'Indoor' | 'Outdoor' | 'Both',
              physicalBenefits: [],
              mentalBenefits: [],
              skillsDeveloped: [],
              careerOpportunities: [],
              scholarships: [],
              professionalLeagues: [],
              tournaments: [],
              competitionPathway: { levels: [] },
              status: 'published' as const,
            }} />
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
