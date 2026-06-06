'use client';

import * as React from 'react';
import { CommandPalette } from './command-palette';

interface CommandPaletteContextValue {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
}

const CommandPaletteContext = React.createContext<CommandPaletteContextValue | null>(null);

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Global keyboard shortcuts: Cmd/Ctrl+K and `/` open; Esc closes (handled by Radix).
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const isEditable = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
    };
    const handler = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((v) => !v);
        return;
      }
      if (e.key === '/' && !isEditable(e.target) && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const value = React.useMemo<CommandPaletteContextValue>(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((v) => !v),
    }),
    [isOpen],
  );

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      <CommandPalette open={isOpen} onOpenChange={setIsOpen} />
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette() {
  const ctx = React.useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error('useCommandPalette must be used within CommandPaletteProvider');
  }
  return ctx;
}
