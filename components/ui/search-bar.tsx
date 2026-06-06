'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface SearchBarProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'size' | 'onSubmit'> {
  value: string;
  onValueChange: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  shortcut?: string; // e.g. "⌘K"
}

const sizeMap: Record<NonNullable<SearchBarProps['size']>, string> = {
  sm: 'h-9 text-sm',
  md: 'h-10 text-sm',
  lg: 'h-12 text-base',
};

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    { value, onValueChange, onSearch, onClear, size = 'md', loading, shortcut, className, ...props },
    ref,
  ) => {
    return (
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch?.(value);
        }}
        className={cn('relative w-full', className)}
      >
        <Search
          aria-hidden
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
        />
        <Input
          ref={ref}
          type="search"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className={cn('pl-10', sizeMap[size], value && 'pr-20', shortcut && 'pr-24')}
          aria-label="Search"
          {...props}
        />
        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
          {value ? (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => {
                onValueChange('');
                onClear?.();
              }}
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          ) : null}
          {shortcut ? (
            <kbd className="border-border/60 bg-muted/60 text-muted-foreground hidden items-center gap-1 rounded border px-1.5 font-mono text-[10px] tracking-wide md:inline-flex">
              {shortcut}
            </kbd>
          ) : null}
          {loading ? (
            <span className="border-primary h-3.5 w-3.5 animate-spin rounded-full border-2 border-t-transparent" />
          ) : null}
        </div>
      </form>
    );
  },
);
SearchBar.displayName = 'SearchBar';
