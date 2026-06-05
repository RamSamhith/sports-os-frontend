import { cn } from '@/lib/utils/cn';
import { EmptyState } from '@/components/feedback/empty-state';

export interface SearchSuggestion {
  id: string;
  label: string;
  sublabel?: string;
}

export function SearchSuggestions({
  items,
  onSelect,
  className,
}: {
  items: SearchSuggestion[];
  onSelect?: (item: SearchSuggestion) => void;
  className?: string;
}) {
  if (!items.length) {
    return <EmptyState title="No matches" description="Try a different search term." />;
  }
  return (
    <ul className={cn('divide-border/60 divide-y rounded-md border', className)}>
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => onSelect?.(item)}
            className="hover:bg-accent/10 flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm"
          >
            <span className="font-medium">{item.label}</span>
            {item.sublabel ? <span className="text-muted-foreground text-xs">{item.sublabel}</span> : null}
          </button>
        </li>
      ))}
    </ul>
  );
}
