'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'size'> {
  value: string;
  onValueChange: (value: string) => void;
  /** Optional clear handler — fires after the input is cleared. */
  onClear?: () => void;
  /** Label used for the input and form. */
  label: string;
  /** Placeholder shown inside the input. */
  placeholder: string;
  /** Optional size. */
  size?: 'sm' | 'md' | 'lg';
  /** Optional className for the outer form. */
  className?: string;
  /** Optional handler for Enter key press. */
  onSearch?: (value: string) => void;
}

const sizeMap: Record<NonNullable<SearchInputProps['size']>, string> = {
  sm: 'h-9 text-sm',
  md: 'h-10 text-sm',
  lg: 'h-11 text-base',
};

/**
 * SearchInput — a search field that works correctly on iOS Safari.
 *
 * Why a custom component:
 *   1. Wraps the `<input>` in a `<form onSubmit={preventDefault}>` so the
 *      iOS keyboard's "Search" key never triggers a navigation, and the
 *      browser does not remove focus from the input.
 *   2. Uses `type="search"`, `inputMode="search"`, and `enterKeyHint="search"`
 *      so iOS / Android / desktop all show the right keyboard key and submit
 *      behaviour.
 *   3. Uses `onChange` (not onInput) to avoid duplicate firing on iOS where
 *      event order differs; composition events handle IME input.
 *   4. Handles composition events for IME input (CJK, etc.)
 *   5. Disables autocorrect / autocomplete / spellcheck so the iOS keyboard
 *      does not offer suggestions that re-write the user's typed value.
 *   6. The clear button is a real `<button type="button">` with an
 *      `aria-label` — and it has a 44 × 44 hit area on mobile.
 */
export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    { value, onValueChange, onClear, label, placeholder, size = 'md', className, onSearch, ...rest },
    ref,
  ) => {
    const [isComposing, setIsComposing] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isComposing) {
        onValueChange(e.currentTarget.value);
      }
    };

    const handleCompositionStart = () => setIsComposing(true);
    const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
      setIsComposing(false);
      onValueChange((e.currentTarget as HTMLInputElement).value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        e.preventDefault();
        onSearch(value);
      }
    };

    return (
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className={cn('relative w-full', className)}
        aria-label={label}
      >
        <Search
          aria-hidden
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
        />
        <input
          ref={ref}
          type="search"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          value={value}
          onChange={handleChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={label}
          className={cn(
            'border-input bg-background/60 placeholder:text-muted-foreground focus-visible:ring-ring/40',
            'flex w-full rounded-md border pl-10 pr-12 text-sm transition-colors',
            'hover:border-foreground/30',
            'focus-visible:ring-2 focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            sizeMap[size],
          )}
          {...rest}
        />
        {value ? (
          <button
            type="button"
            onClick={() => {
              onValueChange('');
              onClear?.();
            }}
            aria-label={`Clear ${label}`}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-0 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-md transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </form>
    );
  },
);
SearchInput.displayName = 'SearchInput';
