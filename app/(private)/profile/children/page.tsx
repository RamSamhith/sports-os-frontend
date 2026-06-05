import { ChildCard } from '@/components/profile/child-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ChildrenPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Children</h1>
        <Button size="sm">
          <Plus className="h-4 w-4" /> Add child
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <ChildCard name="Aarav" age={9} sportInterests={['Cricket', 'Swimming']} />
        <ChildCard name="Diya" age={7} sportInterests={['Badminton']} />
      </div>
    </div>
  );
}
