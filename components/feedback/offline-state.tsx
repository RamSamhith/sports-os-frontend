import * as React from 'react';
import { WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface OfflineStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export function OfflineState({
  message = "You're offline. Showing the latest available information.",
  className,
  ...props
}: OfflineStateProps) {
  return (
    <div
      role="status"
      className={cn(
        'border-border/40 bg-card/40 mx-auto flex w-full max-w-md items-center gap-3 rounded-xl border p-4 text-sm',
        className,
      )}
      {...props}
    >
      <WifiOff className="text-muted-foreground h-4 w-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
