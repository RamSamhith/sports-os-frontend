'use client';

import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { ShieldCheck, BadgeCheck, Star, Route, LucideIcon } from 'lucide-react';

const trustItems: Array<{ icon: LucideIcon; title: string; description: string }> = [
  {
    icon: ShieldCheck,
    title: 'Verified Academies',
    description: 'Every academy is manually verified for authenticity and coaching standards.',
  },
  {
    icon: BadgeCheck,
    title: 'Verified Coaches',
    description: 'All coaches are background-checked and certified by sports federations.',
  },
  {
    icon: Star,
    title: 'Trusted Reviews',
    description: 'Authentic feedback from students and parents helps you choose with confidence.',
  },
  {
    icon: Route,
    title: 'Competition Pathways',
    description: 'Clear progression from grassroots to state, national, and international levels.',
  },
];

export function TrustSection() {
  return (
    <Container size="lg">
      <div className="mb-4">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Why SportsOS</h2>
        <p className="text-muted-foreground text-xs">Every academy and coach is verified for quality and authenticity.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {trustItems.map((item) => (
          <div
            key={item.title}
            className="border-border/60 bg-card/40 hover:border-primary/30 rounded-xl border p-4 transition-all duration-200"
          >
            <item.icon className="h-5 w-5 text-primary mb-2" />
            <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <Link
          href="/trust"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs min-h-[44px]"
        >
          Learn more about our verification process &rarr;
        </Link>
      </div>
    </Container>
  );
}
