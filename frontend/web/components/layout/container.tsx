import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeMap: Record<NonNullable<ContainerProps['size']>, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-[1440px]',
  full: 'max-w-none',
};

export function Container({ className, size = 'xl', ...props }: ContainerProps) {
  return <div className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizeMap[size], className)} {...props} />;
}
