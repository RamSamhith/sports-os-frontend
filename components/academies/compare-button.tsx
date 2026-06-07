'use client';

import * as React from 'react';
import { GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCompare } from '@/lib/hooks/use-compare';
import { toast } from 'sonner';

interface CompareButtonProps {
  entityType: 'academy' | 'coach' | 'sport';
  id: string;
  label?: string;
  sublabel?: string;
  href?: string;
}

/**
 * CompareButton — single-button compare toggle for detail pages.
 *
 * Looks up the entity in the source fixtures to fetch a label/sublabel/href
 * if none were provided. The CompareProvider repairs metadata on hydration,
 * so even bare `add()` calls end up with a label — but passing meta here
 * means the user sees the right label instantly without a flash.
 */
export function CompareButton({ entityType, id, label, sublabel, href }: CompareButtonProps) {
  const { has, addWithMeta, remove, canAdd, maxItems } = useCompare();
  const active = has(entityType, id);

  const onClick = () => {
    if (active) {
      remove(entityType, id);
      toast(`Removed from compare`);
    } else if (canAdd(entityType, id)) {
      addWithMeta(entityType, id, {
        label: label ?? id,
        sublabel,
        href: href ?? '#',
      });
      toast.success('Added to compare');
    } else {
      toast.error(`You can compare up to ${maxItems} items.`);
    }
  };

  return (
    <Button
      size="icon"
      variant={active ? 'default' : 'outline'}
      onClick={onClick}
      aria-label={active ? 'Remove from compare' : 'Add to compare'}
      aria-pressed={active}
    >
      <GitCompare className="h-4 w-4" />
    </Button>
  );
}
