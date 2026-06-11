'use client';

import * as React from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useShortlist } from '@/lib/hooks/use-shortlist';
import type { ShortlistItemType } from '@/types/domain/shortlist';

export interface ShortlistToggleProps {
  itemType: ShortlistItemType;
  itemId: string;
  label: string;
  sublabel?: string;
  href: string;
  size?: 'sm' | 'md' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  labelText?: string;
}

export function ShortlistToggle({
  itemType,
  itemId,
  label,
  sublabel,
  href,
  size = 'lg',
  variant = 'outline',
  labelText,
}: ShortlistToggleProps) {
  const { has, addWithMeta, remove } = useShortlist();
  const active = has(itemType, itemId);

  return (
    <Button
      size={size}
      variant={active ? 'default' : variant}
      aria-label={active ? `Remove ${label} from shortlist` : `Save ${label} to shortlist`}
      aria-pressed={active}
      onClick={() => {
        if (active) {
          remove(itemType, itemId);
          toast(`Removed ${label} from shortlist`);
        } else {
          addWithMeta(itemType, itemId, { label, sublabel, href });
          toast.success(`Saved ${label} to shortlist`);
        }
      }}
    >
      {active ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {labelText}
    </Button>
  );
}
