import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'raised' | 'glass' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantMap: Record<NonNullable<SurfaceProps['variant']>, string> = {
  flat: 'bg-card border border-border/60',
  raised: 'bg-card border border-border/60 shadow-[var(--shadow-md)]',
  glass: 'glass border border-border/40',
  outline: 'border border-border/60 bg-transparent',
};

const paddingMap: Record<NonNullable<SurfaceProps['padding']>, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
};

export function Surface({ className, variant = 'flat', padding = 'md', ...props }: SurfaceProps) {
  return <div className={cn('rounded-xl', variantMap[variant], paddingMap[padding], className)} {...props} />;
}
