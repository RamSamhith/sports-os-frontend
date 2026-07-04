'use client';

import * as React from 'react';
import { Search, Mail, AlertTriangle, Inbox, X } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Stack } from '@/components/layout/stack';
import { Grid } from '@/components/layout/grid';
import { Text } from '@/components/typography/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { SearchBar } from '@/components/ui/search-bar';
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle, ModalTrigger, ModalClose } from '@/components/ui/modal';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerPanel } from '@/components/ui/drawer';
import { Surface } from '@/components/ui/surface';
import { Kbd } from '@/components/ui/kbd';
import { ThemeCycleButton } from '@/components/theme/theme-toggle';
import { ThemeMeta } from '@/components/theme/theme-meta';
import { HeroReveal } from '@/components/motion/hero-reveal';
import { FadeIn } from '@/components/motion/fade-in';
import { HoverLift } from '@/components/motion/hover-lift';
import { PressScale } from '@/components/motion/press';
import { StaggerContainer, StaggerItem } from '@/components/motion/stagger';
import { PageTransition } from '@/components/motion/page-transition';
import { ScrollProgress } from '@/components/motion/scroll-progress';
import { AuroraBackground } from '@/components/layout/aurora-background';
import { Divider } from '@/components/layout/divider';

const colorSwatches = [
  { name: 'background', token: '--background', tone: 'hsl(0 0% 5%)' },
  { name: 'foreground', token: '--foreground', tone: 'hsl(0 0% 98%)' },
  { name: 'primary', token: '--primary', tone: 'hsl(199 89% 56%)' },
  { name: 'accent', token: '--accent', tone: 'hsl(199 89% 60%)' },
  { name: 'card', token: '--card', tone: 'hsl(0 0% 7%)' },
  { name: 'muted', token: '--muted', tone: 'hsl(0 0% 12%)' },
  { name: 'border', token: '--border', tone: 'hsl(0 0% 14%)' },
  { name: 'destructive', token: '--destructive', tone: 'hsl(0 72% 50%)' },
];

const spacingScale = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];
const radiusScale = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'pill'] as const;

