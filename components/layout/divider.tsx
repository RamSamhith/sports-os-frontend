import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export function Divider({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn('bg-border/60 h-px w-full', className)}
      {...props}
    />
  );
}
