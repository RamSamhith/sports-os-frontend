'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, MapPin, Trophy, Users, School, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { getAcademies } from '@/lib/api/academies';
import { getCoaches } from '@/lib/api/coaches';
import { listSports } from '@/lib/api/sports';
import type { Academy } from '@/types/domain/academy';
import type { Coach } from '@/types/domain/coach';
import type { Sport } from '@/types/domain/sport';

interface Suggestion {
  id: string;
  type: 'academy' | 'coach' | 'sport' | 'city' | 'navigation';
  title: string;
  subtitle?: string;
  href: string;
  icon: React.ReactNode;
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-primary/20 text-foreground rounded-sm px-0.5">{part}</mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function scoreSuggestion(s: Suggestion, q: string): number {
  const lower = q.toLowerCase();
  const titleLower = s.title.toLowerCase();
  const subtitleLower = (s.subtitle ?? '').toLowerCase();

  if (titleLower === lower) return 1000;
  if (titleLower.startsWith(lower)) return 800;
  if (titleLower.includes(lower)) return 600;
  if (subtitleLower.includes(lower)) return 400;
  const words = titleLower.split(/\s+/);
  for (const word of words) {
    if (word.startsWith(lower)) return 500;
  }
  const subWords = subtitleLower.split(/\s+/);
  for (const word of subWords) {
    if (word.startsWith(lower)) return 300;
  }
  let li = 0, ti = 0;
  while (li < lower.length && ti < titleLower.length) {
    if (lower[li] === titleLower[ti]) li++;
    ti++;
  }
  if (li === lower.length) return 200;
  return 0;
}

interface SearchAutocompleteProps {
  placeholder?: string;
  size?: 'sm' | 'lg';
  className?: string;
  onSelect?: (href: string) => void;
  autoFocus?: boolean;
  initialValue?: string;
}

