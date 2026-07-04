'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/lib/hooks/use-auth';
import { ChildSwitcher } from './child-switcher';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const allItems = [
  { href: '/profile/personal', label: 'Personal' },
  { href: '/profile/children', label: 'Children', parentOnly: true },
  { href: '/profile/preferences', label: 'Preferences' },
  { href: '/profile/saved', label: 'Saved' },
  { href: '/profile/enquiries', label: 'Enquiries' },
  { href: '/profile/settings', label: 'Settings' },
];

export function ProfileSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, signOut } = useAuth();
  const isParent = role === 'parent';

  const items = allItems.filter((it) => {
    if (it.parentOnly && !isParent) return false;
    if ('roleOnly' in it && it.roleOnly !== role) return false;
    return true;
  });

  function handleSignOut() {
    signOut();
    router.push('/welcome');
  }

  return (
    <aside className="flex flex-col gap-4">
      {isParent && (
        <div className="border-border/60 bg-card/40 rounded-xl border p-3">
          <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
            Active child
          </p>
          <ChildSwitcher />
        </div>
      )}
      <nav aria-label="Profile" className="border-border/60 bg-card/40 rounded-xl border p-2">
        <ul className="flex flex-col">
          {items.map((it) => {
            const active = pathname === it.href;
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm transition-colors',
                    'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
                    active ? 'bg-accent/15 text-foreground font-medium' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <Button
        variant="ghost"
        className="text-muted-foreground hover:text-destructive justify-start gap-2 px-3"
        onClick={handleSignOut}
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    </aside>
  );
}
