import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ShortlistList } from '@/components/shortlist/shortlist-list';

export default function ShortlistPage() {
  return (
    <Section>
      <Container size="md">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Shortlist</h1>
        <p className="text-muted-foreground mt-1 text-sm">Saved academies, coaches, and sports.</p>
        <div className="mt-6">
          <Tabs defaultValue="academies">
            <TabsList>
              <TabsTrigger value="academies">Academies</TabsTrigger>
              <TabsTrigger value="coaches">Coaches</TabsTrigger>
              <TabsTrigger value="sports">Sports</TabsTrigger>
            </TabsList>
            <TabsContent value="academies">
              <ShortlistList items={[]} />
            </TabsContent>
            <TabsContent value="coaches">
              <ShortlistList items={[]} />
            </TabsContent>
            <TabsContent value="sports">
              <ShortlistList items={[]} />
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </Section>
  );
}
