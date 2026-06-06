'use client';

import { GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCompare, type CompareEntityType } from '@/lib/hooks/use-compare';
import { toast } from 'sonner';

export function CompareButton({
  entityType,
  id,
  label = 'Compare',
}: {
  entityType: CompareEntityType;
  id: string;
  label?: string;
}) {
  const { has, add, remove, canAdd } = useCompare();
  const active = has(entityType, id);
  return (
    <Button
      size="sm"
      variant={active ? 'default' : 'outline'}
      aria-label={active ? `Remove from compare` : `Add to compare`}
      aria-pressed={active}
      onClick={() => {
        if (active) {
          remove(entityType, id);
          toast('Removed from compare');
        } else if (canAdd(entityType, id)) {
          add({ entityType, id });
          toast.success('Added to compare');
        } else {
          toast.error('You can compare up to 3 items.');
        }
      }}
    >
      <GitCompare className="h-4 w-4" />
      {active ? 'In compare' : label}
    </Button>
  );
}
