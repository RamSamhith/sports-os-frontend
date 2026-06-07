'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemePreviewCard } from '@/components/theme/theme-card';
import { themeList, type ThemeName } from '@/config/theme';
import { useThemeSafe } from '@/lib/hooks/use-theme-safe';

export default function ThemeSettingsPage() {
  const { mounted, activeTheme, setTheme, theme, systemTheme } = useThemeSafe();

  const handleSelect = (id: ThemeName) => setTheme(id);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Theme</h2>
        <p className="text-muted-foreground text-sm text-pretty">
          Four premium products. Each one is a different visual identity — not just a
          colour swap. Tap a card to apply, or use the single button in the navbar to cycle
          Midnight Ice → Arctic Steel → Ember Orange → Alpine Light.
        </p>
      </header>

      <section aria-labelledby="theme-picker-heading">
        <h3 id="theme-picker-heading" className="sr-only">
          Pick a theme
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {themeList.map((t) => (
            <ThemePreviewCard
              key={t.id}
              id={t.id}
              active={mounted && activeTheme === t.id}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System</CardTitle>
            <CardDescription>Follow the operating system light / dark preference.</CardDescription>
          </CardHeader>
          <CardContent>
            <button
              type="button"
              onClick={() => setTheme('system')}
              className="border-border bg-card text-card-foreground hover:border-foreground/20 motion-press inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
            >
              <span aria-hidden className="bg-primary inline-block h-2.5 w-2.5 rounded-full" />
              Use system theme
            </button>
            <p className="text-muted-foreground mt-3 text-xs">
              {mounted ? (
                <>
                  Currently <span className="text-foreground font-medium">{theme}</span>
                  {theme === 'system' ? (
                    <>
                      {' '}
                      (system reports <span className="text-foreground font-medium">{systemTheme}</span>)
                    </>
                  ) : null}
                </>
              ) : (
                '—'
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accessibility</CardTitle>
            <CardDescription>
              SportsOS follows <code className="font-mono">prefers-reduced-motion</code> automatically.
              The <span className="text-foreground font-medium">Alpine Light</span> theme is tuned
              for long reading sessions with maximum readability.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground flex flex-col gap-1.5 text-sm">
              <li>• WCAG AA contrast on body and primary text</li>
              <li>• Visible focus rings on all interactive surfaces</li>
              <li>• 44px minimum touch target on icon buttons</li>
              <li>• Reduced-motion override for transitions and animations</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
