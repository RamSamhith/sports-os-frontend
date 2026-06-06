'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, CornerDownLeft, ArrowUp, ArrowDown, History } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { academies } from '@/data/academies';
import { coaches } from '@/data/coaches';
import { sports } from '@/data/sports';
import { useRecentSearches, type RecentQuery } from './recent-searches-store';
import { cn } from '@/lib/utils/cn';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Result {
  id: string;
  group: 'Academies' | 'Coaches' | 'Sports' | 'Navigate';
  label: string;
  sublabel?: string;
  href?: string;
  action?: () => void;
}

function matches(haystack: string, q: string): number {
  const h = haystack.toLowerCase();
  if (h === q) return 1000;
  if (h.startsWith(q)) return 500;
  if (h.includes(q)) return 100;
  return 0;
}

function searchAll(q: string): Result[] {
  if (!q) return [];
  const lower = q.toLowerCase();
  const results: Array<Result & { score: number }> = [];

  for (const a of academies) {
    const score = Math.max(
      matches(a.name, lower),
      matches(a.location.city, lower),
      matches(a.location.state, lower),
      ...a.sportsOffered.map((s) => matches(s, lower)),
    );
    if (score > 0) {
      results.push({
        id: `academy:${a.id}`,
        group: 'Academies',
        label: a.name,
        sublabel: `${a.location.city}, ${a.location.state}`,
        href: `/academies/${a.slug}`,
        score,
      });
    }
  }
  for (const c of coaches) {
    const score = Math.max(
      matches(c.name, lower),
      matches(c.location.city, lower),
      ...c.sportsCoached.map((s) => matches(s, lower)),
    );
    if (score > 0) {
      results.push({
        id: `coach:${c.id}`,
        group: 'Coaches',
        label: c.name,
        sublabel: `${c.location.city} · ${c.experienceYears}+ yrs`,
        href: `/coaches/${c.slug}`,
        score,
      });
    }
  }
  for (const s of sports) {
    const score = Math.max(matches(s.name, lower), matches(s.category, lower));
    if (score > 0) {
      results.push({
        id: `sport:${s.id}`,
        group: 'Sports',
        label: s.name,
        sublabel: s.category,
        href: `/sports/${s.slug}`,
        score,
      });
    }
  }

  // Navigation quick actions
  const navItems: Array<{ id: string; label: string; href: string; sublabel: string }> = [
    { id: 'nav-home', label: 'Home', href: '/', sublabel: 'Discover the ecosystem' },
    { id: 'nav-discover', label: 'Discover', href: '/discover', sublabel: 'Browse all categories' },
    { id: 'nav-academies', label: 'Academies', href: '/academies', sublabel: 'Find the right academy' },
    { id: 'nav-coaches', label: 'Coaches', href: '/coaches', sublabel: 'Verified coaches across India' },
    { id: 'nav-sports', label: 'Sports', href: '/sports', sublabel: 'Explore sports and pathways' },
    { id: 'nav-shortlist', label: 'Shortlist', href: '/shortlist', sublabel: 'Your saved items' },
    { id: 'nav-compare', label: 'Compare', href: '/compare', sublabel: 'Side-by-side comparison' },
  ];
  for (const n of navItems) {
    const score = matches(n.label, lower);
    if (score > 0) {
      results.push({ ...n, group: 'Navigate', score });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}

const QUICK_NAV: Array<{ id: string; label: string; sublabel: string; href: string }> = [
  { id: 'q-home', label: 'Home', sublabel: 'Discover the ecosystem', href: '/' },
  { id: 'q-discover', label: 'Discover', sublabel: 'Browse all categories', href: '/discover' },
  { id: 'q-academies', label: 'Academies', sublabel: 'Find the right academy', href: '/academies' },
  { id: 'q-coaches', label: 'Coaches', sublabel: 'Verified coaches across India', href: '/coaches' },
  { id: 'q-sports', label: 'Sports', sublabel: 'Explore sports and pathways', href: '/sports' },
  { id: 'q-shortlist', label: 'Shortlist', sublabel: 'Your saved items', href: '/shortlist' },
  { id: 'q-compare', label: 'Compare', sublabel: 'Side-by-side comparison', href: '/compare' },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [highlight, setHighlight] = React.useState(0);
  const { items: recent, push: pushRecent, clear: clearRecent, hydrated } = useRecentSearches();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Reset on close
  React.useEffect(() => {
    if (!open) {
      setQuery('');
      setHighlight(0);
    } else {
      // Focus input shortly after open
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Build the result list: when query is empty, show recent + quick nav; otherwise search.
  const results = React.useMemo<Result[]>(() => {
    const q = query.trim();
    if (!q) {
      const recents: Result[] = recent.slice(0, 5).map((r) => ({
        id: `recent:${r.query}`,
        group: 'Navigate',
        label: r.query,
        sublabel: 'Recent',
        action: () => {
          setQuery(r.query);
        },
      }));
      const quick: Result[] = QUICK_NAV.map((n) => ({
        id: n.id,
        group: 'Navigate',
        label: n.label,
        sublabel: n.sublabel,
        href: n.href,
      }));
      return [...recents, ...quick];
    }
    return searchAll(q);
  }, [query, recent]);

  // Group results by group, preserving the order of first appearance.
  const groups = React.useMemo(() => {
    const map = new Map<string, Result[]>();
    for (const r of results) {
      const arr = map.get(r.group) ?? [];
      arr.push(r);
      map.set(r.group, arr);
    }
    return Array.from(map.entries());
  }, [results]);

  // Flat list for keyboard navigation
  const flat = React.useMemo(() => results, [results]);

  React.useEffect(() => {
    setHighlight(0);
  }, [query]);

  // Scroll highlighted item into view
  React.useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-result-index="${highlight}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [highlight]);

  const select = React.useCallback(
    (r: Result) => {
      if (r.action) {
        r.action();
        return;
      }
      if (r.href) {
        if (query.trim().length > 0) pushRecent(query);
        onOpenChange(false);
        router.push(r.href);
      }
    },
    [onOpenChange, pushRecent, query, router],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, Math.max(flat.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const r = flat[highlight];
      if (r) select(r);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl gap-0 overflow-hidden p-0 sm:rounded-2xl [&_[data-dialog-close]]:hidden"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <DialogDescription className="sr-only">
          Search academies, coaches, sports, and quick navigation actions.
        </DialogDescription>

        <div className="border-border/60 flex items-center gap-3 border-b px-4 py-3">
          <Search aria-hidden className="text-muted-foreground h-4 w-4 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search academies, coaches, sports, or jump to a page…"
            aria-label="Command palette search"
            className="placeholder:text-muted-foreground/70 text-foreground h-9 w-full bg-transparent text-sm outline-none"
          />
          <kbd className="border-border/60 bg-muted/40 text-muted-foreground hidden items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] tracking-wide md:inline-flex">
            Esc
          </kbd>
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => onOpenChange(false)}
            aria-label="Close command palette"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div
          ref={listRef}
          role="listbox"
          aria-label="Search results"
          className="max-h-[60dvh] overflow-y-auto p-2"
        >
          {flat.length === 0 ? (
            <div className="text-muted-foreground px-3 py-8 text-center text-sm">
              {query.trim() ? `No results for "${query.trim()}".` : 'Type to search.'}
            </div>
          ) : (
            groups.map(([group, items]) => (
              <div key={group} className="mb-1">
                <div className="text-muted-foreground px-2 py-1.5 text-[10px] font-semibold tracking-widest uppercase">
                  {group === 'Navigate' && recent.length > 0 && !query.trim() ? 'Recent' : group}
                </div>
                <ul>
                  {items.map((r) => {
                    const flatIndex = flat.indexOf(r);
                    const isActive = flatIndex === highlight;
                    return (
                      <li key={r.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          data-result-index={flatIndex}
                          onMouseEnter={() => setHighlight(flatIndex)}
                          onClick={() => select(r)}
                          className={cn(
                            'flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors',
                            isActive
                              ? 'bg-accent/15 text-foreground'
                              : 'text-foreground/90 hover:bg-accent/10',
                          )}
                        >
                          <span className="flex min-w-0 flex-col">
                            <span className="truncate font-medium">{r.label}</span>
                            {r.sublabel ? (
                              <span className="text-muted-foreground truncate text-xs">{r.sublabel}</span>
                            ) : null}
                          </span>
                          <span className="text-muted-foreground flex shrink-0 items-center gap-1 text-[10px] tracking-widest uppercase">
                            {group === 'Navigate' && recent.length > 0 && !query.trim() ? (
                              <History aria-hidden className="h-3 w-3" />
                            ) : null}
                            {isActive ? <CornerDownLeft aria-hidden className="h-3 w-3" /> : null}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>

        <div className="border-border/60 text-muted-foreground flex items-center justify-between border-t px-4 py-2 text-[10px] tracking-wide">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <ArrowUp aria-hidden className="h-3 w-3" />
              <ArrowDown aria-hidden className="h-3 w-3" />
              navigate
            </span>
            <span className="inline-flex items-center gap-1">
              <CornerDownLeft aria-hidden className="h-3 w-3" />
              select
            </span>
          </div>
          {hydrated && recent.length > 0 && !query.trim() ? (
            <button
              type="button"
              onClick={clearRecent}
              className="hover:text-foreground"
            >
              Clear recent
            </button>
          ) : (
            <span>Press / or ⌘K anywhere</span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
