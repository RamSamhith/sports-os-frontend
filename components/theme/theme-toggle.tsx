'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun, Trophy, Focus as FocusIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { themeMeta, nextTheme, type ThemeName } from '@/config/theme';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import { useThemeSafe } from '@/lib/hooks/use-theme-safe';

const iconFor: Record<ThemeName, React.ComponentType<{ className?: string }>> = {
  midnight: Moon,
  ivory: Sun,
  arena: Trophy,
  focus: FocusIcon,
};

/**
 * Single-cycle theme button.
 *
 * Replaces the previous dropdown with one button. Each click advances
 * to the next theme in the order: Midnight → Ivory → Arena → Focus → Midnight.
 *
 * Behaviour:
 *   - Renders the icon for the *currently active* theme.
 *   - Hover/focus shows a label "Theme: <name>".
 *   - Click instantly cycles and persists (next-themes handles storage).
 *   - Reduced-motion: no icon swap animation.
 */
export function ThemeCycleButton() {
  const { mounted, activeTheme, setTheme } = useThemeSafe();
  const reduced = useReducedMotion();

  const Icon = iconFor[activeTheme];
  const meta = themeMeta[activeTheme];

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Theme: ${meta.label}. Click to switch.`}
      onClick={() => setTheme(nextTheme(activeTheme))}
      className="relative overflow-visible"
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted ? (
          <motion.span
            key={activeTheme}
            initial={reduced ? false : { opacity: 0, scale: 0.6, rotate: -25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: 25 }}
            transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
            className="inline-flex"
          >
            <Icon className="h-4 w-4" />
          </motion.span>
        ) : (
          <Sparkles className="h-4 w-4" aria-hidden />
        )}
      </AnimatePresence>
    </Button>
  );
}

/**
 * Standalone label companion, e.g. shown next to the icon in the mobile drawer.
 * Reads the current theme; no click handler.
 */
export function ThemeCycleLabel() {
  const { mounted, activeTheme } = useThemeSafe();
  const meta = themeMeta[activeTheme];
  const Icon = iconFor[activeTheme];
  return (
    <span className="text-foreground inline-flex items-center gap-2 text-sm font-medium">
      <Icon className="text-muted-foreground h-4 w-4" />
      {mounted ? meta.label : 'Theme'}
    </span>
  );
}

export { themeMeta };
export type { ThemeName };
