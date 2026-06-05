import Link from 'next/link';

export function SportCard({ slug, name, category }: { slug: string; name: string; category: string }) {
  return (
    <Link
      href={`/sports/${slug}`}
      className="border-border/60 bg-card/40 hover:border-primary/40 hover:bg-accent/10 group flex flex-col gap-1 rounded-xl border p-4 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="bg-muted/50 grid h-9 w-9 place-items-center rounded-md text-sm font-semibold uppercase">
          {name.charAt(0)}
        </span>
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-muted-foreground text-xs capitalize">{category}</div>
        </div>
      </div>
    </Link>
  );
}
