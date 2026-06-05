import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Button } from '@/components/ui/button';
import { AuroraBackground } from '@/components/layout/aurora-background';

export function CtaSection() {
  return (
    <Section>
      <Container size="md">
        <div className="border-border/60 bg-card/40 relative overflow-hidden rounded-2xl border p-10 text-center">
          <AuroraBackground />
          <div className="relative">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Build your shortlist, your way
            </h2>
            <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm text-pretty">
              Save academies, coaches, and sports. Compare side by side. Connect when you're ready.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <Button asChild>
                <Link href="/discover">Start exploring</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/about">How it works</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
