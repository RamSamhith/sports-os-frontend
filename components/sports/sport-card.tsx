import Link from 'next/link';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { fixtureImages } from '@/lib/images';
import type { Sport } from '@/types/domain/sport';

export function SportCard({ sport }: { sport: Sport }) {
  const { slug, name, category, coverImage, description, explorationGuidance, id } = sport;
  const imageSrc = coverImage ?? fixtureImages.sports[id];
  const initial = name.charAt(0);
  const ageRange = explorationGuidance?.ageSuitability;
  const ageText =
    ageRange?.min !== undefined && ageRange?.max !== undefined
      ? `Ages ${ageRange.min}–${ageRange.max}`
      : ageRange?.min !== undefined
        ? `Ages ${ageRange.min}+`
        : null;

  return (
    <Link
      href={`/sports/${slug}`}
      className="border-border/60 bg-card/40 hover:border-foreground/30 motion-card group relative flex flex-col gap-3 overflow-hidden rounded-xl border p-4 backdrop-blur-md"
    >
      <div className="flex items-center gap-3">
        <span className="bg-muted/40 relative h-9 w-9 shrink-0 overflow-hidden rounded-md">
          <ImageWithFallback
            src={imageSrc}
            alt={`${name} cover`}
            fill
            sizes="36px"
            className="object-cover"
            fallback={
              <span className="bg-primary/15 text-foreground/80 grid h-full w-full place-items-center text-sm font-semibold uppercase">
                {initial}
              </span>
            }
          />
        </span>
        <div className="min-w-0 flex-1">
          <div className="line-clamp-1 font-medium">{name}</div>
          <div className="text-muted-foreground text-xs capitalize">{category}</div>
        </div>
      </div>
      {description ? (
        <p className="text-muted-foreground line-clamp-2 text-xs text-pretty">{description}</p>
      ) : null}
      {ageText ? (
        <span className="text-muted-foreground text-[10px] tracking-widest uppercase">{ageText}</span>
      ) : null}
    </Link>
  );
}
