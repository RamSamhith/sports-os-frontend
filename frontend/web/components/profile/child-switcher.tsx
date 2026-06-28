'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useChildren } from '@/lib/hooks/use-children';

export function ChildSwitcher() {
  const { children, activeChildId, setActiveChild } = useChildren();

  if (children.length === 0) {
    return (
      <p className="text-muted-foreground text-xs">
        No children added yet.
      </p>
    );
  }

  return (
    <Select value={activeChildId ?? ''} onValueChange={setActiveChild} aria-label="Select active child">
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a child" />
      </SelectTrigger>
      <SelectContent>
        {children.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
