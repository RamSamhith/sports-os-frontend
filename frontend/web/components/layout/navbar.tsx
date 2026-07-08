'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, Search, MapPin, Bookmark, User2 } from 'lucide-react';
import { primaryNav } from '@/config/nav';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useCommandPalette } from '@/components/command/command-palette-provider';
import { ThemeCycleButton } from '@/components/theme/theme-toggle';
import { LocationPicker } from '@/components/location/location-picker';
import { useLocation } from '@/lib/hooks/use-location';
import { useAuth } from '@/lib/hooks/use-auth';

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [locationOpen, setLocationOpen] = React.useState(false);
  const commandPalette = useCommandPalette();
  const { location } = useLocation();
  const { isGuest } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <header
      className={cn(
        'border-border/40 bg-background/70 supports-[backdrop-filter]:bg-background/50 sticky top-safe z-[var(--z-sticky)] border-b backdrop-blur-xl',
        'transition-[opacity,transform] duration-[var(--duration-standard)] ease-[var(--ease-luxe)]',
        mounted ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0',
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="bg-primary/20 ring-primary/30 grid h-8 w-8 place-items-center rounded-lg ring-1">
              <span className="bg-primary h-3 w-3 rounded-sm" />
            </span>
            <span>SportsOS</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {primaryNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'text-muted-foreground hover:text-foreground hover:bg-accent/15 focus-visible:ring-ring',
                    'motion-press relative rounded-md px-3 py-2 text-sm min-h-[44px] flex items-center',
                    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none',
                    active && 'text-foreground',
                  )}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      data-nav-active
                      className="bg-foreground/10 absolute inset-0 -z-10 rounded-md shadow-[var(--shadow-inset-hairline)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <div className="hidden items-center sm:flex">
              {/* 44 × 44 touch target — the button itself is 44 × 44, no dead zone. */}
              <Button
                variant="ghost"
                size="icon-touch"
                aria-label="Open search (Cmd+K)"
                aria-keyshortcuts="Control+K Meta+K"
                onClick={commandPalette.open}
              >
                <Search className="h-4 w-4" />
              </Button>
              <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon-touch" aria-label={location ? `Location: ${location.city || 'Set'}` : 'Set location'}>
                    <MapPin className="h-4 w-4" />
                    {location && (
                      <span className="bg-primary absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" sideOffset={8} className="w-80">
                  <LocationPicker />
                </PopoverContent>
              </Popover>
              <Button variant="ghost" size="icon-touch" aria-label="Shortlist" asChild>
                <Link href="/shortlist">
                  <Bookmark className="h-4 w-4" />
                </Link>
              </Button>
              <ThemeCycleButton />
              {isGuest ? (
                <Button variant="ghost" size="icon-touch" aria-label="Guest User" asChild>
                  <Link href="/profile" className="flex items-center gap-1.5">
                    <User2 className="h-4 w-4" />
                    <span className="text-xs font-medium hidden lg:inline">Guest</span>
                  </Link>
                </Button>
              ) : (
                <Button variant="ghost" size="icon-touch" aria-label="Profile" asChild>
                  <Link href="/profile">
                    <User2 className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <div className="grid h-11 w-11 place-items-center md:hidden">
                  <Button variant="ghost" size="icon-touch" aria-label="Open menu">
                    <Menu className="h-4 w-4" />
                  </Button>
                </div>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <div className="flex flex-col gap-1 p-4 pb-safe">
                  <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-widest uppercase">
                    Menu
                  </p>
                  <button
                    type="button"
                    onClick={() => { commandPalette.open(); setOpen(false); }}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent/15 motion-press flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-left transition-colors focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none min-h-[44px]"
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </button>
                  {primaryNav.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'text-muted-foreground hover:text-foreground hover:bg-accent/15 motion-press rounded-md px-3 py-2.5 text-sm min-h-[44px] flex items-center',
                          'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
                          active && 'text-foreground bg-accent/10',
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                  <Separator className="my-2" />
                  <div className="px-3 py-2">
                    <LocationPicker />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
                      Theme
                    </p>
                    <ThemeCycleButton />
                  </div>
                  <Link
                    href="/shortlist"
                    onClick={() => setOpen(false)}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent/15 rounded-md px-3 py-2.5 text-sm transition-colors min-h-[44px] flex items-center"
                  >
                    Shortlist
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent/15 rounded-md px-3 py-2.5 text-sm transition-colors min-h-[44px] flex items-center gap-2"
                  >
                    <User2 className="h-4 w-4" />
                    {isGuest ? 'Guest User' : 'Profile'}
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  );
}
