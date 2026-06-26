'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

export function ChildCard({
  name,
  age,
  sportInterests,
  skillLevel,
  isActive,
  onEdit,
  onRemove,
}: {
  name: string;
  age: number;
  sportInterests?: string[];
  skillLevel?: string;
  isActive?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
}) {
  const sportLabel = sportInterests?.length ? sportInterests[0] : 'No sport';
  return (
    <Card className={isActive ? 'ring-primary/40 ring-2' : undefined}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{name}</CardTitle>
            <CardDescription>{age} years old</CardDescription>
          </div>
          <div className="flex gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onEdit}
                aria-label={`Edit ${name}`}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
            {onRemove && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onRemove}
                aria-label={`Remove ${name}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-1.5">
        <Badge variant="secondary">{sportLabel}</Badge>
        {skillLevel && <Badge variant="outline">{skillLevel}</Badge>}
      </CardContent>
    </Card>
  );
}
