'use client';

import * as React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { ShieldCheck, BadgeCheck, Users, Award, LucideIcon } from 'lucide-react';

const trustItems: Array<{ icon: LucideIcon; title: string; description: string }> = [
  {
    icon: ShieldCheck,
    title: 'Verified Academies',
    description: 'Every academy is manually verified for authenticity, facilities, and coaching standards.',
  },
  {
    icon: BadgeCheck,
    title: 'Certified Coaches',
    description: 'All coaches are background-checked and certified by respective sports federations.',
  },
  {
    icon: Users,
    title: 'Real Reviews',
    description: 'Authentic feedback from students and parents helps you make informed decisions.',
  },
  {
    icon: Award,
    title: 'Quality Assured',
    description: 'We maintain strict quality standards across all listed academies and training programs.',
  },
];

export function TrustSection() {
  return (
    <Section spacing="md">
      <Container size="lg">
        <div className="mb-4">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Trusted by Athletes</h2>
          <p className="text-muted-foreground text-xs">Every academy and coach on our platform is verified for quality and authenticity.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="border-border/60 bg-card/40 rounded-xl border p-4 transition-colors"
            >
              <item.icon className="h-6 w-6 text-primary mb-2" />
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
    </Section>
  );
}
