import { EmptyState } from '@/components/feedback/empty-state';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ShortlistList({ items }: { items: Array<{ id: string; label: string; href: string }> }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Bookmark className="h-5 w-5" />}
        title="No items saved yet"
        description="Save academies, coaches, and sports to revisit them here."
        action={
          <Button asChild>
            <Link href="/discover">Start exploring</Link>
          </Button>
        }
      />
    );
  }
  return (
    <ul className="divide-border/60 divide-y rounded-md border">
      {items.map((item) => (
        <li key={item.id} className="flex items-center justify-between p-3 text-sm">
          <Link href={item.href} className="font-medium hover:underline">
            {item.label}
          </Link>
          <Button size="sm" variant="ghost" asChild>
            <Link href={item.href}>View</Link>
          </Button>
        </li>
      ))}
    </ul>
  );
}
