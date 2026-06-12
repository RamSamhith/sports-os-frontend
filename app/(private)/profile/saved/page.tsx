import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ShortlistView } from '@/components/shortlist/shortlist-view';

export default function SavedPage() {
  return (
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
  );
}
