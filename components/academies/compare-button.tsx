'use client';

import * as React from 'react';
import { GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCompare } from '@/lib/hooks/use-compare';
import { toast } from 'sonner';

export function CompareButton({ entityType, id }: { entityType: 'academy' | 'coach'; id: string }) {
  const { has, add, remove, canAdd } = useCompare();
  const active = has(entityType, id);

  return (
    <Button
      size="icon"
      variant="outline"
      aria-label={active ? 'Remove from compare' : 'Add to compare'}
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
    </Button>
  );
}
