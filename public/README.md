# Public assets

This directory holds static files served from the site root.

## Image organisation

All images are stored as **local files only** — no runtime external URLs.

```
public/
  images/
    academies/        # Real cover images for each academy (referenced from /data/academies.ts)
    coaches/          # Real avatar images for each coach
    sports/           # Real cover images for each sport
    placeholders/
      sports/         # Sport-specific placeholders (10 sports)
      academies/      # Generic academy placeholders (indoor / outdoor / multi-sport)
      coaches/        # Coach placeholder
  icons/              # Favicon, app icons, sport icons
  icons/sports/       # Per-sport icons
```

## Image hierarchy

Components consume images in this priority order (see `components/ui/image-with-fallback.tsx`):

1. **Real academy image** — `data/academies.ts → coverImage` if the file exists at `/images/academies/...`
2. **Sport-specific image** — `data/sports.ts → coverImage` if the file exists at `/images/sports/...`
3. **Generic professional placeholder** — sport-or-entity-specific SVG at `/images/placeholders/...`
4. **Gradient fallback** — inline gradient + initial, rendered by the component itself

This guarantees the user never sees a broken-image icon or empty box.

## Adding a new image

1. Drop the file in the appropriate `public/images/...` folder
2. Reference it from the fixture in `data/`
3. Use the path with a leading `/` (e.g. `/images/academies/foo.jpg`)

## Iconography

Sport icons live in `public/icons/sports/` (e.g. `cricket.svg`) and are referenced from `data/sports.ts → icon`.

The favicon and PWA app icons live in `public/icons/`.

## Filename conventions

- Lowercase, kebab-case
- ASCII only
- Prefer SVG for placeholders and icons
- Use JPG/PNG/WebP for photographs
- Aim for ≤ 80 KB per photograph
