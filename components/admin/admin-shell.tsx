'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Container } from '@/components/layout/container';
import { Separator } from '@/components/ui/separator';

const items = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/academies', label: 'Academies' },
  { href: '/admin/coaches', label: 'Coaches' },
  { href: '/admin/sports', label: 'Sports' },
  { href: '/admin/verification', label: 'Verification' },
  { href: '/admin/enquiries', label: 'Enquiries' },
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/settings', label: 'Settings' },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <Container className="grid grid-cols-1 gap-6 py-10 md:grid-cols-[220px_1fr]">
      <aside className="border-border/60 bg-card/40 sticky top-20 h-fit rounded-xl border p-3">
        <p className="text-muted-foreground px-2 text-xs font-semibold tracking-widest uppercase">Admin</p>
        <Separator className="my-2" />
        <nav aria-label="Admin">
          <ul className="flex flex-col">
            {items.map((it) => {
              const active = pathname === it.href;
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    className={cn(
                      'block rounded-md px-3 py-2 text-sm transition-colors',
                      active ? 'bg-accent/15 text-foreground' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {it.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      <section className="min-w-0">{children}</section>
    </Container>
  );
}
