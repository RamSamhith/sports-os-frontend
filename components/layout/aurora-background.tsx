import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'aurora-bg pointer-events-none absolute inset-0 -z-10 overflow-hidden',
        className,
      )}
    >
      <div className="animate-aurora-pan absolute -top-32 -left-24 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,hsl(var(--primary)/0.22),transparent_70%)] blur-2xl" />
      <div className="animate-aurora-pan absolute -top-20 -right-24 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,hsl(var(--accent)/0.18),transparent_70%)] blur-2xl [animation-delay:-6s]" />
    </div>
  );
}