export function DesignContent() {
  const [search, setSearch] = React.useState('');
  const [searchSm, setSearchSm] = React.useState('');
  const [searchLg, setSearchLg] = React.useState('');

  return (
    <PageTransition>
      <ScrollProgress />
      <Section spacing="md">
        <Container>
          <HeroReveal>
            <div className="border-border/60 bg-card/40 relative overflow-hidden rounded-2xl border p-10">
              <AuroraBackground />
              <div className="relative">
                <Text variant="overline" tone="muted">
                  Foundations
                </Text>
                <Text as="h2" variant="h1" className="mt-2 max-w-2xl">
                  Build premium interfaces with consistent, opinionated tokens.
                </Text>
                <Text variant="muted" className="mt-3 max-w-xl">
                  Every color, space, radius, shadow, and motion step is defined once and consumed
                  everywhere. No magic numbers.
                </Text>
                <div className="mt-6 flex items-center gap-2">
                  <ThemeCycleButton />
                  <ThemeMeta />
                </div>
              </div>
            </div>
          </HeroReveal>
        </Container>
      </Section>

      <Section id="colors" spacing="md">
        <Container>
          <SectionHeader title="Colors" description="HSL-driven CSS variables. Four premium themes: Midnight, Ivory, Arena, Focus." />
          <Grid cols={4} gap={3} className="mt-6">
            {colorSwatches.map((c) => (
              <Surface key={c.name} padding="sm" className="flex items-center gap-3">
                <span
                  className="border-border/40 h-10 w-10 rounded-md border"
                  style={{ background: `var(${c.token})` }}
                  aria-hidden
                />
                <Stack gap={0}>
                  <Text variant="small" className="font-medium capitalize">{c.name}</Text>
                  <Text variant="mono" tone="muted">
                    {c.token}
                  </Text>
                </Stack>
              </Surface>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section id="typography" spacing="md">
        <Container>
          <SectionHeader title="Typography" description="Geist for display, Inter for body. Sizes are clamped and balanced." />
          <Surface padding="lg" className="mt-6">
            <Stack gap={4}>
              <Text variant="display">Display — Discover the right sports ecosystem.</Text>
              <Text variant="h1">H1 — Section title</Text>
              <Text variant="h2">H2 — Subsection</Text>
              <Text variant="h3">H3 — Card title</Text>
              <Text variant="h4">H4 — Subhead</Text>
              <Text variant="lead">Lead — A slightly larger paragraph that introduces a section.</Text>
              <Text variant="body">Body — Default body copy. Balanced and readable across breakpoints.</Text>
              <Text variant="small">Small — Supporting text and metadata.</Text>
              <Text variant="muted">Muted — Lower-emphasis body and helper text.</Text>
              <Text variant="overline">Overline</Text>
              <Text variant="mono" tone="muted">const sportsos = "premium";</Text>
            </Stack>
          </Surface>
        </Container>
      </Section>

      <Section id="spacing" spacing="md">
        <Container>
          <SectionHeader title="Spacing" description="8px base scale with a 4px half-step." />
          <Surface padding="lg" className="mt-6">
            <Stack gap={3}>
              {spacingScale.map((n) => (
                <div key={n} className="flex items-center gap-4">
                  <Text variant="mono" className="w-12 text-right">{n}</Text>
                  <div
                    className="bg-primary/40 rounded-sm"
                    style={{ width: `calc(var(--space-${n}) * 1)` }}
                    aria-hidden
                  />
                  <Text variant="mono" tone="muted">--space-{n}</Text>
                </div>
              ))}
            </Stack>
          </Surface>
        </Container>
      </Section>

      <Section id="radius" spacing="md">
        <Container>
          <SectionHeader title="Radius" description="Soft, modern, and consistent." />
          <Grid cols={4} gap={3} className="mt-6">
            {radiusScale.map((r) => (
              <Surface key={r} padding="md" className="flex flex-col items-center gap-2">
                <div
                  className="border-border/60 bg-muted/40 h-16 w-16 border"
                  style={{ borderRadius: `var(--radius-${r})` }}
                  aria-hidden
                />
                <Text variant="small" className="font-medium uppercase tracking-wide">{r}</Text>
              </Surface>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section id="shadows" spacing="md">
        <Container>
          <SectionHeader title="Shadows" description="Subtle elevation. Pair with surface variants for hierarchy." />
          <Grid cols={3} gap={6} className="mt-6">
            {(['none', 'sm', 'md', 'lg', 'xl', 'glow'] as const).map((s) => (
              <Surface key={s} padding="lg" className="flex flex-col items-center gap-3" style={{ boxShadow: s === 'none' ? 'none' : `var(--shadow-${s})` }}>
                <div className="bg-muted/30 h-12 w-12 rounded-md" aria-hidden />
                <Text variant="small" className="font-medium uppercase tracking-wide">{s}</Text>
              </Surface>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section id="motion" spacing="md">
        <Container>
          <SectionHeader title="Motion" description="Framer Motion primitives. All honor prefers-reduced-motion." />
          <Grid cols={2} gap={4} className="mt-6">
            <DemoCard
              title="Hero reveal"
              description="Blur + translate, used for hero surfaces."
            >
              <HeroReveal>
                <div className="bg-primary/20 ring-primary/30 grid h-24 place-items-center rounded-xl ring-1">
                  <Text variant="h4">Revealed</Text>
                </div>
              </HeroReveal>
            </DemoCard>

            <DemoCard
              title="Hover lift"
              description="Used on cards and interactive surfaces."
            >
              <HoverLift>
                <div className="border-border/60 bg-card grid h-24 cursor-pointer place-items-center rounded-xl border">
                  <Text variant="h4">Hover me</Text>
                </div>
              </HoverLift>
            </DemoCard>

            <DemoCard
              title="Press scale"
              description="Wraps buttons or interactive elements for tactile feedback."
            >
              <PressScale>
                <Button>Tap me</Button>
              </PressScale>
            </DemoCard>

            <DemoCard
              title="Stagger on view"
              description="Children reveal in sequence when scrolled into view."
            >
              <StaggerContainer className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <StaggerItem key={i}>
                    <div className="bg-muted/40 grid h-12 place-items-center rounded-md text-sm">{i}</div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </DemoCard>
          </Grid>
        </Container>
      </Section>

      <Section id="buttons" spacing="md">
        <Container>
          <SectionHeader title="Buttons" description="Variants, sizes, and states." />
          <Surface padding="lg" className="mt-6">
            <Stack gap={6}>
              <Stack gap={3}>
                <Text variant="overline" tone="muted">Variants</Text>
                <div className="flex flex-wrap items-center gap-2">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="glass">Glass</Button>
                </div>
              </Stack>
              <Divider />
              <Stack gap={3}>
                <Text variant="overline" tone="muted">Sizes</Text>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra large</Button>
                </div>
              </Stack>
              <Divider />
              <Stack gap={3}>
                <Text variant="overline" tone="muted">States</Text>
                <div className="flex flex-wrap items-center gap-2">
                  <Button>Enabled</Button>
                  <Button disabled>Disabled</Button>
                  <Button>
                    <Mail className="h-4 w-4" /> With icon
                  </Button>
                </div>
              </Stack>
            </Stack>
          </Surface>
        </Container>
      </Section>

      <Section id="cards" spacing="md">
        <Container>
          <SectionHeader title="Cards" description="Primary content surface." />
          <Grid cols={3} gap={4} className="mt-6">
            <HoverLift>
              <Card>
                <CardHeader>
                  <CardTitle>Card title</CardTitle>
                  <CardDescription>Short supporting description.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Text variant="small" tone="muted">Cards lift on hover and are the default surface for content blocks.</Text>
                </CardContent>
              </Card>
            </HoverLift>
            <Card>
              <CardHeader>
                <CardTitle>Plain card</CardTitle>
                <CardDescription>No interaction.</CardDescription>
              </CardHeader>
              <CardContent>
                <Text variant="small" tone="muted">Use when the card is not interactive.</Text>
              </CardContent>
            </Card>
            <Surface variant="glass" padding="md">
              <Stack gap={2}>
                <Text variant="overline" tone="muted">Glass</Text>
                <Text variant="body">Glass surface variant for layered, premium feels.</Text>
              </Stack>
            </Surface>
          </Grid>
        </Container>
      </Section>

      <Section id="badges" spacing="md">
        <Container>
          <SectionHeader title="Badges" description="Status and category indicators." />
          <Surface padding="lg" className="mt-6 flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="verified">Verified</Badge>
          </Surface>
        </Container>
      </Section>

      <Section id="inputs" spacing="md">
        <Container>
          <SectionHeader title="Inputs" description="Form primitives." />
          <Surface padding="lg" className="mt-6">
            <Grid cols={2} gap={4}>
              <Stack gap={2}>
                <Label>Email</Label>
                <Input type="email" placeholder="you@example.com" />
              </Stack>
              <Stack gap={2}>
                <Label>Phone</Label>
                <Input type="tel" placeholder="+91…" />
              </Stack>
              <Stack gap={2} className="sm:col-span-2">
                <Label>Message</Label>
                <Textarea placeholder="Share anything that helps us help you." />
              </Stack>
              <Stack direction="row" gap={4} className="sm:col-span-2 items-center">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox /> I agree to the terms
                </label>
                <div className="flex items-center gap-2 text-sm">
                  <Switch /> Email me updates
                </div>
              </Stack>
            </Grid>
          </Surface>
        </Container>
      </Section>

      <Section id="search" spacing="md">
        <Container>
          <SectionHeader title="Search bar" description="Debounced, with clear and shortcut affordance." />
          <Surface padding="lg" className="mt-6">
            <Stack gap={4}>
              <SearchBar
                value={search}
                onValueChange={setSearch}
                placeholder="Search academies, sports…"
                shortcut="⌘K"
              />
              <SearchBar value={searchSm} onValueChange={setSearchSm} size="sm" placeholder="Compact search" />
              <SearchBar value={searchLg} onValueChange={setSearchLg} size="lg" placeholder="Large search" />
            </Stack>
          </Surface>
        </Container>
      </Section>

      <Section id="modal" spacing="md">
        <Container>
          <SectionHeader title="Modal" description="Centered dialog with backdrop." />
          <Surface padding="lg" className="mt-6 flex flex-wrap gap-2">
            <Modal>
              <ModalTrigger asChild>
                <Button>Open modal</Button>
              </ModalTrigger>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>Confirm action</ModalTitle>
                  <ModalDescription>This is a generic modal placeholder for the design system.</ModalDescription>
                </ModalHeader>
                <ModalFooter>
                  <ModalClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </ModalClose>
                  <ModalClose asChild>
                    <Button>Confirm</Button>
                  </ModalClose>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Surface>
        </Container>
      </Section>

      <Section id="drawer" spacing="md">
        <Container>
          <SectionHeader title="Drawer" description="Side sheet for filters, details, or navigation." />
          <Surface padding="lg" className="mt-6 flex flex-wrap gap-2">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline">Open right drawer</Button>
              </DrawerTrigger>
              <DrawerContent side="right">
                <DrawerHeader>
                  <DrawerTitle>Drawer title</DrawerTitle>
                  <DrawerDescription>Drawer placeholder content.</DrawerDescription>
                </DrawerHeader>
                <DrawerPanel>
                  <Text variant="body" tone="muted">A drawer slides in from the chosen side and supports a header, body, and footer.</Text>
                </DrawerPanel>
              </DrawerContent>
            </Drawer>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline">Open bottom drawer</Button>
              </DrawerTrigger>
              <DrawerContent side="bottom">
                <DrawerHeader>
                  <DrawerTitle>Bottom drawer</DrawerTitle>
                </DrawerHeader>
                <DrawerPanel>
                  <Text variant="body" tone="muted">Use bottom drawers on mobile for actions and details.</Text>
                </DrawerPanel>
              </DrawerContent>
            </Drawer>
          </Surface>
        </Container>
      </Section>

      <Section id="skeleton" spacing="md">
        <Container>
          <SectionHeader title="Skeleton" description="Used in place of spinners." />
          <Surface padding="lg" className="mt-6">
            <Stack gap={3}>
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
            </Stack>
          </Surface>
        </Container>
      </Section>

      <Section id="empty" spacing="md">
        <Container>
          <SectionHeader title="Empty state" description="Used wherever a list has nothing to show." />
          <div className="mt-6">
            <EmptyState
              icon={<Inbox className="h-5 w-5" />}
              title="Nothing here yet"
              description="When you save items, they'll show up here."
              action={<Button>Start exploring</Button>}
            />
          </div>
        </Container>
      </Section>

      <Section id="error" spacing="md">
        <Container>
          <SectionHeader title="Error state" description="Recoverable failures with retry." />
          <div className="mt-6">
            <ErrorState
              icon={<AlertTriangle className="h-5 w-5" />}
              title="We couldn't load this"
              description="Please check your connection and try again."
              onRetry={() => undefined}
            />
          </div>
        </Container>
      </Section>

      <Section id="motion-applied" spacing="md">
        <Container>
          <SectionHeader title="Motion in context" description="Staggered list, scroll-triggered fade-in." />
          <Surface padding="lg" className="mt-6">
            <StaggerContainer>
              <Grid cols={3} gap={3}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <StaggerItem key={i}>
                    <div className="border-border/60 bg-card/50 flex h-24 items-center justify-center rounded-xl border">
                      <Text variant="small" tone="muted">Item {i + 1}</Text>
                    </div>
                  </StaggerItem>
                ))}
              </Grid>
            </StaggerContainer>
            <div className="mt-6">
              <FadeIn>
                <Surface padding="md" variant="outline">
                  <Text variant="body">This card fades in on scroll. Respects reduced-motion.</Text>
                </Surface>
              </FadeIn>
            </div>
          </Surface>
        </Container>
      </Section>

      <Section id="kbd" spacing="md">
        <Container>
          <SectionHeader title="Keyboard" description="Inline shortcut affordance." />
          <Surface padding="lg" className="mt-6 flex flex-wrap items-center gap-3">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
            <Text variant="small" tone="muted">Open command palette</Text>
            <span className="mx-2 text-muted-foreground">·</span>
            <Kbd>Esc</Kbd>
            <Text variant="small" tone="muted">Close</Text>
          </Surface>
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <Surface padding="lg" className="flex items-center justify-between">
            <Text variant="small" tone="muted">
              Use <Kbd>Tab</Kbd> to navigate. All interactive elements have visible focus rings.
            </Text>
            <Button size="sm" variant="ghost" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <X className="h-4 w-4" /> Back to top
            </Button>
          </Surface>
        </Container>
      </Section>
    </PageTransition>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <Stack gap={1}>
      <Text variant="overline" tone="muted">
        {title}
      </Text>
      <Text variant="h2">{title}</Text>
      <Text variant="muted">{description}</Text>
    </Stack>
  );
}

function DemoCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Surface padding="md">
      <Stack gap={3}>
        <Stack gap={0}>
          <Text variant="small" className="font-medium">{title}</Text>
          <Text variant="muted">{description}</Text>
        </Stack>
        {children}
      </Stack>
    </Surface>
  );
}
