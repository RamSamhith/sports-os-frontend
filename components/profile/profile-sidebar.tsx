'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { useRole } from '@/lib/hooks/use-role';
import { ChildSwitcher } from './child-switcher';

const allItems = [
  { href: '/profile/personal', label: 'Personal' },
  { href: '/profile/children', label: 'Children', parentOnly: true },
  { href: '/profile/preferences', label: 'Preferences' },
  { href: '/profile/saved', label: 'Saved' },
  { href: '/profile/enquiries', label: 'Enquiries' },
  { href: '/profile/settings', label: 'Settings' },
];

export function ProfileSidebar({ kids }: { kids: Array<{ id: string; name: string }> }) {
  const pathname = usePathname();
  const role = useRole();
  const isParent = role === 'parent';

  const items = allItems.filter((it) => !it.parentOnly || isParent);

  return (
    <aside className="flex flex-col gap-4">
      {isParent && (
        <div className="border-border/60 bg-card/40 rounded-xl border p-3">
          <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
            Active child
          </p>
          <ChildSwitcher kids={kids} />
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
  );
}
