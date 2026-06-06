'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ChildSwitcher({ kids }: { kids: Array<{ id: string; name: string }> }) {
  const [value, setValue] = React.useState<string>(kids[0]?.id ?? '');
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a child" />
      </SelectTrigger>
      <SelectContent>
        {kids.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
