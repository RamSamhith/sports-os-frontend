'use client';

import * as React from 'react';
import { Snowflake, Crown, Flame, Image as ImageIcon, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { themeMeta, type ThemeName } from '@/config/theme';

const iconFor: Record<ThemeName, React.ComponentType<{ className?: string }>> = {
  'midnight-ice': Snowflake,
  'emerald-gold': Crown,
  'ember-orange': Flame,
  'monochrome-mist': ImageIcon,
};

const atmosphereClassFor: Record<ThemeName, string> = {
  'midnight-ice': 'atmosphere',
  'emerald-gold': 'atmosphere',
  'ember-orange': 'atmosphere',
  'monochrome-mist': 'atmosphere',
};

/**
 * Visual preview card for a single theme. Renders a small mock of the
 * surface (background, card, primary button, text) inside an isolated
 * container that *applies* the theme's tokens — so users can see the
 * result without actually switching the live theme.
 */
export function ThemePreviewCard({
  id,
  active,
  onSelect,
}: {
  id: ThemeName;
  active: boolean;
  onSelect: (id: ThemeName) => void;
}) {
  const meta = themeMeta[id];
  const Icon = iconFor[id];

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      aria-pressed={active}
      aria-label={`Apply ${meta.label} theme`}
      className={cn(
        'group relative flex flex-col items-stretch overflow-hidden rounded-xl border text-left motion-premium',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
        active
          ? 'border-primary shadow-[var(--shadow-md)]'
          : 'border-border hover:border-foreground/20',
      )}
    >
      {/* Live preview — applies the theme class on a child element so it
          doesn't affect the rest of the page. Each preview also gets a
          mini-atmosphere with the same motion personality. */}
      <div className={cn('relative h-40 w-full overflow-hidden', id)}>
        <div className={atmosphereClassFor[id]}>
          <div className="atmosphere__layer atmosphere__layer--1" />
          <div className="atmosphere__layer atmosphere__layer--2" />
          <div className="atmosphere__layer atmosphere__layer--3" />
        </div>
        <div className="bg-background text-foreground relative flex h-full w-full flex-col gap-2 p-4">
          <div className="flex items-center justify-between">
            <div className="bg-card/70 text-card-foreground backdrop-blur-sm flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-medium shadow-[var(--shadow-xs)]">
              <Icon className="h-3 w-3" />
              {meta.label}
            </div>
            <div className="btn-primary rounded-md px-2 py-1 text-[10px] font-medium">
              Primary
            </div>
          </div>
          <div className="bg-card/70 text-card-foreground backdrop-blur-sm flex-1 rounded-md border p-2 shadow-[var(--shadow-xs)]">
            <div className="text-foreground text-[11px] font-semibold">Card title</div>
            <div className="text-muted-foreground mt-0.5 text-[10px]">Subtitle in muted</div>
            <div className="mt-2 flex gap-1.5">
              <span className="bg-secondary text-secondary-foreground rounded px-1.5 py-0.5 text-[9px]">
                Chip
              </span>
              <span className="bg-accent text-accent-foreground rounded px-1.5 py-0.5 text-[9px]">
                Accent
              </span>
              {id === 'emerald-gold' || id === 'ember-orange' ? (
                <>
                  <span className="sport-cricket rounded px-1.5 py-0.5 text-[9px]">Cricket</span>
                  <span className="sport-football rounded px-1.5 py-0.5 text-[9px]">Football</span>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card flex items-center justify-between gap-2 border-t p-3">
        <div className="min-w-0">
          <div className="text-foreground flex items-center gap-2 text-sm font-medium">
            {meta.label}
            {meta.accessibility ? (
              <span className="bg-info/15 text-info rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                A11y
              </span>
            ) : null}
            {meta.tags.slice(0, 1).map((tag) => (
              <span
                key={tag}
                className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="text-muted-foreground line-clamp-2 text-xs">{meta.description}</div>
        </div>
        {active ? (
          <span className="bg-primary text-primary-foreground inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
            <Check className="h-3.5 w-3.5" />
          </span>
        ) : (
          <span className="border-border text-muted-foreground inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px]">
            {meta.label.charAt(0)}
          </span>
        )}
      </div>
    </button>
  );
}
