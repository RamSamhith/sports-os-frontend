import { Trophy } from 'lucide-react';

export function PathwayTimeline({ levels }: { levels: Array<{ key: string; label: string; description?: string }> }) {
  return (
    <ol className="border-border/60 bg-card/40 space-y-3 rounded-xl border p-4">
      {levels.map((l, i) => (
        <li key={l.key} className="flex items-start gap-3">
          <span className="bg-primary/15 text-primary grid h-8 w-8 shrink-0 place-items-center rounded-full">
            <Trophy className="h-4 w-4" />
          </span>
          <div>
            <div className="text-sm font-semibold">{l.label}</div>
            {l.description ? (
              <p className="text-muted-foreground text-xs">{l.description}</p>
            ) : null}
          </div>
          {i < levels.length - 1 ? <span aria-hidden className="bg-border/60 ml-4 h-6 w-px" /> : null}
        </li>
      ))}
    </ol>
  );
}
