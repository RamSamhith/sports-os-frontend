'use client';

import { useTheme } from 'next-themes';
import * as React from 'react';

export function ThemeMeta() {
  const { theme, resolvedTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <p className="text-muted-foreground text-xs">Theme: —</p>
    );
  }
  return (
    <p className="text-muted-foreground text-xs">
      theme: <span className="text-foreground font-medium">{theme}</span> · resolved:{' '}
      <span className="text-foreground font-medium">{resolvedTheme}</span> · system:{' '}
      <span className="text-foreground font-medium">{systemTheme}</span>
    </p>
  );
}
