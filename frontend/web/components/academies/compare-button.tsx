'use client';

import * as React from 'react';
import { GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCompare } from '@/lib/hooks/use-compare';
import { trackCompareAdd, trackCompareRemove } from '@/lib/analytics/events';
import { toast } from 'sonner';

interface CompareButtonProps {
  entityType: 'academy' | 'coach' | 'sport';
  /** Entity slug used as the unique identifier in compare state. */
  slug: string;
  label?: string;
  sublabel?: string;
  href?: string;
}

/**
 * CompareButton — single-button compare toggle for detail pages.
 *
 * The `slug` prop is the entity's URL slug, stored as the unique key in
 * compare state and used to resolve entity data on the compare page.
 */
export function CompareButton({ entityType, slug, label, sublabel, href }: CompareButtonProps) {
  const { has, addWithMeta, remove, canAdd, maxItems } = useCompare();
  const active = has(entityType, slug);

  const onClick = () => {
    if (active) {
      remove(entityType, slug);
      trackCompareRemove(slug, entityType);
      toast(`Removed from compare`);
    } else if (canAdd(entityType, slug)) {
      addWithMeta(entityType, slug, {
        label: label ?? slug,
        sublabel,
        href: href ?? '#',
      });
      trackCompareAdd(slug, entityType, label ?? slug);
      toast.success('Added to compare');
    } else {
      toast.error(`You can compare up to ${maxItems} items.`);
    }
  };

  return (
    <Button
      size="icon-touch"
      variant={active ? 'default' : 'outline'}
      onClick={onClick}
      aria-label={active ? 'Remove from compare' : 'Add to compare'}
      aria-pressed={active}
    >
      <GitCompare aria-hidden className="h-4 w-4" />
    </Button>
  );
}
