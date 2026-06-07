import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DiscoverPage() {
  return (
    <Section>
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Discover</h1>
          <p className="text-muted-foreground mt-2 text-sm text-pretty">
            Explore the sports ecosystem across India.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { href: '/academies', title: 'Academies', cta: 'Explore Academies', desc: 'Find sports academies near you.' },
            { href: '/coaches', title: 'Coaches', cta: 'Explore Coaches', desc: 'Discover verified coaches.' },
            { href: '/sports', title: 'Sports', cta: 'Explore Sports', desc: 'Explore sports and pathways.' },
          ].map((c) => (
            <Link key={c.href} href={c.href}>
              <Card className="motion-card hover:border-foreground/30 group/discover">
                <CardHeader>
                  <CardTitle>{c.title}</CardTitle>
                  <CardDescription>{c.desc}</CardDescription>
                </CardHeader>
                <CardContent className="text-muted-foreground inline-flex items-center gap-1 text-sm">
                  <span>{c.cta}</span>
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-[var(--duration-fast)] ease-[var(--ease-spring)] group-hover/discover:translate-x-0.5"
                  >
                    →
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
