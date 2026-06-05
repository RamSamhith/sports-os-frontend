import { Info } from 'lucide-react';

export function SportDisclaimer() {
  return (
    <div className="border-border/60 bg-muted/30 text-muted-foreground flex items-start gap-2 rounded-md border p-3 text-xs">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <p>
        SportsOS provides informational guidance only. Suggestions should not replace professional coaching,
        medical assessment, or expert evaluation.
      </p>
    </div>
  );
}
