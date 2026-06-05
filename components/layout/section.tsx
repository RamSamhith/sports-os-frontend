import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div' | 'header' | 'footer' | 'main';
  spacing?: 'sm' | 'md' | 'lg' | 'none';
  bleed?: boolean;
}

const spacingMap: Record<NonNullable<SectionProps['spacing']>, string> = {
  none: 'py-0',
  sm: 'py-10 md:py-14',
  md: 'py-16 md:py-24',
  lg: 'py-20 md:py-32',
};

export function Section({
  as: Tag = 'section',
  spacing = 'md',
  bleed = false,
  className,
  ...props
}: SectionProps) {
  return <Tag className={cn(!bleed && spacingMap[spacing], className)} {...props} />;
}
