import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ShortlistView } from '@/components/shortlist/shortlist-view';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';

export const metadata = {
  title: 'Shortlist',
  description: 'Academies and coaches you have saved on SportsOS.',
};

export default function ShortlistPage() {
  return (
    <Section>
      <Container size="md">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Shortlist' }]} className="mb-4" />
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Shortlist</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Saved academies and coaches.
        </p>
        <div className="mt-6">
          <Tabs defaultValue="academies">
            <TabsList>
              <TabsTrigger value="academies">Academies</TabsTrigger>
              <TabsTrigger value="coaches">Coaches</TabsTrigger>
            </TabsList>
            <TabsContent value="academies">
              <ShortlistView entityType="academy" />
            </TabsContent>
            <TabsContent value="coaches">
              <ShortlistView entityType="coach" />
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </Section>
  );
}
