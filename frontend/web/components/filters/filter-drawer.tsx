'use client';

import * as React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface FilterDrawerProps {
  children: React.ReactNode;
  appliedCount?: number;
  onApply?: () => void;
  onClear?: () => void;
  onReset?: () => void;
  title?: string;
}

export function FilterDrawer({
  children,
  appliedCount = 0,
  onApply,
  onClear,
  onReset,
  title = 'Filters',
}: FilterDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label={`${title}${appliedCount > 0 ? `, ${appliedCount} applied` : ''}`}
          className={cn(
            'hover:border-foreground/40 hover:bg-accent/15 transition-colors',
            appliedCount > 0 && 'border-primary/40 bg-primary/5 text-foreground',
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {title}
          {appliedCount > 0 ? (
            <span
              className={cn(
                'ml-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-bold',
                'bg-primary text-primary-foreground',
              )}
              aria-label={`${appliedCount} filters applied`}
              aria-hidden
            >
              {appliedCount}
            </span>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 py-2">{children}</div>
        {(onApply || onClear || onReset) && (
          <SheetFooter className="border-border/60 border-t p-4 pb-safe">
            {onClear ? (
              <Button
                variant="ghost"
                className="min-h-[44px] min-w-[44px]"
                onClick={onClear}
                disabled={appliedCount === 0}
              >
                Clear filters
              </Button>
            ) : null}
            {onReset ? (
              <Button
                variant="ghost"
                className="min-h-[44px] min-w-[44px]"
                onClick={onReset}
              >
                Reset
              </Button>
            ) : null}
            {onApply ? (
              <SheetClose asChild>
                <Button onClick={onApply}>Apply filters</Button>
              </SheetClose>
            ) : null}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
