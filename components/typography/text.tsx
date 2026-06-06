import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const textVariants = cva('', {
  variants: {
    variant: {
      display:
        'font-display text-[clamp(2.25rem,4vw+1rem,4.5rem)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tighter)] text-balance',
      h1: 'font-display text-4xl font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-balance md:text-5xl',
      h2: 'font-display text-3xl font-semibold leading-[var(--leading-snug)] tracking-[var(--tracking-tight)] text-balance md:text-4xl',
      h3: 'font-display text-2xl font-semibold leading-[var(--leading-snug)] tracking-[var(--tracking-tight)]',
      h4: 'font-display text-xl font-semibold leading-[var(--leading-snug)]',
      h5: 'font-display text-lg font-semibold leading-[var(--leading-snug)]',
      lead: 'text-lg leading-[var(--leading-relaxed)] text-pretty md:text-xl',
      body: 'text-base leading-[var(--leading-normal)] text-pretty',
      small: 'text-sm leading-[var(--leading-normal)] text-pretty',
      muted: 'text-sm leading-[var(--leading-normal)] text-muted-foreground text-pretty',
      overline:
        'text-[0.6875rem] font-medium tracking-[var(--tracking-wider)] text-muted-foreground uppercase',
      mono: 'font-mono text-sm',
    },
    tone: {
      default: '',
      primary: 'text-primary',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
      success: 'text-success',
      warning: 'text-warning',
      info: 'text-info',
    },
  },
  defaultVariants: { variant: 'body', tone: 'default' },
});

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof textVariants> {
  as?: keyof React.JSX.IntrinsicElements;
}

const tagByVariant: Record<NonNullable<TextProps['variant']>, keyof React.JSX.IntrinsicElements> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  lead: 'p',
  body: 'p',
  small: 'p',
  muted: 'p',
  overline: 'span',
  mono: 'code',
};

export function Text({ variant = 'body', tone, as, className, ...props }: TextProps) {
  const Tag = (as ?? tagByVariant[variant ?? 'body']) as keyof React.JSX.IntrinsicElements;
  return React.createElement(Tag, { className: cn(textVariants({ variant, tone }), className), ...props });
}
