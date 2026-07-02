import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
}

export function EmptyState({ title, description, icon, action, secondaryAction, className, ...props }: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        'border-border/40 bg-card/40 mx-auto flex w-full max-w-md flex-col items-center gap-3 rounded-xl border border-dashed p-8 text-center',
        className,
      )}
      {...props}
    >
      {icon ? <div className="bg-muted/50 grid h-14 w-14 place-items-center rounded-full">{icon}</div> : null}
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      {description ? <p className="text-muted-foreground text-sm text-pretty">{description}</p> : null}
      {action ? <div className="mt-2 flex flex-wrap justify-center gap-2">{action}</div> : null}
      {secondaryAction ? <div className="mt-1">{secondaryAction}</div> : null}
    </div>
  );
}
