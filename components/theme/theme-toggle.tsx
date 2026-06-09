'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Snowflake, Flame, Gem, Sun, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { themeMeta, nextTheme, type ThemeName } from '@/config/theme';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import { useThemeSafe } from '@/lib/hooks/use-theme-safe';

const iconFor: Record<ThemeName, React.ComponentType<{ className?: string }>> = {
  'midnight-ice': Snowflake,
  'ember-orange': Flame,
  'graphite-titanium': Gem,
  'alpine-light': Sun,
};

/**
 * Single-cycle theme button.
 *
 * Cycle: Midnight Ice → Ember Orange → Graphite Titanium → Alpine Light → Midnight Ice.
 * The icon swap is animated via framer-motion; reduced motion disables it.
 *
 * Theme transition: adds `.theme-transitioning` to <html> for 250 ms so CSS
 * can animate background, color, border, and box-shadow properties smoothly.
 * No MutationObserver — direct toggle avoids infinite loops.
 */
export function ThemeCycleButton() {
  const { mounted, activeTheme, setTheme } = useThemeSafe();
  const reduced = useReducedMotion();

  const Icon = iconFor[activeTheme];
  const meta = themeMeta[activeTheme];

  const handleThemeChange = React.useCallback(() => {
    const root = document.documentElement;
    root.classList.add('theme-transitioning');
    setTimeout(() => root.classList.remove('theme-transitioning'), 250);
    setTheme(nextTheme(activeTheme));
  }, [activeTheme, setTheme]);

  return (
    <Button
      variant="ghost"
      size="icon-touch"
      aria-label={`Theme: ${meta.label}. Click to switch.`}
      onClick={handleThemeChange}
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