export function SearchAutocomplete({
  placeholder = 'Search academies, sports, cities…',
  size = 'lg',
  className,
  onSelect,
  autoFocus = false,
  initialValue = '',
}: SearchAutocompleteProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState(initialValue);
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const academiesRef = React.useRef<Academy[]>([]);
  const coachesRef = React.useRef<Coach[]>([]);
  const sportsRef = React.useRef<Sport[]>([]);
  const dataLoadedRef = React.useRef(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const debouncedQuery = useDebounce(query, 250);

  React.useEffect(() => {
    let cancelled = false;
    async function loadData() {
      if (dataLoadedRef.current) return;
      setLoading(true);
      try {
        const [academiesRes, coachesRes, sportsRes] = await Promise.all([
          getAcademies({ pageSize: 200 }),
          getCoaches({ pageSize: 200 }),
          listSports({ status: 'published', limit: 100 }),
        ]);
        if (cancelled) return;
        if (academiesRes.ok) academiesRef.current = academiesRes.data.items;
        if (coachesRes.ok) coachesRef.current = coachesRes.data.items;
        if (sportsRes.ok) sportsRef.current = sportsRes.data.items;
        dataLoadedRef.current = true;
      } catch {
        // Data will be empty
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadData();
    return () => { cancelled = true; };
  }, []);

  React.useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const q = debouncedQuery.trim().toLowerCase();
    const results: Suggestion[] = [];
    const seen = new Set<string>();

    for (const a of academiesRef.current) {
      if (seen.has(`academy:${a.id}`)) continue;
      const titleMatch = a.name.toLowerCase().includes(q);
      const cityMatch = a.location?.city?.toLowerCase().includes(q);
      const stateMatch = a.location?.state?.toLowerCase().includes(q);
      const sportMatch = a.sportsOffered?.some(s => s.toLowerCase().includes(q));
      if (titleMatch || cityMatch || stateMatch || sportMatch) {
        seen.add(`academy:${a.id}`);
        results.push({
          id: a.id,
          type: 'academy',
          title: a.name,
          subtitle: `${a.location?.city ?? ''}, ${a.location?.state ?? ''}`.replace(/^,\s*/, ''),
          href: `/academies/${a.slug}`,
          icon: <School className="h-4 w-4" />,
        });
      }
    }

    for (const c of coachesRef.current) {
      if (seen.has(`coach:${c.id}`)) continue;
      const titleMatch = c.name.toLowerCase().includes(q);
      const cityMatch = c.location?.city?.toLowerCase().includes(q);
      const sportMatch = c.sportsCoached?.some(s => s.toLowerCase().includes(q));
      if (titleMatch || cityMatch || sportMatch) {
        seen.add(`coach:${c.id}`);
        results.push({
          id: c.id,
          type: 'coach',
          title: c.name,
          subtitle: `${c.location?.city ?? ''} · ${c.experienceYears}+ yrs`,
          href: `/coaches/${c.slug}`,
          icon: <Users className="h-4 w-4" />,
        });
      }
    }

    for (const s of sportsRef.current) {
      if (seen.has(`sport:${s.id}`)) continue;
      if (s.name.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q)) {
        seen.add(`sport:${s.id}`);
        results.push({
          id: s.id,
          type: 'sport',
          title: s.name,
          subtitle: s.category,
          href: `/sports/${s.slug}`,
          icon: <Trophy className="h-4 w-4" />,
        });
      }
    }

    const cities = new Set<string>();
    for (const a of academiesRef.current) {
      const city = a.location?.city;
      if (city && city.toLowerCase().includes(q) && !cities.has(city)) {
        cities.add(city);
        results.push({
          id: `city:${city}`,
          type: 'city',
          title: city,
          subtitle: 'Browse academies',
          href: `/cities/${encodeURIComponent(city.toLowerCase().replace(/\s+/g, '-'))}`,
          icon: <MapPin className="h-4 w-4" />,
        });
      }
    }

    results.sort((a, b) => scoreSuggestion(b, q) - scoreSuggestion(a, q));

    const limited = results.slice(0, 8);
    limited.push({
      id: 'search-all',
      type: 'navigation',
      title: `See all results for "${debouncedQuery.trim()}"`,
      href: `/search?q=${encodeURIComponent(debouncedQuery.trim())}`,
      icon: <ArrowRight className="h-4 w-4" />,
    });

    setSuggestions(limited);
    setActiveIndex(-1);
  }, [debouncedQuery]);

  React.useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open]);

  function navigate(href: string) {
    setOpen(false);
    setQuery('');
    if (onSelect) onSelect(href);
    else router.push(href);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          navigate(suggestions[activeIndex].href);
        } else if (query.trim()) {
          navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  }

  React.useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const inputSizeClass = size === 'lg' ? 'h-12 pl-10 pr-10 text-base' : 'h-10 pl-9 pr-9 text-sm';

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-controls="search-autocomplete-list"
          aria-activedescendant={activeIndex >= 0 ? `search-suggestion-${activeIndex}` : undefined}
          aria-label="Search"
          autoComplete="off"
          className={cn(
            'bg-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-xl border bg-transparent pl-10 pr-10 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
            inputSizeClass,
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1 -translate-y-1/2 flex h-11 w-11 items-center justify-center"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div
          ref={listRef}
          id="search-autocomplete-list"
          role="listbox"
          aria-label="Search suggestions"
          className="bg-popover absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border shadow-lg"
        >
          {suggestions.map((s, i) => (
            <button
              key={s.id}
              id={`search-suggestion-${i}`}
              data-index={i}
              role="option"
              aria-selected={i === activeIndex}
              onClick={() => navigate(s.href)}
              onMouseEnter={() => setActiveIndex(i)}
              className={cn(
                'flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors',
                i === activeIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50',
              )}
            >
              <span className="text-muted-foreground shrink-0">{s.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">
                  {highlightMatch(s.title, query)}
                </p>
                {s.subtitle && (
                  <p className="text-muted-foreground truncate text-xs">{s.subtitle}</p>
                )}
              </div>
              {s.type === 'navigation' && (
                <ArrowRight className="text-muted-foreground h-4 w-4 shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}

      {open && query.trim().length >= 2 && suggestions.length === 0 && !loading && (
        <div className="bg-popover absolute top-full z-50 mt-2 w-full rounded-xl border p-4 text-center shadow-lg">
          <p className="text-muted-foreground text-sm">No results for &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
