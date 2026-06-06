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

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
      className="border-border/40 bg-background/70 supports-[backdrop-filter]:bg-background/50 sticky top-0 z-[var(--z-sticky)] border-b backdrop-blur-xl"
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
                    'text-muted-foreground hover:text-foreground hover:bg-accent/15 focus-visible:ring-ring relative rounded-md px-3 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none',
                    active && 'text-foreground',
                  )}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="bg-foreground/15 absolute inset-0 -z-10 rounded-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <div className="hidden items-center gap-1 sm:flex">
              <Button variant="ghost" size="icon-sm" aria-label="Search">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="Location">
                <MapPin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="Shortlist" asChild>
                <Link href="/shortlist">
                  <Bookmark className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="Profile" asChild>
                <Link href="/profile">
                  <User2 className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Open menu">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <div className="flex flex-col gap-1 p-4">
                  <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-widest uppercase">
                    Menu
                  </p>
                  {primaryNav.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'text-muted-foreground hover:text-foreground hover:bg-accent/15 rounded-md px-3 py-2 text-sm transition-colors',
                          active && 'text-foreground bg-accent/10',
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                  <Separator className="my-2" />
                  <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-widest uppercase">
                    Account
                  </p>
                  <Link
                    href="/shortlist"
                    onClick={() => setOpen(false)}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent/15 rounded-md px-3 py-2 text-sm transition-colors"
                  >
                    Shortlist
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent/15 rounded-md px-3 py-2 text-sm transition-colors"
                  >
                    Profile
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </motion.header>
  );
}
