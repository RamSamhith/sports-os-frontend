'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, User, MapPin, Bell, Shield, LogOut, Play, Lock, Mail } from 'lucide-react';

const sections = [
  {
    title: 'Theme',
    description: 'Appearance, contrast, and motion preferences',
    href: '/settings/theme',
    icon: Palette,
  },
  {
    title: 'Profile',
    description: 'Name, photo, and contact details',
    href: '/settings/profile',
    icon: User,
  },
  {
    title: 'Location',
    description: 'City, GPS, and search radius',
    href: '/settings/location',
    icon: MapPin,
  },
  {
    title: 'Location Detection',
    description: 'Gmail scan and GPS location detection',
    href: '/settings/location-detection',
    icon: Mail,
  },
  {
    title: 'Notifications',
    description: 'Email, WhatsApp, and push notification controls',
    href: '/settings/notifications',
    icon: Bell,
  },
  {
    title: 'Privacy',
    description: 'Data sharing, visibility, and consent settings',
    href: '/settings/privacy',
    icon: Shield,
  },
  {
    title: 'Security',
    description: 'Password, email, phone, and account management',
    href: '/settings/security',
    icon: Lock,
  },
  {
    title: 'Session',
    description: 'Active devices and sessions',
    href: '/settings/session',
    icon: LogOut,
  },
  {
    title: 'Motion',
    description: 'Reduce animations for accessibility',
    href: '/settings/motion',
    icon: Play,
  },
];

export default function SettingsIndexPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
        <p className="text-muted-foreground text-sm text-pretty">
          Manage your account preferences, appearance, and privacy settings.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.href} href={section.href} className="group block">
              <Card className="h-full transition-colors group-hover:border-primary/30 group-hover:shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{section.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
