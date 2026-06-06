'use client';

import * as React from 'react';
import { Monitor, Moon, Sun, Trophy, Focus as FocusIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { themeList, themeMeta, type ThemeName } from '@/config/theme';
import { useThemeSafe } from '@/lib/hooks/use-theme-safe';

const iconFor: Record<ThemeName, React.ComponentType<{ className?: string }>> = {
  dark: Moon,
  light: Sun,
  arena: Trophy,
  focus: FocusIcon,
};

/**
 * Compact theme switcher for the navbar / footer.
 * Renders a single button that opens a dropdown of all 4 themes + 'system'.
 * Hydration-safe — uses `useThemeSafe` and renders a stable Moon icon
 * until the client has mounted.
 */
export function ThemeToggle({ align = 'end' }: { align?: 'start' | 'end' }) {
  const { mounted, activeTheme, setTheme } = useThemeSafe();
  const Active = iconFor[activeTheme];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Switch theme"
          // Stable label while mounting so screen readers don't flicker.
        >
          {mounted ? <Active className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-56">
        <DropdownMenuLabel className="text-muted-foreground text-xs font-normal uppercase tracking-wider">
          Theme
        </DropdownMenuLabel>
        {themeList.map((t) => {
          const Icon = iconFor[t.id];
          const isActive = mounted && activeTheme === t.id;
          return (
            <DropdownMenuItem
              key={t.id}
              onClick={() => setTheme(t.id)}
              className="flex items-start gap-2 py-2"
            >
              <Icon className="text-foreground/80 mt-0.5 h-4 w-4 shrink-0" />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm leading-tight font-medium">{t.label}</span>
                <span className="text-muted-foreground line-clamp-1 text-xs leading-snug">
                  {t.description}
                </span>
              </div>
              {isActive ? <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" /> : null}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="flex items-center gap-2"
        >
          <Monitor className="text-foreground/80 h-4 w-4" />
          <span className="text-sm">System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { themeMeta };
export type { ThemeName };
