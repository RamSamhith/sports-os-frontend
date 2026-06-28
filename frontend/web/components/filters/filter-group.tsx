'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils/cn';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterGroupProps {
  title: string;
  options: FilterOption[];
  selected: string[];
  onChange: (next: string[]) => void;
  layout?: 'grid' | 'list';
  maxHeight?: string;
  /** Prefix used to build a `layoutId` for shared-layout transitions with FilterChips. */
  layoutIdPrefix?: string;
}

export function FilterGroup({
  title,
  options,
  selected,
  onChange,
  layout = 'grid',
  maxHeight,
  layoutIdPrefix,
}: FilterGroupProps) {
  const toggle = (value: string, checked: boolean) => {
    onChange(checked ? [...selected, value] : selected.filter((v) => v !== value));
  };

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-foreground text-sm font-semibold">{title}</legend>
      <div
        className={cn(
          layout === 'grid' ? 'grid grid-cols-2 gap-x-2 gap-y-1.5' : 'flex flex-col gap-1.5',
          maxHeight && 'overflow-y-auto pr-1',
        )}
        style={maxHeight ? { maxHeight } : undefined}
      >
        {options.map((opt) => {
          const id = `filter-${title}-${opt.value}`;
          const isChecked = selected.includes(opt.value);
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={cn(
                'hover:bg-accent/10 focus-within:ring-ring/40 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors focus-within:ring-2 focus-within:outline-none',
                isChecked && 'bg-accent/15 text-foreground',
              )}
            >
              <Checkbox
                id={id}
                checked={isChecked}
                onCheckedChange={(c) => toggle(opt.value, c === true)}
                aria-describedby={opt.count !== undefined ? `${id}-count` : undefined}
              />
              <span className="flex-1 truncate">
                {layoutIdPrefix && isChecked ? (
                  <motion.span
                    layoutId={`${layoutIdPrefix}-${opt.value}`}
                    className="block w-full truncate"
                  >
                    {opt.label}
                  </motion.span>
                ) : (
                  opt.label
                )}
              </span>
              {opt.count !== undefined ? (
                <span
                  id={`${id}-count`}
                  className="text-muted-foreground text-xs tabular-nums"
                >
                  {opt.count}
                </span>
              ) : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
