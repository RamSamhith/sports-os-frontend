'use client';

import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function RecentSearches({
  queries,
  onSelect,
  className,
}: {
  queries: string[];
  onSelect?: (q: string) => void;
  className?: string;
}) {
  if (!queries.length) return null;
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
        <Clock className="h-3.5 w-3.5" />
        Recent
      </span>
      {queries.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => onSelect?.(q)}
          className="border-border/60 bg-card/40 hover:bg-accent/10 rounded-full border px-2.5 py-0.5 text-xs transition-colors"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
