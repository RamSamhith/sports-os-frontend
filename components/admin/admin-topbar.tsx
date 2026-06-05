import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, LogOut } from 'lucide-react';

export function AdminTopbar() {
  return (
    <div className="border-border/40 bg-background/70 sticky top-0 z-[var(--z-sticky)] flex h-14 items-center gap-3 border-b px-4 backdrop-blur">
      <Input placeholder="Search academies, coaches, users…" className="h-9 max-w-md" />
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Search">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Sign out">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
