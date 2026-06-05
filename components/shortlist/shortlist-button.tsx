'use client';

import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useShortlist } from '@/lib/hooks/use-shortlist';
import { toast } from 'sonner';

export function ShortlistButton({
  itemType,
  itemId,
  size = 'sm',
}: {
  itemType: 'academy' | 'coach' | 'sport';
  itemId: string;
  size?: 'sm' | 'md' | 'icon';
}) {
  const { has, add, remove } = useShortlist();
  const active = has(itemType, itemId);

  return (
    <Button
      size={size}
      variant={active ? 'default' : 'outline'}
      aria-pressed={active}
      onClick={() => {
        if (active) {
          remove(itemType, itemId);
          toast('Removed from shortlist');
        } else {
          add({ itemType, itemId });
          toast.success('Added to shortlist');
        }
      }}
    >
      {active ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {size !== 'icon' && (active ? 'Saved' : 'Save')}
    </Button>
  );
}
