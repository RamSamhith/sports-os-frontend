'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { cn } from '@/lib/utils/cn';

const settingsNav: ReadonlyArray<{ label: string; href: string; description: string }> = [
  { label: 'Theme', href: '/settings/theme', description: 'Appearance, contrast, motion' },
  { label: 'Profile', href: '/settings/profile', description: 'Name, photo, contact details' },
  { label: 'Location', href: '/settings/location', description: 'City, GPS, search radius' },
  { label: 'Location Detection', href: '/settings/location-detection', description: 'Gmail scan, GPS detect' },
  { label: 'Notifications', href: '/settings/notifications', description: 'Email, WhatsApp, push' },
  { label: 'Privacy', href: '/settings/privacy', description: 'Data, sharing, visibility' },
  { label: 'Security', href: '/settings/security', description: 'Password, email, phone, 2FA' },
  { label: 'Session', href: '/settings/session', description: 'Devices, active sessions' },
  { label: 'Motion', href: '/settings/motion', description: 'Reduce animations' },
];

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <Section>
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Settings</h1>
          <p className="text-muted-foreground mt-1 text-sm text-pretty">
            Personalise your SportsOS experience.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
          <nav aria-label="Settings sections" className="flex flex-col gap-1">
            {settingsNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm transition-colors',
                    'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
                    isActive
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground',
                  )}
                >
                  <span className="block font-medium">{item.label}</span>
                  <span className="text-muted-foreground block text-xs leading-snug">
                    {item.description}
                  </span>
                </Link>
              );
            })}
          </nav>
          <div className="min-w-0">{children}</div>
        </div>
      </Container>
    </Section>
  );
}
